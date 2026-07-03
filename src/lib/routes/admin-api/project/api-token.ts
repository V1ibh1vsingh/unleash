import {
    type ApiTokenSchema,
    apiTokenSchema,
    type ApiTokensSchema,
    apiTokensSchema,
    createRequestSchema,
    createResponseSchema,
    emptyResponse,
    resourceCreatedResponseSchema,
} from '../../../openapi/index.js';
import { getStandardResponses } from '../../../openapi/util/standard-responses.js';
import type { IUser } from '../../../types/user.js';
import {
    ADMIN,
    CREATE_PROJECT_API_TOKEN,
    DELETE_PROJECT_API_TOKEN,
    type IUnleashConfig,
    READ_PROJECT_API_TOKEN,
    serializeDates,
} from '../../../types/index.js';
import { ApiTokenType, type IApiToken } from '../../../types/model.js';
import type {
    AccessService,
    ApiTokenService,
    OpenApiService,
    ProjectService,
    FrontendApiService,
    IUnleashServices,
} from '../../../services/index.js';
import type { IAuthRequest } from '../../unleash-types.js';
import Controller from '../../controller.js';
import type { Response } from 'express';
import { timingSafeEqual } from 'crypto';
import { OperationDeniedError } from '../../../error/index.js';
import type { CreateProjectApiTokenSchema } from '../../../openapi/spec/create-project-api-token-schema.js';
import { createProjectApiToken } from '../../../schema/create-project-api-token-schema.js';

interface ProjectTokenParam {
    token: string;
    projectId: string;
}

const PATH = '/:projectId/api-tokens';
const PATH_TOKEN = `${PATH}/:token`;
export class ProjectApiTokenController extends Controller {
    private apiTokenService: ApiTokenService;

    private accessService: AccessService;

    private frontendApiService: FrontendApiService;

    private openApiService: OpenApiService;

    private projectService: ProjectService;

    constructor(
        config: IUnleashConfig,
        {
            apiTokenService,
            accessService,
            frontendApiService,
            openApiService,
            projectService,
        }: Pick<
            IUnleashServices,
            | 'apiTokenService'
            | 'accessService'
            | 'frontendApiService'
            | 'openApiService'
            | 'projectService'
        >,
    ) {
        throw new Error("STUB");
    }

    async getProjectApiTokens(
        req: IAuthRequest,
        res: Response<ApiTokensSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async createProjectApiToken(
        req: IAuthRequest<{ projectId: string }, CreateProjectApiTokenSchema>,
        res: Response<ApiTokenSchema>,
    ): Promise<any> {
        throw new Error("STUB");
    }

    async deleteProjectApiToken(
        req: IAuthRequest<ProjectTokenParam>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    private tokenEquals(token1: string, token2: string) {
        throw new Error("STUB");
    }

    private async accessibleTokens(
        user: IUser,
        project: string,
    ): Promise<IApiToken[]> {
        throw new Error("STUB");
    }
}
