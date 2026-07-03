import type { Response } from 'express';
import { promisify } from 'util';
import { type IUnleashConfig, NONE } from '../types/index.js';
import Controller from './controller.js';
import type { IAuthRequest } from './unleash-types.js';
import type { IUnleashServices } from '../services/index.js';
import type SessionService from '../services/session-service.js';

class LogoutController extends Controller {
    private clearSiteDataOnLogout: boolean;

    private cookieName: string;

    private baseUri: string;

    private sessionService: SessionService;

    constructor(
        config: IUnleashConfig,
        { sessionService }: Pick<IUnleashServices, 'sessionService'>,
    ) {
        throw new Error("STUB");
    }

    async logout(req: IAuthRequest, res: Response): Promise<void> {
        throw new Error("STUB");
    }

    private isReqLogoutWithoutCallback(
        logout: IAuthRequest['logout'],
    ): logout is () => void {
        throw new Error("STUB");
    }
}

export default LogoutController;
