import type { RequestHandler } from 'express';
import { is } from 'type-is';
import ContentTypeError from '../error/content-type-error.js';

const DEFAULT_ACCEPTED_CONTENT_TYPE = 'application/json';

/**
 * Builds an express middleware checking the content-type header
 * returning 415 if the header is not either `application/json` or in the array
 * passed into the function of valid content-types
 * @param {String} acceptedContentTypes
 * @returns {function(Request, Response, NextFunction): void}
 */
export default function requireContentType(
    ...acceptedContentTypes: string[]
): RequestHandler {
    if (acceptedContentTypes.length === 0) {
        acceptedContentTypes.push(DEFAULT_ACCEPTED_CONTENT_TYPE);
    }
    return (req, res, next) => {
        throw new Error("STUB");
    };
}
