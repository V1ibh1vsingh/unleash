import Controller from '../../routes/controller.js';
import {
    ADMIN,
    type IFlagResolver,
    type IUnleashConfig,
} from '../../types/index.js';
import type { Logger } from '../../logger.js';
import type { InactiveUsersService } from './inactive-users-service.js';
import {
    createRequestSchema,
    createResponseSchema,
    emptyResponse,
    getStandardResponses,
    type IdsSchema,
    type InactiveUserSchema,
    inactiveUsersSchema,
    type InactiveUsersSchema,
} from '../../openapi/index.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import type { Response } from 'express';
import type { IUnleashServices, OpenApiService } from '../../services/index.js';
import { anonymise } from '../../util/index.js';
export class InactiveUsersController extends Controller {
    private readonly logger: Logger;

    private inactiveUsersService: InactiveUsersService;

    private openApiService: OpenApiService;

    private flagResolver: IFlagResolver;

    private readonly userInactivityThresholdInDays: number;
    constructor(
        config: IUnleashConfig,
        {
            inactiveUsersService,
            openApiService,
        }: Pick<IUnleashServices, 'inactiveUsersService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async getInactiveUsers(
        _req: IAuthRequest,
        res: Response<InactiveUsersSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
    anonymiseUsers(users: InactiveUserSchema[]): InactiveUserSchema[] {
        throw new Error("STUB");
    }
    async deleteInactiveUsers(
        req: IAuthRequest<undefined, undefined, IdsSchema>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
