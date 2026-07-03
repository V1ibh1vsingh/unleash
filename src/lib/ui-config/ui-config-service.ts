import type { IUnleashConfig } from '../types/option.js';
import type { UiConfigSchema } from '../openapi/index.js';
import {
    IAuthType,
    type EmailService,
    type FrontendApiService,
    type IFlagResolver,
    type IUnleashServices,
    type SessionService,
    type SettingService,
    type VersionService,
} from '../server-impl.js';
import type { IUser } from '../types/user.js';
import type MaintenanceService from '../features/maintenance/maintenance-service.js';
import {
    type SimpleAuthSettings,
    simpleAuthSettingsKey,
} from '../types/settings/simple-auth-settings.js';
import version from '../util/version.js';
import type { ResourceLimitsService } from '../features/resource-limits/resource-limits-service.js';
import { ImpactMetricsAvailabilityResolver } from '../features/metrics/impact/impact-metrics-availability.js';
import { hashValue } from '../util/anonymise.js';

export class UiConfigService {
    private config: IUnleashConfig;

    private versionService: VersionService;

    private settingService: SettingService;

    private frontendApiService: FrontendApiService;

    private emailService: EmailService;

    private sessionService: SessionService;

    private maintenanceService: MaintenanceService;

    private resourceLimitsService: ResourceLimitsService;

    private flagResolver: IFlagResolver;

    private impactMetricsAvailabilityResolver: ImpactMetricsAvailabilityResolver;

    constructor(
        config: IUnleashConfig,
        {
            versionService,
            settingService,
            emailService,
            frontendApiService,
            maintenanceService,
            sessionService,
            resourceLimitsService,
        }: Pick<
            IUnleashServices,
            | 'versionService'
            | 'settingService'
            | 'emailService'
            | 'frontendApiService'
            | 'maintenanceService'
            | 'sessionService'
            | 'resourceLimitsService'
        >,
    ) {
        this.config = config;
        this.flagResolver = config.flagResolver;
        this.versionService = versionService;
        this.settingService = settingService;
        this.emailService = emailService;
        this.frontendApiService = frontendApiService;
        this.maintenanceService = maintenanceService;
        this.sessionService = sessionService;
        this.resourceLimitsService = resourceLimitsService;
        this.impactMetricsAvailabilityResolver =
            new ImpactMetricsAvailabilityResolver(config, settingService);
    }

    async getMaxSessionsCount(): Promise<number> {
        throw new Error("STUB");
    }

    async getUiConfig(
        user: Pick<IUser, 'id' | 'email'>,
        sessionId?: string,
    ): Promise<UiConfigSchema> {
        throw new Error("STUB");
    }
}
