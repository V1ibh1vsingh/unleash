import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type StrategyService from '../../services/strategy-service.js';
import Controller from '../controller.js';
import { extractUsername } from '../../util/extract-user.js';
import {
    CREATE_STRATEGY,
    DELETE_STRATEGY,
    NONE,
    UPDATE_STRATEGY,
} from '../../types/permissions.js';
import type { Request, Response } from 'express';
import type { IAuthRequest } from '../unleash-types.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import {
    createResponseSchema,
    resourceCreatedResponseSchema,
} from '../../openapi/util/create-response-schema.js';
import {
    strategySchema,
    type StrategySchema,
} from '../../openapi/spec/strategy-schema.js';
import {
    strategiesSchema,
    type StrategiesSchema,
} from '../../openapi/spec/strategies-schema.js';
import type { CreateStrategySchema } from '../../openapi/spec/create-strategy-schema.js';
import type { UpdateStrategySchema } from '../../openapi/spec/update-strategy-schema.js';

const version = 1;

class StrategyController extends Controller {
    private strategyService: StrategyService;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            strategyService,
            openApiService,
        }: Pick<IUnleashServices, 'strategyService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async getAllStrategies(
        _req: Request,
        res: Response<StrategiesSchema>,
    ): Promise<void> {
        const strategies = await this.strategyService.getStrategies();

        this.openApiService.respondWithValidation(
            200,
            res,
            strategiesSchema.$id,
            { version, strategies },
        );
    }

    async getStrategy(
        req: Request,
        res: Response<StrategySchema>,
    ): Promise<void> {
        const strategy = await this.strategyService.getStrategy(
            req.params.name,
        );

        this.openApiService.respondWithValidation(
            200,
            res,
            strategySchema.$id,
            strategy,
        );
    }

    async removeStrategy(req: IAuthRequest, res: Response): Promise<void> {
        throw new Error("STUB");
    }

    async createStrategy(
        req: IAuthRequest<unknown, unknown, CreateStrategySchema>,
        res: Response<StrategySchema>,
    ): Promise<void> {
        const _userName = extractUsername(req);

        const strategy = await this.strategyService.createStrategy(
            req.body,
            req.audit,
        );
        this.openApiService.respondWithValidation(
            201,
            res,
            strategySchema.$id,
            strategy,
            { location: `strategies/${strategy!.name}` },
        );
    }

    async updateStrategy(
        req: IAuthRequest<{ name: string }, UpdateStrategySchema>,
        res: Response<void>,
    ): Promise<void> {
        const _userName = extractUsername(req);

        await this.strategyService.updateStrategy(
            { ...req.body, name: req.params.name },
            req.audit,
        );
        res.status(200).end();
    }

    async deprecateStrategy(
        req: IAuthRequest,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async reactivateStrategy(
        req: IAuthRequest,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}

export default StrategyController;
