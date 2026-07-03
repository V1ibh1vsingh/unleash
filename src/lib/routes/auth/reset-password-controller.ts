import type { Request, Response } from 'express';
import Controller from '../controller.js';
import type UserService from '../../services/user-service.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import { NONE } from '../../types/permissions.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import {
    tokenUserSchema,
    type TokenUserSchema,
} from '../../openapi/spec/token-user-schema.js';
import type { EmailSchema } from '../../openapi/spec/email-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import rateLimit from 'express-rate-limit';
import { minutesToMilliseconds } from 'date-fns';

interface IValidateQuery {
    token: string;
}

interface IChangePasswordBody {
    token: string;
    password: string;
}

interface SessionRequest<PARAMS, QUERY, BODY, K>
    extends Request<PARAMS, QUERY, BODY, K> {
    user?;
}

class ResetPasswordController extends Controller {
    private userService: UserService;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            userService,
            openApiService,
        }: Pick<IUnleashServices, 'userService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async sendResetPasswordEmail(
        req: Request<unknown, unknown, EmailSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validatePassword(req: Request, res: Response): Promise<void> {
        throw new Error("STUB");
    }

    async validateToken(
        req: Request<unknown, unknown, unknown, IValidateQuery>,
        res: Response<TokenUserSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async changePassword(
        req: Request<unknown, unknown, IChangePasswordBody, unknown>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    private async logout(req: SessionRequest<any, any, any, any>) {
        throw new Error("STUB");
    }
}

export default ResetPasswordController;
