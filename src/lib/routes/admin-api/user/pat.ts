import type { Response } from 'express';
import Controller from '../../controller.js';
import type { Logger } from '../../../logger.js';
import type { IFlagResolver, IUnleashConfig } from '../../../types/index.js';
import { createRequestSchema } from '../../../openapi/util/create-request-schema.js';
import {
    createResponseSchema,
    resourceCreatedResponseSchema,
} from '../../../openapi/util/create-response-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../../openapi/util/standard-responses.js';
import type { OpenApiService } from '../../../services/openapi-service.js';

import type PatService from '../../../features/pat/pat-service.js';
import { NONE } from '../../../types/permissions.js';
import type { IAuthRequest } from '../../unleash-types.js';
import { serializeDates } from '../../../types/serialize-dates.js';
import { type PatSchema, patSchema } from '../../../openapi/spec/pat-schema.js';
import {
    type PatsSchema,
    patsSchema,
} from '../../../openapi/spec/pats-schema.js';
import {
    type CreatePatSchema,
    createPatSchema,
} from '../../../openapi/spec/create-pat-schema.js';
import { ForbiddenError, NotFoundError } from '../../../error/index.js';
import type { IUnleashServices } from '../../../services/index.js';

export default class PatController extends Controller {
    private patService: PatService;

    private openApiService: OpenApiService;

    private logger: Logger;

    private flagResolver: IFlagResolver;

    constructor(
        config: IUnleashConfig,
        {
            openApiService,
            patService,
        }: Pick<IUnleashServices, 'openApiService' | 'patService'>,
    ) {
        throw new Error("STUB");
    }

    async createPat(
        req: IAuthRequest<unknown, unknown, CreatePatSchema>,
        res: Response<PatSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getPats(req: IAuthRequest, res: Response<PatsSchema>): Promise<void> {
        throw new Error("STUB");
    }

    async deletePat(
        req: IAuthRequest<{ id: number }>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
