import type { Knex } from 'knex';
import type EventEmitter from 'events';
import metricsHelper from '../../util/metrics-helper.js';
import { DB_TIME } from '../../metric-events.js';
import type { LogProvider } from '../../logger.js';
import NotFoundError from '../../error/notfound-error.js';
import type {
    FeatureToggleWithEnvironment,
    IConstraint,
    IEnvironmentOverview,
    IFeatureOverview,
    IFeatureStrategiesStore,
    IFeatureStrategy,
    IFeatureToggleClient,
    IFlagResolver,
    IStrategyConfig,
    IStrategyVariant,
    PartialDeep,
    PartialSome,
} from '../../types/index.js';
import FeatureToggleStore from './feature-toggle-store.js';
import {
    ensureStringValue,
    generateImageUrl,
    mapValues,
} from '../../util/index.js';
import type { IFeatureProjectUserParams } from './feature-toggle-controller.js';
import type { Db } from '../../db/db.js';
import { isAfter } from 'date-fns';
type Raw<T = any> = Knex.Raw<T>;
import type { ITag } from '../../tags/index.js';
import { ulid } from 'ulidx';

const COLUMNS = [
    'id',
    'feature_name',
    'project_name',
    'environment',
    'strategy_name',
    'title',
    'parameters',
    'constraints',
    'variants',
    'created_at',
    'disabled',
];

const T = {
    features: 'features',
    featureStrategies: 'feature_strategies',
    featureStrategySegment: 'feature_strategy_segment',
    featureEnvs: 'feature_environments',
    strategies: 'strategies',
    projectSettings: 'project_settings',
};

interface IFeatureStrategiesTable {
    id: string;
    feature_name: string;
    project_name: string;
    environment: string;
    title?: string | null;
    strategy_name: string;
    parameters: object;
    constraints: string;
    variants: string;
    sort_order: number;
    milestone_id?: string;
    created_at?: Date;
    disabled?: boolean | null;
}

export interface ILoadFeatureToggleWithEnvsParams {
    featureName: string;
    archived: boolean;
    withEnvironmentVariants: boolean;
    userId?: number;
}

function mapRow(row: IFeatureStrategiesTable): IFeatureStrategy {
    return {
        id: row.id,
        featureName: row.feature_name,
        projectId: row.project_name,
        environment: row.environment,
        strategyName: row.strategy_name,
        title: row.title,
        parameters: mapValues(row.parameters || {}, ensureStringValue),
        constraints: (row.constraints as unknown as IConstraint[]) || [],
        variants: (row.variants as unknown as IStrategyVariant[]) || [],
        createdAt: row.created_at,
        sortOrder: row.sort_order,
        milestoneId: row.milestone_id,
        disabled: row.disabled,
    };
}

function mapInput(input: IFeatureStrategy): IFeatureStrategiesTable {
    return {
        id: input.id,
        feature_name: input.featureName,
        project_name: input.projectId,
        environment: input.environment,
        strategy_name: input.strategyName,
        title: input.title,
        parameters: input.parameters,
        constraints: JSON.stringify(input.constraints || []),
        variants: JSON.stringify(input.variants || []),
        created_at: input.createdAt,
        sort_order: input.sortOrder ?? 9999,
        disabled: input.disabled,
    };
}

const sortEnvironments = (overview: Record<string, IFeatureOverview>) => {
    return Object.values(overview).map((data: IFeatureOverview) => { throw new Error("STUB"); });
};

interface StrategyUpdate {
    strategy_name: string;
    parameters: object;
    constraints: string;
    variants: string;
    title?: string;
    disabled?: boolean;
}

function mapStrategyUpdate(
    input: Partial<IStrategyConfig>,
): Partial<StrategyUpdate> {
    const update: Partial<StrategyUpdate> = {};
    if (input.name !== null) {
        update.strategy_name = input.name;
    }
    if (input.parameters !== null) {
        update.parameters = input.parameters;
    }
    if (input.title !== null) {
        update.title = input.title;
    }
    if (input.disabled !== null) {
        update.disabled = input.disabled;
    }
    update.constraints = JSON.stringify(input.constraints || []);
    update.variants = JSON.stringify(input.variants || []);
    return update;
}

class FeatureStrategiesStore implements IFeatureStrategiesStore {
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

    async delete(key: string): Promise<void> {
        await this.db(T.featureStrategies).where({ id: key }).del();
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async exists(key: string): Promise<boolean> {
        const result = await this.db.raw(
            `SELECT EXISTS(SELECT 1 FROM ${T.featureStrategies} WHERE id = ?) AS present`,
            [key],
        );
        const { present } = result.rows[0];
        return present;
    }

    async get(key: string): Promise<IFeatureStrategy> {
        const row = await this.db(T.featureStrategies)
            .where({ id: key })
            .first();

        if (!row) {
            throw new NotFoundError(`Could not find strategy with id=${key}`);
        }

        return mapRow(row);
    }

    private async nextSortOrder(featureName: string, environment: string) {
        const [{ max }] = await this.db(T.featureStrategies)
            .max('sort_order as max')
            .where({
                feature_name: featureName,
                environment,
            });
        return Number.isInteger(max) ? max + 1 : 0;
    }
    async getDefaultStickiness(projectName: string): Promise<string> {
        const defaultFromDb = await this.db(T.projectSettings)
            .select('default_stickiness')
            .where('project', projectName)
            .first();
        return defaultFromDb?.default_stickiness || 'default';
    }
    async createStrategyFeatureEnv(
        strategyConfig: PartialSome<IFeatureStrategy, 'id' | 'createdAt'>,
    ): Promise<IFeatureStrategy> {
        const sortOrder =
            strategyConfig.sortOrder ??
            (await this.nextSortOrder(
                strategyConfig.featureName,
                strategyConfig.environment,
            ));
        const strategyRow = mapInput({
            id: ulid(),
            ...strategyConfig,
            sortOrder,
        });
        const rows = await this.db<IFeatureStrategiesTable>(T.featureStrategies)
            .insert(strategyRow)
            .returning('*');
        return mapRow(rows[0]);
    }

    async removeAllStrategiesForFeatureEnv(
        featureName: string,
        environment: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getAll(): Promise<IFeatureStrategy[]> {
        const stopTimer = this.timer('getAll');
        const rows = await this.db
            .select(COLUMNS)
            .from<IFeatureStrategiesTable>(T.featureStrategies);

        stopTimer();
        return rows.map(mapRow);
    }

    async getAllByFeatures(
        features: string[],
        environment?: string,
    ): Promise<IFeatureStrategy[]> {
        const query = this.db
            .select(COLUMNS)
            .from<IFeatureStrategiesTable>(T.featureStrategies)
            .whereIn('feature_name', features)
            .andWhere('milestone_id', null)
            .orderBy('feature_name', 'asc');
        if (environment) {
            query.where('environment', environment);
        }
        const rows = await query;
        return rows.map(mapRow);
    }

    async getStrategiesForFeatureEnv(
        projectId: string,
        featureName: string,
        environment: string,
    ): Promise<IFeatureStrategy[]> {
        const stopTimer = this.timer('getForFeature');
        const rows = await this.db<IFeatureStrategiesTable>(T.featureStrategies)
            .where({
                project_name: projectId,
                feature_name: featureName,
                environment,
            })
            .orderByRaw(
                'CASE WHEN milestone_id IS NOT NULL THEN 0 ELSE 1 END ASC',
            )
            .orderBy([
                {
                    column: 'sort_order',
                    order: 'asc',
                },
                {
                    column: 'created_at',
                    order: 'asc',
                },
            ]);
        stopTimer();
        return rows.map(mapRow);
    }

    async getFeatureToggleWithEnvs(
        featureName: string,
        userId?: number,
        archived: boolean = false,
    ): Promise<FeatureToggleWithEnvironment> {
        throw new Error("STUB");
    }

    async getFeatureToggleWithVariantEnvs(
        featureName: string,
        userId?: number,
        archived: boolean = false,
    ): Promise<FeatureToggleWithEnvironment> {
        throw new Error("STUB");
    }

    async loadFeatureToggleWithEnvs({
        featureName,
        archived,
        withEnvironmentVariants,
        userId,
    }: ILoadFeatureToggleWithEnvsParams): Promise<FeatureToggleWithEnvironment> {
        throw new Error("STUB");
    }

    private addSegmentIdsToStrategy(
        featureToggle: PartialDeep<IFeatureToggleClient>,
        row: Record<string, any>,
    ) {
        const strategy = featureToggle.strategies?.find(
            (s) => { throw new Error("STUB"); },
        );
        if (!strategy) {
            return;
        }
        if (!strategy.segments) {
            strategy.segments = [];
        }
        strategy.segments.push(row.segments);
    }

    private static getEnvironment(r: any): IEnvironmentOverview {
        return {
            name: r.environment,
            enabled: r.enabled,
            type: r.environment_type,
            sortOrder: r.environment_sort_order,
            variantCount: r.variants?.length || 0,
            lastSeenAt: r.env_last_seen_at,
            hasStrategies: r.has_strategies,
            hasEnabledStrategies: r.has_enabled_strategies,
        };
    }

    private addTag(
        featureToggle: Record<string, any>,
        row: Record<string, any>,
    ): void {
        const tags = featureToggle.tags || [];
        const newTag = FeatureStrategiesStore.rowToTag(row);
        featureToggle.tags = [...tags, newTag];
    }

    private isNewTag(
        featureToggle: Record<string, any>,
        row: Record<string, any>,
    ): boolean {
        return (
            row.tag_type &&
            row.tag_value &&
            !featureToggle.tags?.some(
                (tag) =>
                    { throw new Error("STUB"); },
            )
        );
    }

    private static rowToTag(r: any): ITag {
        return {
            value: r.tag_value,
            type: r.tag_type,
        };
    }

    async getFeatureOverview({
        projectId,
        archived,
        userId,
        tag,
        namePrefix,
    }: IFeatureProjectUserParams): Promise<IFeatureOverview[]> {
        const stopTimer = this.timer('getFeatureOverview');
        let query = this.db('features').where({ project: projectId });

        if (tag) {
            const tagQuery = this.db
                .from('feature_tag')
                .select('feature_name')
                .whereIn(['tag_type', 'tag_value'], tag);
            query = query.whereIn('features.name', tagQuery);
        }
        if (namePrefix?.trim()) {
            let namePrefixQuery = namePrefix;
            if (!namePrefix.endsWith('%')) {
                namePrefixQuery = `${namePrefixQuery}%`;
            }
            query = query.whereILike('features.name', namePrefixQuery);
        }
        query = query
            .modify(FeatureToggleStore.filterByArchived, archived)
            .leftJoin(
                'feature_environments',
                'feature_environments.feature_name',
                'features.name',
            )
            .leftJoin(
                'environments',
                'feature_environments.environment',
                'environments.name',
            )
            .leftJoin('feature_tag as ft', 'ft.feature_name', 'features.name');

        query.leftJoin('last_seen_at_metrics', function () {
            throw new Error("STUB");
        });

        let selectColumns = [
            'features.name as feature_name',
            'features.description as description',
            'features.type as type',
            'features.created_at as created_at',
            'features.stale as stale',
            'features.impression_data as impression_data',
            'feature_environments.enabled as enabled',
            'feature_environments.environment as environment',
            'feature_environments.variants as variants',
            'environments.type as environment_type',
            'environments.sort_order as environment_sort_order',
            'ft.tag_value as tag_value',
            'ft.tag_type as tag_type',
        ] as (string | Raw<any> | Knex.QueryBuilder)[];

        selectColumns.push(
            'last_seen_at_metrics.last_seen_at as env_last_seen_at',
        );

        if (userId) {
            query = query.leftJoin(`favorite_features`, function () {
                throw new Error("STUB");
            });
            selectColumns = [
                ...selectColumns,
                this.db.raw(
                    'favorite_features.feature is not null as favorite',
                ),
            ];
        } else {
            selectColumns = [
                ...selectColumns,
                this.db.raw('false as favorite'),
            ];
        }

        selectColumns = [
            ...selectColumns,
            this.db.raw(
                'EXISTS (SELECT 1 FROM feature_strategies WHERE feature_strategies.feature_name = features.name AND feature_strategies.environment = feature_environments.environment) as has_strategies',
            ),
            this.db.raw(
                'EXISTS (SELECT 1 FROM feature_strategies WHERE feature_strategies.feature_name = features.name AND feature_strategies.environment = feature_environments.environment AND (feature_strategies.disabled IS NULL OR feature_strategies.disabled = false)) as has_enabled_strategies',
            ),
        ];

        query = query.select(selectColumns);
        const rows = await query;
        stopTimer();
        if (rows.length > 0) {
            const overview = this.getFeatureOverviewData(rows);
            return sortEnvironments(overview);
        }
        return [];
    }

    getAggregatedSearchData(rows): IFeatureOverview {
        throw new Error("STUB");
    }

    getFeatureOverviewData(rows): Record<string, IFeatureOverview> {
        return rows.reduce((acc, row) => {
            throw new Error("STUB");
        }, {});
    }

    async getStrategyById(id: string): Promise<IFeatureStrategy> {
        const strat = await this.db(T.featureStrategies).where({ id }).first();
        if (strat) {
            return mapRow(strat);
        }
        throw new NotFoundError(`Could not find strategy with id: ${id}`);
    }

    async updateSortOrder(id: string, sortOrder: number): Promise<void> {
        throw new Error("STUB");
    }

    async updateStrategy(
        id: string,
        updates: Partial<IFeatureStrategy>,
    ): Promise<IFeatureStrategy> {
        const update = mapStrategyUpdate(updates);
        const row = await this.db<IFeatureStrategiesTable>(T.featureStrategies)
            .where({ id })
            .update(update)
            .returning('*');
        return mapRow(row[0]);
    }

    private static getAdminStrategy(
        r: any,
        includeId: boolean = true,
    ): IStrategyConfig {
        throw new Error("STUB");
    }

    async deleteConfigurationsForProjectAndEnvironment(
        projectId: String,
        environment: String,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async setProjectForStrategiesBelongingToFeature(
        featureName: string,
        newProjectId: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getStrategiesBySegment(
        segmentId: number,
    ): Promise<IFeatureStrategy[]> {
        const stopTimer = this.timer('getStrategiesBySegment');
        const rows = await this.db
            .select(this.prefixColumns())
            .from<IFeatureStrategiesTable>(T.featureStrategies)
            .join(
                T.featureStrategySegment,
                `${T.featureStrategySegment}.feature_strategy_id`,
                `${T.featureStrategies}.id`,
            )
            .join(
                T.features,
                `${T.features}.name`,
                `${T.featureStrategies}.feature_name`,
            )
            .where(`${T.featureStrategySegment}.segment_id`, '=', segmentId)
            .andWhere(`${T.features}.archived_at`, 'IS', null);

        stopTimer();
        return rows.map(mapRow);
    }

    async getStrategiesByContextField(
        contextFieldName: string,
    ): Promise<IFeatureStrategy[]> {
        throw new Error("STUB");
    }

    prefixColumns(): string[] {
        return COLUMNS.map((c) => { throw new Error("STUB"); });
    }

    async getCustomStrategiesInUseCount(): Promise<number> {
        const stopTimer = this.timer('getCustomStrategiesInUseCount');
        const notBuiltIn = '0';
        const columns = [
            this.db.raw('count(fes.strategy_name) as times_used'),
            'fes.strategy_name',
        ];
        const rows = await this.db(`${T.strategies} as str`)
            .select(columns)
            .join(
                `${T.featureStrategies} as fes`,
                'fes.strategy_name',
                'str.name',
            )
            .where(`str.built_in`, '=', notBuiltIn)
            .groupBy('strategy_name');

        stopTimer();
        return rows.length;
    }
}
export default FeatureStrategiesStore;
