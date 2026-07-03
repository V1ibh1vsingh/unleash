import type { FeatureToggleService } from '../../../features/feature-toggle/feature-toggle-service.js';
import type { Logger } from '../../../logger.js';
import Controller from '../../controller.js';
import type { IUnleashConfig } from '../../../types/option.js';
import type { IUnleashServices } from '../../../services/index.js';
import type { Request, Response } from 'express';
import type { Operation } from 'fast-json-patch';
import {
    NONE,
    UPDATE_FEATURE_ENVIRONMENT_VARIANTS,
} from '../../../types/permissions.js';
import { type IVariant, WeightType } from '../../../types/model.js';
import type { IAuthRequest } from '../../unleash-types.js';
import type { FeatureVariantsSchema } from '../../../openapi/spec/feature-variants-schema.js';
import { createRequestSchema } from '../../../openapi/util/create-request-schema.js';
import { createResponseSchema } from '../../../openapi/util/create-response-schema.js';
import type { AccessService } from '../../../services/index.js';
import { BadDataError, PermissionError } from '../../../../lib/error/index.js';
import type { IUser } from '../../../types/index.js';
import type { PushVariantsSchema } from '../../../openapi/spec/push-variants-schema.js';
import { getStandardResponses } from '../../../openapi/index.js';

const PREFIX = '/:projectId/features/:featureName/variants';
const ENV_PREFIX =
    '/:projectId/features/:featureName/environments/:environment/variants';

interface FeatureEnvironmentParams extends FeatureParams {
    environment: string;
}

interface FeatureParams extends ProjectParam {
    featureName: string;
}

interface ProjectParam {
    projectId: string;
}
export default class VariantsController extends Controller {
    private logger: Logger;

    private featureService: FeatureToggleService;

    private accessService: AccessService;

    constructor(
        config: IUnleashConfig,
        {
            featureToggleService,
            openApiService,
            accessService,
        }: Pick<
            IUnleashServices,
            'featureToggleService' | 'openApiService' | 'accessService'
        >,
    ) {
        throw new Error("STUB");
    }

    async pushVariantsToEnvironments(
        req: IAuthRequest<
            FeatureEnvironmentParams,
            any,
            PushVariantsSchema,
            any
        >,
        res: Response<FeatureVariantsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async checkAccess(
        user: IUser,
        projectId: string,
        environments: string[],
        permission: string,
    ): Promise<void> {
        for (const environment of environments) {
            if (
                !(await this.accessService.hasPermission(
                    user,
                    permission,
                    projectId,
                    environment,
                ))
            ) {
                throw new PermissionError(
                    UPDATE_FEATURE_ENVIRONMENT_VARIANTS,
                    environment,
                );
            }
        }
    }

    async getVariantsOnEnv(
        req: Request<FeatureEnvironmentParams, any, any, any>,
        res: Response<FeatureVariantsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async patchVariantsOnEnv(
        req: IAuthRequest<FeatureEnvironmentParams, any, Operation[]>,
        res: Response<FeatureVariantsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async overwriteVariantsOnEnv(
        req: IAuthRequest<FeatureEnvironmentParams, any, IVariant[], any>,
        res: Response<FeatureVariantsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
