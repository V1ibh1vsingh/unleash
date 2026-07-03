import type { Request, Response } from 'express';
import type { PoolClient } from 'pg';
import type { IUnleashConfig } from '../types/option.js';
import type { IUnleashServices } from '../services/index.js';
import type { Db } from '../db/db.js';
import type { Logger } from '../logger.js';

import Controller from './controller.js';
import { NONE } from '../types/permissions.js';
import { createResponseSchema } from '../openapi/util/create-response-schema.js';
import type { ReadyCheckSchema } from '../openapi/spec/ready-check-schema.js';
import { emptyResponse, parseEnvVarNumber } from '../server-impl.js';
import type { FrontendApiService } from '../features/frontend-api/frontend-api-service.js';

export class ReadyCheckController extends Controller {
    private logger: Logger;

    private db?: Db;

    private frontendApiService: FrontendApiService;

    constructor(
        config: IUnleashConfig,
        {
            openApiService,
            frontendApiService,
        }: Pick<IUnleashServices, 'openApiService' | 'frontendApiService'>,
        db?: Db,
    ) {
        throw new Error("STUB");
    }

    async getReady(_: Request, res: Response<ReadyCheckSchema>): Promise<void> {
        throw new Error("STUB");
    }

    private async runReadinessQuery(timeoutMs: number): Promise<void> {
        throw new Error("STUB");
    }
}

function getKnexClient(db: Db): Db['client'] {
    throw new Error("STUB");
}
