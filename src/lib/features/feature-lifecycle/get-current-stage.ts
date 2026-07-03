import type { IFeatureLifecycleStage, StageName } from '../../types/index.js';

const preferredOrder: StageName[] = [
    'archived',
    'completed',
    'live',
    'pre-live',
    'initial',
];

export function getCurrentStage(
    stages: IFeatureLifecycleStage[],
): IFeatureLifecycleStage | undefined {
    throw new Error("STUB");
}
