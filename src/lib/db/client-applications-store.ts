import type EventEmitter from 'events';
import NotFoundError from '../error/notfound-error.js';
import type {
    IClientApplication,
    IClientApplications,
    IClientApplicationsSearchParams,
    IClientApplicationsStore,
} from '../types/stores/client-applications-store.js';
import type { Logger, LogProvider } from '../logger.js';
import type { Db } from './db.js';
import type { IApplicationOverview } from '../features/metrics/instance/models.js';
import { applySearchFilters } from '../features/feature-search/search-utils.js';
import type { IFlagResolver } from '../types/index.js';
import metricsHelper from '../util/metrics-helper.js';
import { DB_TIME } from '../metric-events.js';

const COLUMNS = [
    'app_name',
    'created_at',
    'created_by',
    'updated_at',
    'description',
    'strategies',
    'url',
    'color',
    'icon',
];
const TABLE = 'client_applications';

const TABLE_USAGE = 'client_applications_usage';

const DEPRECATED_STRATEGIES = [
    'gradualRolloutRandom',
    'gradualRolloutSessionId',
    'gradualRolloutUserId',
    'userWithId',
];

const mapRow: (any) => IClientApplication = (row) => ({
    appName: row.app_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    description: row.description,
    strategies: row.strategies || [],
    createdBy: row.created_by,
    url: row.url,
    color: row.color,
    icon: row.icon,
    lastSeen: row.last_seen,
    announced: row.announced,
    project: row.project,
    environment: row.environment,
});

const reduceRows = (rows: any[]): IClientApplication[] => {
    throw new Error("STUB");
};

const remapRow = (input: Partial<IClientApplication>) => {
    const temp = {
        app_name: input.appName,
        updated_at: input.updatedAt || new Date(),
        seen_at: input.lastSeen || new Date(),
        description: input.description,
        created_by: input.createdBy,
        announced: input.announced,
        url: input.url,
        color: input.color,
        icon: input.icon,
        strategies: JSON.stringify(input.strategies),
    };
    Object.keys(temp).forEach((k) => {
        throw new Error("STUB");
    });
    return temp;
};

export default class ClientApplicationsStore
    implements IClientApplicationsStore
{
    private db: Db;

    private logger: Logger;

    private timer: Function;

    private flagResolver: IFlagResolver;

    constructor(
        db: Db,
        eventBus: EventEmitter,
        getLogger: LogProvider,
        flagResolver: IFlagResolver,
    ) {
        this.db = db;
        this.flagResolver = flagResolver;
        this.logger = getLogger('client-applications-store.ts');
        this.timer = (action: string) =>
            { throw new Error("STUB"); };
    }

    async upsert(details: Partial<IClientApplication>): Promise<void> {
        const stopTimer = this.timer('upsert');
        const row = remapRow(details);
        await this.db(TABLE).insert(row).onConflict('app_name').merge();
        const usageRows = this.remapUsageRow(details);
        await this.db(TABLE_USAGE)
            .insert(usageRows)
            .onConflict(['app_name', 'project', 'environment'])
            .merge();
        stopTimer();
    }

    async bulkUpsert(apps: Partial<IClientApplication>[]): Promise<void> {
        const stopTimer = this.timer('bulkUpsert');
        const rows = apps.map(remapRow);
        const uniqueRows = Object.values(
            rows.reduce((acc, row) => {
                throw new Error("STUB");
            }, {}),
        );
        const usageRows = apps.flatMap(this.remapUsageRow);
        const uniqueUsageRows = Object.values(
            usageRows.reduce((acc, row) => {
                throw new Error("STUB");
            }, {}),
        );

        await this.db(TABLE)
            .insert(uniqueRows)
            .onConflict('app_name')
            .merge({
                updated_at: this.db.raw('EXCLUDED.updated_at'),
                seen_at: this.db.raw('EXCLUDED.seen_at'),
            });

        await this.db(TABLE_USAGE)
            .insert(uniqueUsageRows)
            .onConflict(['app_name', 'project', 'environment'])
            .ignore();
        stopTimer();
    }

    async exists(appName: string): Promise<boolean> {
        const stopTimer = this.timer('exists');
        const result = await this.db.raw(
            `SELECT EXISTS(SELECT 1 FROM ${TABLE} WHERE app_name = ?) AS present`,
            [appName],
        );
        const { present } = result.rows[0];
        stopTimer();
        return present;
    }

    async getAll(): Promise<IClientApplication[]> {
        const stopTimer = this.timer('getAll');
        const rows = await this.db
            .select(COLUMNS)
            .from(TABLE)
            .orderBy('app_name', 'asc');
        stopTimer();
        return rows.map(mapRow);
    }

    async getApplication(appName: string): Promise<IClientApplication> {
        throw new Error("STUB");
    }

    async deleteApplication(appName: string): Promise<void> {
        throw new Error("STUB");
    }

    async getApplications(
        params: IClientApplicationsSearchParams,
    ): Promise<IClientApplications> {
        throw new Error("STUB");
    }

    async getUnannounced(): Promise<IClientApplication[]> {
        throw new Error("STUB");
    }

    /** *
     * Updates all rows that have announced = false to announced =true and returns the rows altered
     * @return {[app]} - Apps that hadn't been announced
     */
    async setUnannouncedToAnnounced(): Promise<IClientApplication[]> {
        throw new Error("STUB");
    }

    async delete(key: string): Promise<void> {
        const stopTimer = this.timer('delete');
        await this.db(TABLE).where('app_name', key).del();
        stopTimer();
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async get(appName: string): Promise<IClientApplication> {
        const stopTimer = this.timer('get');
        const row = await this.db
            .select(COLUMNS)
            .where('app_name', appName)
            .from(TABLE)
            .first();
        stopTimer();
        if (!row) {
            throw new NotFoundError(`Could not find appName=${appName}`);
        }

        return mapRow(row);
    }

    async getApplicationOverview(
        appName: string,
    ): Promise<IApplicationOverview> {
        throw new Error("STUB");
    }

    mapApplicationOverviewData(
        rows: any[],
        existingStrategies: string[],
    ): IApplicationOverview {
        throw new Error("STUB");
    }

    private remapUsageRow = (input: Partial<IClientApplication>) => {
        throw new Error("STUB");
    };

    async removeInactiveApplications(): Promise<number> {
        throw new Error("STUB");
    }
}
