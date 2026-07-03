import type { Response } from 'express';
import type { IUnleashConfig } from '../../../types/option.js';
import {
    type IFlagResolver,
    type IProjectParam,
    UPDATE_FEATURE,
} from '../../../types/index.js';
import type { Logger } from '../../../logger.js';
import { DELETE_FEATURE } from '../../../types/permissions.js';
import type { FeatureToggleService } from '../../../features/feature-toggle/feature-toggle-service.js';
import type { IAuthRequest } from '../../unleash-types.js';
import type { OpenApiService } from '../../../services/openapi-service.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../../openapi/util/standard-responses.js';
import {
    type BatchFeaturesSchema,
    createRequestSchema,
    createResponseSchema,
} from '../../../openapi/index.js';
import Controller from '../../controller.js';
import type { IUnleashServices } from '../../../services/index.js';
import type { WithTransactional } from '../../../db/transaction.js';

const PATH = '/:projectId';
const PATH_ARCHIVE = `${PATH}/archive`;
const PATH_VALIDATE_ARCHIVE = `${PATH}/archive/validate`;
const PATH_DELETE = `${PATH}/delete`;
const PATH_REVIVE = `${PATH}/revive`;

export default class ProjectArchiveController extends Controller {
    private readonly logger: Logger;

    private featureService: FeatureToggleService;

    private transactionalFeatureToggleService: WithTransactional<FeatureToggleService>;

    private openApiService: OpenApiService;

    private flagResolver: IFlagResolver;

    constructor(
        config: IUnleashConfig,
        {
            transactionalFeatureToggleService,
            featureToggleService,
            openApiService,
        }: Pick<
            IUnleashServices,
            | 'transactionalFeatureToggleService'
            | 'featureToggleService'
            | 'openApiService'
        >,
    ) {
        throw new Error("STUB");
    }

    async deleteFeatures(
        req: IAuthRequest<IProjectParam, any, BatchFeaturesSchema>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async reviveFeatures(
        req: IAuthRequest<IProjectParam, any, BatchFeaturesSchema>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async archiveFeatures(
        req: IAuthRequest<IProjectParam, void, BatchFeaturesSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validateArchiveFeatures(
        req: IAuthRequest<IProjectParam, void, BatchFeaturesSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
