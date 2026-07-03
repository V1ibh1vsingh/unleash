import type { Request, Response } from 'express';
import type { IConstraintsReadModel } from './constraints-read-model-type.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import { NONE } from '../../types/permissions.js';
import Controller from '../../routes/controller.js';
import type { Logger } from '../../logger.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import {
    type ConstraintSchema,
    getStandardResponses,
} from '../../openapi/index.js';

export default class ConstraintsController extends Controller {
    private constraintsReadModel: IConstraintsReadModel;

    private openApiService: OpenApiService;

    private readonly logger: Logger;

    constructor(
        config: IUnleashConfig,
        {
            constraintsReadModel,
            openApiService,
        }: Pick<IUnleashServices, 'constraintsReadModel' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async validateConstraint(
        req: Request<void, void, ConstraintSchema>,
        res: Response,
    ): Promise<void> {
        await this.constraintsReadModel.validateConstraint(req.body);
        res.status(204).send();
    }
}
