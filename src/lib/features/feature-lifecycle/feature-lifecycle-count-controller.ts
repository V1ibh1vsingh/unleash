import {
    type IAuthRequest,
    type IFeatureLifecycleReadModel,
    type IUnleashConfig,
    type IUnleashStores,
    NONE,
} from '../../types/index.js';
import type { IUnleashServices, OpenApiService } from '../../services/index.js';
import {
    createResponseSchema,
    getStandardResponses,
} from '../../openapi/index.js';
import Controller from '../../routes/controller.js';
import type { Response } from 'express';
import {
    type FeatureLifecycleCountSchema,
    featureLifecycleCountSchema,
} from '../../openapi/spec/feature-lifecycle-count-schema.js';
import type { IPrivateProjectChecker } from '../private-project/privateProjectCheckerType.js';

export default class FeatureLifecycleCountController extends Controller {
    private featureLifecycleReadModel: IFeatureLifecycleReadModel;

    private openApiService: OpenApiService;

    private privateProjectChecker: IPrivateProjectChecker;

    constructor(
        config: IUnleashConfig,
        {
            openApiService,
            privateProjectChecker,
        }: Pick<IUnleashServices, 'openApiService' | 'privateProjectChecker'>,
        {
            featureLifecycleReadModel,
        }: Pick<IUnleashStores, 'featureLifecycleReadModel'>,
    ) {
        throw new Error("STUB");
    }

    async getStageCount(
        req: IAuthRequest,
        res: Response<FeatureLifecycleCountSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
