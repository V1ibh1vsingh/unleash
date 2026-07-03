import type { Response } from 'express';
import Controller from '../controller.js';
import type { IUnleashConfig } from '../../types/index.js';
import type { Logger } from '../../logger.js';
import { NONE } from '../../types/index.js';
import { createResponseSchema } from '../../openapi/index.js';
import type { RequestBody } from '../unleash-types.js';
import { createRequestSchema } from '../../openapi/index.js';
import {
    validatedEdgeTokensSchema,
    type ValidatedEdgeTokensSchema,
} from '../../openapi/index.js';
import type EdgeService from '../../services/edge-service.js';
import type { OpenApiService } from '../../services/index.js';
import { getStandardResponses } from '../../openapi/index.js';
import type {
    EdgeEnvironmentsProjectsListSchema,
    TokenStringListSchema,
} from '../../openapi/index.js';
import type { IUnleashServices } from '../../services/index.js';
import { hmacSignatureVerifyTokenRequest } from '../../features/edgetokens/edge-hmac-verifier.js';
import type { WithTransactional } from '../../db/transaction.js';

export default class EdgeController extends Controller {
    private readonly logger: Logger;

    private edgeService: WithTransactional<EdgeService>;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            edgeService,
            openApiService,
        }: Pick<IUnleashServices, 'edgeService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async validateTokens(
        req: RequestBody<TokenStringListSchema>,
        res: Response<ValidatedEdgeTokensSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async createOrReturnTokens(
        req: RequestBody<EdgeEnvironmentsProjectsListSchema>,
        res: Response<ValidatedEdgeTokensSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
