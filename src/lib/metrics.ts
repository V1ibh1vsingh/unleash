import { collectDefaultMetrics } from 'prom-client';
import memoizee from 'memoizee';
import type EventEmitter from 'events';
import type { Knex } from 'knex';
import * as events from './metric-events.js';
import {
    DB_POOL_UPDATE,
    FEATURE_ARCHIVED,
    FEATURE_CREATED,
    FEATURE_REVIVED,
    FEATURE_STRATEGY_ADD,
    FEATURE_STRATEGY_REMOVE,
    FEATURE_STRATEGY_UPDATE,
    FEATURE_ENVIRONMENT_ENABLED,
    FEATURE_ENVIRONMENT_DISABLED,
    FEATURE_VARIANTS_UPDATED,
    FEATURE_METADATA_UPDATED,
    FEATURE_UPDATED,
    CLIENT_METRICS,
    CLIENT_REGISTER,
    PROJECT_ENVIRONMENT_REMOVED,
    PROJECT_CREATED,
    PROJECT_ARCHIVED,
    PROJECT_REVIVED,
    PROJECT_DELETED,
    RELEASE_PLAN_ADDED,
    RELEASE_PLAN_REMOVED,
    RELEASE_PLAN_MILESTONE_STARTED,
} from './events/index.js';
import type { IUnleashConfig } from './types/option.js';
import type { IUnleashStores } from './types/stores.js';
import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';
import type { InstanceStatsService } from './features/instance-stats/instance-stats-service.js';
import type { IEnvironment, ISdkHeartbeat } from './types/index.js';
import {
    createCounter,
    createGauge,
    createSummary,
    createHistogram,
} from './util/metrics/index.js';
import type { SchedulerService } from './services/index.js';
import type { IClientMetricsEnv } from './features/metrics/client-metrics/client-metrics-store-v2-type.js';
import { DbMetricsMonitor } from './metrics-gauge.js';
import * as impactMetrics from './features/metrics/impact/define-impact-metrics.js';
import HyperLogLog from 'hyperloglog-lite';
import { setupIntegrationMetrics } from './features/metrics/integrations/integration-metrics.js';

const DISTINCT_HLL_REGISTERS_EXPONENT = 14;

export function registerPrometheusPostgresMetrics(
    db: Knex,
    eventBus: EventEmitter,
    postgresVersion: string,
) {
    if (db?.client) {
        const dbPoolMin = createGauge({
            name: 'db_pool_min',
            help: 'Minimum DB pool size',
        });
        dbPoolMin.set(db.client.pool.min);
        const dbPoolMax = createGauge({
            name: 'db_pool_max',
            help: 'Maximum DB pool size',
        });
        dbPoolMax.set(db.client.pool.max);
        const dbPoolFree = createGauge({
            name: 'db_pool_free',
            help: 'Current free connections in DB pool',
        });
        const dbPoolUsed = createGauge({
            name: 'db_pool_used',
            help: 'Current connections in use in DB pool',
        });
        const dbPoolPendingCreates = createGauge({
            name: 'db_pool_pending_creates',
            help: 'how many asynchronous create calls are running in DB pool',
        });
        const dbPoolPendingAcquires = createGauge({
            name: 'db_pool_pending_acquires',
            help: 'how many acquires are waiting for a resource to be released in DB pool',
        });

        eventBus.on(DB_POOL_UPDATE, (data) => {
            throw new Error("STUB");
        });

        const database_version = createGauge({
            name: 'postgres_version',
            help: 'Which version of postgres is running (SHOW server_version)',
            labelNames: ['version'],
        });
        database_version.labels({ version: postgresVersion }).set(1);
    }
}

export function registerPrometheusMetrics(
    config: IUnleashConfig,
    stores: IUnleashStores,
    version: string,
    eventBus: EventEmitter,
    instanceStatsService: InstanceStatsService,
) {
    const resolveEnvironmentType = async (
        environment: string,
        cachedEnvironments: () => Promise<IEnvironment[]>,
    ): Promise<string> => {
        const environments = await cachedEnvironments();
        const env = environments.find((e) => { throw new Error("STUB"); });

        if (env) {
            return env.type;
        } else {
            return 'unknown';
        }
    };

    const { eventStore, environmentStore } = stores;
    const { flagResolver } = config;
    const dbMetrics = new DbMetricsMonitor(config);

    const cachedEnvironments: () => Promise<IEnvironment[]> = memoizee(
        async () => { throw new Error("STUB"); },
        {
            promise: true,
            maxAge: hoursToMilliseconds(1),
        },
    );

    const requestDuration = createSummary({
        name: 'http_request_duration_milliseconds',
        help: 'App response time',
        labelNames: ['path', 'method', 'status', 'appName'],
        percentiles: [0.1, 0.5, 0.9, 0.95, 0.99],
        maxAgeSeconds: 600,
        ageBuckets: 5,
    });
    const schedulerDuration = createSummary({
        name: 'scheduler_duration_seconds',
        help: 'Scheduler duration time',
        labelNames: ['jobId'],
        percentiles: [0.1, 0.5, 0.9, 0.95, 0.99],
        maxAgeSeconds: 600,
        ageBuckets: 5,
    });
    const dbDuration = createSummary({
        name: 'db_query_duration_seconds',
        help: 'DB query duration time',
        labelNames: ['store', 'action'],
        percentiles: [0.1, 0.5, 0.9, 0.95, 0.99],
        maxAgeSeconds: 600,
        ageBuckets: 5,
    });
    const functionDuration = createSummary({
        name: 'function_duration_seconds',
        help: 'Function duration time',
        labelNames: ['functionName', 'className'],
        percentiles: [0.1, 0.5, 0.9, 0.95, 0.99],
        maxAgeSeconds: 600,
        ageBuckets: 5,
    });
    const featureFlagUpdateTotal = createCounter({
        name: 'feature_toggle_update_total',
        help: 'Number of times a flag has been updated. Environment label would be "n/a" when it is not available, e.g. when a feature flag is created.',
        labelNames: [
            'toggle',
            'project',
            'environment',
            'environmentType',
            'action',
        ],
    });
    const featureFlagUsageTotal = createCounter({
        name: 'feature_toggle_usage_total',
        help: 'Number of times a feature flag has been used',
        labelNames: ['toggle', 'active', 'appName'],
    });
    const clientRegistrationTotal = createCounter({
        name: 'client_registration_total',
        help: 'Number of times a an application have registered',
        labelNames: ['appName', 'environment', 'interval'],
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'feature_toggles_total',
        help: 'Number of feature flags',
        labelNames: ['version'],
        query: () => { throw new Error("STUB"); },
        map: (value) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'max_feature_environment_strategies',
        help: 'Maximum number of environment strategies in one feature',
        labelNames: ['feature', 'environment'],
        query: () =>
            { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'max_feature_strategies',
        help: 'Maximum number of strategies in one feature',
        labelNames: ['feature'],
        query: () =>
            { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'max_constraint_values',
        help: 'Maximum number of constraint values used in a single constraint',
        labelNames: ['feature', 'environment'],
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'max_strategy_constraints',
        help: 'Maximum number of constraints used on a single strategy',
        labelNames: ['feature', 'environment'],
        query: () =>
            { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'largest_project_environment_size',
        help: 'The largest project environment size (bytes) based on strategies, constraints, variants and parameters',
        labelNames: ['project', 'environment'],
        query: () =>
            { throw new Error("STUB"); },
        map: (results) => {
            throw new Error("STUB");
        },
    });
    dbMetrics.registerGaugeDbMetric({
        name: 'largest_feature_environment_size',
        help: 'The largest feature environment size (bytes) base on strategies, constraints, variants and parameters',
        labelNames: ['feature', 'environment'],
        query: () =>
            { throw new Error("STUB"); },
        map: (results) => {
            throw new Error("STUB");
        },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'unique_sdk_connections_total',
        help: 'The number of unique SDK connections for the full previous hour across all instances. Available only for SDKs reporting `unleash-connection-id`',
        query: () => {
            throw new Error("STUB");
        },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'unique_backend_sdk_connections_total',
        help: 'The number of unique backend SDK connections for the full previous hour across all instances. Available only for SDKs reporting `unleash-connection-id`',
        query: () => {
            throw new Error("STUB");
        },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'unique_frontend_sdk_connections_total',
        help: 'The number of unique frontend SDK connections for the full previous hour across all instances. Available only for SDKs reporting `unleash-connection-id`',
        query: () => {
            throw new Error("STUB");
        },
        map: (result) => { throw new Error("STUB"); },
    });

    const featureTogglesArchivedTotal = createGauge({
        name: 'feature_toggles_archived_total',
        help: 'Number of archived feature flags',
    });
    createGauge({
        name: 'users_total',
        help: 'Number of users',
        fetchValue: () => { throw new Error("STUB"); },
        ttlMs: minutesToMilliseconds(15),
    });
    const trafficTotal = createGauge({
        name: 'traffic_total',
        help: 'Traffic used current month',
    });
    const serviceAccounts = createGauge({
        name: 'service_accounts_total',
        help: 'Number of service accounts',
    });
    const apiTokens = createGauge({
        name: 'api_tokens_total',
        help: 'Number of API tokens',
        labelNames: ['type'],
    });
    const enabledMetricsBucketsPreviousDay = createGauge({
        name: 'enabled_metrics_buckets_previous_day',
        help: 'Number of hourly enabled/disabled metric buckets in the previous day',
    });
    const variantMetricsBucketsPreviousDay = createGauge({
        name: 'variant_metrics_buckets_previous_day',
        help: 'Number of hourly variant metric buckets in the previous day',
    });
    const usersActive7days = createGauge({
        name: 'users_active_7',
        help: 'Number of users active in the last 7 days',
    });
    const usersActive30days = createGauge({
        name: 'users_active_30',
        help: 'Number of users active in the last 30 days',
    });
    const usersActive60days = createGauge({
        name: 'users_active_60',
        help: 'Number of users active in the last 60 days',
    });
    const usersActive90days = createGauge({
        name: 'users_active_90',
        help: 'Number of users active in the last 90 days',
    });
    dbMetrics.registerGaugeDbMetric({
        name: 'projects_total',
        help: 'Number of projects',
        labelNames: ['mode'],
        query: () => { throw new Error("STUB"); },
        map: (projects) =>
            { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'environments_total',
        help: 'Number of environments',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });
    dbMetrics.registerGaugeDbMetric({
        name: 'groups_total',
        help: 'Number of groups',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'roles_total',
        help: 'Number of roles',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'custom_root_roles_total',
        help: 'Number of custom root roles',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'custom_root_roles_in_use_total',
        help: 'Number of custom root roles in use',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'segments_total',
        help: 'Number of segments',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'context_total',
        help: 'Number of context',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'project_context_total',
        help: 'Number of project context fields',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'strategies_total',
        help: 'Number of strategies',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'custom_strategies_total',
        help: 'Number of custom strategies',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'custom_strategies_in_use_total',
        help: 'Number of custom strategies in use',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'client_apps_total',
        help: 'Number of registered client apps aggregated by range by last seen',
        labelNames: ['range'],
        query: () => { throw new Error("STUB"); },
        map: (result) =>
            { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'saml_enabled',
        help: 'Whether SAML is enabled',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'oidc_enabled',
        help: 'Whether OIDC is enabled',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'password_auth_enabled',
        help: 'Whether password auth is enabled',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'scim_enabled',
        help: 'Whether SCIM is enabled',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    const clientSdkVersionUsage = createCounter({
        name: 'client_sdk_versions',
        help: 'Which sdk versions are being used',
        labelNames: [
            'sdk_name',
            'sdk_version',
            'platform_name',
            'platform_version',
            'yggdrasil_version',
            'spec_version',
        ],
    });

    const productionChanges30 = createGauge({
        name: 'production_changes_30',
        help: 'Changes made to production environment last 30 days',
        labelNames: ['environment'],
    });
    const productionChanges60 = createGauge({
        name: 'production_changes_60',
        help: 'Changes made to production environment last 60 days',
        labelNames: ['environment'],
    });
    const productionChanges90 = createGauge({
        name: 'production_changes_90',
        help: 'Changes made to production environment last 90 days',
        labelNames: ['environment'],
    });

    const rateLimits = createGauge({
        name: 'rate_limits',
        help: 'Rate limits (per minute) for METHOD/ENDPOINT pairs',
        labelNames: ['endpoint', 'method'],
    });
    rateLimits
        .labels({
            endpoint: '/api/client/metrics',
            method: 'POST',
        })
        .set(config.metricsRateLimiting.clientMetricsMaxPerMinute);
    rateLimits
        .labels({
            endpoint: '/api/client/register',
            method: 'POST',
        })
        .set(config.metricsRateLimiting.clientRegisterMaxPerMinute);
    rateLimits
        .labels({
            endpoint: '/api/frontend/metrics',
            method: 'POST',
        })
        .set(config.metricsRateLimiting.frontendMetricsMaxPerMinute);
    rateLimits
        .labels({
            endpoint: '/api/frontend/register',
            method: 'POST',
        })
        .set(config.metricsRateLimiting.frontendRegisterMaxPerMinute);
    rateLimits
        .labels({
            endpoint: '/api/admin/user-admin',
            method: 'POST',
        })
        .set(config.rateLimiting.createUserMaxPerMinute);
    rateLimits
        .labels({
            endpoint: '/auth/simple',
            method: 'POST',
        })
        .set(config.rateLimiting.simpleLoginMaxPerMinute);
    rateLimits
        .labels({
            endpoint: '/auth/reset/password-email',
            method: 'POST',
        })
        .set(config.rateLimiting.passwordResetMaxPerMinute);
    rateLimits
        .labels({
            endpoint: '/api/signal-endpoint/:name',
            method: 'POST',
        })
        .set(config.rateLimiting.callSignalEndpointMaxPerSecond * 60);

    const namePrefixUsed = createCounter({
        name: 'nameprefix_count',
        help: 'Count of nameprefix usage in client api',
    });

    const tagsUsed = createCounter({
        name: 'tags_count',
        help: 'Count of tags usage in client api',
    });

    const namePrefixDistinct = createGauge({
        name: 'nameprefix_distinct_estimate',
        help: 'Approximate number of distinct nameprefix values in client api',
    });
    const tagsDistinct = createGauge({
        name: 'tags_distinct_estimate',
        help: 'Approximate number of distinct tag values in client api',
    });
    const projectDistinct = createGauge({
        name: 'project_distinct_estimate',
        help: 'Approximate number of distinct project values in client api',
    });
    const namePrefixHll = HyperLogLog(DISTINCT_HLL_REGISTERS_EXPONENT);
    const tagsHll = HyperLogLog(DISTINCT_HLL_REGISTERS_EXPONENT);
    const projectHll = HyperLogLog(DISTINCT_HLL_REGISTERS_EXPONENT);
    namePrefixDistinct.set(0);
    tagsDistinct.set(0);
    projectDistinct.set(0);

    const featureCreatedByMigration = createCounter({
        name: 'feature_created_by_migration_count',
        help: 'Feature createdBy migration count',
    });
    const eventCreatedByMigration = createCounter({
        name: 'event_created_by_migration_count',
        help: 'Event createdBy migration count',
    });
    const proxyRepositoriesCreated = createCounter({
        name: 'proxy_repositories_created',
        help: 'Proxy repositories created',
    });
    const frontendApiRepositoriesCreated = createCounter({
        name: 'frontend_api_repositories_created',
        help: 'Frontend API repositories created',
    });
    const mapFeaturesForClientDuration = createHistogram({
        name: 'map_features_for_client_duration',
        help: 'Duration of mapFeaturesForClient function',
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'feature_lifecycle_stage_duration',
        labelNames: ['stage', 'project_id'],
        help: 'Duration of feature lifecycle stages',
        query: () => { throw new Error("STUB"); },
        map: (result) =>
            { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'onboarding_duration',
        labelNames: ['event'],
        help: 'firstLogin, secondLogin, firstFeatureFlag, firstPreLive, firstLive from first user creation',
        query: () => { throw new Error("STUB"); },
        map: (result) =>
            { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'project_onboarding_duration',
        labelNames: ['event', 'project'],
        help: 'firstFeatureFlag, firstPreLive, firstLive from project creation',
        query: () => { throw new Error("STUB"); },
        map: (projectsOnboardingMetrics) =>
            { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'feature_lifecycle_stage_count_by_project',
        help: 'Count features in a given stage by project id',
        labelNames: ['stage', 'project_id'],
        query: () => { throw new Error("STUB"); },
        map: (result) =>
            { throw new Error("STUB"); },
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'feature_link_by_domain',
        help: 'Count most popular domains used in feature links',
        labelNames: ['domain'],
        query: () => {
            throw new Error("STUB");
        },
        map: (result) =>
            { throw new Error("STUB"); },
    });

    const featureLifecycleStageEnteredCounter = createCounter({
        name: 'feature_lifecycle_stage_entered',
        help: 'Count how many features entered a given stage',
        labelNames: ['stage'],
    });

    const projectActionsCounter = createCounter({
        name: 'project_actions_count',
        help: 'Count project actions',
        labelNames: ['action'],
    });

    const projectEnvironmentsDisabled = createCounter({
        name: 'project_environments_disabled',
        help: 'How many "environment disabled" events we have received for each project',
        labelNames: ['project_id'],
    });

    const orphanedTokensTotal = createGauge({
        name: 'orphaned_api_tokens_total',
        help: 'Number of API tokens without a project',
    });

    const orphanedTokensActive = createGauge({
        name: 'orphaned_api_tokens_active',
        help: 'Number of API tokens without a project, last seen within 3 months',
    });

    const legacyTokensTotal = createGauge({
        name: 'legacy_api_tokens_total',
        help: 'Number of API tokens with v1 format',
    });

    const legacyTokensActive = createGauge({
        name: 'legacy_api_tokens_active',
        help: 'Number of API tokens with v1 format, last seen within 3 months',
    });

    const exceedsLimitErrorCounter = createCounter({
        name: 'exceeds_limit_error',
        help: 'The number of exceeds limit errors registered by this instance.',
        labelNames: ['resource', 'limit'],
    });

    const requestOriginCounter = createCounter({
        name: 'request_origin_counter',
        help: 'Number of authenticated requests, including origin information.',
        labelNames: ['type', 'method', 'source'],
    });

    const resourceLimit = createGauge({
        name: 'resource_limit',
        help: 'The maximum number of resources allowed.',
        labelNames: ['resource'],
    });
    for (const [resource, limit] of Object.entries(config.resourceLimits)) {
        resourceLimit.labels({ resource }).set(limit);
    }

    const licensedUsers = createGauge({
        name: 'licensed_users',
        help: 'The number of seats used.',
    });

    const addonEventsHandledCounter = createCounter({
        name: 'addon_events_handled',
        help: 'Events handled by addons and the result.',
        labelNames: ['result', 'destination'],
    });

    const unknownFlagsGauge = createGauge({
        name: 'unknown_flags',
        help: 'Number of unknown flag reports (name + app + env) in the last 24 hours, if any.',
    });

    const unknownFlagsUniqueNamesGauge = createGauge({
        name: 'unknown_flags_unique_names',
        help: 'Number of unique unknown flag names reported in the last 24 hours, if any.',
    });

    dbMetrics.registerGaugeDbMetric({
        name: 'read_only_users',
        help: 'Number of read-only users (viewers with no permissions or write events).',
        query: () => { throw new Error("STUB"); },
        map: (result) => { throw new Error("STUB"); },
    });

    // register event listeners
    eventBus.on(
        events.EXCEEDS_LIMIT,
        ({ resource, limit }: { resource: string; limit: number }) => {
            throw new Error("STUB");
        },
    );

    eventBus.on(
        events.STAGE_ENTERED,
        (entered: { stage: string; feature: string }) => {
            throw new Error("STUB");
        },
    );

    eventBus.on(
        events.REQUEST_TIME,
        ({ path, method, time, statusCode, appName }) => {
            throw new Error("STUB");
        },
    );

    eventBus.on(events.SCHEDULER_JOB_TIME, ({ jobId, time }) => {
        throw new Error("STUB");
    });

    eventBus.on(events.FUNCTION_TIME, ({ functionName, className, time }) => {
        throw new Error("STUB");
    });

    eventBus.on(events.EVENTS_CREATED_BY_PROCESSED, ({ updated }) => {
        throw new Error("STUB");
    });

    eventBus.on(events.FEATURES_CREATED_BY_PROCESSED, ({ updated }) => {
        throw new Error("STUB");
    });

    eventBus.on(events.DB_TIME, ({ store, action, time }) => {
        throw new Error("STUB");
    });

    eventBus.on(events.PROXY_REPOSITORY_CREATED, () => {
        throw new Error("STUB");
    });

    eventBus.on(events.FRONTEND_API_REPOSITORY_CREATED, () => {
        throw new Error("STUB");
    });

    eventBus.on(events.PROXY_FEATURES_FOR_TOKEN_TIME, ({ duration }) => {
        throw new Error("STUB");
    });

    eventBus.on(
        events.CLIENT_METRICS_NAMEPREFIX,
        (payload?: { namePrefix?: string }) => {
            throw new Error("STUB");
        },
    );

    eventBus.on(events.CLIENT_METRICS_TAGS, (payload?: { tags?: string[] }) => {
        throw new Error("STUB");
    });

    eventBus.on(
        events.CLIENT_METRICS_PROJECT,
        (payload?: { projects?: string[] }) => {
            throw new Error("STUB");
        },
    );

    eventBus.on(
        events.CLIENT_REGISTERED,
        ({ appName, environment, interval }) => {
            throw new Error("STUB");
        },
    );

    events.onMetricEvent(
        eventBus,
        events.REQUEST_ORIGIN,
        ({ type, method, source }) => {
            throw new Error("STUB");
        },
    );

    eventStore.on(FEATURE_CREATED, ({ featureName, project }) => {
        throw new Error("STUB");
    });
    eventStore.on(FEATURE_VARIANTS_UPDATED, ({ featureName, project }) => {
        throw new Error("STUB");
    });
    eventStore.on(FEATURE_METADATA_UPDATED, ({ featureName, project }) => {
        throw new Error("STUB");
    });
    eventStore.on(FEATURE_UPDATED, ({ featureName, project }) => {
        throw new Error("STUB");
    });
    eventStore.on(
        FEATURE_STRATEGY_ADD,
        async ({ featureName, project, environment }) => {
            throw new Error("STUB");
        },
    );
    eventStore.on(
        FEATURE_STRATEGY_REMOVE,
        async ({ featureName, project, environment }) => {
            throw new Error("STUB");
        },
    );
    eventStore.on(
        FEATURE_STRATEGY_UPDATE,
        async ({ featureName, project, environment }) => {
            throw new Error("STUB");
        },
    );
    eventStore.on(
        FEATURE_ENVIRONMENT_DISABLED,
        async ({ featureName, project, environment }) => {
            throw new Error("STUB");
        },
    );
    eventStore.on(
        FEATURE_ENVIRONMENT_ENABLED,
        async ({ featureName, project, environment }) => {
            throw new Error("STUB");
        },
    );
    eventStore.on(FEATURE_ARCHIVED, ({ featureName, project }) => {
        throw new Error("STUB");
    });
    eventStore.on(FEATURE_REVIVED, ({ featureName, project }) => {
        throw new Error("STUB");
    });

    eventStore.on(
        RELEASE_PLAN_ADDED,
        async ({ featureName, project, environment }) => {
            throw new Error("STUB");
        },
    );

    eventStore.on(
        RELEASE_PLAN_REMOVED,
        async ({ featureName, project, environment }) => {
            throw new Error("STUB");
        },
    );

    eventStore.on(
        RELEASE_PLAN_MILESTONE_STARTED,
        async ({ featureName, project, environment }) => {
            throw new Error("STUB");
        },
    );

    eventStore.on(PROJECT_CREATED, () => {
        throw new Error("STUB");
    });
    eventStore.on(PROJECT_ARCHIVED, () => {
        throw new Error("STUB");
    });
    eventStore.on(PROJECT_REVIVED, () => {
        throw new Error("STUB");
    });
    eventStore.on(PROJECT_DELETED, () => {
        throw new Error("STUB");
    });

    const logger = config.getLogger('metrics.ts');
    eventBus.on(CLIENT_METRICS, (metrics: IClientMetricsEnv[]) => {
        throw new Error("STUB");
    });

    eventStore.on(CLIENT_REGISTER, (heartbeatEvent: ISdkHeartbeat) => {
        throw new Error("STUB");
    });

    eventStore.on(PROJECT_ENVIRONMENT_REMOVED, ({ project }) => {
        throw new Error("STUB");
    });

    eventBus.on(events.ADDON_EVENTS_HANDLED, ({ result, destination }) => {
        throw new Error("STUB");
    });

    setupIntegrationMetrics({ config, stores, eventBus, dbMetrics });

    return {
        collectAggDbMetrics: dbMetrics.refreshMetrics,
        collectStaticCounters: async () => {
            throw new Error("STUB");
        },
    };
}
export default class MetricsMonitor {
    constructor() {}

    async startMonitoring(
        config: IUnleashConfig,
        stores: IUnleashStores,
        version: string,
        eventBus: EventEmitter,
        instanceStatsService: InstanceStatsService,
        schedulerService: SchedulerService,
        db: Knex,
    ): Promise<void> {
        if (!config.server.serverMetrics) {
            return Promise.resolve();
        }

        collectDefaultMetrics();

        const { collectStaticCounters, collectAggDbMetrics } =
            registerPrometheusMetrics(
                config,
                stores,
                version,
                eventBus,
                instanceStatsService,
            );

        const postgresVersion = await stores.settingStore.postgresVersion();
        registerPrometheusPostgresMetrics(db, eventBus, postgresVersion);

        await schedulerService.schedule(
            async () =>
                { throw new Error("STUB"); },
            hoursToMilliseconds(1),
            'collectStaticCounters',
        );
        await schedulerService.schedule(
            async () =>
                { throw new Error("STUB"); },
            minutesToMilliseconds(1),
            'registerPoolMetrics',
        );

        return Promise.resolve();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    registerPoolMetrics(pool: any, eventBus: EventEmitter) {
        throw new Error("STUB");
    }
}

export function createMetricsMonitor(): MetricsMonitor {
    return new MetricsMonitor();
}
