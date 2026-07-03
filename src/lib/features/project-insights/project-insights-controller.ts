import type { Response } from 'express';
import Controller from '../../routes/controller.js';
import {
    type IFlagResolver,
    type IProjectParam,
    type IUnleashConfig,
    NONE,
    serializeDates,
} from '../../types/index.js';
import type { ProjectInsightsService } from './project-insights-service.js';
import {
    createResponseSchema,
    projectInsightsSchema,
    type ProjectInsightsSchema,
} from '../../openapi/index.js';
import { getStandardResponses } from '../../openapi/util/standard-responses.js';
import type { IUnleashServices, OpenApiService } from '../../services/index.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';

export default class ProjectInsightsController extends Controller {
    private projectInsightsService: ProjectInsightsService;

    private openApiService: OpenApiService;

    private flagResolver: IFlagResolver;

    constructor(config: IUnleashConfig, services: IUnleashServices) {
        throw new Error("STUB");
    }

    async getProjectInsights(
        req: IAuthRequest<IProjectParam, unknown, unknown, unknown>,
        res: Response<ProjectInsightsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
