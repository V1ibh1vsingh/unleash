import { Counter, Gauge, type Registry } from 'prom-client';
import { BatchHistogram } from './batch-histogram.js';

export interface NumericMetricSample {
    labels?: Record<string, string | number>;
    value: number;
}

export interface BucketMetricSample {
    labels?: Record<string, string | number>;
    count: number;
    sum: number;
    buckets: Array<{ le: number | '+Inf'; count: number }>;
}

export interface NumericMetric {
    name: string;
    help: string;
    type: 'counter' | 'gauge';
    samples: NumericMetricSample[];
}

export interface BucketMetric {
    name: string;
    help: string;
    type: 'histogram';
    samples: BucketMetricSample[];
}

export type Metric = NumericMetric | BucketMetric;

export class MetricsTranslator {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    sanitizeName(name: string): string {
        throw new Error("STUB");
    }

    private hasNewLabels(
        existingMetric: Counter<string> | Gauge<string> | BatchHistogram,
        newLabelNames: string[],
    ): boolean {
        throw new Error("STUB");
    }

    private hasNewBuckets(
        existingHistogram: BatchHistogram,
        newBuckets: Array<{ le: number | '+Inf'; count: number }>,
    ): boolean {
        throw new Error("STUB");
    }

    private buildLabels(
        sample: NumericMetricSample | BucketMetricSample,
        type: string,
    ): Record<string, string | number> {
        throw new Error("STUB");
    }

    private resolveCounter(
        name: string,
        help: string,
        labelNames: string[],
    ): Counter<string> {
        throw new Error("STUB");
    }

    private resolveGauge(
        name: string,
        help: string,
        labelNames: string[],
    ): Gauge<string> {
        throw new Error("STUB");
    }

    private resolveHistogram(
        name: string,
        help: string,
        labelNames: string[],
        samples: BucketMetricSample[],
    ): BatchHistogram {
        throw new Error("STUB");
    }

    private collectLabelNames(metric: Metric): string[] {
        throw new Error("STUB");
    }

    translateMetric(
        metric: Metric,
    ): Counter<string> | Gauge<string> | BatchHistogram | null {
        throw new Error("STUB");
    }

    translateMetrics(metrics: Metric[]): Registry {
        throw new Error("STUB");
    }

    serializeMetrics(): Promise<string> {
        throw new Error("STUB");
    }

    translateAndSerializeMetrics(metrics: Metric[]): Promise<string> {
        throw new Error("STUB");
    }
}
