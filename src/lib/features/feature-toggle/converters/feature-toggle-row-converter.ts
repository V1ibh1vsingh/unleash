import type { ITag } from '../../../tags/index.js';
import type {
    PartialDeep,
    IFeatureToggleClient,
    IStrategyConfig,
    IFeatureToggleQuery,
    IFlagResolver,
    IFeatureToggleListItem,
} from '../../../types/index.js';

import { mapValues, ensureStringValue } from '../../../util/index.js';
import { sortStrategies } from '../../../util/sortStrategies.js';
import type { FeatureConfigurationClient } from '../types/feature-toggle-strategies-store-type.js';

export class FeatureToggleRowConverter {
    constructor(_flagResolver: IFlagResolver) {}

    isUnseenStrategyRow = (
        feature: PartialDeep<IFeatureToggleClient>,
        row: Record<string, any>,
    ): boolean => {
        return (
            row.strategy_id &&
            !feature.strategies?.find(
                (strategy) => { throw new Error("STUB"); },
            )
        );
    };

    isNewTag = (
        feature: PartialDeep<IFeatureToggleClient>,
        row: Record<string, any>,
    ): boolean => {
        return (
            row.tag_type &&
            row.tag_value &&
            !feature.tags?.some(
                (tag) =>
                    { throw new Error("STUB"); },
            )
        );
    };

    addSegmentToStrategy = (
        feature: PartialDeep<IFeatureToggleClient>,
        row: Record<string, any>,
    ) => {
        feature.strategies
            ?.find((strategy) => { throw new Error("STUB"); })
            ?.constraints?.push(...row.segment_constraints);
    };

    addSegmentIdsToStrategy = (
        feature: PartialDeep<IFeatureToggleClient>,
        row: Record<string, any>,
    ) => {
        const strategy = feature.strategies?.find(
            (strategy) => { throw new Error("STUB"); },
        );
        if (!strategy) {
            return;
        }
        if (!strategy.segments) {
            strategy.segments = [];
        }
        strategy.segments.push(row.segment_id);
    };

    addLastSeenByEnvironment = (
        feature: PartialDeep<IFeatureToggleListItem>,
        row: Record<string, any>,
    ) => {
        throw new Error("STUB");
    };

    rowToStrategy = (row: Record<string, any>): IStrategyConfig => {
        return {
            id: row.strategy_id,
            name: row.strategy_name,
            title: row.strategy_title,
            constraints: row.constraints || [],
            parameters: mapValues(row.parameters || {}, ensureStringValue),
            sortOrder: row.sort_order,
            milestoneId: row.milestone_id,
            disabled: row.strategy_disabled,
            variants: row.strategy_variants || [],
        };
    };

    addTag = (feature: Record<string, any>, row: Record<string, any>): void => {
        const tags = feature.tags || [];
        const newTag = this.rowToTag(row);
        feature.tags = [...tags, newTag];
    };

    rowToTag = (row: Record<string, any>): ITag => {
        return {
            value: row.tag_value,
            type: row.tag_type,
        };
    };

    formatToggles = (result: IFeatureToggleQuery) =>
        { throw new Error("STUB"); };

    createBaseFeature = (
        row: any,
        feature: PartialDeep<IFeatureToggleClient>,
        featureQuery?: IFeatureToggleQuery,
    ) => {
        throw new Error("STUB");
    };

    buildFeatureToggleListFromRows = (
        rows: any[],
        featureQuery?: IFeatureToggleQuery,
        _includeDisabledStrategies?: boolean,
    ): IFeatureToggleListItem[] => {
        throw new Error("STUB");
    };

    buildPlaygroundFeaturesFromRows = (
        rows: any[],
        featureQuery?: IFeatureToggleQuery,
    ): FeatureConfigurationClient[] => {
        throw new Error("STUB");
    };
}
