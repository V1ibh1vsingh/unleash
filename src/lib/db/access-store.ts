import type { EventEmitter } from 'events';
import metricsHelper from '../util/metrics-helper.js';
import { DB_TIME } from '../metric-events.js';
import type {
    IAccessStore,
    IProjectRoleUsage,
    IRole,
    IRoleWithProject,
    IUserPermission,
    IUserRole,
    IUserWithProjectRoles,
} from '../types/stores/access-store.js';
import type { IPermission, IUserAccessOverview } from '../types/model.js';
import NotFoundError from '../error/notfound-error.js';
import {
    ENVIRONMENT_PERMISSION_TYPE,
    PROJECT_ROLE_TYPES,
    ROOT_PERMISSION_TYPE,
    ROOT_ROLE_TYPES,
} from '../util/constants.js';
import type { Db } from './db.js';
import type {
    IdPermissionRef,
    NamePermissionRef,
    PermissionRef,
} from '../services/access-service.js';
import { inTransaction } from './transaction.js';
import BadDataError from '../error/bad-data-error.js';

const T = {
    ROLE_USER: 'role_user',
    ROLES: 'roles',
    GROUPS: 'groups',
    GROUP_ROLE: 'group_role',
    GROUP_USER: 'group_user',
    ROLE_PERMISSION: 'role_permission',
    PERMISSIONS: 'permissions',
    PERMISSION_TYPES: 'permission_types',
    CHANGE_REQUEST_SETTINGS: 'change_request_settings',
    PERSONAL_ACCESS_TOKENS: 'personal_access_tokens',
    PUBLIC_SIGNUP_TOKENS_USER: 'public_signup_tokens_user',
};

interface IPermissionRow {
    id: number;
    permission: string;
    display_name: string;
    environment?: string;
    type: string;
    project?: string;
    role_id: number;
}

type NameAndIdPermission = NamePermissionRef & IdPermissionRef;

export class AccessStore implements IAccessStore {
    private timer: Function;

    private db: Db;

    constructor(db: Db, eventBus: EventEmitter, _getLogger: Function) {
        this.db = db;
        this.timer = (action: string) =>
            { throw new Error("STUB"); };
    }

    private permissionHasName = (permission: PermissionRef): boolean => {
        throw new Error("STUB");
    };

    private permissionIdsToNames = async (
        permissions: IdPermissionRef[],
    ): Promise<NameAndIdPermission[]> => {
        throw new Error("STUB");
    };

    resolvePermissions = async (
        permissions: PermissionRef[],
    ): Promise<NamePermissionRef[]> => {
        throw new Error("STUB");
    };

    async delete(key: number): Promise<void> {
        await this.db(T.ROLES).where({ id: key }).del();
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async exists(key: number): Promise<boolean> {
        const result = await this.db.raw(
            `SELECT EXISTS(SELECT 1 FROM ${T.ROLES} WHERE id = ?) AS present`,
            [key],
        );
        const { present } = result.rows[0];
        return present;
    }

    async get(key: number): Promise<IRole> {
        const role = await this.db
            .select(['id', 'name', 'type', 'description'])
            .where('id', key)
            .first()
            .from<IRole>(T.ROLES);

        if (!role) {
            throw new NotFoundError(`Could not find role with id: ${key}`);
        }

        return role;
    }

    async getAll(): Promise<IRole[]> {
        return Promise.resolve([]);
    }

    async getAvailablePermissions(): Promise<IPermission[]> {
        const rows = await this.db
            .select(['id', 'permission', 'type', 'display_name'])
            .where('type', 'project')
            .orWhere('type', 'environment')
            .orWhere('type', 'root')
            .from(`${T.PERMISSIONS} as p`);
        return rows.map(this.mapPermission);
    }

    mapPermission(permission: IPermissionRow): IPermission {
        throw new Error("STUB");
    }

    async getPermissionsForUser(userId: number): Promise<IUserPermission[]> {
        const stopTimer = this.timer('getPermissionsForUser');
        let userPermissionQuery = this.db
            .select(
                'project',
                'rp.permission',
                'environment',
                'type',
                'ur.role_id',
            )
            .from<IPermissionRow>(`${T.ROLE_PERMISSION} AS rp`)
            .join(`${T.ROLE_USER} AS ur`, 'ur.role_id', 'rp.role_id')
            .join(`${T.PERMISSIONS} AS p`, 'p.permission', 'rp.permission')
            .where('ur.user_id', '=', userId);

        userPermissionQuery = userPermissionQuery.union((db) => {
            throw new Error("STUB");
        });

        userPermissionQuery = userPermissionQuery.union((db) => {
            throw new Error("STUB");
        });
        const rows = await userPermissionQuery;
        stopTimer();
        return rows.map(this.mapUserPermission);
    }

    mapUserPermission(row: IPermissionRow): IUserPermission {
        throw new Error("STUB");
    }

    async getPermissionsForRole(roleId: number): Promise<IPermission[]> {
        const stopTimer = this.timer('getPermissionsForRole');
        const rows = await this.db
            .select(
                'p.id',
                'rp.permission',
                'rp.environment',
                'p.display_name',
                'p.type',
            )
            .from<IPermission>(`${T.ROLE_PERMISSION} as rp`)
            .join(`${T.PERMISSIONS} as p`, 'p.permission', 'rp.permission')
            .where('rp.role_id', '=', roleId);
        stopTimer();
        return rows.map((permission) => {
            throw new Error("STUB");
        });
    }

    async addEnvironmentPermissionsToRole(
        role_id: number,
        permissions: PermissionRef[],
    ): Promise<void> {
        throw new Error("STUB");
    }

    async unlinkUserRoles(userId: number): Promise<void> {
        throw new Error("STUB");
    }

    async unlinkUserGroups(userId: number): Promise<void> {
        throw new Error("STUB");
    }

    async clearUserPersonalAccessTokens(userId: number): Promise<void> {
        throw new Error("STUB");
    }

    async clearPublicSignupUserTokens(userId: number): Promise<void> {
        throw new Error("STUB");
    }

    async getProjectUsersForRole(
        roleId: number,
        projectId?: string,
    ): Promise<IUserRole[]> {
        throw new Error("STUB");
    }

    async getProjectUsers(
        projectId?: string,
    ): Promise<IUserWithProjectRoles[]> {
        throw new Error("STUB");
    }

    async getRolesForUserId(userId: number): Promise<IRoleWithProject[]> {
        return this.db
            .select(['id', 'name', 'type', 'project', 'description'])
            .from<IRole[]>(T.ROLES)
            .innerJoin(`${T.ROLE_USER} as ru`, 'ru.role_id', 'id')
            .where('ru.user_id', '=', userId);
    }

    async getAllProjectRolesForUser(
        userId: number,
        project: string,
    ): Promise<IRoleWithProject[]> {
        const stopTimer = this.timer('get_all_project_roles_for_user');
        const roles = await this.db
            .select(['id', 'name', 'type', 'project', 'description'])
            .from<IRole[]>(T.ROLES)
            .innerJoin(`${T.ROLE_USER} as ru`, 'ru.role_id', 'id')
            .where('ru.user_id', '=', userId)
            .andWhere((builder) => {
                throw new Error("STUB");
            })
            .union([
                this.db
                    .select(['id', 'name', 'type', 'project', 'description'])
                    .from<IRole[]>(T.ROLES)
                    .innerJoin(`${T.GROUP_ROLE} as gr`, 'gr.role_id', 'id')
                    .innerJoin(
                        `${T.GROUP_USER} as gu`,
                        'gu.group_id',
                        'gr.group_id',
                    )
                    .where('gu.user_id', '=', userId)
                    .andWhere((builder) => {
                        throw new Error("STUB");
                    }),
            ]);
        stopTimer();
        return roles;
    }

    async getRootRoleForUser(userId: number): Promise<IRole | undefined> {
        return this.db
            .select(['id', 'name', 'type', 'description'])
            .from<IRole[]>(T.ROLES)
            .innerJoin(`${T.ROLE_USER} as ru`, 'ru.role_id', 'id')
            .whereIn('type', ROOT_ROLE_TYPES)
            .andWhere('ru.user_id', '=', userId)
            .first();
    }

    async getUserIdsForRole(roleId: number): Promise<number[]> {
        const rows = await this.db
            .select(['user_id'])
            .from<IRole>(T.ROLE_USER)
            .where('role_id', roleId);
        return rows.map((r) => { throw new Error("STUB"); });
    }

    async getGroupIdsForRole(roleId: number): Promise<number[]> {
        throw new Error("STUB");
    }

    async getProjectUserAndGroupCountsForRole(
        roleId: number,
    ): Promise<IProjectRoleUsage[]> {
        throw new Error("STUB");
    }

    async addUserToRole(
        userId: number,
        roleId: number,
        projectId?: string,
    ): Promise<void> {
        await this.db(T.ROLE_USER)
            .insert({
                user_id: userId,
                role_id: roleId,
                project: projectId,
            })
            .onConflict(['user_id', 'role_id', 'project'])
            .ignore();
    }

    async removeUserFromRole(
        userId: number,
        roleId: number,
        projectId?: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async addGroupToRole(
        groupId: number,
        roleId: number,
        createdBy: string,
        projectId?: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateUserProjectRole(
        userId: number,
        roleId: number,
        projectId: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async addAccessToProject(
        roles: number[],
        groups: number[],
        users: number[],
        projectId: string,
        createdBy: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async setProjectRolesForUser(
        projectId: string,
        userId: number,
        roles: number[],
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getProjectRolesForUser(
        projectId: string,
        userId: number,
    ): Promise<number[]> {
        const rows = await this.db(`${T.ROLE_USER} as ru`)
            .join(`${T.ROLES} as r`, 'ru.role_id', 'r.id')
            .select('ru.role_id')
            .where('ru.project', projectId)
            .whereIn('r.type', PROJECT_ROLE_TYPES)
            .andWhere('ru.user_id', userId);
        return rows.map((r) => { throw new Error("STUB"); });
    }

    async setProjectRolesForGroup(
        projectId: string,
        groupId: number,
        roles: number[],
        createdBy: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getProjectRolesForGroup(
        projectId: string,
        groupId: number,
    ): Promise<number[]> {
        throw new Error("STUB");
    }

    async removeUserAccess(projectId: string, userId: number): Promise<void> {
        throw new Error("STUB");
    }

    async removeGroupAccess(projectId: string, groupId: number): Promise<void> {
        throw new Error("STUB");
    }

    async removeRolesOfTypeForUser(
        userId: number,
        roleTypes: string[],
    ): Promise<void> {
        const rolesToRemove = await this.db(T.ROLES)
            .select('id')
            .whereIn('type', roleTypes)
            .pluck('id');

        return this.db(T.ROLE_USER)
            .where({ user_id: userId })
            .whereIn('role_id', rolesToRemove)
            .delete();
    }

    async addPermissionsToRole(
        role_id: number,
        permissions: PermissionRef[] | string[],
        environment?: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async removePermissionFromRole(
        role_id: number,
        permission: string,
        environment?: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async wipePermissionsFromRole(role_id: number): Promise<void> {
        throw new Error("STUB");
    }

    async cloneEnvironmentPermissions(
        sourceEnvironment: string,
        destinationEnvironment: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getUserAccessOverview(): Promise<IUserAccessOverview[]> {
        throw new Error("STUB");
    }
}
