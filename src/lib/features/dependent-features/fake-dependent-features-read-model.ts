import type { IDependentFeaturesReadModel } from './dependent-features-read-model-type.js';
import type { IDependency, IFeatureDependency } from '../../types/index.js';

export class FakeDependentFeaturesReadModel
    implements IDependentFeaturesReadModel
{
    getDependencies(): Promise<IFeatureDependency[]> {
        throw new Error("STUB");
    }
    getChildren(): Promise<string[]> {
        return Promise.resolve([]);
    }

    getParents(): Promise<IDependency[]> {
        return Promise.resolve([]);
    }

    getPossibleParentFeatures(): Promise<string[]> {
        throw new Error("STUB");
    }

    getPossibleParentVariants(): Promise<string[]> {
        throw new Error("STUB");
    }

    haveDependencies(): Promise<boolean> {
        throw new Error("STUB");
    }

    getOrphanParents(_parentsAndChildren: string[]): Promise<string[]> {
        throw new Error("STUB");
    }

    hasAnyDependencies(): Promise<boolean> {
        throw new Error("STUB");
    }
}
