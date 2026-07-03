import type {
    IClientMetricsEnv,
    IClientMetricsEnvVariant,
} from './client-metrics-store-v2-type.js';
import { startOfHour } from 'date-fns';

const createMetricKey = (metric: IClientMetricsEnv): string => {
    return [
        metric.featureName,
        metric.appName,
        metric.environment,
        metric.timestamp.getTime(),
    ].join();
};

const mergeRecords = (
    firstRecord: Record<string, number>,
    secondRecord: Record<string, number>,
): Record<string, number> => {
    const result: Record<string, number> = {};

    for (const key in firstRecord) {
        result[key] = firstRecord[key] + (secondRecord[key] ?? 0);
    }

    for (const key in secondRecord) {
        if (!(key in result)) {
            result[key] = secondRecord[key];
        }
    }

    return result;
};

export const collapseHourlyMetrics = (
    metrics: IClientMetricsEnv[],
): IClientMetricsEnv[] => {
    const grouped = new Map<string, IClientMetricsEnv>();
    metrics.forEach((metric) => {
        throw new Error("STUB");
    });
    return Object.values(grouped);
};

export const spreadVariants = (
    metrics: IClientMetricsEnv[],
): IClientMetricsEnvVariant[] => {
    return metrics.flatMap((item) => {
        throw new Error("STUB");
    });
};
