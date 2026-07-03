import type { IUnleashConfig } from '../types/index.js';
import type { IAuthRequest } from '../routes/unleash-types.js';
import NotFoundError from '../error/notfound-error.js';
import type { AccountService } from '../services/account-service.js';

const patMiddleware = (
    { getLogger }: Pick<IUnleashConfig, 'getLogger'>,
    { accountService }: { accountService: AccountService },
): any => {
    const logger = getLogger('/middleware/pat-middleware.ts');
    logger.debug('Enabling PAT middleware');

    return async (req: IAuthRequest, _res, next) => {
        throw new Error("STUB");
    };
};

export default patMiddleware;
