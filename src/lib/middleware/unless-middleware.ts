import type { RequestHandler } from 'express';

export const unless =
    (path: string, middleware: RequestHandler): RequestHandler =>
    (req, res, next) => {
        throw new Error("STUB");
    };
