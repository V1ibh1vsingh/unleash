import type { Response } from 'express';
import {
    unknownFlagsResponseSchema,
    type UnknownFlagsResponseSchema,
} from '../../../openapi/index.js';
import { createResponseSchema } from '../../../openapi/util/create-response-schema.js';
import Controller from '../../../routes/controller.js';
import type { IAuthRequest } from '../../../routes/unleash-types.js';
import type { OpenApiService } from '../../../services/openapi-service.js';
import type { IUnleashConfig } from '../../../types/option.js';
import { NONE } from '../../../types/permissions.js';
import { serializeDates } from '../../../types/serialize-dates.js';
import type { IUnleashServices } from '../../../services/index.js';
import type { UnknownFlagsService } from './unknown-flags-service.js';

export default class UnknownFlagsController extends Controller {
    private unknownFlagsService: UnknownFlagsService;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            unknownFlagsService,
            openApiService,
        }: Pick<IUnleashServices, 'unknownFlagsService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async getUnknownFlags(
        _: IAuthRequest,
        res: Response<UnknownFlagsResponseSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
