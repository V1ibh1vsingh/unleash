import type { Request, Response } from 'express';
import Controller from '../../controller.js';
import type { IUnleashServices } from '../../../services/index.js';
import type { IUnleashConfig } from '../../../types/option.js';
import type ProjectHealthService from '../../../services/project-health-service.js';
import type { Logger } from '../../../logger.js';
import type { IProjectParam } from '../../../types/model.js';
import { NONE } from '../../../types/permissions.js';
import type { OpenApiService } from '../../../services/openapi-service.js';
import { createResponseSchema } from '../../../openapi/util/create-response-schema.js';
import { getStandardResponses } from '../../../openapi/util/standard-responses.js';
import { serializeDates } from '../../../types/serialize-dates.js';
import {
    healthReportSchema,
    type HealthReportSchema,
} from '../../../openapi/spec/health-report-schema.js';

export default class ProjectHealthReport extends Controller {
    private projectHealthService: ProjectHealthService;

    private openApiService: OpenApiService;

    private logger: Logger;

    constructor(
        config: IUnleashConfig,
        {
            projectHealthService,
            openApiService,
        }: Pick<IUnleashServices, 'projectHealthService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async getProjectHealthReport(
        req: Request<IProjectParam>,
        res: Response<HealthReportSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
