import type { Response } from 'express';
import type { IUnleashServices } from '../services/index.js';
import type { IUnleashConfig } from '../types/option.js';
import Controller from '../routes/controller.js';
import { ADMIN, NONE, UPDATE_CORS } from '../types/permissions.js';
import { createResponseSchema } from '../openapi/util/create-response-schema.js';
import {
    uiConfigSchema,
    type UiConfigSchema,
} from '../openapi/spec/ui-config-schema.js';
import type { OpenApiService } from '../services/openapi-service.js';
import { emptyResponse } from '../openapi/util/standard-responses.js';
import type { IAuthRequest } from '../routes/unleash-types.js';
import NotFoundError from '../error/notfound-error.js';
import type { SetCorsSchema } from '../openapi/spec/set-cors-schema.js';
import { createRequestSchema } from '../openapi/util/create-request-schema.js';
import type { FrontendApiService } from '../services/index.js';
import type { UiConfigService } from './ui-config-service.js';

class UiConfigController extends Controller {
    private frontendApiService: FrontendApiService;

    private uiConfigService: UiConfigService;

    private readonly openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            openApiService,
            frontendApiService,
            uiConfigService,
        }: Pick<
            IUnleashServices,
            | 'openApiService'
            | 'frontendApiService'
            | 'clientInstanceService'
            | 'uiConfigService'
        >,
    ) {
        throw new Error("STUB");
    }

    async getUiConfig(
        req: IAuthRequest,
        res: Response<UiConfigSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async setCors(
        req: IAuthRequest<void, void, SetCorsSchema>,
        res: Response<string>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}

export default UiConfigController;
