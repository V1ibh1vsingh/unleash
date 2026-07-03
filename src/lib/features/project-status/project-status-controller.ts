import type { Response } from 'express';
import Controller from '../../routes/controller.js';
import {
    type IFlagResolver,
    type IProjectParam,
    type IUnleashConfig,
    NONE,
    serializeDates,
} from '../../types/index.js';

import { getStandardResponses } from '../../openapi/util/standard-responses.js';
import type { OpenApiService, IUnleashServices } from '../../services/index.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import {
    createResponseSchema,
    projectStatusSchema,
    type ProjectStatusSchema,
} from '../../openapi/index.js';
import type { ProjectStatusService } from './project-status-service.js';

export default class ProjectStatusController extends Controller {
    private projectStatusService: ProjectStatusService;

    private openApiService: OpenApiService;

    private flagResolver: IFlagResolver;

    constructor(config: IUnleashConfig, services: IUnleashServices) {
        throw new Error("STUB");
    }

    async getProjectStatus(
        req: IAuthRequest<IProjectParam, unknown, unknown, unknown>,
        res: Response<ProjectStatusSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
