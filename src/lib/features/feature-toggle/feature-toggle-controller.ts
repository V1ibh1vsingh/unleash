import type { Request, Response } from 'express';
import type { Operation } from 'fast-json-patch';
import fastJsonPatch from 'fast-json-patch';
const { applyPatch } = fastJsonPatch;
import Controller from '../../routes/controller.js';
import {
    CREATE_FEATURE,
    CREATE_FEATURE_STRATEGY,
    DELETE_FEATURE,
    DELETE_FEATURE_STRATEGY,
    type FeatureToggleView,
    type IFlagResolver,
    type IUnleashConfig,
    NONE,
    serializeDates,
    UPDATE_FEATURE,
    UPDATE_FEATURE_ENVIRONMENT,
    UPDATE_FEATURE_STRATEGY,
} from '../../types/index.js';
import type { Logger } from '../../logger.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import {
    type AdminFeaturesQuerySchema,
    type BulkToggleFeaturesSchema,
    type CreateFeatureSchema,
    type CreateFeatureStrategySchema,
    createRequestSchema,
    createResponseSchema,
    emptyResponse,
    featureEnvironmentSchema,
    type FeatureEnvironmentSchema,
    featureSchema,
    type FeatureSchema,
    featureStrategySchema,
    type FeatureStrategySchema,
    getStandardResponses,
    projectFeaturesSchema,
    type ProjectFeaturesSchema,
    type SetStrategySortOrderSchema,
    type TagsBulkAddSchema,
    type TagSchema,
    type UpdateFeatureSchema,
    type UpdateFeatureStrategySchema,
} from '../../openapi/index.js';
import type {
    FeatureTagService,
    FeatureToggleService,
    OpenApiService,
    IUnleashServices,
} from '../../services/index.js';
import { querySchema } from '../../schema/feature-schema.js';
import type { BatchStaleSchema } from '../../openapi/spec/batch-stale-schema.js';
import type { WithTransactional } from '../../db/transaction.js';
import { BadDataError } from '../../error/index.js';
import { anonymise } from '../../util/index.js';
import { throwOnInvalidSchema } from '../../openapi/validate.js';

interface FeatureStrategyParams {
    projectId: string;
    featureName: string;
    environment: string;
    sortOrder?: number;
}

interface BulkFeaturesStrategyParams {
    projectId: string;
    environment: string;
}

interface FeatureStrategyQuery {
    shouldActivateDisabledStrategies: string;
}

interface FeatureParams extends ProjectParam {
    featureName: string;
}

interface ProjectParam {
    projectId: string;
}

interface StrategyIdParams extends FeatureStrategyParams {
    strategyId: string;
}

export interface IFeatureProjectUserParams extends ProjectParam {
    archived?: boolean;
    userId?: number;

    tag?: string[][];
    namePrefix?: string;
}

const PATH = '/:projectId/features';
const PATH_STALE = '/:projectId/stale';
const PATH_TAGS = `/:projectId/tags`;
const PATH_FEATURE = `${PATH}/:featureName`;
const PATH_FEATURE_CLONE = `${PATH_FEATURE}/clone`;
const PATH_ENV = `${PATH_FEATURE}/environments/:environment`;
const BULK_PATH_ENV = `/:projectId/bulk_features/environments/:environment`;
const PATH_STRATEGIES = `${PATH_ENV}/strategies`;
const PATH_STRATEGY = `${PATH_STRATEGIES}/:strategyId`;

type ProjectFeaturesServices = Pick<
    IUnleashServices,
    | 'featureToggleService'
    | 'projectHealthService'
    | 'openApiService'
    | 'transactionalFeatureToggleService'
    | 'featureTagService'
>;

export default class ProjectFeaturesController extends Controller {
    private featureService: FeatureToggleService;

    private featureTagService: FeatureTagService;

    private transactionalFeatureToggleService: WithTransactional<FeatureToggleService>;

    private openApiService: OpenApiService;

    private flagResolver: IFlagResolver;

    private readonly logger: Logger;

    constructor(
        config: IUnleashConfig,
        {
            featureToggleService,
            openApiService,
            transactionalFeatureToggleService,
            featureTagService,
        }: ProjectFeaturesServices,
    ) {
        throw new Error("STUB");
    }

    async getFeatures(
        req: IAuthRequest<ProjectParam, any, any, AdminFeaturesQuerySchema>,
        res: Response<ProjectFeaturesSchema>,
    ): Promise<void> {
        const { projectId } = req.params;
        const query = await this.prepQuery(req.query, projectId);
        const features = await this.featureService.getFeatureOverview({
            ...query,
            userId: req.user.id,
        });
        this.openApiService.respondWithValidation(
            200,
            res,
            projectFeaturesSchema.$id,
            { version: 2, features: serializeDates(features) },
        );
    }

    async prepQuery(
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        { tag, namePrefix }: AdminFeaturesQuerySchema,
        projectId: string,
    ): Promise<IFeatureProjectUserParams> {
        if (!tag && !namePrefix) {
            return { projectId };
        }
        const tagQuery = this.paramToArray(tag);
        const query = await querySchema.validateAsync({
            tag: tagQuery,
            namePrefix,
        });
        if (query.tag) {
            query.tag = query.tag.map((q) => { throw new Error("STUB"); });
        }
        return { projectId, ...query };
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paramToArray(param: any): Array<any> {
        if (!param) {
            return param;
        }
        return Array.isArray(param) ? param : [param];
    }

    async cloneFeature(
        req: IAuthRequest<
            FeatureParams,
            any,
            { name: string; replaceGroupId?: boolean }
        >,
        res: Response<FeatureSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async createFeature(
        req: IAuthRequest<FeatureParams, FeatureSchema, CreateFeatureSchema>,
        res: Response<FeatureSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    maybeAnonymise(feature: FeatureToggleView): FeatureToggleView {
        throw new Error("STUB");
    }

    async getFeature(
        req: IAuthRequest<FeatureParams, any, any, any>,
        res: Response<FeatureSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateFeature(
        req: IAuthRequest<
            { projectId: string; featureName: string },
            any,
            UpdateFeatureSchema
        >,
        res: Response<FeatureSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async patchFeature(
        req: IAuthRequest<
            { projectId: string; featureName: string },
            any,
            Operation[],
            any
        >,
        res: Response<FeatureSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async archiveFeature(
        req: IAuthRequest<
            { projectId: string; featureName: string },
            any,
            any,
            any
        >,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async staleFeatures(
        req: IAuthRequest<{ projectId: string }, void, BatchStaleSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getFeatureEnvironment(
        req: Request<FeatureStrategyParams, any, any, any>,
        res: Response<FeatureEnvironmentSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async toggleFeatureEnvironmentOn(
        req: IAuthRequest<
            FeatureStrategyParams,
            any,
            any,
            FeatureStrategyQuery
        >,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async bulkToggleFeaturesEnvironmentOn(
        req: IAuthRequest<
            BulkFeaturesStrategyParams,
            any,
            BulkToggleFeaturesSchema,
            FeatureStrategyQuery
        >,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async bulkToggleFeaturesEnvironmentOff(
        req: IAuthRequest<
            BulkFeaturesStrategyParams,
            any,
            BulkToggleFeaturesSchema,
            FeatureStrategyQuery
        >,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async toggleFeatureEnvironmentOff(
        req: IAuthRequest<FeatureStrategyParams, any, any, any>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async addFeatureStrategy(
        req: IAuthRequest<
            FeatureStrategyParams,
            any,
            CreateFeatureStrategySchema
        >,
        res: Response<FeatureStrategySchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getFeatureStrategies(
        req: Request<FeatureStrategyParams, any, any, any>,
        res: Response<FeatureStrategySchema[]>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async setStrategiesSortOrder(
        req: IAuthRequest<
            FeatureStrategyParams,
            any,
            SetStrategySortOrderSchema,
            any
        >,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateFeatureStrategy(
        req: IAuthRequest<StrategyIdParams, any, UpdateFeatureStrategySchema>,
        res: Response<FeatureStrategySchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async patchFeatureStrategy(
        req: IAuthRequest<StrategyIdParams, any, Operation[], any>,
        res: Response<FeatureStrategySchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getFeatureStrategy(
        req: IAuthRequest<StrategyIdParams, any, any, any>,
        res: Response<FeatureStrategySchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteFeatureStrategy(
        req: IAuthRequest<StrategyIdParams, any, any, any>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateFeaturesTags(
        req: IAuthRequest<void, void, TagsBulkAddSchema>,
        res: Response<TagSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
