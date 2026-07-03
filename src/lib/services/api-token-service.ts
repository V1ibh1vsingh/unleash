import crypto from 'crypto';
import type { Logger } from '../logger.js';
import { ADMIN, CLIENT, FRONTEND } from '../types/permissions.js';
import type { IUnleashStores } from '../types/stores.js';
import type { IUnleashConfig } from '../types/option.js';
import ApiUser, { type IApiUser } from '../types/api-user.js';
import {
    ALL,
    resolveValidProjects,
    validateApiToken,
} from '../types/models/api-token.js';
import type { IApiTokenStore } from '../types/stores/api-token-store.js';
import { FOREIGN_KEY_VIOLATION } from '../error/db-error.js';
import BadDataError from '../error/bad-data-error.js';
import type { IEnvironmentStore } from '../features/project-environments/environment-store-type.js';
import { constantTimeCompare } from '../util/constantTimeCompare.js';
import {
    ADMIN_TOKEN_USER,
    ApiTokenCreatedEvent,
    ApiTokenDeletedEvent,
    ApiTokenType,
    ApiTokenUpdatedEvent,
    type IApiToken,
    type IApiTokenCreate,
    type IAuditUser,
    type IFlagResolver,
    SYSTEM_USER_AUDIT,
} from '../types/index.js';
import { omitKeys } from '../util/index.js';
import type EventService from '../features/events/event-service.js';
import { addMinutes, isPast } from 'date-fns';
import metricsHelper from '../util/metrics-helper.js';
import { FUNCTION_TIME } from '../metric-events.js';
import { throwExceedsLimitError } from '../error/exceeds-limit-error.js';
import type EventEmitter from 'events';
import type { ResourceLimitsService } from '../features/resource-limits/resource-limits-service.js';

const resolveTokenPermissions = (tokenType: string) => {
    if (tokenType === ApiTokenType.ADMIN) {
        return [ADMIN];
    }

    if (
        tokenType === ApiTokenType.BACKEND ||
        tokenType === ApiTokenType.CLIENT
    ) {
        return [CLIENT];
    }

    if (tokenType === ApiTokenType.FRONTEND) {
        return [FRONTEND];
    }

    return [];
};

export class ApiTokenService {
    private store: IApiTokenStore;

    private environmentStore: IEnvironmentStore;

    private logger: Logger;

    private activeTokens: IApiToken[] = [];

    private queryAfter = new Map<string, Date>();

    private eventService: EventService;

    private lastSeenSecrets: Set<string> = new Set<string>();

    private flagResolver: IFlagResolver;

    private timer: Function;

    private resourceLimitsService: ResourceLimitsService;

    private eventBus: EventEmitter;

    constructor(
        {
            apiTokenStore,
            environmentStore,
        }: Pick<IUnleashStores, 'apiTokenStore' | 'environmentStore'>,
        config: Pick<
            IUnleashConfig,
            'getLogger' | 'authentication' | 'flagResolver' | 'eventBus'
        >,
        eventService: EventService,
        resourceLimitsService: ResourceLimitsService,
    ) {
        throw new Error("STUB");
    }

    /**
     * Called by a scheduler without jitter to refresh all active tokens
     */
    async fetchActiveTokens(): Promise<void> {
        throw new Error("STUB");
    }

    async getToken(secret: string): Promise<IApiToken | undefined> {
        throw new Error("STUB");
    }
    async getTokenWithCache(secret: string): Promise<IApiToken | undefined> {
        if (!secret) {
            return undefined;
        }

        let token = this.activeTokens.find(
            (activeToken) =>
                { throw new Error("STUB"); },
        );

        // If the token is not found, try to find it in the legacy format with alias.
        // This allows us to support the old format of tokens migrating to the embedded proxy.
        if (!token) {
            token = this.activeTokens.find(
                (activeToken) =>
                    { throw new Error("STUB"); },
            );
        }

        const nextAllowedQuery = this.queryAfter.get(secret) ?? 0;
        if (!token) {
            if (isPast(nextAllowedQuery)) {
                if (this.queryAfter.size > 1000) {
                    // establish a max limit for queryAfter size to prevent memory leak
                    this.queryAfter.clear();
                }

                const stopCacheTimer = this.timer('getTokenWithCache.query');
                token = await this.store.get(secret);
                if (token) {
                    if (token?.expiresAt && isPast(token.expiresAt)) {
                        this.logger.info('Token has expired');
                        // prevent querying the same invalid secret multiple times. Expire after 5 minutes
                        this.queryAfter.set(secret, addMinutes(new Date(), 5));
                        token = undefined;
                    } else {
                        this.activeTokens.push(token);
                    }
                } else {
                    // prevent querying the same invalid secret multiple times. Expire after 5 minutes
                    this.queryAfter.set(secret, addMinutes(new Date(), 5));
                }
                stopCacheTimer();
            } else {
                if (Math.random() < 0.1) {
                    this.logger.info(
                        `Token ${secret.replace(
                            /^([^.]*)\.(.{8}).*$/,
                            '$1.$2...',
                        )} rate limited until: ${this.queryAfter.get(secret)}`,
                    );
                }
            }
        }
        return token;
    }

    async updateLastSeen(): Promise<void> {
        throw new Error("STUB");
    }

    public async getAllTokens(): Promise<IApiToken[]> {
        throw new Error("STUB");
    }

    public async getUserDefinedTokens(): Promise<IApiToken[]> {
        throw new Error("STUB");
    }

    async initApiTokens(tokens: IApiTokenCreate[]) {
        const tokenCount = await this.store.count();
        if (tokenCount > 0) {
            this.logger.debug(
                'Not creating initial API tokens because tokens exist in the database',
            );
            return;
        }
        try {
            const createAll = tokens.map((t) =>
                { throw new Error("STUB"); },
            );
            await Promise.all(createAll);
            this.logger.info(
                `Created initial API tokens: ${tokens.map((t) => { throw new Error("STUB"); }).join(', ')}`,
            );
        } catch (e) {
            this.logger.warn(
                `Unable to create initial API tokens from: ${tokens.map((t) => { throw new Error("STUB"); }).join(', ')}`,
                e,
            );
        }
    }

    public async getUserForToken(
        secret: string,
    ): Promise<IApiUser | undefined> {
        const token = await this.getTokenWithCache(secret);
        if (token) {
            this.lastSeenSecrets.add(token.secret);
            const apiUser: IApiUser = new ApiUser({
                tokenName: token.tokenName,
                permissions: resolveTokenPermissions(token.type),
                projects: token.projects,
                environment: token.environment,
                type: token.type,
                secret: token.secret,
            });

            apiUser.internalAdminTokenUserId =
                token.type === ApiTokenType.ADMIN
                    ? ADMIN_TOKEN_USER.id
                    : undefined;
            return apiUser;
        }

        return undefined;
    }

    public async updateExpiry(
        secret: string,
        expiresAt: Date,
        auditUser: IAuditUser,
    ): Promise<IApiToken> {
        throw new Error("STUB");
    }

    public async delete(secret: string, auditUser: IAuditUser): Promise<void> {
        if (await this.store.exists(secret)) {
            const token = (await this.store.get(secret))!;
            await this.store.delete(secret);
            await this.eventService.storeEvent(
                new ApiTokenDeletedEvent({
                    auditUser,
                    apiToken: omitKeys(token, 'secret'),
                }),
            );
        }
    }

    /**
     * @param newToken
     * @param auditUser Used for event log and referencing who made the token
     */
    public async createApiTokenWithProjects(
        newToken: Omit<IApiTokenCreate, 'secret'>,
        auditUser: IAuditUser = SYSTEM_USER_AUDIT,
    ): Promise<IApiToken> {
        throw new Error("STUB");
    }

    private async internalCreateApiTokenWithProjects(
        newToken: Omit<IApiTokenCreate, 'secret'>,
        auditUser: IAuditUser,
    ): Promise<IApiToken> {
        throw new Error("STUB");
    }

    private async validateApiTokenEnvironment({
        environment,
    }: Pick<IApiTokenCreate, 'environment'>): Promise<void> {
        throw new Error("STUB");
    }

    private async validateApiTokenLimit() {
        throw new Error("STUB");
    }

    // TODO: Remove this service method after embedded proxy has been released in
    // 4.16.0
    public async createMigratedProxyApiToken(
        newToken: Omit<IApiTokenCreate, 'secret'>,
    ): Promise<IApiToken> {
        throw new Error("STUB");
    }

    private normalizeTokenType(token: IApiTokenCreate): IApiTokenCreate {
        const { type, ...rest } = token;
        return {
            ...rest,
            type: type.toLowerCase() as ApiTokenType,
        };
    }

    private async insertNewApiToken(
        newApiToken: IApiTokenCreate,
        auditUser: IAuditUser,
    ): Promise<IApiToken> {
        try {
            const token = await this.store.insert(
                this.normalizeTokenType(newApiToken),
                auditUser.id,
            );
            this.activeTokens.push(token);
            await this.eventService.storeEvent(
                new ApiTokenCreatedEvent({
                    auditUser,
                    apiToken: omitKeys(token, 'secret'),
                }),
            );
            return token;
        } catch (error) {
            if (error.code === FOREIGN_KEY_VIOLATION) {
                let { message } = error;
                if (error.constraint === 'api_token_project_project_fkey') {
                    message = `Project=${this.findInvalidProject(
                        error.detail,
                        newApiToken.projects,
                    )} does not exist`;
                } else if (error.constraint === 'api_tokens_environment_fkey') {
                    message = `Environment=${newApiToken.environment} does not exist`;
                }
                throw new BadDataError(message);
            }
            throw error;
        }
    }

    private findInvalidProject(errorDetails, projects) {
        if (!errorDetails) {
            return 'invalid';
        }
        const invalidProject = projects.find((project) => {
            throw new Error("STUB");
        });
        return invalidProject || 'invalid';
    }

    private generateSecretKey({ projects, environment }) {
        throw new Error("STUB");
    }
}
