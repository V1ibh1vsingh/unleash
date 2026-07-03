import type { Response } from 'express';

import Controller from './controller.js';
import { NONE } from '../types/permissions.js';
import type { IAuthRequest } from './unleash-types.js';
import type { IUnleashConfig } from '../types/index.js';
import type { OpenApiService } from '../services/openapi-service.js';
import { createRequestSchema } from '../openapi/util/create-request-schema.js';
import { createResponseSchema } from '../openapi/util/create-response-schema.js';
import { serializeDates } from '../types/serialize-dates.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../openapi/util/standard-responses.js';
import type { PublicSignupTokenService } from '../services/public-signup-token-service.js';
import { type UserSchema, userSchema } from '../openapi/spec/user-schema.js';
import type { CreateInvitedUserSchema } from '../openapi/spec/create-invited-user-schema.js';
import type { IUnleashServices } from '../services/index.js';

interface TokenParam {
    token: string;
}

export class PublicInviteController extends Controller {
    private publicSignupTokenService: PublicSignupTokenService;

    private openApiService: OpenApiService;

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

    async validate(
        req: IAuthRequest<TokenParam, void>,
        res: Response,
    ): Promise<void> {
        const { token } = req.params;
        const valid = await this.publicSignupTokenService.validate(token);
        if (valid) {
            res.status(200).end();
        } else {
            res.status(400).end();
        }
    }

    async addTokenUser(
        req: IAuthRequest<TokenParam, void, CreateInvitedUserSchema>,
        res: Response<UserSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
