import type { Response } from 'express';
import Controller from '../../routes/controller.js';
import type {
    FeatureSearchService,
    OpenApiService,
    IUnleashServices,
} from '../../services/index.js';
import {
    type IFeatureSearchOverview,
    type IFlagResolver,
    type IUnleashConfig,
    NONE,
    serializeDates,
} from '../../types/index.js';
import type { Logger } from '../../logger.js';
import {
    createResponseSchema,
    getStandardResponses,
    type SearchFeaturesSchema,
    searchFeaturesSchema,
} from '../../openapi/index.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import {
    type FeatureSearchQueryParameters,
    featureSearchQueryParameters,
} from '../../openapi/spec/feature-search-query-parameters.js';
import { normalizeQueryParams } from './search-utils.js';
import { anonymise, extractUserId } from '../../util/index.js';

type FeatureSearchServices = Pick<
    IUnleashServices,
    'openApiService' | 'featureSearchService'
>;

export default class FeatureSearchController extends Controller {
    private openApiService: OpenApiService;

    private flagResolver: IFlagResolver;

    private featureSearchService: FeatureSearchService;

    private readonly logger: Logger;

    constructor(
        config: IUnleashConfig,
        { openApiService, featureSearchService }: FeatureSearchServices,
    ) {
        throw new Error("STUB");
    }

    maybeAnonymise(
        features: IFeatureSearchOverview[],
    ): IFeatureSearchOverview[] {
        throw new Error("STUB");
    }

    async searchFeatures(
        req: IAuthRequest<any, any, any, FeatureSearchQueryParameters>,
        res: Response<SearchFeaturesSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
