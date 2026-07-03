import { CRUDStore, type CrudStoreConfig } from '../../db/crud/crud-store.js';
import type { Row } from '../../db/crud/row-type.js';
import type { Db } from '../../db/db.js';
import type { IntegrationEventSchema } from '../../openapi/spec/integration-event-schema.js';

export type IntegrationEventWriteModel = Omit<
    IntegrationEventSchema,
    'id' | 'createdAt'
>;

export type IntegrationEventState = IntegrationEventWriteModel['state'];

export class IntegrationEventsStore extends CRUDStore<
    IntegrationEventSchema,
    IntegrationEventWriteModel,
    Row<IntegrationEventSchema>,
    Row<IntegrationEventWriteModel>,
    string
> {
    constructor(db: Db, config: CrudStoreConfig) {
        super('integration_events', db, config);
    }

    async getPaginatedEvents(
        id: number,
        limit: number,
        offset: number,
    ): Promise<IntegrationEventSchema[]> {
        throw new Error("STUB");
    }

    async cleanUpEvents(): Promise<void> {
        throw new Error("STUB");
    }
}
