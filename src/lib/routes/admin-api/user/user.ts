import type { Response } from 'express';
import type { IAuthRequest } from '../../unleash-types.js';
import Controller from '../../controller.js';
import type { AccessService } from '../../../services/access-service.js';
import { IAuthType, type IUnleashConfig } from '../../../types/option.js';
import type {
    GroupService,
    IUnleashServices,
} from '../../../services/index.js';
import type UserService from '../../../services/user-service.js';
import type UserFeedbackService from '../../../services/user-feedback-service.js';
import type UserSplashService from '../../../services/user-splash-service.js';
import { ADMIN, NONE } from '../../../types/permissions.js';
import type { OpenApiService } from '../../../services/openapi-service.js';
import { createRequestSchema } from '../../../openapi/util/create-request-schema.js';
import { createResponseSchema } from '../../../openapi/util/create-response-schema.js';
import { meSchema, type MeSchema } from '../../../openapi/spec/me-schema.js';
import { serializeDates } from '../../../types/serialize-dates.js';
import type {
    IRole,
    IUserPermission,
} from '../../../types/stores/access-store.js';
import type { PasswordSchema } from '../../../openapi/spec/password-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../../openapi/util/standard-responses.js';
import {
    profileSchema,
    type ProfileSchema,
} from '../../../openapi/spec/profile-schema.js';
import type ProjectService from '../../../features/project/project-service.js';
import {
    rolesSchema,
    type RolesSchema,
} from '../../../openapi/spec/roles-schema.js';
import type { IFlagResolver } from '../../../types/index.js';
import type { UserSubscriptionsService } from '../../../features/user-subscriptions/user-subscriptions-service.js';
import { BadDataError } from '../../../server-impl.js';
import type { Logger } from '../../../logger.js';

class UserController extends Controller {
    private accessService: AccessService;

    private userService: UserService;

    private groupService: GroupService;

    private userFeedbackService: UserFeedbackService;

    private userSplashService: UserSplashService;

    private openApiService: OpenApiService;

    private projectService: ProjectService;

    private flagResolver: IFlagResolver;

    private userSubscriptionsService: UserSubscriptionsService;

    private readonly logger: Logger;

    constructor(
        config: IUnleashConfig,
        {
            accessService,
            userService,
            groupService,
            userFeedbackService,
            userSplashService,
            openApiService,
            projectService,
            transactionalUserSubscriptionsService,
        }: Pick<
            IUnleashServices,
            | 'accessService'
            | 'userService'
            | 'groupService'
            | 'userFeedbackService'
            | 'userSplashService'
            | 'openApiService'
            | 'projectService'
            | 'transactionalUserSubscriptionsService'
        >,
    ) {
        throw new Error("STUB");
    }

    async getRoles(
        req: IAuthRequest,
        res: Response<RolesSchema>,
    ): Promise<void> {
        const { projectId } = req.query;
        if (projectId) {
            let roles: IRole[];
            if (this.flagResolver.isEnabled('projectRoleAssignment')) {
                roles = await this.accessService.getProjectRoles();
            } else {
                roles = await this.accessService.getAllProjectRolesForUser(
                    req.user.id,
                    projectId,
                );
            }
            this.openApiService.respondWithValidation(
                200,
                res,
                rolesSchema.$id,
                {
                    version: 1,
                    roles,
                },
            );
        } else {
            res.status(400).end();
        }
    }
    async getMe(req: IAuthRequest, res: Response<MeSchema>): Promise<void> {
        throw new Error("STUB");
    }

    async getProfile(
        req: IAuthRequest,
        res: Response<ProfileSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async changeMyPassword(
        req: IAuthRequest<unknown, unknown, PasswordSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
export default UserController;
