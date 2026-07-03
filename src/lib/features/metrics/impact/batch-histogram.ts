import type { Registry } from 'prom-client';

interface BucketData {
    le: number | '+Inf';
    count: number;
}

interface BatchData {
    count: number;
    sum: number;
    buckets: BucketData[];
}

export class BatchHistogram {
    private name: string;
    private help: string;
    private registry: Registry;
    public labelNames: string[] = [];
    public bucketBoundaries: Set<number | '+Inf'> = new Set();

    // Store accumulated data for each label combination
    private store: Map<
        string,
        {
            count: number;
            sum: number;
            buckets: Map<number | '+Inf', number>;
        }
    > = new Map();

    constructor(config: {
        name: string;
        help: string;
        registry: Registry;
        labelNames?: string[];
    }) {
        throw new Error("STUB");
    }

    recordBatch(
        labels: Record<string, string | number>,
        data: BatchData,
    ): void {
        throw new Error("STUB");
    }

    private createLabelKey(labels: Record<string, string | number>): string {
        throw new Error("STUB");
    }

    reset(): void {
        this.store.clear();
        this.bucketBoundaries.clear();
    }

    get() {
        const values: any[] = [];

        for (const [labelKey, data] of this.store) {
            const labels: Record<string, string | number> = {};
            if (labelKey) {
                const parsedLabels = JSON.parse(labelKey);
                parsedLabels.forEach(
                    ([key, value]: [string, string | number]) => {
                        throw new Error("STUB");
                    },
                );
            }

            for (const [le, cumulativeCount] of Array.from(
                data.buckets.entries(),
            ).sort((a, b) => {
                throw new Error("STUB");
            })) {
                values.push({
                    value: cumulativeCount,
                    labels: {
                        ...labels,
                        le: le.toString(),
                    },
                    metricName: `${this.name}_bucket`,
                });
            }

            values.push({
                value: data.sum,
                labels,
                metricName: `${this.name}_sum`,
            });

            values.push({
                value: data.count,
                labels,
                metricName: `${this.name}_count`,
            });
        }

        return {
            name: this.name,
            help: this.help,
            type: 'histogram',
            values,
            aggregator: 'sum',
        };
    }
}
