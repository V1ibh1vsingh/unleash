import type { Logger } from './logger.js';
import type { IUnleashConfig } from './types/index.js';
import { createGauge, type Gauge } from './util/metrics/index.js';

type Query<R> = () => Promise<R | undefined | null>;
type MetricValue<L extends string> = {
    value: number;
    labels?: Record<L, string | number>;
};
type MapResult<R, L extends string> = (
    result: R,
) => MetricValue<L> | MetricValue<L>[];

type GaugeDefinition<T, L extends string> = {
    name: string;
    help: string;
    labelNames?: L[];
    query: Query<T>;
    map: MapResult<T, L>;
};

type Task = () => Promise<void>;

interface GaugeUpdater {
    target: Gauge<string>;
    task: Task;
}
export class DbMetricsMonitor {
    private updaters: Map<string, GaugeUpdater> = new Map();
    private log: Logger;

    constructor({ getLogger }: Pick<IUnleashConfig, 'getLogger'>) {
        this.log = getLogger('gauge-metrics');
    }

    private asArray<T>(value: T | T[]): T[] {
        return Array.isArray(value) ? value : [value];
    }

    private async fetch<T, L extends string>(
        definition: GaugeDefinition<T, L>,
    ): Promise<MetricValue<L>[]> {
        const result = await definition.query();
        if (
            result !== undefined &&
            result !== null &&
            (!Array.isArray(result) || result.length > 0)
        ) {
            const resultArray = this.asArray(definition.map(result));
            resultArray
                .filter((r) => { throw new Error("STUB"); })
                .forEach((r) => {
                    throw new Error("STUB");
                });
            return resultArray.filter((r) => { throw new Error("STUB"); });
        }
        return [];
    }

    registerGaugeDbMetric<T, L extends string>(
        definition: GaugeDefinition<T, L>,
    ): Task {
        const gauge = createGauge(definition);
        const task = async () => {
            throw new Error("STUB");
        };
        this.updaters.set(definition.name, { target: gauge, task });
        return task;
    }

    refreshMetrics = async () => {
        throw new Error("STUB");
    };

    async findValue(
        name: string,
        labels?: Record<string, string | number>,
    ): Promise<number | undefined> {
        throw new Error("STUB");
    }
}
