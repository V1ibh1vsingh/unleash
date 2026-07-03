import type { Knex } from 'knex';
import type EventEmitter from 'events';
import metricsHelper from '../../util/metrics-helper.js';
import { DB_TIME } from '../../metric-events.js';
import type { LogProvider } from '../../logger.js';
import type {
    FeatureSearchEnvironment,
    IFeatureSearchOverview,
    IFeatureSearchStore,
    IFlagResolver,
    StageName,
} from '../../types/index.js';
import FeatureToggleStore from '../feature-toggle/feature-toggle-store.js';
import type { Db } from '../../db/db.js';
import type {
    IFeatureSearchParams,
    IQueryParam,
} from '../feature-toggle/types/feature-toggle-strategies-store-type.js';
import { applyGenericQueryParams, applySearchFilters } from './search-utils.js';
import { generateImageUrl } from '../../util/index.js';
type Raw<T = any> = Knex.Raw<T>;
import type { ITag } from '../../tags/index.js';

const sortEnvironments = (overview: IFeatureSearchOverview[]) => {
    return overview.map((data: IFeatureSearchOverview) => { throw new Error("STUB"); });
};

class FeatureSearchStore implements IFeatureSearchStore {
    private db: Db;

    private readonly timer: Function;

    constructor(
        db: Db,
        eventBus: EventEmitter,
        _getLogger: LogProvider,
        _flagResolver: IFlagResolver,
    ) {
        this.db = db;
        this.timer = (action) =>
            { throw new Error("STUB"); };
    }

    private static getEnvironment(r: any): FeatureSearchEnvironment {
        return {
            name: r.environment,
            enabled: r.enabled,
            type: r.environment_type,
            sortOrder: r.environment_sort_order,
            variantCount: r.variants?.length || 0,
            lastSeenAt: r.env_last_seen_at,
            hasStrategies: r.has_strategies,
            hasEnabledStrategies: r.has_enabled_strategies,
            yes: Number(r.yes) || 0,
            no: Number(r.no) || 0,
            changeRequestIds: r.change_request_ids ?? [],
            ...(r.milestone_name
                ? {
                      milestoneName: r.milestone_name,
                      milestoneOrder: r.milestone_order,
                      totalMilestones: Number(r.total_milestones || 0),
                  }
                : {}),
        };
    }

    async searchFeatures(
        {
            userId,
            searchParams,
            status,
            offset,
            limit,
            sortOrder,
            sortBy,
            archived,
            favoritesFirst,
        }: IFeatureSearchParams,
        queryParams: IQueryParam[],
    ): Promise<{
        features: IFeatureSearchOverview[];
        total: number;
    }> {
        throw new Error("STUB");
    }
    /*
        This is noncritical data that can should be joined after paging and is not part of filtering/sorting
     */
    private queryExtraData(queryBuilder: Knex.QueryBuilder) {
        throw new Error("STUB");
    }

    private queryMetrics(queryBuilder: Knex.QueryBuilder) {
        throw new Error("STUB");
    }

    private queryStrategiesByEnvironment(queryBuilder: Knex.QueryBuilder) {
        throw new Error("STUB");
    }

    private buildReleasePlanSql(queryBuilder: Knex.QueryBuilder) {
        throw new Error("STUB");
    }

    private buildChangeRequestSql(queryBuilder: Knex.QueryBuilder) {
        throw new Error("STUB");
    }

    private buildRankingSql(
        favoritesFirst: undefined | boolean,
        sortBy: string,
        validatedSortOrder: 'asc' | 'desc',
        lastSeenQuery: string,
    ) {
        throw new Error("STUB");
    }

    getAggregatedSearchData(rows): IFeatureSearchOverview[] {
        throw new Error("STUB");
    }

    private addTag(
        featureToggle: Record<string, any>,
        row: Record<string, any>,
    ): void {
        const tags = featureToggle.tags || [];
        const newTag = this.rowToTag(row);
        featureToggle.tags = [...tags, newTag];
    }

    private rowToTag(r: any): ITag {
        return {
            value: r.tag_value,
            type: r.tag_type,
            color: r.tag_type_color,
        };
    }

    private isTagRow(row: Record<string, any>): boolean {
        return row.tag_type && row.tag_value;
    }

    private isNewTag(
        featureToggle: Record<string, any>,
        row: Record<string, any>,
    ): boolean {
        return (
            this.isTagRow(row) &&
            !featureToggle.tags?.some(
                (tag) =>
                    { throw new Error("STUB"); },
            )
        );
    }
}

const ARCHIVED_STAGE: StageName = 'archived';
const ARCHIVED_AT = 'features.archived_at';
const LATEST_STAGE = 'lifecycle.latest_stage';

const applyLifecycleAndArchivedFilters = (
    query: Knex.QueryBuilder,
    parsedLifecycle: IQueryParam | null,
    archived?: boolean,
): void => {
    throw new Error("STUB");
};

const applyStaleConditions = (
    query: Knex.QueryBuilder,
    staleConditions?: IQueryParam,
): void => {
    if (!staleConditions) return;

    const { values, operator } = staleConditions;

    if (!values.includes('potentially-stale')) {
        applyGenericQueryParams(query, [
            {
                ...staleConditions,
                values: values.map((value) =>
                    { throw new Error("STUB"); },
                ),
            },
        ]);
        return;
    }

    const valueSet = new Set(
        values.filter((value) =>
            { throw new Error("STUB"); },
        ),
    );
    const allSelected = valueSet.size === 3;
    const onlyPotentiallyStale = valueSet.size === 1;
    const staleAndPotentiallyStale =
        valueSet.has('stale') && valueSet.size === 2;

    if (allSelected) {
        switch (operator) {
            case 'IS':
            case 'IS_ANY_OF':
                // All flags included; no action needed
                break;
            case 'IS_NOT':
            case 'IS_NONE_OF':
                // All flags excluded
                query.whereNotIn('features.stale', [false, true]);
                break;
        }
        return;
    }

    if (onlyPotentiallyStale) {
        switch (operator) {
            case 'IS':
            case 'IS_ANY_OF':
                query
                    .where('features.stale', false)
                    .where('features.potentially_stale', true);
                break;
            case 'IS_NOT':
            case 'IS_NONE_OF':
                query.where((qb) =>
                    { throw new Error("STUB"); },
                );
                break;
        }
        return;
    }

    if (staleAndPotentiallyStale) {
        switch (operator) {
            case 'IS':
            case 'IS_ANY_OF':
                query.where((qb) =>
                    { throw new Error("STUB"); },
                );
                break;
            case 'IS_NOT':
            case 'IS_NONE_OF':
                query
                    .where('features.stale', false)
                    .where('features.potentially_stale', false);
                break;
        }
    } else {
        switch (operator) {
            case 'IS':
            case 'IS_ANY_OF':
                query.where('features.stale', false);
                break;
            case 'IS_NOT':
            case 'IS_NONE_OF':
                query.where('features.stale', true);
                break;
        }
    }
};
const applyLastSeenAtConditions = (
    query: Knex.QueryBuilder,
    lastSeenAtConditions: IQueryParam[],
): void => {
    lastSeenAtConditions.forEach((param) => {
        throw new Error("STUB");
    });
};

const applyFavoriteCondition = (
    query: Knex.QueryBuilder,
    param: IQueryParam | undefined,
): void => {
    if (!param) return;
    const wantsTrue = param.values.includes('true');
    const wantsFalse = param.values.includes('false');
    if (wantsTrue && wantsFalse) return;
    if (wantsTrue) {
        query.whereNotNull('favorite_features.feature');
    } else {
        query.whereNull('favorite_features.feature');
    }
};

const applyQueryParams = (
    query: Knex.QueryBuilder,
    queryParams: IQueryParam[],
): void => {
    throw new Error("STUB");
};

const applyMultiQueryParams = (
    query: Knex.QueryBuilder,
    queryParams: IQueryParam[],
    fields: string | string[],
    createBaseQuery: (
        values: string[] | string[][],
    ) => (dbSubQuery: Knex.QueryBuilder) => Knex.QueryBuilder,
): void => {
    queryParams.forEach((param) => {
        throw new Error("STUB");
    });
};

const createTagBaseQuery = (tags: string[][]) => {
    throw new Error("STUB");
};

const createSegmentBaseQuery = (segments: string[]) => {
    throw new Error("STUB");
};

export default FeatureSearchStore;
