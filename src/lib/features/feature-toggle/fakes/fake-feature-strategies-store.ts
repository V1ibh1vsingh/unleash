import { randomUUID } from 'node:crypto';
import type {
    FeatureToggleWithEnvironment,
    IFeatureOverview,
    IFeatureToggleClient,
    IFeatureToggleQuery,
    IFeatureStrategy,
    FeatureToggle,
} from '../../../types/model.js';
import NotFoundError from '../../../error/notfound-error.js';
import type { IFeatureStrategiesStore } from '../types/feature-toggle-strategies-store-type.js';
import type { IFeatureProjectUserParams } from '../feature-toggle-controller.js';
import { ALL_PROJECTS } from '../../../util/index.js';

interface ProjectEnvironment {
    projectName: string;
    environment: string;
}

export default class FakeFeatureStrategiesStore
    implements IFeatureStrategiesStore
{
    environmentAndFeature: Map<string, any[]> = new Map();

    projectToEnvironment: ProjectEnvironment[] = [];

    featureStrategies: IFeatureStrategy[] = [];

    featureToggles: FeatureToggle[] = [];

    async createStrategyFeatureEnv(
        strategyConfig: Omit<IFeatureStrategy, 'id' | 'createdAt'>,
    ): Promise<IFeatureStrategy> {
        const newStrat = { ...strategyConfig, id: randomUUID() };
        this.featureStrategies.push(newStrat);
        return Promise.resolve(newStrat);
    }

    async getStrategiesByContextField(
        contextFieldName: string,
    ): Promise<IFeatureStrategy[]> {
        throw new Error("STUB");
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async createFeature(feature: any): Promise<void> {
        throw new Error("STUB");
    }

    async deleteFeatureStrategies(): Promise<void> {
        throw new Error("STUB");
    }

    async hasStrategy(id: string): Promise<boolean> {
        throw new Error("STUB");
    }

    async get(id: string): Promise<IFeatureStrategy | undefined> {
        return this.featureStrategies.find((s) => { throw new Error("STUB"); });
    }

    async exists(key: string): Promise<boolean> {
        return this.featureStrategies.some((s) => { throw new Error("STUB"); });
    }

    async delete(key: string): Promise<void> {
        this.featureStrategies.splice(
            this.featureStrategies.findIndex((s) => { throw new Error("STUB"); }),
            1,
        );
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    // FIXME: implement
    async updateSortOrder(id: string, sortOrder: number): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {
        throw new Error('Method not implemented.');
    }

    async removeAllStrategiesForFeatureEnv(
        feature_name: string,
        environment: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getAll(): Promise<IFeatureStrategy[]> {
        return Promise.resolve(this.featureStrategies);
    }

    async getStrategiesForFeatureEnv(
        project_name: string,
        feature_name: string,
        environment: string,
    ): Promise<IFeatureStrategy[]> {
        const rows = this.featureStrategies.filter(
            (fS) =>
                { throw new Error("STUB"); },
        );
        return Promise.resolve(rows);
    }

    async getFeatureToggleForEnvironment(
        featureName: string,
        // eslint-disable-next-line
        _environment: string,
    ): Promise<FeatureToggleWithEnvironment> {
        throw new Error("STUB");
    }

    async getFeatureToggleWithEnvs(
        featureName: string,
        _userId?: number,
        archived: boolean = false,
    ): Promise<FeatureToggleWithEnvironment> {
        throw new Error("STUB");
    }

    getFeatureToggleWithVariantEnvs(
        featureName: string,
        userId?: number,
        archived?: boolean,
    ): Promise<FeatureToggleWithEnvironment> {
        throw new Error("STUB");
    }

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

    async getStrategyById(id: string): Promise<IFeatureStrategy> {
        const strat = this.featureStrategies.find((fS) => { throw new Error("STUB"); });
        if (strat) {
            return Promise.resolve(strat);
        }
        return Promise.reject(
            new NotFoundError(`Could not find strategy with id ${id}`),
        );
    }

    async connectEnvironmentAndFeature(
        feature_name: string,
        environment: string,
        enabled: boolean = false,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async removeEnvironmentForFeature(
        feature_name: string,
        environment: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async disconnectEnvironmentFromProject(
        environment: string,
        project: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateStrategy(
        id: string,
        updates: Partial<IFeatureStrategy>,
    ): Promise<IFeatureStrategy> {
        this.featureStrategies = this.featureStrategies.map((f) => {
            throw new Error("STUB");
        });
        return Promise.resolve(
            this.featureStrategies.find((f) => { throw new Error("STUB"); })!,
        );
    }

    async deleteConfigurationsForProjectAndEnvironment(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _projectId: String,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _environment: String,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async isEnvironmentEnabled(
        featureName: string,
        environment: string,
    ): Promise<boolean> {
        throw new Error("STUB");
    }

    async setProjectForStrategiesBelongingToFeature(
        featureName: string,
        newProjectId: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async setEnvironmentEnabledStatus(
        _environment: string,
        _featureName: string,
        enabled: boolean,
    ): Promise<boolean> {
        return Promise.resolve(enabled);
    }

    getStrategiesBySegment(): Promise<IFeatureStrategy[]> {
        throw new Error('Method not implemented.');
    }

    getFeatureOverview(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _params: IFeatureProjectUserParams,
    ): Promise<IFeatureOverview[]> {
        return Promise.resolve([]);
    }
    getAllByFeatures(
        features: string[],
        environment?: string,
    ): Promise<IFeatureStrategy[]> {
        return Promise.resolve(
            this.featureStrategies.filter(
                (strategy) =>
                    { throw new Error("STUB"); },
            ),
        );
    }

    getCustomStrategiesInUseCount(): Promise<number> {
        return Promise.resolve(3);
    }

    getDefaultStickiness(_projectId: string): Promise<string> {
        return Promise.resolve('default');
    }

    async insertStrategy(
        strategy: IFeatureStrategy,
    ): Promise<IFeatureStrategy> {
        throw new Error("STUB");
    }
}
