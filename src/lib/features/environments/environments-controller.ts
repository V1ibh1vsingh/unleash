import type { Request, Response } from 'express';
import Controller from '../../routes/controller.js';
import type { IUnleashServices } from '../../services/index.js';
import type { IUnleashConfig } from '../../types/option.js';
import type EnvironmentService from '../project-environments/environment-service.js';
import { ADMIN, NONE } from '../../types/permissions.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import {
    environmentsSchema,
    type EnvironmentsSchema,
} from '../../openapi/spec/environments-schema.js';
import {
    environmentSchema,
    type EnvironmentSchema,
} from '../../openapi/spec/environment-schema.js';
import type { SortOrderSchema } from '../../openapi/spec/sort-order-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import {
    environmentsProjectSchema,
    type EnvironmentsProjectSchema,
} from '../../openapi/spec/environments-project-schema.js';

interface EnvironmentParam {
    name: string;
}

interface ProjectParam {
    projectId: string;
}

export class EnvironmentsController extends Controller {
    private openApiService: OpenApiService;

    private service: EnvironmentService;

    constructor(
        config: IUnleashConfig,
        {
            environmentService,
            openApiService,
        }: Pick<IUnleashServices, 'environmentService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async getAllEnvironments(
        _req: Request,
        res: Response<EnvironmentsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateSortOrder(
        req: Request<unknown, unknown, SortOrderSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async toggleEnvironmentOn(
        req: Request<EnvironmentParam>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async toggleEnvironmentOff(
        req: Request<EnvironmentParam>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getEnvironment(
        req: Request<EnvironmentParam>,
        res: Response<EnvironmentSchema>,
    ): Promise<void> {
        this.openApiService.respondWithValidation(
            200,
            res,
            environmentSchema.$id,
            await this.service.get(req.params.name),
        );
    }

    async getProjectEnvironments(
        req: Request<ProjectParam>,
        res: Response<EnvironmentsProjectSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
