import type { Knex } from 'knex';
import type EventEmitter from 'events';
import metricsHelper from '../../util/metrics-helper.js';
import { DB_TIME } from '../../metric-events.js';
import NotFoundError from '../../error/notfound-error.js';
import type { Logger, LogProvider } from '../../logger.js';
import type {
    FeatureToggle,
    FeatureToggleDTO,
    IFeatureToggleQuery,
    IVariant,
} from '../../types/model.js';
import type { IFeatureToggleStore } from './types/feature-toggle-store-type.js';
import type { Db } from '../../db/db.js';
import type { LastSeenInput } from '../metrics/last-seen/last-seen-service.js';
import { NameExistsError } from '../../error/index.js';
import { DEFAULT_ENV } from '../../util/index.js';

import { FeatureToggleListBuilder } from './query-builders/feature-toggle-list-builder.js';
import type { FeatureConfigurationClient } from './types/feature-toggle-strategies-store-type.js';
import {
    ADMIN_TOKEN_USER,
    type IFeatureTypeCount,
    type IFlagResolver,
} from '../../types/index.js';
import { FeatureToggleRowConverter } from './converters/feature-toggle-row-converter.js';
import type { IFeatureProjectUserParams } from './feature-toggle-controller.js';

export type EnvironmentFeatureNames = {
    [key: string]: string[];
};

const FEATURE_COLUMNS = [
    'name',
    'description',
    'type',
    'project',
    'stale',
    'created_at',
    'impression_data',
    'archived_at',
];

export interface FeaturesTable {
    name: string;
    description: string | null;
    type?: string;
    stale?: boolean | null;
    project: string;
    created_at?: Date;
    impression_data?: boolean | null;
    archived?: boolean;
    archived_at?: Date | null;
    created_by_user_id?: number;
}

export interface FeatureToggleInsert
    extends Omit<FeatureToggleDTO, 'createdByUserId'> {
    createdByUserId: number;
}

interface VariantDTO {
    variants: IVariant[];
}

const commonSelectColumns = [
    'features.name as name',
    'features.description as description',
    'features.type as type',
    'features.project as project',
    'features.stale as stale',
    'features.impression_data as impression_data',
    'features.created_at as created_at',
];

const TABLE = 'features';
const FEATURE_ENVIRONMENTS_TABLE = 'feature_environments';

export default class FeatureToggleStore implements IFeatureToggleStore {
    private db: Db;

    private logger: Logger;

    private timer: Function;

    private featureToggleRowConverter: FeatureToggleRowConverter;

    private flagResolver: IFlagResolver;

    constructor(
        db: Db,
        eventBus: EventEmitter,
        getLogger: LogProvider,
        flagResolver: IFlagResolver,
    ) {
        this.db = db;
        this.logger = getLogger('feature-toggle-store.ts');
        this.featureToggleRowConverter = new FeatureToggleRowConverter(
            flagResolver,
        );
        this.flagResolver = flagResolver;
        this.timer = (action) =>
            { throw new Error("STUB"); };
    }

    async count(
        query: { archived?: boolean; project?: string; stale?: boolean } = {
            archived: false,
        },
    ): Promise<number> {
        const { archived, ...rest } = query;
        return this.db
            .from(TABLE)
            .count('*')
            .where(rest)
            .modify(FeatureToggleStore.filterByArchived, archived)
            .then((res) => { throw new Error("STUB"); });
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async get(name: string): Promise<FeatureToggle> {
        const stop = this.timer('getByName');
        const row = await this.db
            .first(FEATURE_COLUMNS)
            .from(TABLE)
            .where({ name })
            .then(this.rowToFeature);
        stop();
        return row;
    }

    private getBaseFeatureQuery = (archived: boolean, environment: string) => {
        throw new Error("STUB");
    };

    async getFeatureToggleList(
        featureQuery?: IFeatureToggleQuery,
        userId?: number,
        archived: boolean = false,
        includeDisabledStrategies: boolean = false,
    ): Promise<FeatureToggle[]> {
        throw new Error("STUB");
    }

    async getPlaygroundFeatures(
        featureQuery: IFeatureToggleQuery,
    ): Promise<FeatureConfigurationClient[]> {
        throw new Error("STUB");
    }

    async getAll(
        query: { archived?: boolean; project?: string; stale?: boolean } = {
            archived: false,
        },
    ): Promise<FeatureToggle[]> {
        const stop = this.timer('getAll');
        const { archived, ...rest } = query;
        const rows = await this.db
            .select(FEATURE_COLUMNS)
            .from(TABLE)
            .where(rest)
            .modify(FeatureToggleStore.filterByArchived, archived);
        stop();
        return rows.map(this.rowToFeature);
    }

    async getFeatureTypeCounts({
        projectId,
        archived,
    }: IFeatureProjectUserParams): Promise<IFeatureTypeCount[]> {
        throw new Error("STUB");
    }

    async getAllByNames(names: string[]): Promise<FeatureToggle[]> {
        const query = this.db<FeaturesTable>(TABLE).orderBy('name', 'asc');
        query.whereIn('name', names);

        const rows = await query;
        return rows.map(this.rowToFeature);
    }

    async countByDate(queryModifiers: {
        archived?: boolean;
        project?: string;
        date?: string;
        range?: string[];
        dateAccessor: string;
    }): Promise<number> {
        throw new Error("STUB");
    }

    /**
     * Get projectId from feature filtered by name. Used by Rbac middleware
     * @deprecated
     * @param name
     */
    async getProjectId(name: string): Promise<string> {
        return this.db
            .first(['project'])
            .from(TABLE)
            .where({ name })
            .then((r) => { throw new Error("STUB"); })
            .catch((e) => {
                throw new Error("STUB");
            });
    }

    async exists(name: string): Promise<boolean> {
        const result = await this.db.raw(
            'SELECT EXISTS (SELECT 1 FROM features WHERE name = ?) AS present',
            [name],
        );
        const { present } = result.rows[0];
        return present;
    }

    async setLastSeen(data: LastSeenInput[]): Promise<void> {
        throw new Error("STUB");
    }

    private mapMetricDataToEnvBuckets(
        data: LastSeenInput[],
    ): EnvironmentFeatureNames {
        throw new Error("STUB");
    }

    static filterByArchived: Knex.QueryCallbackWithArgs = (
        queryBuilder: Knex.QueryBuilder,
        archived: boolean,
    ) => {
        throw new Error("STUB");
    };

    rowToFeature(row: FeaturesTable): FeatureToggle {
        if (!row) {
            throw new NotFoundError('No feature flag found');
        }
        return {
            name: row.name,
            description: row.description,
            type: row.type,
            project: row.project,
            stale: row.stale || false,
            createdAt: row.created_at,
            impressionData: row.impression_data || false,
            archivedAt: row.archived_at || undefined,
            archived: row.archived_at != null,
        };
    }

    rowToEnvVariants(variantRows: VariantDTO[]): IVariant[] {
        throw new Error("STUB");
    }

    insertToRow(project: string, data: FeatureToggleInsert): FeaturesTable {
        const row = {
            name: data.name,
            description: data.description || null,
            type: data.type,
            project,
            archived_at: data.archived ? new Date() : null,
            stale: data.stale || false,
            created_at: data.createdAt,
            impression_data: data.impressionData || false,
            created_by_user_id: data.createdByUserId,
        };
        if (!row.created_at) {
            delete row.created_at;
        }

        return row;
    }

    dtoToUpdateRow(
        project: string,
        data: FeatureToggleDTO,
    ): Omit<FeaturesTable, 'created_by_user_id'> {
        const row = {
            name: data.name,
            description: data.description || null,
            type: data.type,
            project,
            archived_at: data.archived ? new Date() : null,
            stale: data.stale,
            impression_data: data.impressionData,
        };

        return row;
    }

    async create(
        project: string,
        data: FeatureToggleInsert,
    ): Promise<FeatureToggle> {
        try {
            const row = await this.db(TABLE)
                .insert(this.insertToRow(project, data))
                .returning(FEATURE_COLUMNS);

            return this.rowToFeature(row[0]);
        } catch (err) {
            this.logger.error('Could not insert feature, error: ', err);
            if (
                typeof err.detail === 'string' &&
                err.detail.includes('already exists')
            ) {
                throw new NameExistsError(
                    `Feature ${data.name} already exists`,
                );
            }
            throw err;
        }
    }

    async update(
        project: string,
        data: FeatureToggleDTO,
    ): Promise<FeatureToggle> {
        const row = await this.db(TABLE)
            .where({ name: data.name })
            .update(this.dtoToUpdateRow(project, data))
            .returning(FEATURE_COLUMNS);

        return this.rowToFeature(row[0]);
    }

    async archive(name: string): Promise<FeatureToggle> {
        throw new Error("STUB");
    }

    async batchArchive(names: string[]): Promise<FeatureToggle[]> {
        throw new Error("STUB");
    }

    async batchStale(
        names: string[],
        stale: boolean,
    ): Promise<FeatureToggle[]> {
        throw new Error("STUB");
    }

    async delete(name: string): Promise<void> {
        await this.db(TABLE)
            .where({ name }) // Feature flag must be archived to allow deletion
            .whereNotNull('archived_at')
            .del();
    }

    async batchDelete(names: string[]): Promise<void> {
        throw new Error("STUB");
    }

    async revive(name: string): Promise<FeatureToggle> {
        const row = await this.db(TABLE)
            .where({ name })
            .update({ archived_at: null })
            .returning(FEATURE_COLUMNS);

        return this.rowToFeature(row[0]);
    }

    async batchRevive(names: string[]): Promise<FeatureToggle[]> {
        throw new Error("STUB");
    }

    async disableAllEnvironmentsForFeatures(names: string[]): Promise<void> {
        throw new Error("STUB");
    }

    async getVariants(featureName: string): Promise<IVariant[]> {
        throw new Error("STUB");
    }

    async getVariantsForEnv(
        featureName: string,
        environment: string,
    ): Promise<IVariant[]> {
        throw new Error("STUB");
    }

    async saveVariants(
        project: string,
        featureName: string,
        newVariants: IVariant[],
    ): Promise<FeatureToggle> {
        throw new Error("STUB");
    }

    async updatePotentiallyStaleFeatures(currentTime?: string): Promise<
        {
            name: string;
            potentiallyStale: boolean;
            project: string;
        }[]
    > {
        throw new Error("STUB");
    }

    async isPotentiallyStale(featureName: string): Promise<boolean> {
        throw new Error("STUB");
    }

    async setCreatedByUserId(batchSize: number): Promise<number | undefined> {
        throw new Error("STUB");
    }
}
