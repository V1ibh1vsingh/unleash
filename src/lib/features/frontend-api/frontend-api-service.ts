import crypto from 'node:crypto';
import type {
    IAuditUser,
    IFlagResolver,
    IUnleashConfig,
    IUser,
} from '../../types/index.js';
import type { Logger } from '../../logger.js';
import type {
    ClientMetricsSchema,
    FrontendApiFeatureSchema,
} from '../../openapi/index.js';
import type { Metric } from '../metrics/impact/metrics-translator.js';
import ApiUser from '../../types/api-user.js';
import type { IApiUser } from '../../types/api-user.js';
import {
    type Context,
    InMemStorageProvider,
    Unleash,
    UnleashEvents,
} from 'unleash-client';
import { ApiTokenType } from '../../types/model.js';
import {
    type FrontendSettings,
    frontendSettingsKey,
} from '../../types/settings/frontend-settings.js';
import { validateOrigins } from '../../util/index.js';
import { BadDataError, InvalidTokenError } from '../../error/index.js';
import { FRONTEND_API_REPOSITORY_CREATED } from '../../metric-events.js';
import { FrontendApiRepository } from './frontend-api-repository.js';
import type { GlobalFrontendApiCache } from './global-frontend-api-cache.js';
import type { IUnleashServices } from '../../services/index.js';

export type Config = Pick<
    IUnleashConfig,
    | 'getLogger'
    | 'frontendApi'
    | 'frontendApiOrigins'
    | 'eventBus'
    | 'flagResolver'
>;

export type Services = Pick<
    IUnleashServices,
    'clientMetricsServiceV2' | 'settingService' | 'clientInstanceService'
>;

export class FrontendApiService {
    private readonly config: Config;

    private readonly logger: Logger;

    private readonly services: Services;

    private flagResolver: IFlagResolver;

    private readonly globalFrontendApiCache: GlobalFrontendApiCache;

    /**
     * This is intentionally a Promise because we want to be able to await
     * until the client (which might be being created by a different request) is ready
     * Check this test that fails if we don't use a Promise: frontend-api.concurrency.e2e.test.ts
     */
    private readonly clients: Map<ApiUser['secret'], Promise<Unleash>> =
        new Map();

    private cachedFrontendSettings: FrontendSettings;

    constructor(
        config: Config,
        services: Services,
        globalFrontendApiCache: GlobalFrontendApiCache,
    ) {
        this.config = config;
        this.logger = config.getLogger('services/frontend-api-service.ts');
        this.services = services;
        this.flagResolver = config.flagResolver;
        this.globalFrontendApiCache = globalFrontendApiCache;
    }

    isCacheReady(): boolean {
        throw new Error("STUB");
    }

    async waitForCacheReady(): Promise<void> {
        throw new Error("STUB");
    }

    async getFrontendApiFeatures(
        token: IApiUser,
        context: Context,
    ): Promise<FrontendApiFeatureSchema[]> {
        throw new Error("STUB");
    }

    private resolveProject(user: IUser | IApiUser) {
        throw new Error("STUB");
    }

    async registerFrontendApiMetrics(
        token: IApiUser,
        metrics: ClientMetricsSchema,
        ip: string,
        sdkVersion?: string | string[],
    ): Promise<void> {
        throw new Error("STUB");
    }

    private async clientForFrontendApiToken(token: IApiUser): Promise<Unleash> {
        throw new Error("STUB");
    }

    private async createClientForFrontendApiToken(
        token: IApiUser,
    ): Promise<Unleash> {
        throw new Error("STUB");
    }

    async deleteClientForFrontendApiToken(secret: string): Promise<void> {
        throw new Error("STUB");
    }

    stopAll(): void {
        throw new Error("STUB");
    }

    refreshData(): Promise<void> {
        throw new Error("STUB");
    }

    private static assertExpectedTokenType({ type }: IApiUser) {
        throw new Error("STUB");
    }

    async setFrontendCorsSettings(
        value: FrontendSettings['frontendApiOrigins'],
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async fetchFrontendSettings(): Promise<FrontendSettings> {
        try {
            this.cachedFrontendSettings =
                await this.services.settingService.getWithDefault(
                    frontendSettingsKey,
                    {
                        frontendApiOrigins: this.config.frontendApiOrigins,
                    },
                );
        } catch (error) {
            this.logger.debug('Unable to fetch frontend settings', error);
        }
        return this.cachedFrontendSettings;
    }

    async getFrontendSettings(useCache = true): Promise<FrontendSettings> {
        if (useCache && this.cachedFrontendSettings) {
            return this.cachedFrontendSettings;
        }
        return this.fetchFrontendSettings();
    }
}
