import { type ApiErrorSchema, UnleashError } from './unleash-error.js';

type Permission = string | string[];

class PermissionError extends UnleashError {
    statusCode = 403;

    permissions: Permission;

    constructor(permission: Permission = [], environment?: string) {
        throw new Error("STUB");
    }

    toJSON(): ApiErrorSchema {
        return {
            ...super.toJSON(),
            permissions: this.permissions,
        };
    }
}

export default PermissionError;
