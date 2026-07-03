import type { Response } from 'express';
import Controller from '../controller.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type UserSplashService from '../../services/user-splash-service.js';
import type { IAuthRequest } from '../unleash-types.js';
import { NONE } from '../../types/permissions.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import { splashRequestSchema } from '../../openapi/spec/splash-request-schema.js';
import { getStandardResponses } from '../../openapi/index.js';
import type { SplashResponseSchema } from '../../openapi/spec/splash-response-schema.js';

class UserSplashController extends Controller {
    private userSplashService: UserSplashService;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            userSplashService,
            openApiService,
        }: Pick<IUnleashServices, 'userSplashService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    private async updateSplashSettings(
        req: IAuthRequest<{ id: string }>,
        res: Response<SplashResponseSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
export default UserSplashController;
