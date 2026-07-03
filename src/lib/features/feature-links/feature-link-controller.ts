import type { Response } from 'express';
import Controller from '../../routes/controller.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { WithTransactional } from '../../db/transaction.js';
import type FeatureLinkService from './feature-link-service.js';
import { UPDATE_FEATURE } from '../../types/permissions.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import type { IFeatureLink } from './feature-link-store-type.js';
import type { IFlagResolver } from '../../types/index.js';

interface FeatureLinkServices {
    transactionalFeatureLinkService: WithTransactional<FeatureLinkService>;
    openApiService: OpenApiService;
}

const PATH = '/:projectId/features/:featureName/link';
const PATH_LINK = '/:projectId/features/:featureName/link/:linkId';

export default class FeatureLinkController extends Controller {
    private transactionalFeatureLinkService: WithTransactional<FeatureLinkService>;
    private openApiService: OpenApiService;
    private flagResolver: IFlagResolver;

    constructor(
        config: IUnleashConfig,
        {
            transactionalFeatureLinkService,
            openApiService,
        }: FeatureLinkServices,
    ) {
        throw new Error("STUB");
    }

    async createFeatureLink(
        req: IAuthRequest<
            { projectId: string; featureName: string },
            unknown,
            Omit<IFeatureLink, 'id' | 'createdAt'>
        >,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateFeatureLink(
        req: IAuthRequest<
            { projectId: string; linkId: string; featureName: string },
            unknown,
            Omit<IFeatureLink, 'id'>
        >,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteFeatureLink(
        req: IAuthRequest<
            { projectId: string; linkId: string },
            unknown,
            Omit<IFeatureLink, 'id'>
        >,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
