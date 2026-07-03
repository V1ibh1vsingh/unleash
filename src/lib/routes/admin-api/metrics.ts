import type { Request, Response } from 'express';
import Controller from '../controller.js';
import { NONE, UPDATE_APPLICATION } from '../../types/permissions.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type ClientInstanceService from '../../features/metrics/instance/instance-service.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import type { ApplicationSchema } from '../../openapi/spec/application-schema.js';
import type { ApplicationsSchema } from '../../openapi/spec/applications-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import type { CreateApplicationSchema } from '../../openapi/spec/create-application-schema.js';
import type { IAuthRequest } from '../unleash-types.js';
import { extractUserIdFromUser } from '../../util/index.js';
import { type IFlagResolver, serializeDates } from '../../types/index.js';
import {
    type ApplicationOverviewSchema,
    applicationOverviewSchema,
} from '../../openapi/spec/application-overview-schema.js';
import type { OpenApiService } from '../../services/index.js';
import { applicationsQueryParameters } from '../../openapi/spec/applications-query-parameters.js';
import { normalizeQueryParams } from '../../features/feature-search/search-utils.js';
import {
    applicationEnvironmentInstancesSchema,
    type ApplicationEnvironmentInstancesSchema,
} from '../../openapi/spec/application-environment-instances-schema.js';
import {
    outdatedSdksSchema,
    type OutdatedSdksSchema,
} from '../../openapi/spec/outdated-sdks-schema.js';
import UnknownFlagsController from '../../features/metrics/unknown-flags/unknown-flags-controller.js';

class MetricsController extends Controller {
    private clientInstanceService: ClientInstanceService;

    private flagResolver: IFlagResolver;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            clientInstanceService,
            unknownFlagsService,
            openApiService,
        }: Pick<
            IUnleashServices,
            'clientInstanceService' | 'unknownFlagsService' | 'openApiService'
        >,
    ) {
        throw new Error("STUB");
    }

    async deprecated(_req: Request, res: Response): Promise<void> {
        throw new Error("STUB");
    }

    async deleteApplication(
        req: Request<{
            appName: string;
        }>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async createApplication(
        req: Request<
            {
                appName: string;
            },
            unknown,
            CreateApplicationSchema
        >,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getApplications(
        req: IAuthRequest,
        res: Response<ApplicationsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getApplication(
        req: Request<{ appName: string }>,
        res: Response<ApplicationSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getApplicationOverview(
        req: IAuthRequest<{ appName: string }>,
        res: Response<ApplicationOverviewSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getOutdatedSdks(_req: Request, res: Response<OutdatedSdksSchema>) {
        throw new Error("STUB");
    }

    async getApplicationEnvironmentInstances(
        req: Request<{ appName: string; environment: string }>,
        res: Response<ApplicationEnvironmentInstancesSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}

export default MetricsController;
