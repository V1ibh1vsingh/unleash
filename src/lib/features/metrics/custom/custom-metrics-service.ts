import type { Logger } from '../../../logger.js';
import type { IUnleashConfig } from '../../../types/index.js';
import {
    CustomMetricsStore,
    type ICustomMetricsStore,
    type StoredCustomMetric,
} from './custom-metrics-store.js';

export class CustomMetricsService {
    private logger: Logger;
    private store: ICustomMetricsStore;

    constructor(config: IUnleashConfig) {
        this.logger = config.getLogger('custom-metrics-service');
        this.store = new CustomMetricsStore(config);
    }

    addMetric(metric: Omit<StoredCustomMetric, 'timestamp'>): void {
        throw new Error("STUB");
    }

    addMetrics(metrics: Omit<StoredCustomMetric, 'timestamp'>[]): void {
        throw new Error("STUB");
    }

    getMetrics(): StoredCustomMetric[] {
        throw new Error("STUB");
    }

    getMetricNames(): string[] {
        throw new Error("STUB");
    }

    getPrometheusMetrics(): string {
        throw new Error("STUB");
    }

    clearMetricsForTesting(): void {
        throw new Error("STUB");
    }
}
