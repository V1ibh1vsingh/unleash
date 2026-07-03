import {
    type IUnleashConfig,
    NONE,
    serializeDates,
} from '../../types/index.js';
import type { IUnleashServices, OpenApiService } from '../../services/index.js';
import {
    createResponseSchema,
    getStandardResponses,
    personalDashboardSchema,
    type PersonalDashboardSchema,
} from '../../openapi/index.js';
import Controller from '../../routes/controller.js';
import type { Response } from 'express';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import type { PersonalDashboardService } from './personal-dashboard-service.js';
import {
    personalDashboardProjectDetailsSchema,
    type PersonalDashboardProjectDetailsSchema,
} from '../../openapi/spec/personal-dashboard-project-details-schema.js';

export default class PersonalDashboardController extends Controller {
    private openApiService: OpenApiService;

    private personalDashboardService: PersonalDashboardService;

    constructor(
        config: IUnleashConfig,
        {
            openApiService,
            personalDashboardService,
        }: Pick<
            IUnleashServices,
            'openApiService' | 'personalDashboardService'
        >,
    ) {
        throw new Error("STUB");
    }

    async getPersonalDashboard(
        req: IAuthRequest,
        res: Response<PersonalDashboardSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getPersonalDashboardProjectDetails(
        req: IAuthRequest<{ projectId: string }>,
        res: Response<PersonalDashboardProjectDetailsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
