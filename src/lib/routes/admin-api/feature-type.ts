import type { Request, Response } from 'express';
import type { IUnleashServices } from '../../services/index.js';
import type FeatureTypeService from '../../services/feature-type-service.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import { ADMIN, NONE } from '../../types/permissions.js';
import {
    featureTypesSchema,
    type FeatureTypesSchema,
} from '../../openapi/spec/feature-types-schema.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import Controller from '../controller.js';
import {
    createRequestSchema,
    featureTypeSchema,
    type FeatureTypeSchema,
    getStandardResponses,
    type UpdateFeatureTypeLifetimeSchema,
} from '../../openapi/index.js';
import type { IAuthRequest } from '../unleash-types.js';
import type { IFlagResolver } from '../../types/index.js';

const version = 1;

export class FeatureTypeController extends Controller {
    private featureTypeService: FeatureTypeService;

    private openApiService: OpenApiService;

    private flagResolver: IFlagResolver;

    constructor(
        config: IUnleashConfig,
        {
            featureTypeService,
            openApiService,
        }: Pick<IUnleashServices, 'featureTypeService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async getAllFeatureTypes(
        _req: Request,
        res: Response<FeatureTypesSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateLifetime(
        req: IAuthRequest<
            { id: string },
            unknown,
            UpdateFeatureTypeLifetimeSchema
        >,
        res: Response<FeatureTypeSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
