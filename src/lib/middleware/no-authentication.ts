import type { Application } from 'express';
import NoAuthUser from '../types/no-auth-user.js';
import { ApiTokenType } from '../types/model.js';
import { DEFAULT_ENV } from '../util/index.js';
import type { IApiRequest, IAuthRequest } from '../routes/unleash-types.js';
import ApiUser from '../types/api-user.js';
import * as permissions from '../types/permissions.js';

// eslint-disable-next-line
function noneAuthentication(baseUriPath: string, app: Application): void {
    throw new Error("STUB");
}

export function noApiToken(baseUriPath: string, app: Application) {
    app.use(`${baseUriPath}/api/frontend`, (req: IApiRequest, _res, next) => {
        throw new Error("STUB");
    });
    app.use(`${baseUriPath}/api/client`, (req: IApiRequest, _res, next) => {
        throw new Error("STUB");
    });
}
export default noneAuthentication;
