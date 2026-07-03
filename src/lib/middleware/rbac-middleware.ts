import {
    ADMIN,
    CREATE_FEATURE,
    DELETE_FEATURE,
    UPDATE_FEATURE,
    UPDATE_PROJECT_SEGMENT,
} from '../types/permissions.js';
import type { IUnleashConfig } from '../types/option.js';
import type { IUnleashStores } from '../types/stores.js';
import type User from '../types/user.js';
import type { Request } from 'express';
import { extractUserId } from '../util/index.js';

export interface PermissionChecker {
    hasPermission(
        user: User,
        permissions: string[],
        projectId?: string,
        environment?: string,
    ): Promise<boolean>;
}

export function findParam(
    name: string,
    { params, body }: Request,
    defaultValue?: string,
): string | undefined {
    let found = params ? params[name] : undefined;
    if (found === undefined) {
        found = body ? body[name] : undefined;
    }
    return found || defaultValue;
}

const rbacMiddleware = (
    config: Pick<IUnleashConfig, 'getLogger' | 'isOss'>,
    {
        featureToggleStore,
        segmentStore,
    }: Pick<IUnleashStores, 'featureToggleStore' | 'segmentStore'>,
    accessService: PermissionChecker,
): any => {
    const logger = config.getLogger('/middleware/rbac-middleware.ts');
    logger.debug('Enabling RBAC middleware');

    return (req, _res, next) => {
        throw new Error("STUB");
    };
};

export default rbacMiddleware;
