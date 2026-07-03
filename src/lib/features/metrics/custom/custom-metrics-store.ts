import type { Logger } from '../../../logger.js';
import type { IUnleashConfig } from '../../../types/index.js';

export interface StoredCustomMetric {
    name: string;
    value: number;
    labels?: Record<string, string>;
    timestamp: Date;
}

export interface ICustomMetricsStore {
    addMetric(metric: Omit<StoredCustomMetric, 'timestamp'>): void;
    addMetrics(metrics: Omit<StoredCustomMetric, 'timestamp'>[]): void;
    getMetrics(): StoredCustomMetric[];
    getMetricsByName(name: string): StoredCustomMetric[];
    getMetricNames(): string[];
    getPrometheusMetrics(): string;
}

export class CustomMetricsStore implements ICustomMetricsStore {
    private logger: Logger;
    private customMetricsStore: Map<string, StoredCustomMetric> = new Map();

    constructor(config: IUnleashConfig) {
        this.logger = config.getLogger('custom-metrics-store');
    }

    private roundToMinute(date: Date): Date {
        throw new Error("STUB");
    }

    private getMetricKey(
        metric: Omit<StoredCustomMetric, 'timestamp'>,
        timestamp: Date,
    ): string {
        throw new Error("STUB");
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

    getMetricsByName(name: string): StoredCustomMetric[] {
        throw new Error("STUB");
    }

    getMetricNames(): string[] {
        throw new Error("STUB");
    }

    getPrometheusMetrics(): string {
        throw new Error("STUB");
    }

    private escapePrometheusString(str: string): string {
        throw new Error("STUB");
    }
}
