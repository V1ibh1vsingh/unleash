import type { Request, Response } from 'express';
import Controller from '../../routes/controller.js';

import { NONE } from '../../types/permissions.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type { Logger } from '../../logger.js';

import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import { createRequestSchema } from '../../openapi/index.js';

const _version = 1;

export class UiObservabilityController extends Controller {
    private logger: Logger;

    constructor(
        config: IUnleashConfig,
        { openApiService }: Pick<IUnleashServices, 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async recordUiError(req: Request, res: Response): Promise<void> {
        throw new Error("STUB");
    }
}
