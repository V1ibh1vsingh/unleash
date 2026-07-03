import type { Request, Response } from 'express';
import Controller from '../controller.js';
import { ADMIN, NONE } from '../../types/permissions.js';
import type UserService from '../../services/user-service.js';
import type { AccountService } from '../../services/account-service.js';
import type { AccessService } from '../../services/access-service.js';
import type { Logger } from '../../logger.js';
import type { IUnleashConfig, RoleName } from '../../types/index.js';
import type { IUnleashServices } from '../../services/index.js';
import type ResetTokenService from '../../services/reset-token-service.js';
import type { IAuthRequest } from '../unleash-types.js';
import type SettingService from '../../features/settings/setting-service.js';
import type { IUser } from '../../types/index.js';
import { anonymise } from '../../util/anonymise.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import {
    createResponseSchema,
    resourceCreatedResponseSchema,
} from '../../openapi/util/create-response-schema.js';
import { userSchema, type UserSchema } from '../../openapi/spec/user-schema.js';
import { serializeDates } from '../../types/serialize-dates.js';
import {
    usersSchema,
    type UsersSchema,
} from '../../openapi/spec/users-schema.js';
import {
    usersSearchSchema,
    type UsersSearchSchema,
} from '../../openapi/spec/users-search-schema.js';
import type { CreateUserSchema } from '../../openapi/spec/create-user-schema.js';
import type { UpdateUserSchema } from '../../openapi/spec/update-user-schema.js';
import type { PasswordSchema } from '../../openapi/spec/password-schema.js';
import type { IdSchema } from '../../openapi/spec/id-schema.js';
import {
    resetPasswordSchema,
    type ResetPasswordSchema,
} from '../../openapi/spec/reset-password-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import type { GroupService } from '../../services/group-service.js';
import {
    type UsersGroupsBaseSchema,
    usersGroupsBaseSchema,
} from '../../openapi/spec/users-groups-base-schema.js';
import type { IGroup } from '../../types/group.js';
import type { IFlagResolver } from '../../types/experimental.js';
import rateLimit from 'express-rate-limit';
import { minutesToMilliseconds } from 'date-fns';
import {
    type AdminCountSchema,
    adminCountSchema,
} from '../../openapi/spec/admin-count-schema.js';
import { ForbiddenError } from '../../error/index.js';
import {
    createUserResponseSchema,
    type CreateUserResponseSchema,
} from '../../openapi/spec/create-user-response-schema.js';
import type { IRoleWithPermissions } from '../../types/stores/access-store.js';
import {
    type UserAccessOverviewSchema,
    userAccessOverviewSchema,
} from '../../openapi/index.js';
import type { WithTransactional } from '../../server-impl.js';

export default class UserAdminController extends Controller {
    private flagResolver: IFlagResolver;

    private userService: WithTransactional<UserService>;

    private accountService: AccountService;

    private accessService: AccessService;

    private readonly logger: Logger;

    private resetTokenService: ResetTokenService;

    private settingService: SettingService;

    private openApiService: OpenApiService;

    private groupService: GroupService;

    readonly isEnterprise: boolean;

    constructor(
        config: IUnleashConfig,
        {
            userService,
            accountService,
            accessService,
            resetTokenService,
            settingService,
            openApiService,
            groupService,
        }: Pick<
            IUnleashServices,
            | 'userService'
            | 'accountService'
            | 'accessService'
            | 'emailService'
            | 'resetTokenService'
            | 'settingService'
            | 'openApiService'
            | 'groupService'
        >,
    ) {
        throw new Error("STUB");
    }

    async resetUserPassword(
        req: IAuthRequest<unknown, ResetPasswordSchema, IdSchema>,
        res: Response<ResetPasswordSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getUsers(_req: Request, res: Response<UsersSchema>): Promise<void> {
        throw new Error("STUB");
    }

    anonymiseUsers(users: IUser[]): IUser[] {
        throw new Error("STUB");
    }

    async searchUsers(
        req: Request,
        res: Response<UsersSearchSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getBaseUsersAndGroups(
        _req: Request,
        res: Response<UsersGroupsBaseSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getUser(
        req: Request<{ id: number }>,
        res: Response<UserSchema>,
    ): Promise<void> {
        const { id } = req.params;
        const { isAPI, ...user } = await this.userService.getUser(id);

        this.openApiService.respondWithValidation(
            200,
            res,
            userSchema.$id,
            serializeDates(user),
        );
    }

    async createUser(
        req: IAuthRequest<unknown, unknown, CreateUserSchema>,
        res: Response<CreateUserResponseSchema>,
    ): Promise<void> {
        const { username, email, name, rootRole, sendEmail, password } =
            req.body;
        const normalizedRootRole = Number.isInteger(Number(rootRole))
            ? Number(rootRole)
            : (rootRole as RoleName);

        const responseData = await this.userService.transactional(
            async (txUserService) => {
                throw new Error("STUB");
            },
        );

        this.openApiService.respondWithValidation(
            201,
            res,
            createUserResponseSchema.$id,
            responseData,
            { location: `${responseData.id}` },
        );
    }

    async updateUser(
        req: IAuthRequest<
            { id: number },
            CreateUserResponseSchema,
            UpdateUserSchema
        >,
        res: Response<CreateUserResponseSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteUser(
        req: IAuthRequest<{ id: number }>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validateUserPassword(
        req: IAuthRequest<unknown, unknown, PasswordSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async changeUserPassword(
        req: IAuthRequest<{ id: number }, unknown, PasswordSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getAdminCount(
        _req: Request,
        res: Response<AdminCountSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getPermissions(
        req: IAuthRequest<
            { id: number },
            unknown,
            unknown,
            { project?: string; environment?: string }
        >,
        res: Response<UserAccessOverviewSchema>,
    ): Promise<void> {
        const { project, environment } = req.query;
        const { isAPI, ...user } = await this.userService.getUser(
            req.params.id,
        );
        const rootRole = await this.accessService.getRootRoleForUser(user.id);
        let projectRoles: IRoleWithPermissions[] = [];
        if (project) {
            const projectRoleIds =
                await this.accessService.getProjectRolesForUser(
                    project,
                    user.id,
                );

            projectRoles = await Promise.all(
                projectRoleIds.map((roleId) =>
                    { throw new Error("STUB"); },
                ),
            );
        }
        const overview = await this.accessService.getAccessOverviewForUser(
            user,
            project,
            environment,
        );

        this.openApiService.respondWithValidation(
            200,
            res,
            userAccessOverviewSchema.$id,
            {
                overview,
                user: serializeDates(user),
                rootRole,
                projectRoles,
            },
        );
    }

    async throwIfScimUser({
        id,
        scimId,
    }: Pick<IUser, 'id' | 'scimId'>): Promise<void> {
        throw new Error("STUB");
    }

    async isScimUser({
        id,
        scimId,
    }: Pick<IUser, 'id' | 'scimId'>): Promise<boolean> {
        throw new Error("STUB");
    }

    async deleteScimUsers(req: IAuthRequest, res: Response): Promise<void> {
        throw new Error("STUB");
    }
}
