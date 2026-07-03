import type { Application } from 'express';
import AuthenticationRequired from '../types/authentication-required.js';
import type { IUnleashServices } from '../services/index.js';
import type { IUnleashConfig } from '../types/option.js';
import ApiUser from '../types/api-user.js';
import { ApiTokenType } from '../types/model.js';
import type { IAuthRequest, IUser } from '../types/index.js';
import type { IApiRequest } from '../routes/unleash-types.js';
import { encrypt } from '../util/index.js';

function demoAuthentication(
    app: Application,
    basePath: string,
    { userService }: Pick<IUnleashServices, 'userService'>,
    {
        authentication,
        flagResolver,
    }: Pick<IUnleashConfig, 'authentication' | 'flagResolver'>,
): void {
    app.post(`${basePath}/auth/demo/login`, async (req: IAuthRequest, res) => {
        throw new Error("STUB");
    });

    app.use(`${basePath}/api/admin/`, (req: IAuthRequest, _res, next) => {
        throw new Error("STUB");
    });

    app.use(`${basePath}/api/client`, (req: IApiRequest, _res, next) => {
        throw new Error("STUB");
    });

    app.use(`${basePath}/api`, (req: IAuthRequest, res, next) => {
        throw new Error("STUB");
    });
}

export default demoAuthentication;
