import type { Response } from 'express';
import type { OpenApiService } from '../../services/index.js';
import type { IAuthRequest } from '../unleash-types.js';
import type { IUnleashConfig } from '../../types/option.js';
import Controller from '../controller.js';
import { NONE } from '../../types/permissions.js';
import type { IUnleashServices } from '../../services/index.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import {
    telemetrySettingsSchema,
    type TelemetrySettingsSchema,
} from '../../openapi/spec/telemetry-settings-schema.js';

class TelemetryController extends Controller {
    openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        { openApiService }: Pick<IUnleashServices, 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async getTelemetrySettings(
        _req: IAuthRequest,
        res: Response<TelemetrySettingsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}

export default TelemetryController;
