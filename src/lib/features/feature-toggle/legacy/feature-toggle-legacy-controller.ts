/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Request, Response } from 'express';
import Controller from '../../../routes/controller.js';
import { NONE, UPDATE_FEATURE } from '../../../types/permissions.js';
import type { IUnleashConfig } from '../../../types/option.js';
import type { FeatureToggleService } from '../feature-toggle-service.js';
import { querySchema } from '../../../schema/feature-schema.js';
import type { IFeatureToggleQuery } from '../../../types/model.js';
import type FeatureTagService from '../../../services/feature-tag-service.js';
import type { IAuthRequest } from '../../../routes/unleash-types.js';
import type { TagSchema } from '../../../openapi/spec/tag-schema.js';
import type { TagsSchema } from '../../../openapi/spec/tags-schema.js';
import type { IUnleashServices } from '../../../services/index.js';
import { createRequestSchema } from '../../../openapi/util/create-request-schema.js';
import {
    createResponseSchema,
    resourceCreatedResponseSchema,
} from '../../../openapi/util/create-response-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../../openapi/util/standard-responses.js';
import type { UpdateTagsSchema } from '../../../openapi/spec/update-tags-schema.js';
import type { ValidateFeatureSchema } from '../../../openapi/spec/validate-feature-schema.js';

const version = 1;

class FeatureController extends Controller {
    private tagService: FeatureTagService;

    private service: FeatureToggleService;

    constructor(
        config: IUnleashConfig,
        {
            featureTagService,
            featureToggleService,
            openApiService,
        }: Pick<
            IUnleashServices,
            'featureTagService' | 'featureToggleService' | 'openApiService'
        >,
    ) {
        throw new Error("STUB");
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    paramToArray(param: any) {
        if (!param) {
            return param;
        }
        return Array.isArray(param) ? param : [param];
    }

    async prepQuery({
        tag,
        project,
        namePrefix,
    }: any): Promise<IFeatureToggleQuery> {
        if (!tag && !project && !namePrefix) {
            return {};
        }
        const tagQuery = this.paramToArray(tag);
        const projectQuery = this.paramToArray(project);
        const query = await querySchema.validateAsync({
            tag: tagQuery,
            project: projectQuery,
            namePrefix,
        });
        if (query.tag) {
            query.tag = query.tag.map((q) => { throw new Error("STUB"); });
        }
        return query;
    }

    async listTags(
        req: Request<{ featureName: string }, any, any, any>,
        res: Response<TagsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async addTag(
        req: IAuthRequest<
            { featureName: string },
            Response<TagSchema>,
            TagSchema,
            any
        >,
        res: Response<TagSchema>,
    ): Promise<void> {
        const { featureName } = req.params;
        const tag = await this.tagService.addTag(
            featureName,
            req.body,
            req.audit,
        );
        res.status(201).header('location', `${featureName}/tags`).json(tag);
    }

    async updateTags(
        req: IAuthRequest<
            { featureName: string },
            Response<TagsSchema>,
            UpdateTagsSchema,
            any
        >,
        res: Response<TagsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    // TODO
    async removeTag(
        req: IAuthRequest<{ featureName: string; type: string; value: string }>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validate(
        req: Request<any, any, ValidateFeatureSchema, any>,
        res: Response<void>,
    ): Promise<void> {
        const { name, projectId } = req.body;

        await this.service.validateName(name);
        await this.service.validateFeatureFlagNameAgainstPattern(
            name,
            projectId ?? undefined,
        );
        res.status(200).end();
    }
}
export default FeatureController;
