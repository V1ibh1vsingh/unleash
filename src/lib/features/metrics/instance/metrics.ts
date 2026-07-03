import type { Response } from 'express';
import { extractClientIp } from '../../../util/extract-user.js';
import Controller from '../../../routes/controller.js';
import type { IFlagResolver, IUnleashConfig } from '../../../types/index.js';
import type ClientInstanceService from './instance-service.js';
import type { Logger } from '../../../logger.js';
import type { IAuthRequest } from '../../../routes/unleash-types.js';
import type ClientMetricsServiceV2 from '../client-metrics/metrics-service-v2.js';
import { NONE } from '../../../types/permissions.js';
import type {
    IUnleashServices,
    OpenApiService,
} from '../../../services/index.js';
import { createRequestSchema } from '../../../openapi/util/create-request-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../../openapi/util/standard-responses.js';
import rateLimit from 'express-rate-limit';
import { minutesToMilliseconds } from 'date-fns';
import type { BulkMetricsSchema } from '../../../openapi/spec/bulk-metrics-schema.js';
import {
    clientMetricsEnvBulkSchema,
    customMetricsSchema,
} from '../shared/schema.js';
import type { IClientMetricsEnv } from '../client-metrics/client-metrics-store-v2-type.js';
import type { CustomMetricsSchema } from '../../../openapi/spec/custom-metrics-schema.js';
import type { StoredCustomMetric } from '../custom/custom-metrics-store.js';
import type { CustomMetricsService } from '../custom/custom-metrics-service.js';
import type {
    Metric,
    MetricsTranslator,
} from '../impact/metrics-translator.js';
import type { ClientMetricsSchema } from '../../../server-impl.js';

export default class ClientMetricsController extends Controller {
    logger: Logger;

    clientInstanceService: ClientInstanceService;

    openApiService: OpenApiService;

    metricsV2: ClientMetricsServiceV2;

    customMetricsService: CustomMetricsService;

    metricsTranslator: MetricsTranslator;

    flagResolver: IFlagResolver;

    constructor(
        {
            clientInstanceService,
            clientMetricsServiceV2,
            openApiService,
            customMetricsService,
        }: Pick<
            IUnleashServices,
            | 'clientInstanceService'
            | 'clientMetricsServiceV2'
            | 'openApiService'
            | 'customMetricsService'
        >,
        config: IUnleashConfig,
    ) {
        throw new Error("STUB");
    }

    private async processPromiseResults(
        promises: Promise<void>[],
    ): Promise<boolean> {
        throw new Error("STUB");
    }

    async registerMetrics(
        req: IAuthRequest<void, void, ClientMetricsSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async customMetrics(
        req: IAuthRequest<void, void, CustomMetricsSchema>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async bulkMetrics(
        req: IAuthRequest<void, void, BulkMetricsSchema>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
