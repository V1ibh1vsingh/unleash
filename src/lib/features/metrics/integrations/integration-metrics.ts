import type EventEmitter from 'events';
import type { Logger } from '../../../logger.js';
import type { IUnleashConfig } from '../../../types/option.js';
import type { IUnleashStores } from '../../../types/stores.js';
import { getAddons, type IAddonProviders } from '../../../addons/index.js';
import {
    AUTH_PROVIDERS_CATALOG,
    type AuthProviderConfig,
} from '../../../types/settings/auth-settings.js';
import { AUTH_LOGIN_COMPLETED } from '../../../metric-events.js';
import { createCounter } from '../../../util/metrics/index.js';
import type { DbMetricsMonitor } from '../../../metrics-gauge.js';

interface IntegrationMetricsSetupOpts {
    config: Pick<
        IUnleashConfig,
        | 'getLogger'
        | 'server'
        | 'flagResolver'
        | 'allowPrivateUrlInIntegration'
        | 'allowListIntegration'
    >;
    stores: Pick<IUnleashStores, 'addonStore' | 'settingStore'>;
    eventBus: EventEmitter;
    dbMetrics: DbMetricsMonitor;
}

interface IntegrationMetricsDeps extends IntegrationMetricsSetupOpts {
    addonProviders: IAddonProviders;
}

interface AvailableIntegration {
    name: string;
    deprecated: string;
    removal_target: string;
}

interface ConfiguredIntegration {
    name: string;
    state: 'enabled' | 'disabled' | 'not_configured';
    count: number;
}

export function setupIntegrationMetrics(
    opts: IntegrationMetricsSetupOpts,
): void {
    const addonProviders = getAddons({
        getLogger: opts.config.getLogger,
        unleashUrl: opts.config.server.unleashUrl,
        flagResolver: opts.config.flagResolver,
        eventBus: opts.eventBus,
        allowPrivateUrls: opts.config.allowPrivateUrlInIntegration,
        allowList: opts.config.allowListIntegration,
    } as Parameters<typeof getAddons>[0]);

    registerIntegrationMetrics({ ...opts, addonProviders });
}

export function registerIntegrationMetrics({
    config,
    stores,
    eventBus,
    dbMetrics,
    addonProviders,
}: IntegrationMetricsDeps): void {
    const logger = config.getLogger('metrics/integrations');

    registerGaugeWithParams({
        dbMetrics,
        name: 'integration_available',
        help: 'Available integrations with this Unleash server. removal_target set if deprecated.',
        labelNames: ['name', 'deprecated', 'removal_target'] as const,
        query: async () => { throw new Error("STUB"); },
        mapMetric: (s: AvailableIntegration) => { throw new Error("STUB"); },
    });

    registerGaugeWithParams({
        dbMetrics,
        name: 'integration_configured',
        help: 'Configured integrations on this Unleash server, per state.',
        labelNames: ['name', 'state'] as const,
        query: () => { throw new Error("STUB"); },
        mapMetric: (s: ConfiguredIntegration) => { throw new Error("STUB"); },
    });

    registerAuthLoginTotalCounter(eventBus);
}

function registerGaugeWithParams<T extends { name: string }>({
    dbMetrics,
    name,
    help,
    labelNames,
    query,
    mapMetric,
}: {
    dbMetrics: DbMetricsMonitor;
    name: string;
    help: string;
    labelNames: readonly string[];
    query: () => Promise<T[]>;
    mapMetric: (m: T) => { value: number; labels: Record<string, string> };
}): void {
    dbMetrics.registerGaugeDbMetric({
        name,
        help,
        labelNames: labelNames as string[],
        query,
        map: (metrics) => { throw new Error("STUB"); },
    });
}

function registerAuthLoginTotalCounter(eventBus: EventEmitter): void {
    const authLoginTotal = createCounter({
        name: 'auth_login_total',
        help: 'Authentication attempts by provider per outcome.',
        labelNames: ['provider', 'outcome'] as const,
    });

    eventBus.on(
        AUTH_LOGIN_COMPLETED,
        (payload: { provider: string; outcome: 'success' | 'failure' }) => {
            throw new Error("STUB");
        },
    );
}

function collectAvailableIntegrations(
    addonProviders: IAddonProviders,
): AvailableIntegration[] {
    const addons = Object.values(addonProviders).map(
        ({ definition: { name, deprecated } }) => { throw new Error("STUB"); },
    );

    const authProviders = Object.values(AUTH_PROVIDERS_CATALOG).map(
        ({ name, deprecatedRemovalTarget }) => { throw new Error("STUB"); },
    );

    return [...addons, ...authProviders];
}

export async function collectConfiguredIntegrations(
    stores: Pick<IUnleashStores, 'addonStore' | 'settingStore'>,
    logger?: Logger,
): Promise<ConfiguredIntegration[]> {
    const addons = await stores.addonStore.getAll();

    const addonBuckets: Array<{
        name: string;
        state: 'enabled' | 'disabled';
        count: number;
    }> = [];
    addons.forEach((addon) => {
        throw new Error("STUB");
    });

    const authBuckets = (
        await Promise.all(
            Object.values(AUTH_PROVIDERS_CATALOG).map(async (provider) => {
                throw new Error("STUB");
            }),
        )
    ).filter((r) => { throw new Error("STUB"); });

    return [...addonBuckets, ...authBuckets];
}

/**
 * The providers in Unleash have two interpretations:
 *   - `default === 'enabled'` (e.g. `simple`)
 *     row stores `{disabled: boolean}`. If no config row, means addon enabled
 *     the row only exists once user turns it off (disabled: true).
 *   - `default === 'disabled'` (e.g. oidc, saml, google) —
 *     row stores `{enabled: boolean}`. If no config row, means not_configured
 *     so that dashboards show "nobody ever set this up".
 */
function resolveAuthState(
    provider: AuthProviderConfig,
    row: { enabled?: boolean; disabled?: boolean } | undefined,
): ConfiguredIntegration['state'] {
    if (provider.default === 'enabled') {
        // e.g. in 'simple' auth, default is enabled, with no config
        // otherwise stored field is `disabled`;
        if (row === undefined) return 'enabled';
        return row.disabled ? 'disabled' : 'enabled';
    }

    // Standard convention, no row means not_configured.
    if (row === undefined) return 'not_configured';
    return row.enabled ? 'enabled' : 'disabled';
}
