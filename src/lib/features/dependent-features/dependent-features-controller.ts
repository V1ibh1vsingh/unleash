import type { Response } from 'express';
import Controller from '../../routes/controller.js';
import type { IUnleashServices, OpenApiService } from '../../services/index.js';
import {
    type IFlagResolver,
    type IUnleashConfig,
    NONE,
    UPDATE_FEATURE_DEPENDENCY,
} from '../../types/index.js';
import type { Logger } from '../../logger.js';
import {
    type CreateDependentFeatureSchema,
    createRequestSchema,
    createResponseSchema,
    emptyResponse,
    getStandardResponses,
    parentFeatureOptionsSchema,
    type ParentFeatureOptionsSchema,
    type ParentVariantOptionsSchema,
    parentVariantOptionsSchema,
} from '../../openapi/index.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import type { DependentFeaturesService } from './dependent-features-service.js';
import type { WithTransactional } from '../../db/transaction.js';

interface ProjectParams {
    projectId: string;
}

interface FeatureParams extends ProjectParams {
    child: string;
}

interface ParentVariantsParams extends ProjectParams {
    parent: string;
}

interface DeleteDependencyParams extends ProjectParams {
    child: string;
    parent: string;
}

const PATH = '/:projectId/features';
const PATH_FEATURE = `${PATH}/:child`;
const PATH_DEPENDENCIES = `${PATH_FEATURE}/dependencies`;
const PATH_DEPENDENCIES_CHECK = `/:projectId/dependencies`;
const PATH_PARENTS = `${PATH_FEATURE}/parents`;
const PATH_PARENT_VARIANTS = `${PATH}/:parent/parent-variants`;
const PATH_DEPENDENCY = `${PATH_FEATURE}/dependencies/:parent`;

type DependentFeaturesServices = Pick<
    IUnleashServices,
    'transactionalDependentFeaturesService' | 'openApiService'
>;

export default class DependentFeaturesController extends Controller {
    private dependentFeaturesService: WithTransactional<DependentFeaturesService>;

    private openApiService: OpenApiService;

    private flagResolver: IFlagResolver;

    private readonly logger: Logger;

    constructor(
        config: IUnleashConfig,
        {
            transactionalDependentFeaturesService,
            openApiService,
        }: DependentFeaturesServices,
    ) {
        throw new Error("STUB");
    }

    async addFeatureDependency(
        req: IAuthRequest<FeatureParams, any, CreateDependentFeatureSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteFeatureDependency(
        req: IAuthRequest<DeleteDependencyParams, any, any>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteFeatureDependencies(
        req: IAuthRequest<FeatureParams, any, any>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getPossibleParentFeatures(
        req: IAuthRequest<FeatureParams, any, any>,
        res: Response<ParentFeatureOptionsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getPossibleParentVariants(
        req: IAuthRequest<ParentVariantsParams, any, any>,
        res: Response<ParentVariantOptionsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async checkDependenciesExist(
        req: IAuthRequest,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
