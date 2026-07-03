import type { IUnleashConfig } from '../types/option.js';
import type {
    IFavoriteProjectsStore,
    IUnleashStores,
} from '../types/stores.js';
import type { IFavoriteFeaturesStore } from '../types/stores/favorite-features.js';
import type { IFavoriteFeature, IFavoriteProject } from '../types/favorites.js';
import {
    FeatureFavoritedEvent,
    FeatureUnfavoritedEvent,
    type IAuditUser,
    ProjectFavoritedEvent,
    ProjectUnfavoritedEvent,
} from '../types/index.js';
import type { IUser } from '../types/user.js';
import type { IFavoriteProjectKey } from '../types/stores/favorite-projects.js';
import type EventService from '../features/events/event-service.js';
import { NotFoundError } from '../error/index.js';

export interface IFavoriteFeatureProps {
    feature: string;
    user: IUser;
}

export interface IFavoriteProjectProps {
    project: string;
    user: IUser;
}

export class FavoritesService {
    private favoriteFeaturesStore: IFavoriteFeaturesStore;

    private favoriteProjectsStore: IFavoriteProjectsStore;

    private eventService: EventService;

    constructor(
        {
            favoriteFeaturesStore,
            favoriteProjectsStore,
        }: Pick<
            IUnleashStores,
            'favoriteFeaturesStore' | 'favoriteProjectsStore'
        >,
        _config: IUnleashConfig,
        eventService: EventService,
    ) {
        this.favoriteFeaturesStore = favoriteFeaturesStore;
        this.favoriteProjectsStore = favoriteProjectsStore;
        this.eventService = eventService;
    }

    async favoriteFeature(
        { feature, user }: IFavoriteFeatureProps,
        auditUser: IAuditUser,
    ): Promise<IFavoriteFeature> {
        throw new Error("STUB");
    }

    async unfavoriteFeature(
        { feature, user }: IFavoriteFeatureProps,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async favoriteProject(
        { project, user }: IFavoriteProjectProps,
        auditUser: IAuditUser,
    ): Promise<IFavoriteProject> {
        throw new Error("STUB");
    }

    async unfavoriteProject(
        { project, user }: IFavoriteProjectProps,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async isFavoriteProject(favorite: IFavoriteProjectKey): Promise<boolean> {
        throw new Error("STUB");
    }
}
