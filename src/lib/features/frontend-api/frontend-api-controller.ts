import type { Request, Response } from 'express';
import { extractClientIp } from '../../util/extract-user.js';
import Controller from '../../routes/controller.js';
import {
    type IFlagResolver,
    type IUnleashConfig,
    NONE,
} from '../../types/index.js';
import type { Logger } from '../../logger.js';
import type { IApiUser } from '../../types/api-user.js';
import {
    type ClientMetricsSchema,
    createRequestSchema,
    createResponseSchema,
    emptyResponse,
    type FrontendApiClientSchema,
    frontendApiFeaturesSchema,
    type FrontendApiFeaturesSchema,
    getStandardResponses,
} from '../../openapi/index.js';
import type { Context } from 'unleash-client';
import { enrichContextWithIp } from './index.js';
import NotImplementedError from '../../error/not-implemented-error.js';
import rateLimit from 'express-rate-limit';
import { minutesToMilliseconds } from 'date-fns';
import metricsHelper from '../../util/metrics-helper.js';
import { FUNCTION_TIME } from '../../metric-events.js';
import type { IUnleashServices } from '../../services/index.js';

interface ApiUserRequest<
    PARAM = any,
    ResBody = any,
    ReqBody = any,
    ReqQuery = any,
> extends Request<PARAM, ResBody, ReqBody, ReqQuery> {
    user: IApiUser;
}

type Services = Pick<
    IUnleashServices,
    | 'settingService'
    | 'frontendApiService'
    | 'openApiService'
    | 'clientInstanceService'
>;

export default class FrontendAPIController extends Controller {
    private readonly logger: Logger;

    private services: Services;

    private timer: Function;

    private flagResolver: IFlagResolver;

    constructor(config: IUnleashConfig, services: Services) {
        throw new Error("STUB");
    }

    private static async endpointNotImplemented(
        _req: ApiUserRequest,
        res: Response,
    ) {
        throw new Error("STUB");
    }

    private async getFrontendApiFeatures(
        req: ApiUserRequest,
        res: Response<FrontendApiFeaturesSchema>,
    ) {
        throw new Error("STUB");
    }

    private async registerFrontendApiMetrics(
        req: ApiUserRequest<unknown, unknown, ClientMetricsSchema>,
        res: Response,
    ) {
        throw new Error("STUB");
    }

    private async registerFrontendApiClient(
        _req: ApiUserRequest<unknown, unknown, FrontendApiClientSchema>,
        res: Response<string>,
    ) {
        throw new Error("STUB");
    }

    private static createContext(req: ApiUserRequest): Context {
        const { query, body } = req;

        const bodyContext = body.context ?? {};
        const contextData = req.method === 'POST' ? bodyContext : query;

        return enrichContextWithIp(contextData, extractClientIp(req));
    }
}
