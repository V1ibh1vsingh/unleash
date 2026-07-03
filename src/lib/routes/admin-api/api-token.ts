import type { Response } from 'express';

import Controller from '../controller.js';
import {
    ADMIN,
    CREATE_CLIENT_API_TOKEN,
    CREATE_FRONTEND_API_TOKEN,
    DELETE_CLIENT_API_TOKEN,
    DELETE_FRONTEND_API_TOKEN,
    READ_CLIENT_API_TOKEN,
    READ_FRONTEND_API_TOKEN,
    UPDATE_CLIENT_API_TOKEN,
    UPDATE_FRONTEND_API_TOKEN,
} from '../../types/permissions.js';
import type { ApiTokenService } from '../../services/api-token-service.js';
import type { Logger } from '../../logger.js';
import type { AccessService } from '../../services/access-service.js';
import type { IAuthRequest } from '../unleash-types.js';
import type { IUser } from '../../types/user.js';
import type { IUnleashConfig } from '../../types/option.js';
import { ApiTokenType, type IApiToken } from '../../types/model.js';
import { createApiToken } from '../../schema/api-token-schema.js';
import type { OpenApiService, IUnleashServices } from '../../services/index.js';
import type { IFlagResolver } from '../../types/index.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import {
    createResponseSchema,
    resourceCreatedResponseSchema,
} from '../../openapi/util/create-response-schema.js';
import {
    apiTokensSchema,
    type ApiTokensSchema,
} from '../../openapi/spec/api-tokens-schema.js';
import { serializeDates } from '../../types/serialize-dates.js';
import {
    apiTokenSchema,
    type ApiTokenSchema,
} from '../../openapi/spec/api-token-schema.js';
import type { UpdateApiTokenSchema } from '../../openapi/spec/update-api-token-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import type { FrontendApiService } from '../../features/frontend-api/frontend-api-service.js';
import { OperationDeniedError } from '../../error/index.js';
import type { CreateApiTokenSchema } from '../../internals.js';
import type { IUserPermission } from '../../server-impl.js';

interface TokenParam {
    token: string;
}
interface TokenNameParam {
    name: string;
}
export const tokenTypeToCreatePermission: (tokenType: ApiTokenType) => string =
    (tokenType) => {
        throw new Error("STUB");
    };

const canReadToken = ({ permission }: IUserPermission, type: ApiTokenType) => {
    throw new Error("STUB");
};

const tokenTypeToUpdatePermission: (tokenType: ApiTokenType) => string = (
    tokenType,
) => {
    throw new Error("STUB");
};

const tokenTypeToDeletePermission: (tokenType: ApiTokenType) => string = (
    tokenType,
) => {
    throw new Error("STUB");
};

export class ApiTokenController extends Controller {
    private apiTokenService: ApiTokenService;

    private accessService: AccessService;

    private frontendApiService: FrontendApiService;

    private openApiService: OpenApiService;

    private logger: Logger;

    private flagResolver: IFlagResolver;

    constructor(
        config: IUnleashConfig,
        {
            apiTokenService,
            accessService,
            frontendApiService,
            openApiService,
        }: Pick<
            IUnleashServices,
            | 'apiTokenService'
            | 'accessService'
            | 'frontendApiService'
            | 'openApiService'
        >,
    ) {
        throw new Error("STUB");
    }

    async getAllApiTokens(
        req: IAuthRequest,
        res: Response<ApiTokensSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getApiTokensByName(
        req: IAuthRequest<TokenNameParam>,
        res: Response<ApiTokensSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async createApiToken(
        req: IAuthRequest<CreateApiTokenSchema>,
        res: Response<ApiTokenSchema>,
    ): Promise<any> {
        throw new Error("STUB");
    }

    async updateApiToken(
        req: IAuthRequest<TokenParam, void, UpdateApiTokenSchema>,
        res: Response,
    ): Promise<any> {
        throw new Error("STUB");
    }

    async deleteApiToken(
        req: IAuthRequest<TokenParam>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    private async accessibleTokensByName(
        tokenName: string,
        user: IUser,
    ): Promise<IApiToken[]> {
        throw new Error("STUB");
    }

    private async accessibleTokens(user: IUser): Promise<IApiToken[]> {
        throw new Error("STUB");
    }
}
