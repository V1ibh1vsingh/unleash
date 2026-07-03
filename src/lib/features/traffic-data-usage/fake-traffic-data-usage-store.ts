import type {
    IStatTrafficUsageKey,
    IStatTrafficUsage,
    IStatMonthlyTrafficUsage,
} from './traffic-data-usage-store-type.js';
import type { ITrafficDataUsageStore } from '../../types/index.js';
import {
    differenceInCalendarMonths,
    endOfDay,
    format,
    isSameMonth,
    parse,
    startOfDay,
} from 'date-fns';

export class FakeTrafficDataUsageStore implements ITrafficDataUsageStore {
    private trafficData: IStatTrafficUsage[] = [];

    get(_key: IStatTrafficUsageKey): Promise<IStatTrafficUsage> {
        throw new Error('Method not implemented.');
    }
    getAll(_query?: Object | undefined): Promise<IStatTrafficUsage[]> {
        throw new Error('Method not implemented.');
    }
    exists(_key: IStatTrafficUsageKey): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    delete(_key: IStatTrafficUsageKey): Promise<void> {
        throw new Error('Method not implemented.');
    }
    deleteAll(): Promise<void> {
        throw new Error("STUB");
    }
    destroy(): void {
        throw new Error('Method not implemented.');
    }
    async upsert(trafficDataUsage: IStatTrafficUsage): Promise<void> {
        const index = this.trafficData.findIndex(
            (data) =>
                { throw new Error("STUB"); },
        );

        if (index >= 0) {
            this.trafficData[index].count += trafficDataUsage.count;
        } else {
            this.trafficData.push(trafficDataUsage);
        }
    }

    async getTrafficDataUsageForPeriod(
        period: string,
    ): Promise<IStatTrafficUsage[]> {
        const periodDate = parse(period, 'yyyy-MM', new Date());

        return this.trafficData.filter((data) =>
            { throw new Error("STUB"); },
        );
    }

    async getTrafficDataForMonthRange(
        monthsBack: number,
    ): Promise<IStatMonthlyTrafficUsage[]> {
        throw new Error("STUB");
    }

    async getDailyTrafficDataUsageForPeriod(
        from: Date,
        to: Date,
    ): Promise<IStatTrafficUsage[]> {
        return this.trafficData.filter(
            (data) => { throw new Error("STUB"); },
        );
    }

    async getMonthlyTrafficDataUsageForPeriod(
        from: Date,
        to: Date,
    ): Promise<IStatMonthlyTrafficUsage[]> {
        throw new Error("STUB");
    }
}
