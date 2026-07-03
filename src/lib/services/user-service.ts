import bcrypt from 'bcryptjs';
import owasp from 'owasp-password-strength-test';
import Joi from 'joi';

import type { URL } from 'url';
import type { Logger } from '../logger.js';
import User, {
    type IAuditUser,
    type IUser,
    type IUserWithRootRole,
} from '../types/user.js';
import isEmail from '../util/is-email.js';
import type { AccessService } from './access-service.js';
import type ResetTokenService from './reset-token-service.js';
import NotFoundError from '../error/notfound-error.js';
import OwaspValidationError from '../error/owasp-validation-error.js';
import type { EmailService } from './email-service.js';
import type {
    IAuthOption,
    IUnleashConfig,
    UsernameAdminUser,
} from '../types/option.js';
import type SessionService from './session-service.js';
import type { IUnleashStores } from '../types/stores.js';
import PasswordUndefinedError from '../error/password-undefined.js';
import {
    ScimUsersDeleted,
    UserCreatedEvent,
    UserDeletedEvent,
    UserUpdatedEvent,
} from '../types/index.js';
import type { IUserStore } from '../types/index.js';
import { RoleName } from '../types/model.js';
import type SettingService from '../features/settings/setting-service.js';
import {
    type SimpleAuthSettings,
    simpleAuthSettingsKey,
} from '../types/settings/simple-auth-settings.js';
import DisabledError from '../error/disabled-error.js';
import BadDataError from '../error/bad-data-error.js';
import { isDefined } from '../util/index.js';
import type { TokenUserSchema } from '../openapi/index.js';
import PasswordMismatch from '../error/password-mismatch.js';
import type EventService from '../features/events/event-service.js';

import {
    type IFlagResolver,
    SYSTEM_USER,
    SYSTEM_USER_AUDIT,
} from '../types/index.js';
import { PasswordPreviouslyUsedError } from '../error/password-previously-used.js';
import { RateLimitError } from '../error/rate-limit-error.js';
import type EventEmitter from 'events';
import { USER_LOGIN } from '../metric-events.js';
import type { ResourceLimitsService } from './index.js';

owasp.config({
    allowPassphrases: false,
});

export interface ICreateUserWithRole {
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    rootRole: number | RoleName;
}

export interface IUpdateUser {
    id: number;
    name?: string;
    email?: string;
    rootRole?: number | RoleName;
}

export interface ILoginUserRequest {
    email: string;
    name?: string;
    rootRole?: number | RoleName;
    autoCreate?: boolean;
}

export interface ChangePasswordOptions {
    /**
     * Opt out of invalidating sessions when changing the password. Defaults to
     * logging the user out (only set this to `false` for flows like setting an
     * initial password during signup).
     */
    logoutUser?: boolean;
    /**
     * When set, keep this session alive and only terminate the user's other
     * sessions. Used by self-service password changes so the user who performed
     * the change stays logged in while every other device is signed out.
     */
    keepSessionId?: string;
}

const saltRounds = 10;
const disallowNPreviousPasswords = 5;

export class UserService {
    private logger: Logger;

    private store: IUserStore;

    private eventService: EventService;

    private eventBus: EventEmitter;

    private accessService: AccessService;

    private resetTokenService: ResetTokenService;

    private sessionService: SessionService;

    private emailService: EmailService;

    private settingService: SettingService;

    private resourceLimitsService: ResourceLimitsService;

    private flagResolver: IFlagResolver;

    private passwordResetTimeouts: { [key: string]: NodeJS.Timeout } = {};

    private baseUriPath: string;

    readonly unleashUrl: string;

    readonly maxParallelSessions: number;

    constructor(
        stores: Pick<IUnleashStores, 'userStore'>,
        {
            server,
            getLogger,
            eventBus,
            flagResolver,
            session,
        }: Pick<
            IUnleashConfig,
            'getLogger' | 'server' | 'eventBus' | 'flagResolver' | 'session'
        >,
        services: {
            accessService: AccessService;
            resetTokenService: ResetTokenService;
            emailService: EmailService;
            eventService: EventService;
            sessionService: SessionService;
            settingService: SettingService;
            resourceLimitsService: ResourceLimitsService;
        },
    ) {
        this.logger = getLogger('service/user-service.js');
        this.store = stores.userStore;
        this.eventBus = eventBus;
        this.eventService = services.eventService;
        this.accessService = services.accessService;
        this.resetTokenService = services.resetTokenService;
        this.emailService = services.emailService;
        this.sessionService = services.sessionService;
        this.settingService = services.settingService;
        this.resourceLimitsService = services.resourceLimitsService;
        this.flagResolver = flagResolver;
        this.maxParallelSessions = session.maxParallelSessions;
        this.baseUriPath = server.baseUriPath || '';
        this.unleashUrl = server.unleashUrl;
    }

    validatePassword(password: string): boolean {
        throw new Error("STUB");
    }

    async initAdminUser({
        createAdminUser,
        initialAdminUser,
    }: Pick<
        IAuthOption,
        'createAdminUser' | 'initialAdminUser'
    >): Promise<void> {
        if (!createAdminUser) return Promise.resolve();

        return this.initAdminUsernameUser(initialAdminUser);
    }

    async initAdminUsernameUser(
        usernameAdminUser?: UsernameAdminUser,
    ): Promise<void> {
        const username = usernameAdminUser?.username || 'admin';
        const password = usernameAdminUser?.password || 'unleash4all';

        const userCount = await this.store.count();

        if (userCount === 0) {
            // create default admin user
            try {
                this.logger.info(
                    `Creating default admin user, with username '${username}' and password '${password}'`,
                );
                const user = await this.store.insert({
                    username,
                });
                const passwordHash = await bcrypt.hash(password, saltRounds);
                await this.store.setPasswordHash(
                    user.id,
                    passwordHash,
                    disallowNPreviousPasswords,
                );
                await this.accessService.setUserRootRole(
                    user.id,
                    RoleName.ADMIN,
                );
            } catch (_e) {
                this.logger.error(
                    `Unable to create default user '${username}'`,
                );
            }
        }
    }

    async getAll(): Promise<IUserWithRootRole[]> {
        const baseUsers = await this.store.getAll();
        const defaultRole = await this.accessService.getPredefinedRole(
            RoleName.VIEWER,
        );
        const userRoles = await this.accessService.getRootRoleForAllUsers();
        let users = baseUsers.map((u) => {
            throw new Error("STUB");
        });

        if (this.flagResolver.isEnabled('showUserDeviceCount')) {
            const sessionCounts = await this.sessionService.getSessionsCount();
            users = users.map((u) => { throw new Error("STUB"); });
        }

        return users;
    }

    async getUser(id: number): Promise<IUserWithRootRole> {
        const user = await this.store.get(id);
        if (user === undefined) {
            throw new NotFoundError(`Could not find user with id ${id}`);
        }
        const rootRole = await this.accessService.getRootRoleForUser(id);
        return { ...user, id, rootRole: rootRole.id };
    }

    async search(query: string): Promise<IUser[]> {
        throw new Error("STUB");
    }

    async getByEmail(email: string): Promise<IUser> {
        throw new Error("STUB");
    }

    private validateEmail(email?: string): void {
        if (email) {
            Joi.assert(
                email,
                Joi.string().email({
                    ignoreLength: true,
                    minDomainSegments: 1,
                }),
                'Email',
            );
        }
    }

    async createUser(
        { username, email, name, password, rootRole }: ICreateUserWithRole,
        auditUser: IAuditUser = SYSTEM_USER_AUDIT,
    ): Promise<IUserWithRootRole> {
        if (!username && !email) {
            throw new BadDataError('You must specify username or email');
        }

        Joi.assert(name, Joi.string(), 'Name');

        this.validateEmail(email);

        const exists = await this.store.hasUser({ username, email });
        if (exists) {
            throw new BadDataError('User already exists');
        }

        const user = await this.store.insert({
            username,
            email,
            name,
        });

        await this.accessService.setUserRootRole(user.id, rootRole);

        if (password) {
            const passwordHash = await bcrypt.hash(password, saltRounds);
            await this.store.setPasswordHash(
                user.id,
                passwordHash,
                disallowNPreviousPasswords,
            );
        }

        const userCreated = await this.getUser(user.id);

        await this.eventService.storeEvent(
            new UserCreatedEvent({
                auditUser,
                userCreated,
            }),
        );

        return userCreated;
    }

    async newUserInviteLink(
        { id: userId }: Pick<IUserWithRootRole, 'id'>,
        auditUser: IAuditUser = SYSTEM_USER_AUDIT,
    ): Promise<string> {
        const passwordAuthSettings =
            await this.settingService.getWithDefault<SimpleAuthSettings>(
                simpleAuthSettingsKey,
                { disabled: false },
            );

        let inviteLink = this.unleashUrl;
        if (!passwordAuthSettings.disabled) {
            const inviteUrl = await this.resetTokenService.createNewUserUrl(
                userId,
                auditUser.username,
            );
            inviteLink = inviteUrl.toString();
        }
        return inviteLink;
    }

    async sendWelcomeEmail(
        user: IUserWithRootRole,
        inviteLink: string,
    ): Promise<boolean> {
        let emailSent = false;
        const emailConfigured = this.emailService.configured();

        if (emailConfigured && user.email) {
            try {
                await this.emailService.sendGettingStartedMail(
                    user.name || '',
                    user.email,
                    this.unleashUrl,
                    inviteLink,
                );
                emailSent = true;
            } catch (e) {
                this.logger.warn(
                    'email was configured, but sending failed due to: ',
                    e,
                );
            }
        } else {
            this.logger.warn(
                'email was not sent to the user because email configuration is lacking',
            );
        }

        return emailSent;
    }

    async updateUser(
        { id, name, email, rootRole }: IUpdateUser,
        auditUser: IAuditUser,
    ): Promise<IUserWithRootRole> {
        throw new Error("STUB");
    }

    async deleteUser(userId: number, auditUser: IAuditUser): Promise<void> {
        throw new Error("STUB");
    }

    async deleteScimUsers(auditUser: IAuditUser): Promise<void> {
        throw new Error("STUB");
    }

    async loginUser(
        usernameOrEmail: string,
        password: string,
        device?: { userAgent?: string; ip: string },
    ): Promise<IUser> {
        throw new Error("STUB");
    }

    /**
     * Used to login users without specifying password. Used when integrating
     * with external identity providers.
     *
     * @param usernameOrEmail
     * @param autoCreateUser
     * @returns
     */
    async loginUserWithoutPassword(
        email: string,
        autoCreateUser: boolean = false,
    ): Promise<IUser> {
        return this.loginUserSSO({ email, autoCreate: autoCreateUser });
    }

    async loginUserSSO({
        email,
        name,
        rootRole,
        autoCreate = false,
    }: ILoginUserRequest): Promise<IUser> {
        let user: IUser;

        try {
            user = await this.store.getByQuery({ email });
            // Update user if not managed by scim
            if (name && user.name !== name && !user.scimId) {
                const currentRole = await this.accessService.getRootRoleForUser(
                    user.id,
                );
                const updatedUser = await this.store.update(user.id, {
                    name,
                    email,
                });

                await this.eventService.storeEvent(
                    new UserUpdatedEvent({
                        auditUser: SYSTEM_USER_AUDIT,
                        preUser: {
                            ...user,
                            rootRole: currentRole.id,
                        },
                        postUser: {
                            ...updatedUser,
                            rootRole: currentRole.id,
                        },
                    }),
                );
                user = { ...user, ...updatedUser };
            }
        } catch (e) {
            // User does not exists. Create if 'autoCreate' is enabled
            if (autoCreate) {
                user = await this.createUser(
                    {
                        email,
                        name,
                        rootRole: rootRole || RoleName.EDITOR,
                    },
                    SYSTEM_USER_AUDIT,
                );
            } else {
                throw e;
            }
        }
        const loginOrder = await this.store.successfullyLogin(user);
        this.eventBus.emit(USER_LOGIN, { loginOrder });
        return user;
    }

    async loginDemoAuthDefaultAdmin(): Promise<IUser> {
        const user = await this.store.getByQuery({ id: 1 });
        const loginOrder = await this.store.successfullyLogin(user);
        this.eventBus.emit(USER_LOGIN, { loginOrder });
        return user;
    }

    async changePassword(
        userId: number,
        password: string,
        { logoutUser, keepSessionId }: ChangePasswordOptions = {},
    ): Promise<void> {
        throw new Error("STUB");
    }

    async changePasswordWithPreviouslyUsedPasswordCheck(
        userId: number,
        password: string,
        options: ChangePasswordOptions = {},
    ): Promise<void> {
        throw new Error("STUB");
    }

    async changePasswordWithVerification(
        userId: number,
        newPassword: string,
        oldPassword: string,
        options: ChangePasswordOptions = {},
    ): Promise<void> {
        throw new Error("STUB");
    }

    async hasPassword(userId: number): Promise<boolean> {
        throw new Error("STUB");
    }

    async getUserForToken(token: string): Promise<TokenUserSchema> {
        const { createdBy, userId } =
            await this.resetTokenService.isValid(token);
        const user = await this.getUser(userId);
        const role = await this.accessService.getRoleData(user.rootRole);
        return {
            token,
            createdBy,
            email: user.email!,
            name: user.name,
            id: user.id,
            role: {
                id: user.rootRole,
                description: role.role.description,
                type: role.role.type,
                name: role.role.name,
            },
        };
    }

    /**
     * If the password is a strong password will update password and delete all sessions for the user we're changing the password for
     * @param token - the token authenticating this request
     * @param password - new password
     */
    async resetPassword(token: string, password: string): Promise<void> {
        throw new Error("STUB");
    }

    async createResetPasswordEmail(
        receiverEmail: string,
        user: IUser = new User({
            id: SYSTEM_USER.id,
            username: SYSTEM_USER.username,
        }),
    ): Promise<URL> {
        throw new Error("STUB");
    }
}

export default UserService;
