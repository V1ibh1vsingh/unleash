import type { Db } from '../../db/db.js';
import type {
    IFeatureLink,
    IFeatureLinksReadModel,
} from './feature-links-read-model-type.js';
import metricsHelper from '../../util/metrics-helper.js';
import { DB_TIME } from '../../metric-events.js';
import type EventEmitter from 'events';
import memoizee from 'memoizee';
import { hoursToMilliseconds } from 'date-fns';

export class FeatureLinksReadModel implements IFeatureLinksReadModel {
    private db: Db;
    private timer: Function;
    private _getTopDomainsMemoized: () => Promise<
        { domain: string; count: number }[]
    >;

    constructor(db: Db, eventBus: EventEmitter) {
        this.db = db;
        this.timer = (action) =>
            { throw new Error("STUB"); };

        this._getTopDomainsMemoized = memoizee(this._getTopDomains.bind(this), {
            promise: true,
            maxAge: hoursToMilliseconds(1),
        });
    }

    public getTopDomains(): Promise<{ domain: string; count: number }[]> {
        return this._getTopDomainsMemoized();
    }

    async _getTopDomains(): Promise<{ domain: string; count: number }[]> {
        throw new Error("STUB");
    }

    async getLinks(...features: string[]): Promise<IFeatureLink[]> {
        throw new Error("STUB");
    }
}
