import { AUTH_PROVIDERS_CATALOG } from '../../types/settings/auth-settings.js';
import { sha256 } from 'js-sha256';
import type { IUnleashConfig } from '../../types/option.js';
import type {
    IClientInstanceStore,
    IClientMetricsStoreV2,
    IEventStore,
    IFeatureStrategiesReadModel,
    IFeatureStrategiesStore,
    ITrafficDataUsageStore,
    IUnleashStores,
} from '../../types/stores.js';
import type { IContextFieldStore } from '../context/context-field-store-type.js';
import type { IEnvironmentStore } from '../project-environments/environment-store-type.js';
import type { IFeatureToggleStore } from '../feature-toggle/types/feature-toggle-store-type.js';
import type { IGroupStore } from '../../types/stores/group-store.js';
import type { IProjectStore } from '../../features/project/project-store-type.js';
import type { IStrategyStore } from '../../types/stores/strategy-store.js';
import type { IUserStore } from '../../types/stores/user-store.js';
import type { ISegmentStore } from '../segment/segment-store-type.js';
import type { IRoleStore } from '../../types/stores/role-store.js';
import type VersionService from '../../services/version-service.js';
import type { ISettingStore } from '../settings/settings-store-type.js';
import { FEATURES_EXPORTED, FEATURES_IMPORTED } from '../../events/index.js';
import type { IApiTokenStore, IFlagResolver } from '../../types/index.js';
import { CUSTOM_ROOT_ROLE_TYPE } from '../../util/index.js';
import type { GetActiveUsers } from './getActiveUsers.js';
import type { ProjectModeCount } from '../project/project-store.js';
import type { GetProductionChanges } from './getProductionChanges.js';
import { format, minutesToMilliseconds } from 'date-fns';
import memoizee from 'memoizee';
import type { GetLicensedUsers } from './getLicensedUsers.js';
import type { GetReadOnlyUsers } from './getReadOnlyUsers.js';
import type { IFeatureUsageInfo } from '../../services/version-service.js';
import type { ReleasePlanTemplateStore } from '../release-plans/release-plan-template-store.js';
import type { ReleasePlanStore } from '../release-plans/release-plan-store.js';
import type { GetEdgeInstances } from './getEdgeInstances.js';

export type TimeRange = 'allTime' | '30d' | '7d';

export interface InstanceStats {
    instanceId: string;
    timestamp: Date;
    versionOSS: string;
    versionEnterprise?: string;
    users: number;
    serviceAccounts: number;
    apiTokens: Map<string, number>;
    featureToggles: number;
    archivedFeatureToggles: number;
    projects: ProjectModeCount[];
    contextFields: number;
    roles: number;
    customRootRoles: number;
    customRootRolesInUse: number;
    featureExports: number;
    featureImports: number;
    groups: number;
    environments: number;
    segments: number;
    strategies: number;
    SAMLenabled: boolean;
    OIDCenabled: boolean;
    passwordAuthEnabled: boolean;
    SCIMenabled: boolean;
    clientApps: { range: TimeRange; count: number }[];
    activeUsers: Awaited<ReturnType<GetActiveUsers>>;
    licensedUsers: Awaited<ReturnType<GetLicensedUsers>>;
    productionChanges: Awaited<ReturnType<GetProductionChanges>>;
    previousDayMetricsBucketsCount: {
        enabledCount: number;
        variantCount: number;
    };
    maxEnvironmentStrategies: number;
    maxConstraints: number;
    maxConstraintValues: number;
    releaseTemplates: number;
    releasePlans: number;
    edgeInstanceUsage: Awaited<ReturnType<GetEdgeInstances>>;
    readOnlyUsers?: number;
}

export type InstanceStatsSigned = Omit<InstanceStats, 'projects'> & {
    projects: number;
    sum: string;
};

export class InstanceStatsService {
    private strategyStore: IStrategyStore;

    private userStore: IUserStore;

    private featureToggleStore: IFeatureToggleStore;

    private contextFieldStore: IContextFieldStore;

    private projectStore: IProjectStore;

    private groupStore: IGroupStore;

    private environmentStore: IEnvironmentStore;

    private segmentStore: ISegmentStore;

    private roleStore: IRoleStore;

    private eventStore: IEventStore;

    private apiTokenStore: IApiTokenStore;

    private versionService: VersionService;

    private settingStore: ISettingStore;

    private clientInstanceStore: IClientInstanceStore;

    private clientMetricsStore: IClientMetricsStoreV2;

    private flagResolver: IFlagResolver;

    private appCount?: Partial<{ [key in TimeRange]: number }>;

    getActiveUsers: GetActiveUsers;

    getLicencedUsers: GetLicensedUsers;

    getReadOnlyUsers: GetReadOnlyUsers;

    getProductionChanges: GetProductionChanges;

    getEdgeInstances: GetEdgeInstances;

    private featureStrategiesReadModel: IFeatureStrategiesReadModel;

    private featureStrategiesStore: IFeatureStrategiesStore;

    private trafficDataUsageStore: ITrafficDataUsageStore;

    private releasePlanTemplateStore: ReleasePlanTemplateStore;

    private releasePlanStore: ReleasePlanStore;

    constructor(
        {
            featureToggleStore,
            userStore,
            projectStore,
            environmentStore,
            strategyStore,
            contextFieldStore,
            groupStore,
            segmentStore,
            roleStore,
            settingStore,
            clientInstanceStore,
            eventStore,
            apiTokenStore,
            clientMetricsStoreV2,
            featureStrategiesReadModel,
            featureStrategiesStore,
            trafficDataUsageStore,
            releasePlanTemplateStore,
            releasePlanStore,
        }: Pick<
            IUnleashStores,
            | 'featureToggleStore'
            | 'userStore'
            | 'projectStore'
            | 'environmentStore'
            | 'strategyStore'
            | 'contextFieldStore'
            | 'groupStore'
            | 'segmentStore'
            | 'roleStore'
            | 'settingStore'
            | 'clientInstanceStore'
            | 'eventStore'
            | 'apiTokenStore'
            | 'clientMetricsStoreV2'
            | 'featureStrategiesReadModel'
            | 'featureStrategiesStore'
            | 'trafficDataUsageStore'
            | 'releasePlanTemplateStore'
            | 'releasePlanStore'
        >,
        { flagResolver }: Pick<IUnleashConfig, 'flagResolver'>,
        versionService: VersionService,
        getActiveUsers: GetActiveUsers,
        getProductionChanges: GetProductionChanges,
        getLicencedUsers: GetLicensedUsers,
        getReadOnlyUsers: GetReadOnlyUsers,
        getEdgeInstances: GetEdgeInstances,
    ) {
        this.strategyStore = strategyStore;
        this.userStore = userStore;
        this.featureToggleStore = featureToggleStore;
        this.environmentStore = environmentStore;
        this.projectStore = projectStore;
        this.groupStore = groupStore;
        this.contextFieldStore = contextFieldStore;
        this.segmentStore = segmentStore;
        this.roleStore = roleStore;
        this.versionService = versionService;
        this.settingStore = settingStore;
        this.eventStore = eventStore;
        this.clientInstanceStore = clientInstanceStore;
        this.getActiveUsers = () =>
            { throw new Error("STUB"); };
        this.getLicencedUsers = () =>
            { throw new Error("STUB"); };
        this.getReadOnlyUsers = () =>
            { throw new Error("STUB"); };
        this.getProductionChanges = () =>
            { throw new Error("STUB"); };
        this.getEdgeInstances = () =>
            { throw new Error("STUB"); };
        this.apiTokenStore = apiTokenStore;
        this.clientMetricsStore = clientMetricsStoreV2;
        this.flagResolver = flagResolver;
        this.featureStrategiesReadModel = featureStrategiesReadModel;
        this.featureStrategiesStore = featureStrategiesStore;
        this.trafficDataUsageStore = trafficDataUsageStore;
        this.releasePlanTemplateStore = releasePlanTemplateStore;
        this.releasePlanStore = releasePlanStore;
    }

    memory = new Map<string, () => Promise<any>>();
    memorize<T>(key: string, fn: () => Promise<T>): Promise<T> {
        const variant = this.flagResolver.getVariant('memorizeStats', {
            memoryKey: key,
        });
        if (variant.feature_enabled) {
            const minutes =
                variant.payload?.type === 'number'
                    ? Number(variant.payload.value)
                    : 1;

            let memoizedFunction = this.memory.get(key);
            if (!memoizedFunction) {
                memoizedFunction = memoizee(() => { throw new Error("STUB"); }, {
                    promise: true,
                    maxAge: minutesToMilliseconds(minutes),
                });
                this.memory.set(key, memoizedFunction);
            }
            return memoizedFunction();
        } else {
            return fn();
        }
    }

    getProjectModeCount(): Promise<ProjectModeCount[]> {
        return this.memorize('getProjectModeCount', () =>
            { throw new Error("STUB"); },
        );
    }

    getToggleCount(): Promise<number> {
        return this.memorize('getToggleCount', () =>
            { throw new Error("STUB"); },
        );
    }

    getArchivedToggleCount(): Promise<number> {
        return this.memorize('hasOIDC', () =>
            { throw new Error("STUB"); },
        );
    }

    async hasOIDC(): Promise<boolean> {
        return this.memorize('hasOIDC', async () => {
            throw new Error("STUB");
        });
    }

    async hasSAML(): Promise<boolean> {
        return this.memorize('hasSAML', async () => {
            throw new Error("STUB");
        });
    }

    async hasPasswordAuth(): Promise<boolean> {
        return this.memorize('hasPasswordAuth', async () => {
            throw new Error("STUB");
        });
    }

    async hasSCIM(): Promise<boolean> {
        return this.memorize('hasSCIM', async () => {
            throw new Error("STUB");
        });
    }

    async getReleaseTemplates(): Promise<number> {
        return this.memorize('getReleaseTemplates', async () => {
            throw new Error("STUB");
        });
    }

    async getReleasePlans(): Promise<number> {
        return this.memorize('getReleasePlans', async () => {
            throw new Error("STUB");
        });
    }

    async getStats(): Promise<InstanceStats> {
        const versionInfo = await this.versionService.getVersionInfo();
        const [
            featureToggles,
            archivedFeatureToggles,
            users,
            serviceAccounts,
            apiTokens,
            activeUsers,
            licensedUsers,
            projects,
            contextFields,
            groups,
            roles,
            customRootRoles,
            customRootRolesInUse,
            environments,
            segments,
            strategies,
            SAMLenabled,
            OIDCenabled,
            passwordAuthEnabled,
            SCIMenabled,
            clientApps,
            featureExports,
            featureImports,
            productionChanges,
            previousDayMetricsBucketsCount,
            maxEnvironmentStrategies,
            maxConstraintValues,
            maxConstraints,
            releaseTemplates,
            releasePlans,
            edgeInstanceUsage,
            readOnlyUsers,
        ] = await Promise.all([
            this.getToggleCount(),
            this.getArchivedToggleCount(),
            this.getRegisteredUsers(),
            this.countServiceAccounts(),
            this.countApiTokensByType(),
            this.getActiveUsers(),
            this.getLicencedUsers(),
            this.getProjectModeCount(),
            this.contextFieldCount(),
            this.groupCount(),
            this.roleCount(),
            this.customRolesCount(),
            this.customRolesCountInUse(),
            this.environmentCount(),
            this.segmentCount(),
            this.strategiesCount(),
            this.hasSAML(),
            this.hasOIDC(),
            this.hasPasswordAuth(),
            this.hasSCIM(),
            this.appCount ? this.appCount : this.getLabeledAppCounts(),
            this.featuresExported(),
            this.featuresImported(),
            this.getProductionChanges(),
            this.countPreviousDayHourlyMetricsBuckets(),
            this.memorize(
                'maxFeatureEnvironmentStrategies',
                this.featureStrategiesReadModel.getMaxFeatureEnvironmentStrategies.bind(
                    this.featureStrategiesReadModel,
                ),
            ),
            this.memorize(
                'maxConstraintValues',
                this.featureStrategiesReadModel.getMaxConstraintValues.bind(
                    this.featureStrategiesReadModel,
                ),
            ),
            this.memorize(
                'maxConstraintsPerStrategy',
                this.featureStrategiesReadModel.getMaxConstraintsPerStrategy.bind(
                    this.featureStrategiesReadModel,
                ),
            ),
            this.getReleaseTemplates(),
            this.getReleasePlans(),
            this.getEdgeInstances(),
            this.getReadOnlyUsers(),
        ]);

        return {
            timestamp: new Date(),
            instanceId: versionInfo.instanceId,
            versionOSS: versionInfo.current.oss,
            versionEnterprise: versionInfo.current.enterprise,
            users,
            serviceAccounts,
            apiTokens,
            activeUsers,
            licensedUsers,
            featureToggles,
            archivedFeatureToggles,
            projects,
            contextFields,
            roles,
            customRootRoles,
            customRootRolesInUse,
            groups,
            environments,
            segments,
            strategies,
            SAMLenabled,
            OIDCenabled,
            passwordAuthEnabled,
            SCIMenabled,
            clientApps: Object.entries(clientApps).map(([range, count]) => { throw new Error("STUB"); }),
            featureExports,
            featureImports,
            productionChanges,
            previousDayMetricsBucketsCount,
            maxEnvironmentStrategies: maxEnvironmentStrategies?.count ?? 0,
            maxConstraintValues: maxConstraintValues?.count ?? 0,
            maxConstraints: maxConstraints?.count ?? 0,
            releaseTemplates,
            releasePlans,
            edgeInstanceUsage,
            ...(readOnlyUsers !== null ? { readOnlyUsers } : {}),
        };
    }

    async getFeatureUsageInfo(): Promise<IFeatureUsageInfo> {
        const [
            featureToggles,
            users,
            projectModeCount,
            contextFields,
            groups,
            roles,
            customRootRoles,
            customRootRolesInUse,
            environments,
            segments,
            strategies,
            SAMLenabled,
            OIDCenabled,
            featureExports,
            featureImports,
            customStrategies,
            customStrategiesInUse,
            userActive,
            productionChanges,
            postgresVersion,
            licenseType,
            hostedBy,
            releaseTemplates,
            releasePlans,
            edgeInstanceUsage,
            readOnlyUsers,
        ] = await Promise.all([
            this.getToggleCount(),
            this.getRegisteredUsers(),
            this.getProjectModeCount(),
            this.contextFieldCount(),
            this.groupCount(),
            this.roleCount(),
            this.customRolesCount(),
            this.customRolesCountInUse(),
            this.environmentCount(),
            this.segmentCount(),
            this.strategiesCount(),
            this.hasSAML(),
            this.hasOIDC(),
            this.featuresExported(),
            this.featuresImported(),
            this.customStrategiesCount(),
            this.customStrategiesInUseCount(),
            this.getActiveUsers(),
            this.getProductionChanges(),
            this.postgresVersion(),
            this.getLicenseType(),
            this.getHostedBy(),
            this.getReleaseTemplates(),
            this.getReleasePlans(),
            this.getEdgeInstances(),
            this.getReadOnlyUsers(),
        ]);
        const versionInfo = await this.versionService.getVersionInfo();

        const featureInfo = {
            featureToggles,
            users,
            projects: projectModeCount
                .map((p) => { throw new Error("STUB"); })
                .reduce((a, b) => { throw new Error("STUB"); }, 0),
            contextFields,
            groups,
            roles,
            customRootRoles,
            customRootRolesInUse,
            environments,
            segments,
            strategies,
            SAMLenabled,
            OIDCenabled,
            featureExports,
            featureImports,
            customStrategies,
            customStrategiesInUse,
            instanceId: versionInfo.instanceId,
            versionOSS: versionInfo.current.oss,
            versionEnterprise: versionInfo.current.enterprise,
            activeUsers30: userActive.last30,
            activeUsers60: userActive.last60,
            activeUsers90: userActive.last90,
            productionChanges30: productionChanges.last30,
            productionChanges60: productionChanges.last60,
            productionChanges90: productionChanges.last90,
            postgresVersion,
            licenseType,
            hostedBy,
            releaseTemplates,
            releasePlans,
            edgeInstanceUsage,
            ...(readOnlyUsers !== null ? { readOnlyUsers } : {}),
        };
        return featureInfo;
    }

    getHostedBy(): string {
        return 'self-hosted';
    }

    getLicenseType(): string {
        return 'oss';
    }

    featuresExported(): Promise<number> {
        return this.memorize('searchEventsCountFeaturesExported', () =>
            { throw new Error("STUB"); },
        );
    }

    featuresImported(): Promise<number> {
        return this.memorize('searchEventsCountFeaturesImported', () =>
            { throw new Error("STUB"); },
        );
    }

    customStrategiesCount(): Promise<number> {
        return this.memorize(
            'customStrategiesCount',
            async () =>
                { throw new Error("STUB"); },
        );
    }

    customStrategiesInUseCount(): Promise<number> {
        return this.memorize(
            'customStrategiesInUseCount',
            async () =>
                { throw new Error("STUB"); },
        );
    }

    postgresVersion(): Promise<string> {
        return this.memorize('postgresVersion', () =>
            { throw new Error("STUB"); },
        );
    }

    groupCount(): Promise<number> {
        return this.memorize('groupCount', () => { throw new Error("STUB"); });
    }

    roleCount(): Promise<number> {
        return this.memorize('roleCount', () => { throw new Error("STUB"); });
    }

    customRolesCount(): Promise<number> {
        return this.memorize('customRolesCount', () =>
            { throw new Error("STUB"); },
        );
    }

    customRolesCountInUse(): Promise<number> {
        return this.memorize('customRolesCountInUse', () =>
            { throw new Error("STUB"); },
        );
    }

    segmentCount(): Promise<number> {
        return this.memorize('segmentCount', () => { throw new Error("STUB"); });
    }

    contextFieldCount(): Promise<number> {
        return this.memorize('contextFieldCount', () =>
            { throw new Error("STUB"); },
        );
    }

    projectContextFieldCount(): Promise<number> {
        return this.memorize('projectContextFieldCount', () =>
            { throw new Error("STUB"); },
        );
    }

    strategiesCount(): Promise<number> {
        return this.memorize('strategiesCount', () =>
            { throw new Error("STUB"); },
        );
    }

    environmentCount(): Promise<number> {
        return this.memorize('environmentCount', () =>
            { throw new Error("STUB"); },
        );
    }

    countPreviousDayHourlyMetricsBuckets(): Promise<{
        enabledCount: number;
        variantCount: number;
    }> {
        return this.memorize('countPreviousDayHourlyMetricsBuckets', () =>
            { throw new Error("STUB"); },
        );
    }

    countApiTokensByType(): Promise<Map<string, number>> {
        return this.memorize('countApiTokensByType', () =>
            { throw new Error("STUB"); },
        );
    }

    getRegisteredUsers(): Promise<number> {
        return this.memorize('getRegisteredUsers', () =>
            { throw new Error("STUB"); },
        );
    }

    countServiceAccounts(): Promise<number> {
        return this.memorize('countServiceAccounts', () =>
            { throw new Error("STUB"); },
        );
    }

    async getCurrentTrafficData(): Promise<number> {
        return this.memorize('getCurrentTrafficData', async () => {
            throw new Error("STUB");
        });
    }

    async getLabeledAppCounts(): Promise<
        Partial<{ [key in TimeRange]: number }>
    > {
        return this.memorize('getLabeledAppCounts', async () => {
            throw new Error("STUB");
        });
    }

    getAppCountSnapshot(range: TimeRange): number | undefined {
        return this.appCount?.[range];
    }

    async getSignedStats(): Promise<InstanceStatsSigned> {
        throw new Error("STUB");
    }
}
