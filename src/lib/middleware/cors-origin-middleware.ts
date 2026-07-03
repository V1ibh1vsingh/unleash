import type { RequestHandler } from 'express';
import cors from 'cors';
import type { IUnleashConfig } from '../types/index.js';
import type { IUnleashServices } from '../services/index.js';

export const resolveOrigin = (allowedOrigins: string[]): string | string[] => {
    if (allowedOrigins.length === 0) {
        return '*';
    }
    if (allowedOrigins.some((origin: string) => { throw new Error("STUB"); })) {
        return '*';
    } else {
        return allowedOrigins;
    }
};

// Check the request's Origin header against a list of allowed origins.
// The list may include '*', which `cors` does not support natively.
export const corsOriginMiddleware = (
    { frontendApiService }: Pick<IUnleashServices, 'frontendApiService'>,
    config: IUnleashConfig,
): RequestHandler => {
    const corsFunc = cors(async (_req, callback) => {
        throw new Error("STUB");
    });
    return (req, res, next) => {
        throw new Error("STUB");
    };
};
