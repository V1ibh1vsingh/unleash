import type { Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import Controller from '../../routes/controller.js';
import { extractUsername } from '../../util/extract-user.js';
import { DELETE_FEATURE, UPDATE_FEATURE } from '../../types/permissions.js';
import type { FeatureToggleService } from './feature-toggle-service.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import type { WithTransactional } from '../../db/transaction.js';

export default class ArchiveController extends Controller {
    private featureService: FeatureToggleService;
    private transactionalFeatureToggleService: WithTransactional<FeatureToggleService>;
    private openApiService: OpenApiService;

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

    async deleteFeature(
        req: IAuthRequest<{ featureName: string }>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async reviveFeature(
        req: IAuthRequest<{ featureName: string }>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
