import type { Request, Response } from 'express';
import Controller from '../../../routes/controller.js';
import type { IUnleashConfig } from '../../../types/option.js';
import type { IFlagResolver } from '../../../types/index.js';
import type ClientMetricsServiceV2 from './metrics-service-v2.js';
import { NONE } from '../../../types/permissions.js';
import { createResponseSchema } from '../../../openapi/util/create-response-schema.js';
import type { OpenApiService } from '../../../services/openapi-service.js';
import { serializeDates } from '../../../types/serialize-dates.js';
import {
    type FeatureUsageSchema,
    featureUsageSchema,
} from '../../../openapi/spec/feature-usage-schema.js';
import {
    featureMetricsSchema,
    type FeatureMetricsSchema,
} from '../../../openapi/spec/feature-metrics-schema.js';
import { getStandardResponses } from '../../../openapi/index.js';
import type { IUnleashServices } from '../../../services/index.js';

interface IName {
    name: string;
}

interface IHoursBack {
    hoursBack: number;
}

class ClientMetricsController extends Controller {
    private metrics: ClientMetricsServiceV2;

    private openApiService: OpenApiService;

    private flagResolver: Pick<IFlagResolver, 'isEnabled'>;

    private static HOURS_BACK_MIN = 1;

    private static HOURS_BACK_MAX = 48;

    private static HOURS_BACK_MAX_V2 = 24 * 91; // 91 days

    constructor(
        config: IUnleashConfig,
        {
            clientMetricsServiceV2,
            openApiService,
        }: Pick<IUnleashServices, 'clientMetricsServiceV2' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async getRawToggleMetrics(
        req: Request<any, IName, IHoursBack, any>,
        res: Response<FeatureMetricsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getToggleMetricsSummary(
        req: Request<IName>,
        res: Response<FeatureUsageSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    private parseHoursBackQueryParam(param: unknown): number | undefined {
        throw new Error("STUB");
    }
}

export default ClientMetricsController;
