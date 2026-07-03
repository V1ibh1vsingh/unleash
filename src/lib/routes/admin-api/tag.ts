import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type TagService from '../../services/tag-service.js';

import Controller from '../controller.js';

import { NONE, UPDATE_FEATURE } from '../../types/permissions.js';
import { extractUsername } from '../../util/extract-user.js';
import type { IAuthRequest } from '../unleash-types.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import {
    createResponseSchema,
    resourceCreatedResponseSchema,
} from '../../openapi/util/create-response-schema.js';
import { tagsSchema, type TagsSchema } from '../../openapi/spec/tags-schema.js';
import type { TagSchema } from '../../openapi/spec/tag-schema.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import {
    tagWithVersionSchema,
    type TagWithVersionSchema,
} from '../../openapi/spec/tag-with-version-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import type { IFlagResolver } from '../../types/index.js';
import type { CreateTagSchema } from '../../openapi/index.js';

const version = 1;

class TagController extends Controller {
    private tagService: TagService;

    private openApiService: OpenApiService;

    private flagResolver: IFlagResolver;

    constructor(
        config: IUnleashConfig,
        {
            tagService,
            openApiService,
        }: Pick<IUnleashServices, 'tagService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async getTags(_req: Request, res: Response<TagsSchema>): Promise<void> {
        throw new Error("STUB");
    }

    async getTagsByType(
        req: Request,
        res: Response<TagsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getTag(
        req: Request<TagSchema>,
        res: Response<TagWithVersionSchema>,
    ): Promise<void> {
        const { type, value } = req.params;
        const tag = await this.tagService.getTag({ type, value });
        this.openApiService.respondWithValidation<TagWithVersionSchema>(
            200,
            res,
            tagWithVersionSchema.$id,
            { version, tag },
        );
    }

    async createTag(
        req: IAuthRequest<unknown, unknown, CreateTagSchema>,
        res: Response<TagWithVersionSchema>,
    ): Promise<void> {
        const _userName = extractUsername(req);
        const tag = await this.tagService.createTag(req.body, req.audit);
        res.status(201)
            .header('location', `tags/${tag.type}/${tag.value}`)
            .json({ version, tag })
            .end();
    }

    async deleteTag(
        req: IAuthRequest<TagSchema>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
export default TagController;
