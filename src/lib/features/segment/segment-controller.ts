import type { Request, Response } from 'express';
import Controller from '../../routes/controller.js';

import type { IAuthRequest, IUnleashConfig } from '../../types/index.js';
import {
    type AdminSegmentSchema,
    adminSegmentSchema,
    createRequestSchema,
    createResponseSchema,
    resourceCreatedResponseSchema,
    updateFeatureStrategySchema,
    type UpdateFeatureStrategySegmentsSchema,
    type UpsertSegmentSchema,
} from '../../openapi/index.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import type { ISegmentService } from './segment-service-interface.js';
import type { SegmentStrategiesSchema } from '../../openapi/spec/segment-strategies-schema.js';
import type {
    AccessService,
    IUnleashServices,
    OpenApiService,
} from '../../services/index.js';
import {
    CREATE_SEGMENT,
    DELETE_SEGMENT,
    type IFlagResolver,
    NONE,
    serializeDates,
    UPDATE_FEATURE_STRATEGY,
    UPDATE_PROJECT_SEGMENT,
    UPDATE_SEGMENT,
} from '../../types/index.js';
import {
    segmentsSchema,
    type SegmentsSchema,
} from '../../openapi/spec/segments-schema.js';

import { anonymiseKeys, extractUserIdFromUser } from '../../util/index.js';
import { BadDataError } from '../../error/index.js';

type IUpdateFeatureStrategySegmentsRequest = IAuthRequest<
    {},
    undefined,
    UpdateFeatureStrategySegmentsSchema
>;

export class SegmentsController extends Controller {
    private segmentService: ISegmentService;

    private accessService: AccessService;

    private flagResolver: IFlagResolver;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            segmentService,
            accessService,
            openApiService,
        }: Pick<
            IUnleashServices,
            'segmentService' | 'accessService' | 'openApiService'
        >,
    ) {
        throw new Error("STUB");
    }

    async validate(
        req: Request<unknown, unknown, { name: string }>,
        res: Response,
    ): Promise<void> {
        const { name } = req.body;
        await this.segmentService.validateName(name);
        res.status(204).send();
    }

    async getSegmentsByStrategy(
        req: Request<{ strategyId: string }>,
        res: Response<SegmentsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateFeatureStrategySegments(
        req: IUpdateFeatureStrategySegmentsRequest,
        res: Response<UpdateFeatureStrategySegmentsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getStrategiesBySegment(
        req: IAuthRequest<{ id: number }>,
        res: Response<SegmentStrategiesSchema>,
    ): Promise<void> {
        const id = req.params.id;
        const { user } = req;
        const userId = extractUserIdFromUser(user);
        const strategies = await this.segmentService.getVisibleStrategies(
            id,
            userId,
        );

        const segmentStrategies = strategies.strategies.map((strategy) => { throw new Error("STUB"); });

        const changeRequestStrategies = strategies.changeRequestStrategies.map(
            (strategy) => { throw new Error("STUB"); },
        );

        res.json({
            strategies: segmentStrategies,
            changeRequestStrategies,
        });
    }

    async removeSegment(
        req: IAuthRequest<{ id: number }>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateSegment(
        req: IAuthRequest<{ id: number }>,
        res: Response,
    ): Promise<void> {
        const id = req.params.id;
        const updateRequest: UpsertSegmentSchema = {
            name: req.body.name,
            description: req.body.description,
            project: req.body.project,
            constraints: req.body.constraints,
        };
        await this.segmentService.update(
            id,
            updateRequest,
            req.user,
            req.audit,
        );
        res.status(204).send();
    }

    async getSegment(
        req: IAuthRequest<{ id: number }>,
        res: Response,
    ): Promise<void> {
        const id = req.params.id;
        const userId = extractUserIdFromUser(req.user);
        const segment = await this.segmentService.get(id, userId);

        if (this.flagResolver.isEnabled('anonymiseEventLog')) {
            res.json(anonymiseKeys(segment, ['createdBy']));
        } else {
            res.json(segment);
        }
    }

    async createSegment(
        req: IAuthRequest<any, any, UpsertSegmentSchema>,
        res: Response<AdminSegmentSchema>,
    ): Promise<void> {
        const createRequest = req.body;
        const segment = await this.segmentService.create(
            createRequest,
            req.audit,
        );
        this.openApiService.respondWithValidation(
            201,
            res,
            adminSegmentSchema.$id,
            serializeDates(segment),
            { location: `segments/${segment.id}` },
        );
    }

    async getSegments(
        req: IAuthRequest,
        res: Response<SegmentsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    private async removeFromStrategy(
        strategyId: string,
        segmentIds: number[],
    ): Promise<void> {
        await Promise.all(
            segmentIds.map((id) =>
                { throw new Error("STUB"); },
            ),
        );
    }

    private async addToStrategy(
        strategyId: string,
        segmentIds: number[],
    ): Promise<void> {
        await Promise.all(
            segmentIds.map((id) =>
                { throw new Error("STUB"); },
            ),
        );
    }
}
