import type EventEmitter from 'events';
import type { LogProvider, Logger } from '../../../logger.js';
import { DB_TIME } from '../../../metric-events.js';
import type { Db } from '../../../types/index.js';
import metricsHelper from '../../../util/metrics-helper.js';
import type { LastSeenInput } from './last-seen-service.js';
import type { ILastSeenStore } from './types/last-seen-store-type.js';

const TABLE = 'last_seen_at_metrics';

const prepareLastSeenInput = (data: LastSeenInput[]) => {
    throw new Error("STUB");
};

export default class LastSeenStore implements ILastSeenStore {
    private db: Db;

    private logger: Logger;

    private timer: Function;

    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider) {
        this.db = db;
        this.logger = getLogger('last-seen-store.ts');
        this.timer = (action) =>
            { throw new Error("STUB"); };
    }

    async setLastSeen(data: LastSeenInput[]): Promise<void> {
        throw new Error("STUB");
    }

    async cleanLastSeen() {
        throw new Error("STUB");
    }
}
