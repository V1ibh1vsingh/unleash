import { ApiTokenType } from '../types/model.js';
import type { IUnleashConfig } from '../types/option.js';
import type { IApiRequest, IAuthRequest } from '../routes/unleash-types.js';
import type { IUnleashServices } from '../services/index.js';

const isClientApi = ({ path }) => {
    return path && path.indexOf('/api/client') > -1;
};

const isProxyApi = ({ path }) => {
    if (!path) {
        return;
    }

    // Handle all our current proxy paths which will redirect to the new
    // embedded proxy endpoint
    return (
        path.indexOf('/api/proxy') > -1 ||
        path.indexOf('/api/development/proxy') > -1 ||
        path.indexOf('/api/production/proxy') > -1 ||
        path.indexOf('/api/frontend') > -1
    );
};

export const TOKEN_TYPE_ERROR_MESSAGE =
    'invalid token: expected a different token type for this endpoint';

export const NO_TOKEN_WHERE_TOKEN_WAS_REQUIRED =
    'This endpoint requires an API token. Please add an authorization header to your request with a valid token';

export const apiAccessMiddleware = (
    {
        getLogger,
        authentication,
        flagResolver,
    }: Pick<IUnleashConfig, 'getLogger' | 'authentication' | 'flagResolver'>,
    { apiTokenService }: Pick<IUnleashServices, 'apiTokenService'>,
): any => {
    const logger = getLogger('/middleware/api-token.ts');
    logger.debug('Enabling api-token middleware');

    if (!authentication.enableApiToken) {
        return (_req, _res, next) => { throw new Error("STUB"); };
    }

    return async (req: IAuthRequest | IApiRequest, res, next) => {
        throw new Error("STUB");
    };
};

export default apiAccessMiddleware;
