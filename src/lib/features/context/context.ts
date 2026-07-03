import type { Request, Response } from 'express';

import Controller from '../../routes/controller.js';

import {
    CREATE_CONTEXT_FIELD,
    UPDATE_CONTEXT_FIELD,
    DELETE_CONTEXT_FIELD,
    NONE,
    UPDATE_PROJECT_CONTEXT,
} from '../../types/permissions.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type ContextService from './context-service.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';

import type { OpenApiService } from '../../services/openapi-service.js';
import {
    contextFieldSchema,
    type ContextFieldSchema,
} from '../../openapi/spec/context-field-schema.js';
import type { ContextFieldsSchema } from '../../openapi/spec/context-fields-schema.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import {
    createResponseSchema,
    resourceCreatedResponseSchema,
} from '../../openapi/util/create-response-schema.js';
import { serializeDates } from '../../types/serialize-dates.js';
import NotFoundError from '../../error/notfound-error.js';
import type { NameSchema } from '../../openapi/spec/name-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import {
    type ContextFieldStrategiesSchema,
    contextFieldStrategiesSchema,
} from '../../openapi/spec/context-field-strategies-schema.js';
import type { UpdateContextFieldSchema } from '../../openapi/spec/update-context-field-schema.js';
import type { CreateContextFieldSchema } from '../../openapi/spec/create-context-field-schema.js';
import { extractUserIdFromUser } from '../../util/index.js';
import type { LegalValueSchema } from '../../openapi/index.js';
import type { WithTransactional } from '../../db/transaction.js';
import {
    type ContextQueryParameters,
    contextQueryParameters,
} from '../../openapi/spec/context-query-parameters.js';

interface ContextParam {
    contextField: string;
}

interface DeleteLegalValueParam extends ContextParam {
    legalValue: string;
}

const resolveOperationId = (operationId: string, mode: 'global' | 'project') =>
    { throw new Error("STUB"); };

export class ContextController extends Controller {
    private transactionalContextService: WithTransactional<ContextService>;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            transactionalContextService,
            openApiService,
        }: Pick<
            IUnleashServices,
            'transactionalContextService' | 'openApiService'
        >,
        mode: 'global' | 'project' = 'global',
    ) {
        throw new Error("STUB");
    }

    async getContextFields(
        req: IAuthRequest<
            { projectId?: string },
            unknown,
            unknown,
            ContextQueryParameters
        >,
        res: Response<ContextFieldsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getContextField(
        req: Request<ContextParam>,
        res: Response<ContextFieldSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async createContextField(
        req: IAuthRequest<
            { projectId?: string },
            void,
            CreateContextFieldSchema
        >,
        res: Response<ContextFieldSchema>,
    ): Promise<void> {
        const value = req.body;

        const result = await this.transactionalContextService.transactional(
            (service) =>
                { throw new Error("STUB"); },
        );

        this.openApiService.respondWithValidation(
            201,
            res,
            contextFieldSchema.$id,
            serializeDates(result),
            { location: `context/${result.name}` },
        );
    }

    async updateContextField(
        req: IAuthRequest<ContextParam, void, UpdateContextFieldSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateLegalValue(
        req: IAuthRequest<ContextParam, void, LegalValueSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteLegalValue(
        req: IAuthRequest<DeleteLegalValueParam, void>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteContextField(
        req: IAuthRequest<ContextParam>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validateContextFieldName(
        req: Request<void, void, NameSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getStrategiesByContextField(
        req: IAuthRequest<{ contextField: string }>,
        res: Response<ContextFieldStrategiesSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
