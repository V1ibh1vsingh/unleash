import type {
    IEventStore,
    IFeatureToggleDeltaQuery,
    IFeatureToggleQuery,
    IFlagResolver,
    ISegmentReadModel,
    IUnleashConfig,
} from '../../../types/index.js';
import type ConfigurationRevisionService from '../../feature-toggle/configuration-revision-service.js';
import { UPDATE_REVISION } from '../../feature-toggle/configuration-revision-service.js';
import { DeltaCache } from './delta-cache.js';
import type {
    FeatureConfigurationDeltaClient,
    IClientFeatureToggleDeltaReadModel,
} from './client-feature-toggle-delta-read-model-type.js';
import EventEmitter from 'events';
import type { Logger } from '../../../logger.js';
import type { ClientFeaturesDeltaSchema } from '../../../openapi/index.js';
import {
    DELTA_EVENT_TYPES,
    type DeltaEvent,
    type DeltaHydrationEvent,
    isDeltaFeatureRemovedEvent,
    isDeltaFeatureUpdatedEvent,
    isDeltaSegmentUpdatedEvent,
} from './client-feature-toggle-delta-types.js';
import {
    FEATURE_ARCHIVED,
    FEATURE_DELETED,
    FEATURE_PROJECT_CHANGE,
    SEGMENT_CREATED,
    SEGMENT_DELETED,
    SEGMENT_UPDATED,
    type IEvent,
} from '../../../events/index.js';
import {
    getReferencedSegmentIds,
    getVisibleRevision,
} from './visible-revision.js';
import { createGauge } from '../../../util/metrics/index.js';
import { BadDataError } from '../../../server-impl.js';

export type EnvironmentRevisions = Record<string, DeltaCache>;
export type EnvironmentVisibleRevisionState = {
    projectRevisions: Map<string, number>;
    segmentRevisions: Map<number, number>;
    maxReferencedSegmentRevision: number;
};

export const UPDATE_DELTA = 'UPDATE_DELTA';

export const filterEventsByQuery = (
    events: DeltaEvent[],
    requestedRevisionId: number,
    projects: string[],
    namePrefix: string,
    referencedSegmentIds: Set<number>,
) => {
    throw new Error("STUB");
};

export const filterHydrationEventByQuery = (
    event: DeltaHydrationEvent,
    projects: string[],
    namePrefix: string,
): DeltaHydrationEvent => {
    throw new Error("STUB");
};

const sortEventsByRevision = (events: DeltaEvent[]): DeltaEvent[] => {
    throw new Error("STUB");
};

const materializeReferencedSegments = (
    events: DeltaEvent[],
    hydrationEvent: DeltaHydrationEvent,
): DeltaEvent[] => {
    throw new Error("STUB");
};

const deltaRevisionIdMetric = createGauge({
    name: 'delta_environment_revision_id',
    help: 'Current delta revision id for environment',
    labelNames: ['environment'],
});

const setMaxRevision = <K>(map: Map<K, number>, key: K, revisionId: number) => {
    throw new Error("STUB");
};

export class ClientFeatureToggleDelta extends EventEmitter {
    private static instance: ClientFeatureToggleDelta;

    private clientFeatureToggleDeltaReadModel: IClientFeatureToggleDeltaReadModel;

    private delta: EnvironmentRevisions = {};

    private visibleRevisions: Record<string, EnvironmentVisibleRevisionState> =
        {};

    private eventStore: IEventStore;

    private lastDeltaProcessedRevisionId: number = 0;

    private flagResolver: IFlagResolver;

    private readonly segmentReadModel: ISegmentReadModel;

    private readonly logger: Logger;

    constructor(
        clientFeatureToggleDeltaReadModel: IClientFeatureToggleDeltaReadModel,
        segmentReadModel: ISegmentReadModel,
        eventStore: IEventStore,
        configurationRevisionService: ConfigurationRevisionService,
        flagResolver: IFlagResolver,
        config: IUnleashConfig,
    ) {
        throw new Error("STUB");
    }

    static getInstance(
        clientFeatureToggleDeltaReadModel: IClientFeatureToggleDeltaReadModel,
        segmentReadModel: ISegmentReadModel,
        eventStore: IEventStore,
        configurationRevisionService: ConfigurationRevisionService,
        flagResolver: IFlagResolver,
        config: IUnleashConfig,
    ) {
        if (!ClientFeatureToggleDelta.instance) {
            ClientFeatureToggleDelta.instance = new ClientFeatureToggleDelta(
                clientFeatureToggleDeltaReadModel,
                segmentReadModel,
                eventStore,
                configurationRevisionService,
                flagResolver,
                config,
            );
        }
        return ClientFeatureToggleDelta.instance;
    }

    async getDelta(
        sdkRevisionId: number | undefined,
        query: IFeatureToggleQuery,
    ): Promise<ClientFeaturesDeltaSchema | undefined> {
        throw new Error("STUB");
    }

    public async onUpdateRevisionEvent() {
        throw new Error("STUB");
    }

    /**
     * This is used in client-feature-delta-api.e2e.test.ts, do not remove
     */
    public resetDelta() {
        throw new Error("STUB");
    }

    private processChangeEvents(changeEvents: IEvent[]) {
        throw new Error("STUB");
    }

    // executes on every change, with max lag of 1 second
    private async updateFeaturesDelta() {
        throw new Error("STUB");
    }

    async getChangedToggles(
        environment: string,
        toggles: string[],
    ): Promise<FeatureConfigurationDeltaClient[]> {
        throw new Error("STUB");
    }

    private async initEnvironmentDelta(environment: string) {
        throw new Error("STUB");
    }

    private updateVisibleRevisions(
        environment: string,
        featureEvents: DeltaEvent[],
        segmentEvents: DeltaEvent[],
    ) {
        throw new Error("STUB");
    }

    async getClientFeatures(
        query: IFeatureToggleDeltaQuery,
    ): Promise<FeatureConfigurationDeltaClient[]> {
        const result =
            await this.clientFeatureToggleDeltaReadModel.getAll(query);
        return result;
    }
}

export type { DeltaEvent };
