import type { Response } from 'express';
import { extractClientIp } from '../../../util/extract-user.js';
import Controller from '../../../routes/controller.js';
import type { IFlagResolver } from '../../../types/index.js';
import type { IUnleashConfig } from '../../../types/option.js';
import type { Logger } from '../../../logger.js';
import type ClientInstanceService from './instance-service.js';
import type { IAuthRequest, IUser } from '../../../types/index.js';
import ApiUser, { type IApiUser } from '../../../types/api-user.js';
import { ALL } from '../../../types/models/api-token.js';
import { NONE } from '../../../types/permissions.js';
import type {
    IUnleashServices,
    OpenApiService,
} from '../../../services/index.js';
import { emptyResponse } from '../../../openapi/util/standard-responses.js';
import { createRequestSchema } from '../../../openapi/util/create-request-schema.js';
import type { ClientApplicationSchema } from '../../../openapi/spec/client-application-schema.js';
import rateLimit from 'express-rate-limit';
import { minutesToMilliseconds } from 'date-fns';
import version from '../../../util/version.js';

export default class RegisterController extends Controller {
    logger: Logger;

    clientInstanceService: ClientInstanceService;

    openApiService: OpenApiService;

    flagResolver: IFlagResolver;

    constructor(
        {
            clientInstanceService,
            openApiService,
        }: Pick<IUnleashServices, 'clientInstanceService' | 'openApiService'>,
        config: IUnleashConfig,
    ) {
        throw new Error("STUB");
    }

    private resolveEnvironment(user: IUser | IApiUser) {
        throw new Error("STUB");
    }

    private resolveProject(user: IUser | IApiUser) {
        throw new Error("STUB");
    }

    async registerClientApplication(
        req: IAuthRequest<unknown, void, ClientApplicationSchema>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
