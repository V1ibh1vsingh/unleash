import { BackstageController } from './backstage.js';
import ResetPasswordController from './auth/reset-password-controller.js';
import { SimplePasswordProvider } from './auth/simple-password-provider.js';
import type { IUnleashConfig, IUnleashStores } from '../types/index.js';
import LogoutController from './logout.js';
import rateLimit from 'express-rate-limit';
import Controller from './controller.js';
import { AdminApi } from './admin-api/index.js';
import ClientApi from './client-api/index.js';

import { ReadyCheckController } from './ready-check.js';
import { HealthCheckController } from './health-check.js';
import FrontendAPIController from '../features/frontend-api/frontend-api-controller.js';
import EdgeController from './edge-api/index.js';
import { PublicInviteController } from './public-invite.js';
import type { Db } from '../db/db.js';
import { minutesToMilliseconds } from 'date-fns';
import type { IUnleashServices } from '../services/index.js';

class IndexRouter extends Controller {
    constructor(
        config: IUnleashConfig,
        services: IUnleashServices,
        stores: IUnleashStores,
        db: Db,
    ) {
        throw new Error("STUB");
    }
}

export default IndexRouter;
