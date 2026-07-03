import type EventEmitter from 'events';
import { APPLICATION_CREATED, CLIENT_REGISTER } from '../../../events/index.js';
import type { IApplication, IApplicationOverview } from './models.js';
import type { IUnleashStores } from '../../../types/stores.js';
import type { IUnleashConfig } from '../../../types/option.js';
import type { IEventStore } from '../../../types/stores/event-store.js';
import type {
    IClientApplication,
    IClientApplications,
    IClientApplicationsSearchParams,
    IClientApplicationsStore,
} from '../../../types/stores/client-applications-store.js';
import type { IFeatureToggleStore } from '../../feature-toggle/types/feature-toggle-store-type.js';
import type { IStrategyStore } from '../../../types/stores/strategy-store.js';
import type { IClientInstanceStore } from '../../../types/stores/client-instance-store.js';
import type {
    IClientApp,
    IFrontendClientApp,
    ISdkHeartbeat,
} from '../../../types/model.js';
import { clientRegisterSchema } from '../shared/schema.js';

import type { IClientMetricsStoreV2 } from '../client-metrics/client-metrics-store-v2-type.js';
import type { IPrivateProjectChecker } from '../../private-project/privateProjectCheckerType.js';
import {
    type ApplicationCreatedEvent,
    type IFlagResolver,
    SYSTEM_USER,
} from '../../../types/index.js';
import { ALL_PROJECTS, parseStrictSemVer } from '../../../util/index.js';
import type { Logger } from '../../../logger.js';
import { findOutdatedSDKs, isOutdatedSdk } from './findOutdatedSdks.js';
import type { OutdatedSdksSchema } from '../../../openapi/spec/outdated-sdks-schema.js';
import { CLIENT_REGISTERED } from '../../../metric-events.js';
import { NotFoundError } from '../../../error/index.js';
import type { ClientMetricsSchema, PartialSome } from '../../../server-impl.js';

export default class ClientInstanceService {
    apps = {};

    logger: Logger;

    seenClients: Record<string, IClientApp> = {};

    private clientMetricsStoreV2: IClientMetricsStoreV2;

    private strategyStore: IStrategyStore;

    private featureToggleStore: IFeatureToggleStore;

    private clientApplicationsStore: IClientApplicationsStore;

    private clientInstanceStore: IClientInstanceStore;

    private eventStore: IEventStore;

    private privateProjectChecker: IPrivateProjectChecker;

    private flagResolver: IFlagResolver;

    private eventBus: EventEmitter;

    constructor(
        {
            clientMetricsStoreV2,
            strategyStore,
            featureToggleStore,
            clientInstanceStore,
            clientApplicationsStore,
            eventStore,
        }: Pick<
            IUnleashStores,
            | 'clientMetricsStoreV2'
            | 'strategyStore'
            | 'featureToggleStore'
            | 'clientApplicationsStore'
            | 'clientInstanceStore'
            | 'eventStore'
        >,
        {
            getLogger,
            flagResolver,
            eventBus,
        }: Pick<IUnleashConfig, 'getLogger' | 'flagResolver' | 'eventBus'>,
        privateProjectChecker: IPrivateProjectChecker,
    ) {
        this.clientMetricsStoreV2 = clientMetricsStoreV2;
        this.strategyStore = strategyStore;
        this.featureToggleStore = featureToggleStore;
        this.clientApplicationsStore = clientApplicationsStore;
        this.clientInstanceStore = clientInstanceStore;
        this.eventStore = eventStore;
        this.eventBus = eventBus;
        this.privateProjectChecker = privateProjectChecker;
        this.flagResolver = flagResolver;
        this.logger = getLogger(
            '/services/client-metrics/client-instance-service.ts',
        );
    }

    private updateSeenClient = (data: IClientApp) => {
        throw new Error("STUB");
    };

    public async registerInstance(
        data: Pick<ClientMetricsSchema, 'appName' | 'instanceId'>,
        clientIp: string,
        environment: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    public registerFrontendClient(data: IFrontendClientApp): void {
        throw new Error("STUB");
    }

    public async registerBackendClient(
        data: PartialSome<IClientApp, 'instanceId'>,
        clientIp: string,
        environment: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async announceUnannounced(): Promise<void> {
        throw new Error("STUB");
    }

    clientKey(client: IClientApp): string {
        throw new Error("STUB");
    }

    async bulkAdd(): Promise<void> {
        if (
            this &&
            this.seenClients &&
            this.clientApplicationsStore &&
            this.clientInstanceStore
        ) {
            const uniqueRegistrations = Object.values(this.seenClients);
            const uniqueApps: Partial<IClientApplication>[] = Object.values(
                uniqueRegistrations.reduce((soFar, reg) => {
                    throw new Error("STUB");
                }, {}),
            );
            this.seenClients = {};
            try {
                if (uniqueRegistrations.length > 0) {
                    await this.clientApplicationsStore.bulkUpsert(uniqueApps);
                    await this.clientInstanceStore.bulkUpsert(
                        uniqueRegistrations,
                    );
                }
            } catch (err) {
                this.logger.warn('Failed to register clients', err);
            }
        }
    }

    async getApplications(
        query: IClientApplicationsSearchParams,
        userId: number,
    ): Promise<IClientApplications> {
        throw new Error("STUB");
    }

    async getApplication(appName: string): Promise<IApplication> {
        throw new Error("STUB");
    }

    async getApplicationOverview(
        appName: string,
        userId: number,
    ): Promise<IApplicationOverview> {
        throw new Error("STUB");
    }

    async getRecentApplicationEnvironmentInstances(
        appName: string,
        environment: string,
    ) {
        throw new Error("STUB");
    }

    async deleteApplication(appName: string): Promise<void> {
        throw new Error("STUB");
    }

    async createApplication(input: IApplication): Promise<void> {
        throw new Error("STUB");
    }

    async removeOldInstances(): Promise<void> {
        throw new Error("STUB");
    }

    async removeInactiveApplications(): Promise<number> {
        throw new Error("STUB");
    }

    async getOutdatedSdks(): Promise<OutdatedSdksSchema['sdks']> {
        throw new Error("STUB");
    }

    async getOutdatedSdksByProject(
        projectId: string,
    ): Promise<OutdatedSdksSchema['sdks']> {
        throw new Error("STUB");
    }

    async usesSdkOlderThan(
        sdkName: string,
        sdkVersion: string,
    ): Promise<boolean> {
        throw new Error("STUB");
    }
}
