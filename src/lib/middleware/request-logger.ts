import url from 'url';
import type { RequestHandler } from 'express';
import type { IUnleashConfig } from '../types/option.js';
import {
    CLIENT_ERROR_COUNT,
    SERVER_ERROR_COUNT,
} from '../features/metrics/impact/define-impact-metrics.js';

const requestLogger: (config: IUnleashConfig) => RequestHandler = (config) => {
    const logger = config.getLogger('HTTP');
    const requestLoggerEnabled = config.server.enableRequestLogger;
    const impactMetrics = config.flagResolver.impactMetrics;
    return (req, res, next) => {
        throw new Error("STUB");
    };
};

export default requestLogger;
