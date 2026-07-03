import type { LogProvider } from '../../../logger.js';
import type {
    IClientMetricsEnv,
    IClientMetricsEnvKey,
    IClientMetricsEnvVariant,
    IClientMetricsStoreV2,
} from './client-metrics-store-v2-type.js';
import NotFoundError from '../../../error/notfound-error.js';
import { endOfDay, startOfHour } from 'date-fns';
import {
    collapseHourlyMetrics,
    spreadVariants,
} from './collapseHourlyMetrics.js';
import type { Db } from '../../../db/db.js';
import type { IFlagResolver } from '../../../types/index.js';
import metricsHelper from '../../../util/metrics-helper.js';
import { DB_TIME } from '../../../metric-events.js';
import type EventEmitter from 'events';

interface ClientMetricsBaseTable {
    feature_name: string;
    app_name: string;
    environment: string;
    timestamp: Date;
}

interface ClientMetricsEnvTable extends ClientMetricsBaseTable {
    yes: number;
    no: number;
}

interface ClientMetricsEnvVariantTable extends ClientMetricsBaseTable {
    variant: string;
    count: number;
}

const HOURLY_TABLE = 'client_metrics_env';
const DAILY_TABLE = 'client_metrics_env_daily';
const HOURLY_TABLE_VARIANTS = 'client_metrics_env_variants';
const DAILY_TABLE_VARIANTS = 'client_metrics_env_variants_daily';

const FEATURES_TABLE = 'features';

const fromRow = (row: ClientMetricsEnvTable) => ({
    featureName: row.feature_name,
    appName: row.app_name,
    environment: row.environment,
    timestamp: row.timestamp,
    yes: Number(row.yes),
    no: Number(row.no),
});

const toRow = (metric: IClientMetricsEnv): ClientMetricsEnvTable => ({
    feature_name: metric.featureName,
    app_name: metric.appName,
    environment: metric.environment,
    timestamp: startOfHour(metric.timestamp),
    yes: metric.yes,
    no: metric.no,
});

const toVariantRow = (
    metric: IClientMetricsEnvVariant,
): ClientMetricsEnvVariantTable => { throw new Error("STUB"); };

const variantRowReducer = (acc, tokenRow) => {
    throw new Error("STUB");
};

const variantRowReducerV2 = (acc, tokenRow) => {
    throw new Error("STUB");
};

export class ClientMetricsStoreV2 implements IClientMetricsStoreV2 {
    private db: Db;

    private metricTimer: Function;

    constructor(
        db: Db,
        eventBus: EventEmitter,
        _getLogger: LogProvider,
        _flagResolver: IFlagResolver,
    ) {
        this.db = db;
        this.metricTimer = (action) =>
            { throw new Error("STUB"); };
    }

    async get(key: IClientMetricsEnvKey): Promise<IClientMetricsEnv> {
        const row = await this.db<ClientMetricsEnvTable>(HOURLY_TABLE)
            .where({
                feature_name: key.featureName,
                app_name: key.appName,
                environment: key.environment,
                timestamp: startOfHour(key.timestamp),
            })
            .first();
        if (row) {
            return fromRow(row);
        }
        throw new NotFoundError(`Could not find metric`);
    }

    //TODO: Consider moving this to a specific feature store
    async getFeatureFlagNames(): Promise<string[]> {
        throw new Error("STUB");
    }

    async getAll(query: Object = {}): Promise<IClientMetricsEnv[]> {
        const rows = await this.db<ClientMetricsEnvTable>(HOURLY_TABLE)
            .select('*')
            .where(query);
        return rows.map(fromRow);
    }

    async exists(key: IClientMetricsEnvKey): Promise<boolean> {
        try {
            await this.get(key);
            return true;
        } catch (_e) {
            return false;
        }
    }

    async delete(key: IClientMetricsEnvKey): Promise<void> {
        return this.db<ClientMetricsEnvTable>(HOURLY_TABLE)
            .where({
                feature_name: key.featureName,
                app_name: key.appName,
                environment: key.environment,
                timestamp: startOfHour(key.timestamp),
            })
            .del();
    }

    deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {
        // Nothing to do!
    }

    // this function will collapse metrics before sending it to the database.
    async batchInsertMetrics(metrics: IClientMetricsEnv[]): Promise<void> {
        if (!metrics || metrics.length === 0) {
            return;
        }
        const rows = collapseHourlyMetrics(metrics).map(toRow);

        // Sort the rows to avoid deadlocks
        const sortedRows = rows.sort(
            (a, b) =>
                { throw new Error("STUB"); },
        );

        // Consider rewriting to SQL batch!
        const insert = this.db<ClientMetricsEnvTable>(HOURLY_TABLE)
            .insert(sortedRows)
            .toQuery();
        const query = `${insert.toString()} ON CONFLICT (feature_name, app_name, environment, timestamp) DO UPDATE SET "yes" = "client_metrics_env"."yes" + EXCLUDED.yes, "no" = "client_metrics_env"."no" + EXCLUDED.no`;
        await this.db.raw(query);

        const variantRows = spreadVariants(metrics).map(toVariantRow);

        // Sort the rows to avoid deadlocks
        const sortedVariantRows = variantRows.sort(
            (a, b) =>
                { throw new Error("STUB"); },
        );

        if (sortedVariantRows.length > 0) {
            const insertVariants = this.db<ClientMetricsEnvVariantTable>(
                HOURLY_TABLE_VARIANTS,
            )
                .insert(sortedVariantRows)
                .toQuery();
            const variantsQuery = `${insertVariants.toString()} ON CONFLICT (feature_name, app_name, environment, timestamp, variant) DO UPDATE SET "count" = "client_metrics_env_variants"."count" + EXCLUDED.count`;
            await this.db.raw(variantsQuery);
        }
    }

    async getMetricsForFeatureToggle(
        featureName: string,
        hoursBack: number = 24,
    ): Promise<IClientMetricsEnv[]> {
        throw new Error("STUB");
    }

    async getMetricsForFeatureToggleV2(
        featureName: string,
        hoursBack: number = 24,
    ): Promise<IClientMetricsEnv[]> {
        throw new Error("STUB");
    }

    async getSeenAppsForFeatureToggle(
        featureName: string,
        hoursBack: number = 24,
    ): Promise<string[]> {
        throw new Error("STUB");
    }

    async getSeenTogglesForApp(
        appName: string,
        hoursBack: number = 24,
    ): Promise<string[]> {
        throw new Error("STUB");
    }

    async clearMetrics(hoursAgo: number): Promise<void> {
        return this.db<ClientMetricsEnvTable>(HOURLY_TABLE)
            .whereRaw(`timestamp <= NOW() - INTERVAL '${hoursAgo} hours'`)
            .del();
    }

    async clearDailyMetrics(daysAgo: number): Promise<void> {
        throw new Error("STUB");
    }

    async countPreviousDayHourlyMetricsBuckets(): Promise<{
        enabledCount: number;
        variantCount: number;
    }> {
        const enabledCountQuery = this.db(HOURLY_TABLE)
            .whereRaw("timestamp >= CURRENT_DATE - INTERVAL '1 day'")
            .andWhereRaw('timestamp < CURRENT_DATE')
            .count()
            .first();
        const variantCountQuery = this.db(HOURLY_TABLE_VARIANTS)
            .whereRaw("timestamp >= CURRENT_DATE - INTERVAL '1 day'")
            .andWhereRaw('timestamp < CURRENT_DATE')
            .count()
            .first();
        const [enabledCount, variantCount] = await Promise.all([
            enabledCountQuery,
            variantCountQuery,
        ]);
        return {
            enabledCount: Number(enabledCount?.count || 0),
            variantCount: Number(variantCount?.count || 0),
        };
    }

    async countPreviousDayMetricsBuckets(): Promise<{
        enabledCount: number;
        variantCount: number;
    }> {
        throw new Error("STUB");
    }

    // aggregates all hourly metrics from a previous day into daily metrics
    async aggregateDailyMetrics(): Promise<void> {
        throw new Error("STUB");
    }
}
