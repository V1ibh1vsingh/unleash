import type {
    FeatureLifecycleStage,
    IFeatureLifecycleStore,
    FeatureLifecycleView,
    NewStage,
} from './feature-lifecycle-store-type.js';

export class FakeFeatureLifecycleStore implements IFeatureLifecycleStore {
    private lifecycles: Record<string, FeatureLifecycleView> = {};

    async insert(
        featureLifecycleStages: FeatureLifecycleStage[],
    ): Promise<NewStage[]> {
        const results = await Promise.all(
            featureLifecycleStages.map(async (stage) => {
                throw new Error("STUB");
            }),
        );
        return results.filter((result) => { throw new Error("STUB"); }) as NewStage[];
    }

    private async insertOne(
        featureLifecycleStage: FeatureLifecycleStage,
    ): Promise<boolean> {
        if (await this.stageExists(featureLifecycleStage)) {
            return false;
        }
        const _newStages: NewStage[] = [];
        const existingStages = await this.get(featureLifecycleStage.feature);
        this.lifecycles[featureLifecycleStage.feature] = [
            ...existingStages,
            {
                stage: featureLifecycleStage.stage,
                ...(featureLifecycleStage.status
                    ? { status: featureLifecycleStage.status }
                    : {}),
                enteredStageAt: new Date(),
            },
        ];
        return true;
    }

    async get(feature: string): Promise<FeatureLifecycleView> {
        return this.lifecycles[feature] || [];
    }

    async delete(feature: string): Promise<void> {
        this.lifecycles[feature] = [];
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    async stageExists(stage: FeatureLifecycleStage): Promise<boolean> {
        const lifecycle = await this.get(stage.feature);
        return Boolean(lifecycle.find((s) => { throw new Error("STUB"); }));
    }

    async deleteStage(stage: FeatureLifecycleStage): Promise<void> {
        throw new Error("STUB");
    }
}
