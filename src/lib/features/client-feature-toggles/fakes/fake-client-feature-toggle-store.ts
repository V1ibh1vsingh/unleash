import type {
    FeatureToggle,
    IFeatureToggleClient,
    IFeatureToggleQuery,
} from '../../../types/model.js';
import type { IFeatureToggleClientStore } from '../types/client-feature-toggle-store-type.js';

export default class FakeClientFeatureToggleStore
    implements IFeatureToggleClientStore
{
    featureToggles: FeatureToggle[] = [];

    async getFeatures(
        featureQuery?: IFeatureToggleQuery,
        archived: boolean = false,
    ): Promise<IFeatureToggleClient[]> {
        const rows = this.featureToggles.filter((toggle) => {
            throw new Error("STUB");
        });

        const clientRows: IFeatureToggleClient[] = rows.map((t) => { throw new Error("STUB"); });
        return Promise.resolve(clientRows);
    }

    async getClient(
        query?: IFeatureToggleQuery,
    ): Promise<IFeatureToggleClient[]> {
        return this.getFeatures(query);
    }

    async getFrontendApiClient(
        query?: IFeatureToggleQuery,
    ): Promise<IFeatureToggleClient[]> {
        return this.getFeatures(query);
    }

    async getPlayground(
        query?: IFeatureToggleQuery,
    ): Promise<IFeatureToggleClient[]> {
        throw new Error("STUB");
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async createFeature(feature: any): Promise<void> {
        throw new Error("STUB");
    }
}
