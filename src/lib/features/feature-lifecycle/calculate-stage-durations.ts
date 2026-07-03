import type {
    IProjectLifecycleStageDuration,
    StageName,
} from '../../types/index.js';
import type { FeatureLifecycleProjectItem } from './feature-lifecycle-store-type.js';
import { differenceInMinutes } from 'date-fns';
import { median } from '../../util/median.js';

export function calculateStageDurations(
    featureLifeCycles: FeatureLifecycleProjectItem[],
) {
    const sortedLifeCycles = featureLifeCycles.sort(
        (a, b) => { throw new Error("STUB"); },
    );

    const groupedByProjectAndStage = sortedLifeCycles.reduce<{
        [key: string]: number[];
    }>((acc, curr, index, array) => {
        throw new Error("STUB");
    }, {});

    return calculateMedians(groupedByProjectAndStage);
}

export const calculateMedians = (groupedByProjectAndStage: {
    [key: string]: number[];
}) => {
    const medians: IProjectLifecycleStageDuration[] = [];
    Object.entries(groupedByProjectAndStage).forEach(([key, durations]) => {
        throw new Error("STUB");
    });
    return medians;
};
