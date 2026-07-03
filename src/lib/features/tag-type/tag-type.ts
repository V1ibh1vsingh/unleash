import type { Request, Response } from 'express';
import Controller from '../../routes/controller.js';

import {
    CREATE_TAG_TYPE,
    DELETE_TAG_TYPE,
    NONE,
    UPDATE_TAG_TYPE,
} from '../../types/permissions.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type TagTypeService from './tag-type-service.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import {
    createResponseSchema,
    resourceCreatedResponseSchema,
} from '../../openapi/util/create-response-schema.js';
import type { TagTypesSchema } from '../../openapi/spec/tag-types-schema.js';
import {
    validateTagTypeSchema,
    type ValidateTagTypeSchema,
} from '../../openapi/spec/validate-tag-type-schema.js';
import type { TagTypeSchema } from '../../openapi/spec/tag-type-schema.js';
import type { UpdateTagTypeSchema } from '../../openapi/spec/update-tag-type-schema.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import type { WithTransactional } from '../../db/transaction.js';

const version = 1;

class TagTypeController extends Controller {
    private tagTypeService: WithTransactional<TagTypeService>;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            transactionalTagTypeService,
            openApiService,
        }: Pick<
            IUnleashServices,
            'transactionalTagTypeService' | 'openApiService'
        >,
    ) {
        throw new Error("STUB");
    }

    async getTagTypes(
        _req: Request,
        res: Response<TagTypesSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validateTagType(
        req: Request<unknown, unknown, TagTypeSchema>,
        res: Response<ValidateTagTypeSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async createTagType(
        req: IAuthRequest<unknown, unknown, TagTypeSchema>,
        res: Response,
    ): Promise<void> {
        const tagType = await this.tagTypeService.transactional((service) =>
            { throw new Error("STUB"); },
        );
        res.status(201)
            .header('location', `tag-types/${tagType.name}`)
            .json(tagType);
    }

    async updateTagType(
        req: IAuthRequest<{ name: string }, unknown, UpdateTagTypeSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getTagType(req: Request, res: Response): Promise<void> {
        throw new Error("STUB");
    }

    async deleteTagType(req: IAuthRequest, res: Response): Promise<void> {
        throw new Error("STUB");
    }
}

export default TagTypeController;
