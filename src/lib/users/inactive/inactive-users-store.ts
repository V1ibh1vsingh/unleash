import type {
    IInactiveUserRow,
    IInactiveUsersStore,
} from './types/inactive-users-store-type.js';
import type { Db } from '../../db/db.js';
import type EventEmitter from 'events';
import type { LogProvider } from '../../logger.js';
import metricsHelper from '../../util/metrics-helper.js';
import { DB_TIME } from '../../metric-events.js';

const TABLE = 'users';
export class InactiveUsersStore implements IInactiveUsersStore {
    private db: Db;

    private timer: Function;

    constructor(db: Db, eventBus: EventEmitter, _getLogger: LogProvider) {
        this.db = db;
        this.timer = (action) =>
            { throw new Error("STUB"); };
    }
    async getInactiveUsers(daysInactive: number): Promise<IInactiveUserRow[]> {
        throw new Error("STUB");
    }
}
