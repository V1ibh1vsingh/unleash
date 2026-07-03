import { UnleashError } from './unleash-error.js';

class ContentTypeError extends UnleashError {
    statusCode = 415;

    constructor(
        acceptedContentTypes: [string, ...string[]],
        providedContentType?: string,
    ) {
        throw new Error("STUB");
    }
}

export default ContentTypeError;
