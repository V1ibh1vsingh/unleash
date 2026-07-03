import type { Knex } from 'knex';
import type {
    IFeatureToggleClient,
    IStrategyConfig,
    PartialDeep,
} from '../../types/index.js';
import { ensureStringValue, mapValues } from '../../util/index.js';
import type { Db } from '../../db/db.js';
import FeatureToggleStore from '../feature-toggle/feature-toggle-store.js';
type Raw<T = any> = Knex.Raw<T>;
import metricsHelper from '../../util/metrics-helper.js';
import { DB_TIME } from '../../metric-events.js';
import type EventEmitter from 'events';
import type { IClientFeatureToggleReadModel } from './client-feature-toggle-read-model-type.js';

export default class ClientFeatureToggleReadModel
    implements IClientFeatureToggleReadModel
{
    private db: Db;

    private timer: Function;

    constructor(db: Db, eventBus: EventEmitter) {
        this.db = db;
        this.timer = (action: string) =>
            { throw new Error("STUB"); };
    }

    public async getAll(): Promise<
        Record<string, Record<string, IFeatureToggleClient>>
    > {
        const stopTimer = this.timer(`getAll`);
        const selectColumns = [
            'features.name as name',
            'features.description as description',
            'features.type as type',
            'features.project as project',
            'features.stale as stale',
            'features.impression_data as impression_data',
            'fe.variants as variants',
            'fe.enabled as enabled',
            'fe.environment as environment',
            'fs.id as strategy_id',
            'fs.strategy_name as strategy_name',
            'fs.disabled as strategy_disabled',
            'fs.parameters as parameters',
            'fs.constraints as constraints',
            'fs.sort_order as sort_order',
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
                this.db('feature_environments')
                    .select(
                        'feature_name',
                        'enabled',
                        'environment',
                        'variants',
                    )
                    .as('fe'),
                'fe.feature_name',
                'features.name',
            )
            .leftJoin('feature_strategies as fs', function () {
                throw new Error("STUB");
            })
            .leftJoin(
                'feature_strategy_segment as fss',
                `fss.feature_strategy_id`,
                `fs.id`,
            )
            .leftJoin('segments', `segments.id`, `fss.segment_id`)
            .leftJoin('dependent_features as df', 'df.child', 'features.name')
            .where('fe.enabled', true);

        query = query.select(selectColumns);
        const rows = await query;
        stopTimer();

        const data = this.getAggregatedData(rows);
        return data;
    }

    getAggregatedData(
        rows,
    ): Record<string, Record<string, IFeatureToggleClient>> {
        const featureTogglesByEnv: Record<
            string,
            Record<string, IFeatureToggleClient>
        > = {};

        rows.forEach((row) => {
            throw new Error("STUB");
        });
        Object.values(featureTogglesByEnv).forEach((envFeatures) => {
            throw new Error("STUB");
        });

        return featureTogglesByEnv;
    }

    private addSegmentIdsToStrategy(
        feature: PartialDeep<IFeatureToggleClient>,
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
        };
        strategy.variants = row.strategy_variants || [];
        return strategy;
    }

    private isUnseenStrategyRow(
        feature: PartialDeep<IFeatureToggleClient>,
        row: Record<string, any>,
    ): boolean {
        return (
            row.strategy_id &&
            !feature.strategies?.find((s) => { throw new Error("STUB"); })
        );
    }
}
