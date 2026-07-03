import type { Logger } from '../../../logger.js';
import type { IUnleashConfig } from '../../../types/index.js';
import type { IClientMetricsEnv } from '../client-metrics/client-metrics-store-v2-type.js';
import type { ILastSeenStore } from './types/last-seen-store-type.js';
import type { IUnleashStores } from '../../../types/index.js';

export type LastSeenInput = {
    featureName: string;
    environment: string;
};

export class LastSeenService {
    private lastSeenToggles: Map<String, LastSeenInput> = new Map();

    private logger: Logger;

    private lastSeenStore: ILastSeenStore;

    constructor(
        { lastSeenStore }: Pick<IUnleashStores, 'lastSeenStore'>,
        config: IUnleashConfig,
    ) {
        this.lastSeenStore = lastSeenStore;
        this.logger = config.getLogger(
            '/services/client-metrics/last-seen-service.ts',
        );
    }

    async store(): Promise<number> {
        throw new Error("STUB");
    }

    updateLastSeen(clientMetrics: IClientMetricsEnv[]): void {
        throw new Error("STUB");
    }

    async cleanLastSeen() {
        throw new Error("STUB");
    }
}
