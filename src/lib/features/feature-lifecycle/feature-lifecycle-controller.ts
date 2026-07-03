import type { FeatureLifecycleService } from './feature-lifecycle-service.js';
import {
    type IFlagResolver,
    type IUnleashConfig,
    NONE,
    serializeDates,
    UPDATE_FEATURE,
} from '../../types/index.js';
import type { IUnleashServices, OpenApiService } from '../../services/index.js';
import {
    createRequestSchema,
    createResponseSchema,
    emptyResponse,
    type FeatureLifecycleCompletedSchema,
    featureLifecycleSchema,
    type FeatureLifecycleSchema,
    getStandardResponses,
} from '../../openapi/index.js';
import Controller from '../../routes/controller.js';
import type { Request, Response } from 'express';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import type { WithTransactional } from '../../db/transaction.js';

interface FeatureLifecycleParams {
    projectId: string;
    featureName: string;
}

const PATH = '/:projectId/features/:featureName/lifecycle';

export default class FeatureLifecycleController extends Controller {
    private featureLifecycleService: WithTransactional<FeatureLifecycleService>;

    private openApiService: OpenApiService;

    private flagResolver: IFlagResolver;

    constructor(
        config: IUnleashConfig,
        {
            transactionalFeatureLifecycleService,
            openApiService,
        }: Pick<
            IUnleashServices,
            'openApiService' | 'transactionalFeatureLifecycleService'
        >,
    ) {
        throw new Error("STUB");
    }

    async getFeatureLifecycle(
        req: Request<FeatureLifecycleParams, any, any, any>,
        res: Response<FeatureLifecycleSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async complete(
        req: IAuthRequest<
            FeatureLifecycleParams,
            any,
            FeatureLifecycleCompletedSchema
        >,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async uncomplete(
        req: IAuthRequest<FeatureLifecycleParams>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
