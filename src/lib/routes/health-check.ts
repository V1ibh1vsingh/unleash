import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../types/option.js';
import type { IUnleashServices } from '../services/index.js';

import Controller from './controller.js';
import { NONE } from '../types/permissions.js';
import { createResponseSchema } from '../openapi/util/create-response-schema.js';
import type { HealthCheckSchema } from '../openapi/spec/health-check-schema.js';

export class HealthCheckController extends Controller {
    constructor(
        config: IUnleashConfig,
        { openApiService }: Pick<IUnleashServices, 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async getHealth(
        _: Request,
        res: Response<HealthCheckSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
