import type { Logger } from '../../../logger.js';
import type { IFlagResolver, IUnleashConfig } from '../../../types/index.js';
import type { ISdkHeartbeat, IUnleashStores } from '../../../types/index.js';
import type { ToggleMetricsSummary } from '../../../types/models/metrics.js';
import type {
    IClientMetricsEnv,
    IClientMetricsStoreV2,
} from './client-metrics-store-v2-type.js';
import { clientMetricsSchema, impactMetricsSchema } from '../shared/schema.js';
import { compareAsc, secondsToMilliseconds } from 'date-fns';
import {
    CLIENT_METRICS,
    CLIENT_METRICS_ADDED,
    CLIENT_REGISTER,
} from '../../../events/index.js';
import ApiUser, { type IApiUser } from '../../../types/api-user.js';
import { ALL } from '../../../types/models/api-token.js';
import type { IUser } from '../../../types/user.js';
import { collapseHourlyMetrics } from './collapseHourlyMetrics.js';
import type { LastSeenService } from '../last-seen/last-seen-service.js';
import {
    generateDayBuckets,
    generateHourBuckets,
    type HourBucket,
} from '../../../util/time-utils.js';
import type { ClientMetricsSchema } from '../../../../lib/openapi/index.js';
import { nameSchema } from '../../../schema/feature-schema.js';
import memoizee from 'memoizee';
import type { UnknownFlagsService } from '../unknown-flags/unknown-flags-service.js';
import {
    type Metric,
    MetricsTranslator,
} from '../impact/metrics-translator.js';
import { impactRegister } from '../impact/impact-register.js';
import type { UnknownFlagReport } from '../unknown-flags/unknown-flags-store.js';

export default class ClientMetricsServiceV2 {
    private config: IUnleashConfig;

    private unsavedMetrics: IClientMetricsEnv[] = [];

    private clientMetricsStoreV2: IClientMetricsStoreV2;

    private lastSeenService: LastSeenService;

    private unknownFlagsService: UnknownFlagsService;

    private flagResolver: Pick<IFlagResolver, 'isEnabled' | 'getVariant'>;

    private logger: Logger;

    private impactMetricsTranslator: MetricsTranslator;

    private cachedFeatureNames: () => Promise<string[]>;

    constructor(
        { clientMetricsStoreV2 }: Pick<IUnleashStores, 'clientMetricsStoreV2'>,
        config: IUnleashConfig,
        lastSeenService: LastSeenService,
        unknownFlagsService: UnknownFlagsService,
    ) {
        this.clientMetricsStoreV2 = clientMetricsStoreV2;
        this.lastSeenService = lastSeenService;
        this.unknownFlagsService = unknownFlagsService;
        this.config = config;
        this.logger = config.getLogger(
            '/services/client-metrics/client-metrics-service-v2.ts',
        );
        this.flagResolver = config.flagResolver;
        this.cachedFeatureNames = memoizee(
            async () => { throw new Error("STUB"); },
            {
                promise: true,
                maxAge: secondsToMilliseconds(10),
            },
        );
        this.impactMetricsTranslator = new MetricsTranslator(impactRegister);
    }

    async clearMetrics(hoursAgo: number) {
        return this.clientMetricsStoreV2.clearMetrics(hoursAgo);
    }

    async clearDailyMetrics(daysAgo: number) {
        throw new Error("STUB");
    }

    async aggregateDailyMetrics() {
        throw new Error("STUB");
    }

    async filterExistingToggleNames(toggleNames: string[]): Promise<{
        validatedToggleNames: string[];
        unknownToggleNames: string[];
    }> {
        throw new Error("STUB");
    }

    async filterValidToggleNames(toggleNames: string[]): Promise<string[]> {
        throw new Error("STUB");
    }

    private async siftMetrics(
        metrics: IClientMetricsEnv[],
    ): Promise<IClientMetricsEnv[]> {
        throw new Error("STUB");
    }

    async registerBulkMetrics(metrics: IClientMetricsEnv[]): Promise<void> {
        throw new Error("STUB");
    }

    async registerImpactMetrics(impactMetrics: Metric[]) {
        throw new Error("STUB");
    }

    async registerClientMetrics(
        data: ClientMetricsSchema,
        _clientIp: string,
        environment: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async bulkAdd(): Promise<void> {
        if (this.unsavedMetrics.length > 0) {
            // Make a copy of `unsavedMetrics` in case new metrics
            // arrive while awaiting `batchInsertMetrics`.
            const copy = [...this.unsavedMetrics];
            this.unsavedMetrics = [];
            await this.clientMetricsStoreV2.batchInsertMetrics(copy);
            this.config.eventBus.emit(CLIENT_METRICS_ADDED, copy);
        }
    }

    // Overview over usage last "hour" bucket and all applications using the toggle
    async getFeatureToggleMetricsSummary(
        featureName: string,
    ): Promise<ToggleMetricsSummary> {
        throw new Error("STUB");
    }

    async getClientMetricsForToggle(
        featureName: string,
        hoursBack: number = 24,
    ): Promise<IClientMetricsEnv[]> {
        throw new Error("STUB");
    }

    resolveMetricsEnvironment(user: IUser | IApiUser): string {
        throw new Error("STUB");
    }

    resolveUserEnvironment(user: IUser | IApiUser): string {
        throw new Error("STUB");
    }
}
