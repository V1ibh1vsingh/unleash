import type {
    IContextField,
    IContextFieldDto,
    IContextFieldStore,
} from './context-field-store-type.js';
import type {
    IFeatureStrategiesStore,
    IUnleashStores,
} from '../../types/stores.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { ContextFieldStrategiesSchema } from '../../openapi/spec/context-field-strategies-schema.js';
import type { IAuditUser, IFeatureStrategy } from '../../types/index.js';
import type { IPrivateProjectChecker } from '../private-project/privateProjectCheckerType.js';
import type EventService from '../events/event-service.js';
import {
    contextSchema,
    legalValueSchema,
} from '../../services/context-schema.js';
import { NameExistsError, NotFoundError } from '../../error/index.js';
import { nameSchema } from '../../schema/feature-schema.js';
import type { LegalValueSchema } from '../../openapi/index.js';
import {
    CONTEXT_FIELD_CREATED,
    CONTEXT_FIELD_UPDATED,
    CONTEXT_FIELD_DELETED,
} from '../../events/index.js';
import ConflictError from '../../error/conflict-error.js';

class ContextService {
    private eventService: EventService;

    private contextFieldStore: IContextFieldStore;

    private featureStrategiesStore: IFeatureStrategiesStore;

    private privateProjectChecker: IPrivateProjectChecker;

    constructor(
        {
            contextFieldStore,
            featureStrategiesStore,
        }: Pick<IUnleashStores, 'contextFieldStore' | 'featureStrategiesStore'>,
        _config: Pick<IUnleashConfig, 'getLogger' | 'flagResolver'>,
        eventService: EventService,
        privateProjectChecker: IPrivateProjectChecker,
    ) {
        this.privateProjectChecker = privateProjectChecker;
        this.eventService = eventService;
        this.contextFieldStore = contextFieldStore;
        this.featureStrategiesStore = featureStrategiesStore;
    }

    async getAll(): Promise<IContextField[]> {
        return this.contextFieldStore.getAll();
    }

    async getAllWithoutProject(): Promise<IContextField[]> {
        throw new Error("STUB");
    }

    async getAllForProject(projectId: string): Promise<IContextField[]> {
        throw new Error("STUB");
    }

    async getAssignableFieldsForProject(
        projectId: string,
    ): Promise<IContextField[]> {
        throw new Error("STUB");
    }

    async getContextFields({
        include,
        projectId,
        userId,
    }: {
        include?: string;
        projectId?: string;
        userId: number;
    }): Promise<IContextField[]> {
        throw new Error("STUB");
    }

    async getContextField(name: string): Promise<IContextField> {
        throw new Error("STUB");
    }

    async getStrategiesByContextField(
        name: string,
        userId: number,
    ): Promise<ContextFieldStrategiesSchema> {
        throw new Error("STUB");
    }

    private mapStrategies(strategies: IFeatureStrategy[]) {
        throw new Error("STUB");
    }

    async createContextField(
        value: IContextFieldDto,
        auditUser: IAuditUser,
    ): Promise<IContextField> {
        // validations
        await this.validateUniqueName(value);
        const contextField = await contextSchema.validateAsync(value);

        // creations
        const createdField = await this.contextFieldStore.create(value);
        await this.eventService.storeEvent({
            type: CONTEXT_FIELD_CREATED,
            createdBy: auditUser.username,
            createdByUserId: auditUser.id,
            ip: auditUser.ip,
            data: contextField,
        });

        return createdField;
    }

    async updateContextField(
        updatedContextField: IContextFieldDto,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateLegalValue(
        contextFieldLegalValue: { name: string; legalValue: LegalValueSchema },
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteLegalValue(
        contextFieldLegalValue: { name: string; legalValue: string },
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteContextField(
        name: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validateUniqueName({
        name,
    }: Pick<IContextFieldDto, 'name'>): Promise<void> {
        let msg: string | undefined;
        try {
            await this.contextFieldStore.get(name);
            msg = 'A context field with that name already exist';
        } catch (_error) {
            // No conflict, everything ok!
            return;
        }

        // Intentional throw here!
        throw new NameExistsError(msg);
    }

    async validateName(name: string): Promise<void> {
        await nameSchema.validateAsync({ name });
        await this.validateUniqueName({ name });
    }
}
export default ContextService;
