import type EventEmitter from 'events';
import type { Logger, LogProvider } from '../logger.js';
import type {
    IClientInstance,
    IClientInstanceStore,
    INewClientInstance,
} from '../types/stores/client-instance-store.js';
import { subDays } from 'date-fns';
import type { Db } from './db.js';
import metricsHelper from '../util/metrics-helper.js';
import { DB_TIME } from '../metric-events.js';

const COLUMNS = [
    'app_name',
    'instance_id',
    'sdk_version',
    'client_ip',
    'last_seen',
    'created_at',
    'environment',
];
const TABLE = 'client_instances';

const mapRow = (row): IClientInstance => ({
    appName: row.app_name,
    instanceId: row.instance_id,
    sdkVersion: row.sdk_version,
    sdkType: row.sdk_type,
    clientIp: row.client_ip,
    lastSeen: row.last_seen,
    createdAt: row.created_at,
    environment: row.environment,
});

const mapToDb = (client: INewClientInstance) => {
    const temp = {
        app_name: client.appName,
        instance_id: client.instanceId,
        sdk_version: client.sdkVersion,
        sdk_type: client.sdkType,
        client_ip: client.clientIp,
        last_seen: client.lastSeen || 'now()',
        environment: client.environment,
    };

    const result = {};
    for (const [key, value] of Object.entries(temp)) {
        if (value !== undefined) {
            result[key] = value;
        }
    }

    return result;
};

export default class ClientInstanceStore implements IClientInstanceStore {
    private db: Db;

    private logger: Logger;

    private eventBus: EventEmitter;

    private metricTimer: Function;

    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider) {
        this.db = db;
        this.eventBus = eventBus;
        this.logger = getLogger('client-instance-store.ts');
        this.metricTimer = (action) =>
            { throw new Error("STUB"); };
    }

    async removeOldInstances(): Promise<void> {
        throw new Error("STUB");
    }

    async bulkUpsert(instances: INewClientInstance[]): Promise<void> {
        const stopTimer = this.metricTimer('bulkUpsert');

        const rows = instances.map(mapToDb);
        await this.db(TABLE)
            .insert(rows)
            .onConflict(['app_name', 'instance_id', 'environment'])
            .merge();

        stopTimer();
    }

    async delete({
        appName,
        instanceId,
    }: Pick<INewClientInstance, 'appName' | 'instanceId'>): Promise<void> {
        await this.db(TABLE)
            .where({
                app_name: appName,
                instance_id: instanceId,
            })
            .del();
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    async get({
        appName,
        instanceId,
    }: Pick<
        INewClientInstance,
        'appName' | 'instanceId'
    >): Promise<IClientInstance> {
        const row = await this.db(TABLE)
            .where({
                app_name: appName,
                instance_id: instanceId,
            })
            .first();
        return mapRow(row);
    }

    async exists({
        appName,
        instanceId,
    }: Pick<INewClientInstance, 'appName' | 'instanceId'>): Promise<boolean> {
        const result = await this.db.raw(
            `SELECT EXISTS (SELECT 1 FROM ${TABLE} WHERE app_name = ? AND instance_id = ?) AS present`,
            [appName, instanceId],
        );
        const { present } = result.rows[0];
        return present;
    }

    async upsert(details: INewClientInstance): Promise<void> {
        const stopTimer = this.metricTimer('insert');

        await this.db(TABLE)
            .insert(mapToDb(details))
            .onConflict(['app_name', 'instance_id', 'environment'])
            .merge();

        stopTimer();
    }

    async getAll(): Promise<IClientInstance[]> {
        const stopTimer = this.metricTimer('getAll');

        const rows = await this.db
            .select(COLUMNS)
            .from(TABLE)
            .orderBy('last_seen', 'desc');

        const toggles = rows.map(mapRow);

        stopTimer();

        return toggles;
    }

    async getByAppName(appName: string): Promise<IClientInstance[]> {
        throw new Error("STUB");
    }

    async getRecentByAppNameAndEnvironment(
        appName: string,
        environment: string,
    ): Promise<IClientInstance[]> {
        throw new Error("STUB");
    }

    async getBySdkName(sdkName: string): Promise<IClientInstance[]> {
        throw new Error("STUB");
    }

    async groupApplicationsBySdk(): Promise<
        { sdkVersion: string; applications: string[] }[]
    > {
        throw new Error("STUB");
    }
    async groupApplicationsBySdkAndProject(
        projectId: string,
    ): Promise<{ sdkVersion: string; applications: string[] }[]> {
        throw new Error("STUB");
    }

    async getDistinctApplications(): Promise<string[]> {
        throw new Error("STUB");
    }

    async getDistinctApplicationsCount(daysBefore?: number): Promise<number> {
        const distinctApplications = this.db
            .select('app_name')
            .from(TABLE)
            .modify((qb) => {
                throw new Error("STUB");
            })
            .groupBy('app_name')
            .as('subquery');

        const query = this.db.from(distinctApplications).count('* as count');

        return query.then((res) => { throw new Error("STUB"); });
    }

    async deleteForApplication(appName: string): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}
}
