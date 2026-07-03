import type {
    IApiRequest,
    IAuthRequest,
    IUnleashConfig,
} from '../server-impl.js';

export const userTokenClientApiLogger = ({
    getLogger,
    flagResolver,
}: Pick<IUnleashConfig, 'getLogger' | 'flagResolver'>): any => {
    return async (req: IAuthRequest | IApiRequest, res, next) => {
        throw new Error("STUB");
    };
};
