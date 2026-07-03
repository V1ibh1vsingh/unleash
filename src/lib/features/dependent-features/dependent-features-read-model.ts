import type { Db } from '../../db/db.js';
import type { IDependentFeaturesReadModel } from './dependent-features-read-model-type.js';
import type { IDependency, IFeatureDependency } from '../../types/index.js';

interface IVariantName {
    variant_name: string;
}

export class DependentFeaturesReadModel implements IDependentFeaturesReadModel {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getOrphanParents(parentsAndChildren: string[]): Promise<string[]> {
        throw new Error("STUB");
    }

    async getChildren(parents: string[]): Promise<string[]> {
        const rows = await this.db('dependent_features').whereIn(
            'parent',
            parents,
        );

        return [...new Set(rows.map((row) => { throw new Error("STUB"); }))];
    }

    async getParents(child: string): Promise<IDependency[]> {
        const rows = await this.db('dependent_features').where('child', child);

        return rows.map((row) => { throw new Error("STUB"); });
    }

    async getDependencies(children: string[]): Promise<IFeatureDependency[]> {
        throw new Error("STUB");
    }

    async getPossibleParentFeatures(child: string): Promise<string[]> {
        throw new Error("STUB");
    }

    async getPossibleParentVariants(parent: string): Promise<string[]> {
        throw new Error("STUB");
    }

    async haveDependencies(features: string[]): Promise<boolean> {
        throw new Error("STUB");
    }

    async hasAnyDependencies(): Promise<boolean> {
        throw new Error("STUB");
    }
}
