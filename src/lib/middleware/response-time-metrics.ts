import { performance } from 'node:perf_hooks';
import { REQUEST_TIME, SDK_CONNECTION_ID_RECEIVED } from '../metric-events.js';
import type EventEmitter from 'events';
import type { RequestHandler } from 'express';
import type { IFlagResolver } from '../internals.js';
import type { InstanceStatsService } from '../server-impl.js';

const appNameReportingThreshold = 1000;

export const storeRequestedRoute: RequestHandler = (req, res, next) => {
    throw new Error("STUB");
};

function collapse(path: string): string {
    let prefix = '';
    if (path) {
        if (path.startsWith('/api/admin')) {
            prefix = '/api/admin/';
        } else if (path.startsWith('/api/client')) {
            prefix = '/api/client/';
        } else if (path.startsWith('/api/frontend')) {
            prefix = '/api/frontend/';
        } else if (path.startsWith('/api')) {
            prefix = '/api/';
        } else if (path.startsWith('/edge')) {
            prefix = '/edge/';
        } else if (path.startsWith('/auth')) {
            prefix = '/auth/';
        }
    }

    return `${prefix}(hidden)`;
}

export function responseTimeMetrics(
    eventBus: EventEmitter,
    flagResolver: IFlagResolver,
    instanceStatsService: Pick<InstanceStatsService, 'getAppCountSnapshot'>,
): RequestHandler {
    return (req, res, next) => {
        throw new Error("STUB");
    };
}
