import type { Application } from 'express';
import authorizationMiddleware from './authorization-middleware.js';
import type { LogProvider } from '../logger.js';

function ossAuthHook(
    app: Application,
    getLogger: LogProvider,
    baseUriPath: string,
): void {
    throw new Error("STUB");
}
export default ossAuthHook;
