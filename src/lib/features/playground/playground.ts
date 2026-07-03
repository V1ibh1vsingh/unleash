import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import { NONE } from '../../types/permissions.js';
import Controller from '../../routes/controller.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import { getStandardResponses } from '../../openapi/util/standard-responses.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import {
    type PlaygroundResponseSchema,
    playgroundResponseSchema,
} from '../../openapi/spec/playground-response-schema.js';
import type { PlaygroundRequestSchema } from '../../openapi/spec/playground-request-schema.js';
import type { PlaygroundService } from './playground-service.js';
import type { IFlagResolver } from '../../types/index.js';
import type { AdvancedPlaygroundRequestSchema } from '../../openapi/spec/advanced-playground-request-schema.js';
import type { AdvancedPlaygroundResponseSchema } from '../../openapi/spec/advanced-playground-response-schema.js';
import {
    advancedPlaygroundViewModel,
    playgroundViewModel,
} from './playground-view-model.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import { extractUserIdFromUser } from '../../util/index.js';

export default class PlaygroundController extends Controller {
    private openApiService: OpenApiService;

    private playgroundService: PlaygroundService;

    private flagResolver: IFlagResolver;

    constructor(
        config: IUnleashConfig,
        {
            openApiService,
            playgroundService,
        }: Pick<IUnleashServices, 'openApiService' | 'playgroundService'>,
    ) {
        throw new Error("STUB");
    }

    async evaluateContext(
        req: Request<any, any, PlaygroundRequestSchema>,
        res: Response<PlaygroundResponseSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async evaluateAdvancedContext(
        req: IAuthRequest<any, any, AdvancedPlaygroundRequestSchema>,
        res: Response<AdvancedPlaygroundResponseSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
