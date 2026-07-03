import type { Response } from 'express';

import Controller from '../controller.js';
import {
    ADMIN,
    type IUnleashConfig,
    serializeDates,
} from '../../types/index.js';
import type { Logger } from '../../logger.js';
import type {
    IUnleashServices,
    OpenApiService,
    PublicSignupTokenService,
} from '../../services/index.js';
import type { IAuthRequest } from '../unleash-types.js';
import {
    createRequestSchema,
    createResponseSchema,
    getStandardResponses,
    type PublicSignupTokenCreateSchema,
    publicSignupTokenSchema,
    type PublicSignupTokenSchema,
    publicSignupTokensSchema,
    type PublicSignupTokensSchema,
    type PublicSignupTokenUpdateSchema,
    resourceCreatedResponseSchema,
} from '../../openapi/index.js';

interface TokenParam {
    token: string;
}

export class PublicSignupController extends Controller {
    private publicSignupTokenService: PublicSignupTokenService;

    private openApiService: OpenApiService;

    private logger: Logger;

    constructor(
        config: IUnleashConfig,
        {
            publicSignupTokenService,
            openApiService,
        }: Pick<
            IUnleashServices,
            'publicSignupTokenService' | 'openApiService'
        >,
    ) {
        throw new Error("STUB");
    }

    async getAllPublicSignupTokens(
        _req: IAuthRequest,
        res: Response<PublicSignupTokensSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getPublicSignupToken(
        req: IAuthRequest<TokenParam>,
        res: Response<PublicSignupTokenSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async createPublicSignupToken(
        req: IAuthRequest<void, void, PublicSignupTokenCreateSchema>,
        res: Response<PublicSignupTokenSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updatePublicSignupToken(
        req: IAuthRequest<TokenParam, void, PublicSignupTokenUpdateSchema>,
        res: Response,
    ): Promise<any> {
        throw new Error("STUB");
    }
}
