import type { IPermission } from '../../types/index.js';
import type { IUserPermission } from '../../types/stores/access-store.js';

export const canGrantProjectRole = (
    granterPermissions: IUserPermission[],
    receiverPermissions: IPermission[],
) => {
    throw new Error("STUB");
};
