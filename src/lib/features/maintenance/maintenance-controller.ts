import {
    ADMIN,
    UPDATE_MAINTENANCE_MODE,
    type IUnleashConfig,
} from '../../types/index.js';
import type { Request, Response } from 'express';
import Controller from '../../routes/controller.js';
import type { Logger } from '../../logger.js';
import {
    createRequestSchema,
    createResponseSchema,
    emptyResponse,
    getStandardResponses,
} from '../../openapi/index.js';
import type { IUnleashServices, OpenApiService } from '../../services/index.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import {
    type MaintenanceSchema,
    maintenanceSchema,
} from '../../openapi/spec/maintenance-schema.js';
import type MaintenanceService from '../../features/maintenance/maintenance-service.js';
import type { ToggleMaintenanceSchema } from '../../openapi/spec/toggle-maintenance-schema.js';

export default class MaintenanceController extends Controller {
    private maintenanceService: MaintenanceService;

    private openApiService: OpenApiService;

    private logger: Logger;

    constructor(
        config: IUnleashConfig,
        {
            maintenanceService,
            openApiService,
        }: Pick<IUnleashServices, 'maintenanceService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async toggleMaintenance(
        req: IAuthRequest<unknown, unknown, ToggleMaintenanceSchema>,
        res: Response<MaintenanceSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getMaintenance(_req: Request, res: Response): Promise<void> {
        throw new Error("STUB");
    }
}
