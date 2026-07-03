import EventEmitter from 'events';
import type { Segment } from 'unleash-client/lib/strategy/strategy.js';
import type { FeatureInterface } from 'unleash-client/lib/feature.js';
import type { IApiUser } from '../../types/api-user.js';
import type {
    IFeatureToggleClient,
    ISegmentReadModel,
    IUnleashConfig,
} from '../../types/index.js';
import {
    mapFeatureForClient,
    mapSegmentsForClient,
} from '../playground/offline-unleash-client.js';
import { ALL_ENVS, DEFAULT_ENV } from '../../util/constants.js';
import type { Logger } from '../../logger.js';
import { UPDATE_REVISION } from '../feature-toggle/configuration-revision-service.js';
import type { IClientFeatureToggleReadModel } from './client-feature-toggle-read-model-type.js';

type Config = Pick<IUnleashConfig, 'getLogger' | 'flagResolver' | 'eventBus'>;

type FrontendApiFeatureCache = Record<string, Record<string, FeatureInterface>>;

export type GlobalFrontendApiCacheState = 'starting' | 'ready' | 'updated';

export class GlobalFrontendApiCache extends EventEmitter {
    private readonly logger: Logger;

    private readonly clientFeatureToggleReadModel: IClientFeatureToggleReadModel;

    private readonly segmentReadModel: ISegmentReadModel;

    private readonly configurationRevisionService: EventEmitter;

    private featuresByEnvironment: FrontendApiFeatureCache = {};

    private segments: Segment[] = [];

    private status: GlobalFrontendApiCacheState = 'starting';

    public readyPromise: Promise<void>;

    constructor(
        config: Config,
        segmentReadModel: ISegmentReadModel,
        clientFeatureToggleReadModel: IClientFeatureToggleReadModel,
        configurationRevisionService: EventEmitter,
    ) {
        throw new Error("STUB");
    }

    isReady(): boolean {
        throw new Error("STUB");
    }

    getSegment(id: number): Segment | undefined {
        return this.segments.find((segment) => { throw new Error("STUB"); });
    }

    getToggle(name: string, token: IApiUser): FeatureInterface {
        const features = this.getTogglesByEnvironment(
            this.environmentNameForToken(token),
        );
        return features[name];
    }

    getToggles(token: IApiUser): FeatureInterface[] {
        const features = this.getTogglesByEnvironment(
            this.environmentNameForToken(token),
        );
        return this.filterTogglesByProjects(features, token.projects);
    }

    private filterTogglesByProjects(
        features: Record<string, FeatureInterface>,
        projects: string[],
    ): FeatureInterface[] {
        if (projects.includes('*')) {
            return Object.values(features);
        }
        return Object.values(features).filter(
            (feature) => { throw new Error("STUB"); },
        );
    }

    private getTogglesByEnvironment(
        environment: string,
    ): Record<string, FeatureInterface> {
        const features = this.featuresByEnvironment[environment];

        if (features == null) return {};

        return features;
    }

    // TODO: fetch only relevant projects/environments based on tokens
    public async refreshData() {
        throw new Error("STUB");
    }

    private async getAllFeatures(): Promise<FrontendApiFeatureCache> {
        throw new Error("STUB");
    }

    private async getAllSegments(): Promise<Segment[]> {
        throw new Error("STUB");
    }

    private async onUpdateRevisionEvent() {
        throw new Error("STUB");
    }

    private environmentNameForToken(token: IApiUser): string {
        if (token.environment === ALL_ENVS) {
            return DEFAULT_ENV;
        }
        return token.environment;
    }

    private mapFeatures(
        features: Record<string, Record<string, IFeatureToggleClient>>,
    ): FrontendApiFeatureCache {
        throw new Error("STUB");
    }
}
