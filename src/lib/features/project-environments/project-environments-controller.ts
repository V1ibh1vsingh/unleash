import type { Response } from 'express';
import Controller from '../../routes/controller.js';
import {
    type IUnleashConfig,
    serializeDates,
    UPDATE_PROJECT,
    PROJECT_DEFAULT_STRATEGY_WRITE,
} from '../../types/index.js';
import type { Logger } from '../../logger.js';
import type EnvironmentService from './environment-service.js';
import {
    createFeatureStrategySchema,
    type CreateFeatureStrategySchema,
    createRequestSchema,
    createResponseSchema,
    emptyResponse,
    getStandardResponses,
    type ProjectEnvironmentSchema,
} from '../../openapi/index.js';
import type {
    IUnleashServices,
    OpenApiService,
    ProjectService,
} from '../../services/index.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import type { WithTransactional } from '../../db/transaction.js';

const PREFIX = '/:projectId/environments';

interface IProjectEnvironmentParams {
    projectId: string;
    environment: string;
}

export default class ProjectEnvironmentsController extends Controller {
    private logger: Logger;

    private environmentService: WithTransactional<EnvironmentService>;

    private openApiService: OpenApiService;

    private projectService: ProjectService;

    constructor(
        config: IUnleashConfig,
        {
            transactionalEnvironmentService,
            openApiService,
            projectService,
        }: Pick<
            IUnleashServices,
            | 'transactionalEnvironmentService'
            | 'openApiService'
            | 'projectService'
        >,
    ) {
        throw new Error("STUB");
    }

    async addEnvironmentToProject(
        req: IAuthRequest<
            Omit<IProjectEnvironmentParams, 'environment'>,
            void,
            ProjectEnvironmentSchema
        >,
        res: Response,
    ): Promise<void> {
        const { projectId } = req.params;
        const { environment } = req.body;
        await this.projectService.getProject(projectId); // Validates that the project exists

        await this.environmentService.transactional((service) =>
            { throw new Error("STUB"); },
        );

        res.status(200).end();
    }

    async removeEnvironmentFromProject(
        req: IAuthRequest<IProjectEnvironmentParams>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateDefaultStrategyForProjectEnvironment(
        req: IAuthRequest<
            IProjectEnvironmentParams,
            CreateFeatureStrategySchema
        >,
        res: Response<CreateFeatureStrategySchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
