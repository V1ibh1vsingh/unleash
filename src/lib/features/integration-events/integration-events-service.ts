import type { IUnleashConfig } from '../../types/index.js';
import type {
    IntegrationEventsStore,
    IntegrationEventWriteModel,
} from './integration-events-store.js';
import type { IntegrationEventSchema } from '../../openapi/spec/integration-event-schema.js';

export class IntegrationEventsService {
    private integrationEventsStore: IntegrationEventsStore;

    constructor(
        {
            integrationEventsStore,
        }: { integrationEventsStore: IntegrationEventsStore },
        _config: Pick<IUnleashConfig, 'getLogger' | 'flagResolver'>,
    ) {
        this.integrationEventsStore = integrationEventsStore;
    }

    async getPaginatedEvents(
        id: number,
        limit: number,
        offset: number,
    ): Promise<IntegrationEventSchema[]> {
        throw new Error("STUB");
    }

    async registerEvent(
        integrationEvent: IntegrationEventWriteModel,
    ): Promise<IntegrationEventSchema> {
        throw new Error("STUB");
    }

    async cleanUpEvents(): Promise<void> {
        throw new Error("STUB");
    }
}
