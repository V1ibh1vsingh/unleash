import type { RequestHandler } from 'express';
import type { EdgeService } from '../../services/index.js';
import { createHash, createHmac } from 'node:crypto';
import { timingSafeEqual } from 'crypto';

const REQUEST_LIFETIME = 5 * 60 * 1000;

export const hmacSignatureVerifyTokenRequest = (
    edgeService: EdgeService,
): RequestHandler => {
    throw new Error("STUB");
};
