import type { IAuthRequest } from '../routes/unleash-types.js';
import type { NextFunction, Response } from 'express';
import type { LogProvider } from '../logger.js';
import UnauthorizedError from '../error/unauthorized-error.js';
import { AuthenticationRequired } from '../types/index.js';
const authorizationMiddleware = (
    getLogger: LogProvider,
    baseUriPath: string,
): any => {
    throw new Error("STUB");
};

export default authorizationMiddleware;
