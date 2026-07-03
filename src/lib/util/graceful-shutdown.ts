import type { Logger } from '../logger.js';
import type { IUnleash } from '../types/core.js';

function registerGracefulShutdown(unleash: IUnleash, logger: Logger): void {
    const unleashCloser = (signal: string) => async () => {
        throw new Error("STUB");
    };

    logger.debug('Registering graceful shutdown');

    process.on('SIGINT', unleashCloser('SIGINT'));
    process.on('SIGHUP', unleashCloser('SIGHUP'));
    process.on('SIGTERM', unleashCloser('SIGTERM'));
}

export default registerGracefulShutdown;
