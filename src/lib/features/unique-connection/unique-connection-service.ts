import type { IUnleashConfig } from '../../types/option.js';
import type { IFlagResolver, IUnleashStores } from '../../types/index.js';
import type {
    BucketId,
    IUniqueConnectionStore,
} from './unique-connection-store-type.js';
import HyperLogLog from 'hyperloglog-lite';
import type EventEmitter from 'events';
import { SDK_CONNECTION_ID_RECEIVED } from '../../metric-events.js';
import { REGISTERS_EXPONENT } from './hyperloglog-config.js';

export class UniqueConnectionService {
    private uniqueConnectionStore: IUniqueConnectionStore;

    private flagResolver: IFlagResolver;

    private eventBus: EventEmitter;

    private activeHour: number;

    private hll = HyperLogLog(REGISTERS_EXPONENT);

    private backendHll = HyperLogLog(REGISTERS_EXPONENT);

    private frontendHll = HyperLogLog(REGISTERS_EXPONENT);

    constructor(
        {
            uniqueConnectionStore,
        }: Pick<IUnleashStores, 'uniqueConnectionStore'>,
        config: Pick<IUnleashConfig, 'getLogger' | 'flagResolver' | 'eventBus'>,
    ) {
        this.uniqueConnectionStore = uniqueConnectionStore;
        this.flagResolver = config.flagResolver;
        this.eventBus = config.eventBus;
        this.activeHour = new Date().getHours();
    }

    listen() {
        this.eventBus.on(SDK_CONNECTION_ID_RECEIVED, this.count.bind(this));
    }

    count({
        connectionId,
        type,
    }: {
        connectionId: string;
        type: 'frontend' | 'backend';
    }) {
        if (!this.flagResolver.isEnabled('uniqueSdkTracking')) return;
        const value = HyperLogLog.hash(connectionId);
        this.hll.add(value);
        if (type === 'frontend') {
            this.frontendHll.add(value);
        } else if (type === 'backend') {
            this.backendHll.add(value);
        }
    }

    async sync(currentTime = new Date()): Promise<void> {
        throw new Error("STUB");
    }

    private resetHll(bucketId: BucketId) {
        throw new Error("STUB");
    }

    private getHll(bucketId: BucketId) {
        throw new Error("STUB");
    }

    private async syncBuckets(
        currentTime: Date,
        current: BucketId,
        previous: BucketId,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
