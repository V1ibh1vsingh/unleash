import type { Response } from 'express';
import Controller from '../controller.js';
import type {
    FavoritesService,
    IUnleashServices,
    OpenApiService,
} from '../../services/index.js';
import type { Logger } from '../../logger.js';
import { type IUnleashConfig, NONE } from '../../types/index.js';
import { emptyResponse, getStandardResponses } from '../../openapi/index.js';
import type { IAuthRequest } from '../unleash-types.js';

export default class FavoritesController extends Controller {
    private favoritesService: FavoritesService;

    private logger: Logger;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            favoritesService,
            openApiService,
        }: Pick<IUnleashServices, 'favoritesService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    async addFavoriteFeature(
        req: IAuthRequest<{ featureName: string }>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async removeFavoriteFeature(
        req: IAuthRequest<{ featureName: string }>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async addFavoriteProject(
        req: IAuthRequest<{ projectId: string }>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async removeFavoriteProject(
        req: IAuthRequest<{ projectId: string }>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
