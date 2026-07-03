import type { Response } from 'express';
import Controller from '../../../routes/controller.js';
import type { IUnleashConfig } from '../../../types/index.js';
import type { Logger } from '../../../logger.js';
import type { IAuthRequest } from '../../../routes/unleash-types.js';
import { NONE } from '../../../types/permissions.js';
import type {
    IUnleashServices,
    OpenApiService,
} from '../../../services/index.js';
import { emptyResponse } from '../../../openapi/util/standard-responses.js';
import type { CustomMetricsService } from './custom-metrics-service.js';

export default class CustomMetricsController extends Controller {
    logger: Logger;
    openApiService: OpenApiService;
    customMetricsService: CustomMetricsService;

    constructor(
        {
            customMetricsService,
            openApiService,
        }: Pick<IUnleashServices, 'customMetricsService' | 'openApiService'>,
        config: IUnleashConfig,
    ) {
        throw new Error("STUB");
    }

    async getCustomMetrics(_req: IAuthRequest, res: Response): Promise<void> {
        throw new Error("STUB");
    }

    async getPrometheusMetrics(
        _req: IAuthRequest,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
