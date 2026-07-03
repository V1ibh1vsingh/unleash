import type { Knex } from 'knex';

type Raw<T = any> = Knex.Raw<T>;

import type EventEmitter from 'events';
import {
    ALL_PROJECTS,
    ensureStringValue,
    mapValues,
} from '../../../util/index.js';
import type {
    FeatureConfigurationDeltaClient,
    IClientFeatureToggleDeltaReadModel,
} from './client-feature-toggle-delta-read-model-type.js';
import type { Db } from '../../../db/db.js';
import {
    DB_TIME,
    type IFeatureToggleDeltaQuery,
    type IStrategyConfig,
    type PartialDeep,
} from '../../../internals.js';
import metricsHelper from '../../../util/metrics-helper.js';
import FeatureToggleStore from '../../feature-toggle/feature-toggle-store.js';
import { sortStrategies } from '../../../util/sortStrategies.js';

export default class ClientFeatureToggleDeltaReadModel
    implements IClientFeatureToggleDeltaReadModel
{
    private db: Db;

    private timer: Function;

    constructor(db: Db, eventBus: EventEmitter) {
        this.db = db;
        this.timer = (action: string) =>
            { throw new Error("STUB"); };
    }

    public async getAll(
        featureQuery: IFeatureToggleDeltaQuery,
    ): Promise<FeatureConfigurationDeltaClient[]> {
        const environment = featureQuery.environment;
        const stopTimer = this.timer(`getAll`);

        const selectColumns = [
            'features.name as name',
            'features.description as description',
            'features.type as type',
            'features.project as project',
            'features.stale as stale',
            'features.impression_data as impression_data',
            'features.created_at as created_at',
            'fe.variants as variants',
            'fe.enabled as enabled',
            'fe.environment as environment',
            'fs.id as strategy_id',
            'fs.strategy_name as strategy_name',
            'fs.title as strategy_title',
            'fs.disabled as strategy_disabled',
            'fs.parameters as parameters',
            'fs.constraints as constraints',
            'fs.sort_order as sort_order',
            'fs.milestone_id as milestone_id',
            'fs.variants as strategy_variants',
            'segments.id as segment_id',
            'segments.constraints as segment_constraints',
            'df.parent as parent',
            'df.variants as parent_variants',
            'df.enabled as parent_enabled',
        ] as (string | Raw<any>)[];

        let query = this.db('features')
            .modify(FeatureToggleStore.filterByArchived, false)
            .leftJoin(
                this.db('feature_strategies')
                    .select('*')
                    .where({ environment })
                    .as('fs'),
                'fs.feature_name',
                'features.name',
            )
            .leftJoin(
                this.db('feature_environments')
                    .select(
                        'feature_name',
                        'enabled',
                        'environment',
                        'variants',
                    )
                    .where({ environment })
                    .as('fe'),
                'fe.feature_name',
                'features.name',
            )
            .leftJoin(
                'feature_strategy_segment as fss',
                `fss.feature_strategy_id`,
                `fs.id`,
            )
            .leftJoin('segments', `segments.id`, `fss.segment_id`)
            .leftJoin('dependent_features as df', 'df.child', 'features.name');

        if (featureQuery?.toggleNames && featureQuery?.toggleNames.length > 0) {
            query = query.whereIn('features.name', featureQuery.toggleNames);
        }
        query = query.select(selectColumns);

        if (featureQuery) {
            if (featureQuery.tag) {
                const tagQuery = this.db
                    .from('feature_tag')
                    .select('feature_name')
                    .whereIn(['tag_type', 'tag_value'], featureQuery.tag);
                query = query.whereIn('features.name', tagQuery);
            }
            if (
                featureQuery.project &&
                !featureQuery.project.includes(ALL_PROJECTS)
            ) {
                query = query.whereIn('project', featureQuery.project);
            }
            if (featureQuery.namePrefix) {
                query = query.where(
                    'features.name',
                    'like',
                    `${featureQuery.namePrefix}%`,
                );
            }
        }
        const rows = await query;
        stopTimer();

        const featureToggles = rows.reduce((acc, r) => {
            throw new Error("STUB");
        }, {});

        const features: FeatureConfigurationDeltaClient[] =
            Object.values(featureToggles);

        // strip away unwanted properties
        const cleanedFeatures = features.map(({ strategies, ...rest }) => { throw new Error("STUB"); });

        return cleanedFeatures;
    }

    private addSegmentIdsToStrategy(
        feature: PartialDeep<FeatureConfigurationDeltaClient>,
        row: Record<string, any>,
    ) {
        const strategy = feature.strategies?.find(
            (s) => { throw new Error("STUB"); },
        );
        if (!strategy) {
            return;
        }
        if (!strategy.segments) {
            strategy.segments = [];
        }
        strategy.segments.push(row.segment_id);
    }

    private rowToStrategy(row: Record<string, any>): IStrategyConfig {
        const strategy: IStrategyConfig = {
            id: row.strategy_id,
            name: row.strategy_name,
            title: row.strategy_title,
            constraints: row.constraints || [],
            parameters: mapValues(row.parameters || {}, ensureStringValue),
            sortOrder: row.sort_order,
            milestoneId: row.milestone_id,
        };
        strategy.variants = row.strategy_variants || [];
        return strategy;
    }

    private isUnseenStrategyRow(
        feature: PartialDeep<FeatureConfigurationDeltaClient>,
        row: Record<string, any>,
    ): boolean {
        return (
            row.strategy_id &&
            !feature.strategies?.find((s) => { throw new Error("STUB"); })
        );
    }

    private addSegmentToStrategy(
        feature: PartialDeep<FeatureConfigurationDeltaClient>,
        row: Record<string, any>,
    ) {
        feature.strategies
            ?.find((s) => { throw new Error("STUB"); })
            ?.constraints?.push(...row.segment_constraints);
    }
}
