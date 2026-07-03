import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import type { Db } from '../../db/db.js';
import type { LogProvider } from '../../logger.js';
import type {
    IStatMonthlyTrafficUsage,
    IStatTrafficUsage,
    IStatTrafficUsageKey,
    ITrafficDataUsageStore,
} from './traffic-data-usage-store-type.js';

const TABLE = 'stat_traffic_usage';
const COLUMNS = ['day', 'traffic_group', 'status_code_series', 'count'];

const toRow = (trafficDataUsage: IStatTrafficUsage) => {
    return {
        day: trafficDataUsage.day,
        traffic_group: trafficDataUsage.trafficGroup,
        status_code_series: trafficDataUsage.statusCodeSeries,
        count: trafficDataUsage.count,
    };
};

const mapRow = (row: any): IStatTrafficUsage => {
    return {
        day: row.day,
        trafficGroup: row.traffic_group,
        statusCodeSeries: row.status_code_series,
        count: Number.parseInt(row.count, 10),
    };
};

export class TrafficDataUsageStore implements ITrafficDataUsageStore {
    private db: Db;

    constructor(db: Db, _getLogger: LogProvider) {
        this.db = db;
    }
    async get(key: IStatTrafficUsageKey): Promise<IStatTrafficUsage> {
        const row = await this.db
            .table(TABLE)
            .select()
            .where({
                day: key.day,
                traffic_group: key.trafficGroup,
                status_code_series: key.statusCodeSeries,
            })
            .first();

        return mapRow(row);
    }
    async getAll(query = {}): Promise<IStatTrafficUsage[]> {
        const rows = await this.db.select(COLUMNS).where(query).from(TABLE);
        return rows.map(mapRow);
    }
    async exists(key: IStatTrafficUsageKey): Promise<boolean> {
        const result = await this.db.raw(
            `SELECT EXISTS (SELECT 1 FROM ${TABLE} WHERE
                day = ? AND
                traffic_group = ? AND
                status_code_series ?) AS present`,
            [key.day, key.trafficGroup, key.statusCodeSeries],
        );
        const { present } = result.rows[0];
        return present;
    }
    async delete(key: IStatTrafficUsageKey): Promise<void> {
        await this.db(TABLE)
            .where({
                day: key.day,
                traffic_group: key.trafficGroup,
                status_code_series: key.statusCodeSeries,
            })
            .del();
    }
    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }
    destroy(): void {}

    async upsert(trafficDataUsage: IStatTrafficUsage): Promise<void> {
        const row = toRow(trafficDataUsage);
        await this.db(TABLE)
            .insert(row)
            .onConflict(['day', 'traffic_group', 'status_code_series'])
            .merge({
                count: this.db.raw('stat_traffic_usage.count + EXCLUDED.count'),
            });
    }

    async getDailyTrafficDataUsageForPeriod(
        from: Date,
        to: Date,
    ): Promise<IStatTrafficUsage[]> {
        const rows = await this.db<IStatTrafficUsage>(TABLE)
            .where('day', '>=', startOfDay(from))
            .andWhere('day', '<=', endOfDay(to));

        return rows.map(mapRow);
    }

    async getMonthlyTrafficDataUsageForPeriod(
        from: Date,
        to: Date,
    ): Promise<IStatMonthlyTrafficUsage[]> {
        throw new Error("STUB");
    }

    async getTrafficDataUsageForPeriod(
        period: string,
    ): Promise<IStatTrafficUsage[]> {
        const month = new Date(period);
        return this.getDailyTrafficDataUsageForPeriod(
            startOfMonth(month),
            endOfMonth(month),
        );
    }
}
