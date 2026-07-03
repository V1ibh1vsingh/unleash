import {
    type IAuditUser,
    type IUnleashConfig,
    type IUnleashStores,
    PatCreatedEvent,
    PatDeletedEvent,
} from '../../types/index.js';
import type { Logger } from '../../logger.js';
import type { IPatStore } from './pat-store-type.js';
import crypto from 'crypto';
import BadDataError from '../../error/bad-data-error.js';
import NameExistsError from '../../error/name-exists-error.js';
import { OperationDeniedError } from '../../error/operation-denied-error.js';
import { PAT_LIMIT } from '../../util/constants.js';
import type EventService from '../events/event-service.js';
import type { CreatePatSchema, PatSchema } from '../../openapi/index.js';

export default class PatService {
    private config: IUnleashConfig;

    private logger: Logger;

    private patStore: IPatStore;

    private eventService: EventService;

    constructor(
        { patStore }: Pick<IUnleashStores, 'patStore'>,
        config: IUnleashConfig,
        eventService: EventService,
    ) {
        this.config = config;
        this.logger = config.getLogger('services/pat-service.ts');
        this.patStore = patStore;
        this.eventService = eventService;
    }

    async createPat(
        pat: CreatePatSchema,
        forUserId: number,
        auditUser: IAuditUser,
    ): Promise<PatSchema> {
        throw new Error("STUB");
    }

    async getAll(userId: number): Promise<PatSchema[]> {
        return this.patStore.getAllByUser(userId);
    }

    async deletePat(
        id: number,
        forUserId: number,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validatePat(
        { description, expiresAt }: CreatePatSchema,
        userId: number,
    ): Promise<void> {
        throw new Error("STUB");
    }

    private generateSecretKey() {
        throw new Error("STUB");
    }
}
