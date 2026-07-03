import type { Response } from 'express';
import Controller from '../controller.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type UserFeedbackService from '../../services/user-feedback-service.js';
import type { IAuthRequest } from '../unleash-types.js';
import { NONE } from '../../types/permissions.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import type { FeedbackCreateSchema } from '../../openapi/spec/feedback-create-schema.js';
import type { FeedbackUpdateSchema } from '../../openapi/spec/feedback-update-schema.js';
import type { FeedbackResponseSchema } from '../../openapi/spec/feedback-response-schema.js';
import { serializeDates } from '../../types/serialize-dates.js';
import { parseISO } from 'date-fns';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import BadDataError from '../../error/bad-data-error.js';
import {
    feedbackResponseSchema,
    getStandardResponses,
} from '../../openapi/index.js';

class UserFeedbackController extends Controller {
    private userFeedbackService: UserFeedbackService;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            userFeedbackService,
            openApiService,
        }: Pick<IUnleashServices, 'userFeedbackService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    private async createFeedback(
        req: IAuthRequest<unknown, unknown, FeedbackCreateSchema>,
        res: Response<FeedbackResponseSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    private async updateFeedback(
        req: IAuthRequest<{ id: string }, unknown, FeedbackUpdateSchema>,
        res: Response<FeedbackResponseSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
export default UserFeedbackController;
