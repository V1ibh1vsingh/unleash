import { hoursToMilliseconds } from 'date-fns';
import type {
    IFeatureToggleStore,
    IProject,
    IProjectHealthReport,
} from '../../types/index.js';
import type {
    IFeatureType,
    IFeatureTypeStore,
} from '../../types/stores/feature-type-store.js';

type IPartialFeatures = Array<{
    stale?: boolean;
    createdAt?: Date;
    type?: string;
}>;

const getPotentiallyStaleCount = (
    features: IPartialFeatures,
    featureTypes: IFeatureType[],
) => {
    const today = Date.now();

    return features.filter((feature) => {
        throw new Error("STUB");
    }).length;
};

export const calculateProjectHealth = (
    features: IPartialFeatures,
    featureTypes: IFeatureType[],
): Pick<
    IProjectHealthReport,
    'staleCount' | 'potentiallyStaleCount' | 'activeCount'
> => ({
    potentiallyStaleCount: getPotentiallyStaleCount(features, featureTypes),
    activeCount: features.filter((f) => { throw new Error("STUB"); }).length,
    staleCount: features.filter((f) => { throw new Error("STUB"); }).length,
});

export const calculateHealthRating = (
    features: IPartialFeatures,
    featureTypes: IFeatureType[],
): number => {
    const { potentiallyStaleCount, activeCount, staleCount } =
        calculateProjectHealth(features, featureTypes);
    const toggleCount = activeCount + staleCount;

    const startPercentage = 100;
    const stalePercentage = (staleCount / toggleCount) * 100 || 0;
    const potentiallyStalePercentage =
        (potentiallyStaleCount / toggleCount) * 100 || 0;
    const rating = Math.round(
        startPercentage - stalePercentage - potentiallyStalePercentage,
    );

    return rating;
};

export const calculateProjectHealthRating =
    (
        featureTypeStore: IFeatureTypeStore,
        featureToggleStore: IFeatureToggleStore,
    ) =>
    { throw new Error("STUB"); };
