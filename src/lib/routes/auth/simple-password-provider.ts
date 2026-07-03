import type { Response } from 'express';
import { extractClientIp } from '../../util/extract-user.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import type { IUnleashConfig } from '../../types/index.js';
import type UserService from '../../services/user-service.js';
import type { IUnleashServices } from '../../services/index.js';
import { NONE } from '../../types/permissions.js';
import Controller from '../controller.js';
import type { IAuthRequest } from '../unleash-types.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import { userSchema, type UserSchema } from '../../openapi/spec/user-schema.js';
import type { LoginSchema } from '../../openapi/spec/login-schema.js';
import { serializeDates } from '../../types/serialize-dates.js';
import { getStandardResponses } from '../../openapi/index.js';

export class SimplePasswordProvider extends Controller {
    private openApiService: OpenApiService;

    private userService: UserService;

    constructor(
        config: IUnleashConfig,
        {
            userService,
            openApiService,
        }: Pick<IUnleashServices, 'userService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async login(
        req: IAuthRequest<void, void, LoginSchema>,
        res: Response<UserSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
