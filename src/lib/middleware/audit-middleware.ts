import type { IUnleashConfig } from '../types/index.js';
import type { IApiRequest, IAuthRequest } from '../routes/unleash-types.js';
import { extractAuditInfo } from '../util/index.js';

export const auditAccessMiddleware = ({
    getLogger,
}: Pick<IUnleashConfig, 'getLogger'>): any => {
    const logger = getLogger('/middleware/audit-middleware.ts');
    return (req: IAuthRequest | IApiRequest, _res, next) => {
        throw new Error("STUB");
    };
};
