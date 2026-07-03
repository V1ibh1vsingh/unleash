import type { IUnleashStores } from '../types/stores.js';
import type { IUnleashConfig } from '../types/option.js';
import type { Logger } from '../logger.js';
import type {
    IFeatureType,
    IFeatureTypeStore,
} from '../types/stores/feature-type-store.js';
import NotFoundError from '../error/notfound-error.js';
import type EventService from '../features/events/event-service.js';
import { FeatureTypeUpdatedEvent, type IAuditUser } from '../types/index.js';

export default class FeatureTypeService {
    private featureTypeStore: IFeatureTypeStore;

    private eventService: EventService;

    private logger: Logger;

    constructor(
        { featureTypeStore }: Pick<IUnleashStores, 'featureTypeStore'>,
        { getLogger }: Pick<IUnleashConfig, 'getLogger'>,
        eventService: EventService,
    ) {
        this.featureTypeStore = featureTypeStore;
        this.logger = getLogger('services/feature-type-service.ts');
        this.eventService = eventService;
    }

    async getAll(): Promise<IFeatureType[]> {
        return this.featureTypeStore.getAll();
    }

    async updateLifetime(
        id: string,
        newLifetimeDays: number | null,
        auditUser: IAuditUser,
    ): Promise<IFeatureType> {
        throw new Error("STUB");
    }
}
