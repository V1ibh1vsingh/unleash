import type { Request, Response, NextFunction } from 'express';
import type { IUnleashConfig } from '../types/index.js';
import { REQUEST_ORIGIN, emitMetricEvent } from '../metric-events.js';
import { determineIntegrationSource } from './integration-headers.js';

export const originMiddleware = ({
    getLogger,
    eventBus,
}: Pick<IUnleashConfig, 'getLogger' | 'eventBus'>) => {
    const logger = getLogger('/middleware/origin-middleware.ts');
    logger.debug('Enabling origin middleware');
    return (req: Request, _: Response, next: NextFunction) => {
        throw new Error("STUB");
    };
};
