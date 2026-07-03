import type {
    IFeatureToggleStore,
    IFeatureToggleStoreQuery,
} from '../types/feature-toggle-store-type.js';
import NotFoundError from '../../../error/notfound-error.js';
import type {
    FeatureToggle,
    FeatureToggleDTO,
    IFeatureToggleQuery,
    IFeatureTypeCount,
} from '../../../types/model.js';
import type { LastSeenInput } from '../../metrics/last-seen/last-seen-service.js';
import type { FeatureToggleInsert } from '../feature-toggle-store.js';
import type { FeatureConfigurationClient } from '../types/feature-toggle-strategies-store-type.js';
import type { IFeatureProjectUserParams } from '../feature-toggle-controller.js';

export default class FakeFeatureToggleStore implements IFeatureToggleStore {
    features: FeatureToggle[] = [];

    async archive(featureName: string): Promise<FeatureToggle> {
        throw new Error("STUB");
    }

    async batchArchive(featureNames: string[]): Promise<FeatureToggle[]> {
        throw new Error("STUB");
    }

    async batchStale(
        featureNames: string[],
        stale: boolean,
    ): Promise<FeatureToggle[]> {
        throw new Error("STUB");
    }

    async batchDelete(featureNames: string[]): Promise<void> {
        throw new Error("STUB");
    }

    async batchRevive(featureNames: string[]): Promise<FeatureToggle[]> {
        throw new Error("STUB");
    }

    disableAllEnvironmentsForFeatures(_names: string[]): Promise<void> {
        throw new Error("STUB");
    }

    async count(
        query: Partial<IFeatureToggleStoreQuery> = { archived: false },
    ): Promise<number> {
        return this.getAll(query).then((features) => { throw new Error("STUB"); });
    }

    async getAllByNames(names: string[]): Promise<FeatureToggle[]> {
        return this.features.filter((f) => { throw new Error("STUB"); });
    }

    async getProjectId(name: string | undefined): Promise<string | undefined> {
        if (name === undefined) {
            return Promise.resolve(undefined);
        }
        return Promise.resolve(this.get(name).then((f) => { throw new Error("STUB"); }));
    }

    private getFilterQuery(query: Partial<IFeatureToggleStoreQuery>) {
        return (f) => {
            throw new Error("STUB");
        };
    }

    async create(
        project: string,
        data: FeatureToggleInsert,
    ): Promise<FeatureToggle> {
        const inserted: FeatureToggle = { ...data, project };
        this.features.push(inserted);
        return inserted;
    }

    async delete(key: string): Promise<void> {
        this.features.splice(
            this.features.findIndex((f) => { throw new Error("STUB"); }),
            1,
        );
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async exists(key: string): Promise<boolean> {
        return this.features.some((f) => { throw new Error("STUB"); });
    }

    async get(key: string): Promise<FeatureToggle> {
        const feature = this.features.find((f) => { throw new Error("STUB"); });
        if (feature) {
            return feature;
        }
        throw new NotFoundError(`Could not find feature with name ${key}`);
    }

    async getAll(
        query: Partial<IFeatureToggleStoreQuery> = { archived: false },
    ): Promise<FeatureToggle[]> {
        return this.features.filter(this.getFilterQuery(query));
    }

    async getFeatureMetadata(name: string): Promise<FeatureToggle> {
        throw new Error("STUB");
    }

    async getBy(
        query: Partial<IFeatureToggleStoreQuery>,
    ): Promise<FeatureToggle[]> {
        throw new Error("STUB");
    }

    async revive(featureName: string): Promise<FeatureToggle> {
        const revive = this.features.find((f) => { throw new Error("STUB"); });
        if (revive) {
            revive.archived = false;
        }
        return this.update(revive!.project, revive!);
    }

    async getFeatureToggleList(
        _query?: IFeatureToggleQuery,
        _userId?: number,
        archived = false,
    ): Promise<FeatureToggle[]> {
        throw new Error("STUB");
    }

    async getPlaygroundFeatures(
        _query?: IFeatureToggleQuery,
    ): Promise<FeatureConfigurationClient[]> {
        throw new Error("STUB");
    }

    async update(
        project: string,
        data: FeatureToggleDTO,
    ): Promise<FeatureToggle> {
        const exists = await this.exists(data.name);
        if (exists) {
            const id = this.features.findIndex((f) => { throw new Error("STUB"); });
            const old = this.features.find((f) => { throw new Error("STUB"); });
            const updated = { project, ...old, ...data };
            this.features.splice(id, 1);
            this.features.push(updated);
            return updated;
        }
        throw new NotFoundError('Could not find feature to update');
    }

    async setLastSeen(data: LastSeenInput[]): Promise<void> {
        throw new Error("STUB");
    }

    async countByDate(queryModifiers: {
        archived?: boolean;
        project?: string;
        date?: string;
        range?: string[];
        dateAccessor: string;
    }): Promise<number> {
        throw new Error("STUB");
    }

    updatePotentiallyStaleFeatures(): Promise<
        { name: string; potentiallyStale: boolean; project: string }[]
    > {
        throw new Error("STUB");
    }

    isPotentiallyStale(): Promise<boolean> {
        throw new Error("STUB");
    }

    async getFeatureTypeCounts(
        _params: IFeatureProjectUserParams,
    ): Promise<IFeatureTypeCount[]> {
        throw new Error("STUB");
    }

    setCreatedByUserId(_batchSize: number): Promise<number | undefined> {
        throw new Error("STUB");
    }
}
