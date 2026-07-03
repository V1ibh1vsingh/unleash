import { ApiTokenType } from '../types/model.js';
import { IAuthType, type IUnleashConfig } from '../types/option.js';
import type { IApiRequest, IAuthRequest } from '../routes/unleash-types.js';
import type { IUnleashServices } from '../services/index.js';
import {
    NO_TOKEN_WHERE_TOKEN_WAS_REQUIRED,
    TOKEN_TYPE_ERROR_MESSAGE,
} from './api-token-middleware.js';

export const frontendApiAccessMiddleware = (
    {
        getLogger,
        authentication,
        flagResolver,
    }: Pick<IUnleashConfig, 'getLogger' | 'authentication' | 'flagResolver'>,
    { apiTokenService }: Pick<IUnleashServices, 'apiTokenService'>,
): any => {
    const logger = getLogger('/middleware/frontend-token-middleware.ts');
    logger.debug('Enabling frontend-token middleware');
    if (
        !authentication.enableApiToken ||
        authentication.type === IAuthType.NONE
    ) {
        return (_req, _res, next) => { throw new Error("STUB"); };
    }

    return async (req: IAuthRequest | IApiRequest, res, next) => {
        throw new Error("STUB");
    };
};

export default frontendApiAccessMiddleware;
