import type { Response } from 'express';
import Controller from '../../routes/controller.js';
import {
    type IArchivedQuery,
    type IFlagResolver,
    type IProjectParam,
    type IUnleashConfig,
    NONE,
    serializeDates,
} from '../../types/index.js';
import ProjectFeaturesController from '../feature-toggle/feature-toggle-controller.js';
import ProjectEnvironmentsController from '../project-environments/project-environments-controller.js';
import ProjectHealthReport from '../../routes/admin-api/project/health-report.js';
import type ProjectService from './project-service.js';
import VariantsController from '../../routes/admin-api/project/variants.js';
import {
    createResponseSchema,
    outdatedSdksSchema,
    type OutdatedSdksSchema,
    type ProjectDoraMetricsSchema,
    projectDoraMetricsSchema,
    projectOverviewSchema,
    type ProjectsSchema,
    projectsSchema,
} from '../../openapi/index.js';
import { getStandardResponses } from '../../openapi/util/standard-responses.js';
import type { IUnleashServices, OpenApiService } from '../../services/index.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import { ProjectApiTokenController } from '../../routes/admin-api/project/api-token.js';
import ProjectArchiveController from '../../routes/admin-api/project/project-archive.js';
import type { Db } from '../../db/db.js';
import DependentFeaturesController from '../dependent-features/dependent-features-controller.js';
import type { ProjectOverviewSchema } from '../../openapi/spec/project-overview-schema.js';
import {
    projectApplicationsSchema,
    type ProjectApplicationsSchema,
} from '../../openapi/spec/project-applications-schema.js';
import { projectApplicationsQueryParameters } from '../../openapi/spec/project-applications-query-parameters.js';
import { normalizeQueryParams } from '../feature-search/search-utils.js';
import ProjectInsightsController from '../project-insights/project-insights-controller.js';
import FeatureLifecycleController from '../feature-lifecycle/feature-lifecycle-controller.js';
import type ClientInstanceService from '../metrics/instance/instance-service.js';
import {
    projectFlagCreatorsSchema,
    type ProjectFlagCreatorsSchema,
} from '../../openapi/spec/project-flag-creators-schema.js';
import ProjectStatusController from '../project-status/project-status-controller.js';
import FeatureLinkController from '../feature-links/feature-link-controller.js';
import { ContextController } from '../context/context.js';

export default class ProjectController extends Controller {
    private projectService: ProjectService;

    private openApiService: OpenApiService;

    private clientInstanceService: ClientInstanceService;

    private flagResolver: IFlagResolver;

    constructor(config: IUnleashConfig, services: IUnleashServices, _db: Db) {
        throw new Error("STUB");
    }

    async getProjects(
        req: IAuthRequest,
        res: Response<ProjectsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getProjectOverview(
        req: IAuthRequest<IProjectParam, unknown, unknown, IArchivedQuery>,
        res: Response<ProjectOverviewSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    /** @deprecated use projectInsights instead */
    async getProjectDora(
        req: IAuthRequest,
        res: Response<ProjectDoraMetricsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getProjectApplications(
        req: IAuthRequest,
        res: Response<ProjectApplicationsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getProjectFlagCreators(
        req: IAuthRequest<IProjectParam>,
        res: Response<ProjectFlagCreatorsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getOutdatedProjectSdks(
        req: IAuthRequest<IProjectParam>,
        res: Response<OutdatedSdksSchema>,
    ) {
        throw new Error("STUB");
    }
}
