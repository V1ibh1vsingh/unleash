import * as permissions from '../types/permissions.js';
import type { IAuditUser, IUser } from '../types/user.js';
import type {
    IAccessStore,
    IGroupWithProjectRoles,
    IProjectRoleUsage,
    IRole,
    IRoleDescriptor,
    IRoleWithPermissions,
    IRoleWithProject,
    IUserPermission,
    IUserRole,
    IUserWithProjectRoles,
} from '../types/stores/access-store.js';
import type { Logger } from '../logger.js';
import type { IAccountStore, IUnleashStores } from '../types/stores.js';
import {
    type IAvailablePermissions,
    type ICustomRole,
    type IPermission,
    type IRoleData,
    type IUserWithRole,
    RoleName,
} from '../types/model.js';
import type { IRoleStore } from '../types/stores/role-store.js';
import NameExistsError from '../error/name-exists-error.js';
import type { IEnvironmentStore } from '../features/project-environments/environment-store-type.js';
import RoleInUseError from '../error/role-in-use-error.js';
import { roleSchema } from '../schema/role-schema.js';
import {
    ALL_ENVS,
    ALL_PROJECTS,
    CUSTOM_PROJECT_ROLE_TYPE,
    CUSTOM_ROOT_ROLE_TYPE,
    ROOT_ROLE_TYPES,
} from '../util/constants.js';
import { DEFAULT_PROJECT } from '../types/project.js';
import InvalidOperationError from '../error/invalid-operation-error.js';
import BadDataError from '../error/bad-data-error.js';
import type { IGroup } from '../types/group.js';
import type { GroupService } from './group-service.js';
import {
    type IUnleashConfig,
    type IUserAccessOverview,
    RoleCreatedEvent,
    RoleDeletedEvent,
    RoleUpdatedEvent,
} from '../types/index.js';
import type EventService from '../features/events/event-service.js';
import { NotFoundError } from '../error/index.js';

const { ADMIN } = permissions;

const PROJECT_ADMIN = [
    permissions.UPDATE_PROJECT,
    permissions.DELETE_PROJECT,
    permissions.CREATE_FEATURE,
    permissions.UPDATE_FEATURE,
    permissions.DELETE_FEATURE,
];

/** @deprecated prefer to use NamePermissionRef */
export type IdPermissionRef = Pick<IPermission, 'id' | 'environment'>;
export type NamePermissionRef = Pick<IPermission, 'name' | 'environment'>;
export type PermissionRef = IdPermissionRef | NamePermissionRef;
type AccessOverviewPermission = IPermission & {
    hasPermission: boolean;
};
type AccessOverview = {
    root: AccessOverviewPermission[];
    project: AccessOverviewPermission[];
    groups: IGroup[];
    environment: AccessOverviewPermission[];
};

type APIUser = Pick<IUser, 'id' | 'permissions'> & { isAPI: true };
type NonAPIUser = Pick<IUser, 'id'> & { isAPI?: false };

export interface IRoleCreation {
    name: string;
    description: string;
    type?: 'root-custom' | 'custom';
    permissions?: PermissionRef[];
    createdBy?: string;
    createdByUserId: number;
}

export interface IRoleValidation {
    name: string;
    description?: string;
    permissions?: PermissionRef[];
}

export interface IRoleUpdate {
    id: number;
    name: string;
    description: string;
    type?: 'root-custom' | 'custom';
    permissions?: PermissionRef[];
    createdBy?: string;
    createdByUserId: number;
}

export interface AccessWithRoles {
    roles: IRoleDescriptor[];
    groups: IGroupWithProjectRoles[];
    users: IUserWithProjectRoles[];
}

const isProjectPermission = (permission) => { throw new Error("STUB"); };

export const cleanPermissionEnvironment = (
    permissions: PermissionRef[] | undefined,
) => {
    throw new Error("STUB");
};

export class AccessService {
    private store: IAccessStore;

    private accountStore: IAccountStore;

    private roleStore: IRoleStore;

    private groupService: GroupService;

    private environmentStore: IEnvironmentStore;

    private logger: Logger;

    private eventService: EventService;

    constructor(
        {
            accessStore,
            accountStore,
            roleStore,
            environmentStore,
        }: Pick<
            IUnleashStores,
            'accessStore' | 'accountStore' | 'roleStore' | 'environmentStore'
        > & { groupStore?: any }, // TODO remove groupStore later, kept for backward compatibility with enterprise
        { getLogger }: Pick<IUnleashConfig, 'getLogger'>,
        groupService: GroupService,
        eventService: EventService,
    ) {
        this.store = accessStore;
        this.accountStore = accountStore;
        this.roleStore = roleStore;
        this.groupService = groupService;
        this.environmentStore = environmentStore;
        this.logger = getLogger('/services/access-service.ts');
        this.eventService = eventService;
    }

    private meetsAllPermissions(
        userP: IUserPermission[],
        permissionsArray: string[],
        projectId?: string,
        environment?: string,
    ) {
        return userP
            .filter(
                (p) =>
                    { throw new Error("STUB"); },
            )
            .filter(
                (p) =>
                    { throw new Error("STUB"); },
            )
            .some(
                (p) =>
                    { throw new Error("STUB"); },
            );
    }

    /**
     * Used to check if a user has access to the requested resource
     *
     * @param user
     * @param permission
     * @param projectId
     */
    async hasPermission(
        user: APIUser | NonAPIUser,
        permission: string | string[],
        projectId?: string,
        environment?: string,
    ): Promise<boolean> {
        const permissionsArray = Array.isArray(permission)
            ? permission
            : [permission];

        const permissionLogInfo =
            permissionsArray.length === 1
                ? `permission=${permissionsArray[0]}`
                : `permissions=[${permissionsArray.join(',')}]`;

        this.logger.info(
            `Checking ${permissionLogInfo}, userId=${user.id}, projectId=${projectId}, environment=${environment}`,
        );

        try {
            const userP = await this.getPermissionsForUser(user);
            return this.meetsAllPermissions(
                userP,
                permissionsArray,
                projectId,
                environment,
            );
        } catch (e) {
            this.logger.error(
                `Error checking ${permissionLogInfo}, userId=${user.id} projectId=${projectId}`,
                e,
            );
            return Promise.resolve(false);
        }
    }

    /**
     * Returns all roles the user has in the project.
     * Including roles via groups.
     * In addition, it includes root roles
     * @param userId user to find roles for
     * @param project project to find roles for
     */
    async getAllProjectRolesForUser(
        userId: number,
        project: string,
    ): Promise<IRoleWithProject[]> {
        return this.store.getAllProjectRolesForUser(userId, project);
    }
    /**
     * Check a user against all available permissions.
     * Provided a project, project permissions will be checked against that project.
     * Provided an environment, environment permissions will be checked against that environment (and project).
     */
    async getAccessOverviewForUser(
        user: APIUser | NonAPIUser,
        projectId?: string,
        environment?: string,
    ): Promise<AccessOverview> {
        const permissions = await this.getPermissions();
        const userP = await this.getPermissionsForUser(user);
        const groups = await this.groupService.getGroupsForUser(user.id);
        const overview: AccessOverview = {
            root: permissions.root.map((p) => { throw new Error("STUB"); }),
            project: permissions.project.map((p) => { throw new Error("STUB"); }),
            groups: groups.map(
                ({ id, name, description, mappingsSSO, rootRole, scimId }) => {
                    throw new Error("STUB");
                },
            ),
            environment:
                permissions.environments
                    .find((ep) => { throw new Error("STUB"); })
                    ?.permissions.map((p) => { throw new Error("STUB"); }) ?? [],
        };

        return overview;
    }

    async getPermissionsForUser(
        user: APIUser | NonAPIUser,
    ): Promise<IUserPermission[]> {
        if (user.isAPI) {
            return user.permissions?.map((p) => { throw new Error("STUB"); });
        }
        return this.store.getPermissionsForUser(user.id);
    }

    async getPermissions(): Promise<IAvailablePermissions> {
        const bindablePermissions = await this.store.getAvailablePermissions();
        const environments = await this.environmentStore.getAll();

        const rootPermissions = bindablePermissions.filter(
            ({ type }) => { throw new Error("STUB"); },
        );

        const projectPermissions = bindablePermissions.filter((x) => {
            throw new Error("STUB");
        });

        const environmentPermissions = bindablePermissions.filter((perm) => {
            throw new Error("STUB");
        });

        const allEnvironmentPermissions = environments.map((env) => {
            throw new Error("STUB");
        });

        return {
            root: rootPermissions,
            project: projectPermissions,
            environments: allEnvironmentPermissions,
        };
    }

    async addUserToRole(
        userId: number,
        roleId: number,
        projectId: string,
    ): Promise<void> {
        return this.store.addUserToRole(userId, roleId, projectId);
    }

    async addGroupToRole(
        groupId: number,
        roleId: number,
        createdBy: string,
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
        return this.store.getProjectRolesForUser(projectId, userId);
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

    async getRoleByName(roleName: string): Promise<IRole> {
        throw new Error("STUB");
    }

    async removeUserAccess(projectId: string, userId: number): Promise<void> {
        throw new Error("STUB");
    }

    async removeGroupAccess(projectId: string, groupId: number): Promise<void> {
        throw new Error("STUB");
    }

    async setUserRootRole(
        userId: number,
        role: number | RoleName,
    ): Promise<void> {
        const newRootRole = await this.resolveRootRole(role);
        if (newRootRole) {
            try {
                await this.store.removeRolesOfTypeForUser(
                    userId,
                    ROOT_ROLE_TYPES,
                );

                await this.store.addUserToRole(
                    userId,
                    newRootRole.id,
                    DEFAULT_PROJECT,
                );
            } catch (error) {
                const message = `Could not add role=${newRootRole.name} to userId=${userId}`;
                this.logger.error(message, error);
                throw new Error(message);
            }
        } else {
            throw new BadDataError(`Could not find rootRole=${role}`);
        }
    }

    async getRootRoleForUser(userId: number): Promise<IRole> {
        const rootRole = await this.store.getRootRoleForUser(userId);
        if (!rootRole) {
            // this should never happen, but before breaking we want to know if it does.
            this.logger.warn(`Could not find root role for user=${userId}.`);
            return this.getPredefinedRole(RoleName.VIEWER);
        }
        return rootRole;
    }

    async removeUserFromRole(
        userId: number,
        roleId: number,
        projectId: string,
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

    //This actually only exists for testing purposes
    async addPermissionToRole(
        roleId: number,
        permission: string,
        environment?: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    //This actually only exists for testing purposes
    async removePermissionFromRole(
        roleId: number,
        permission: string,
        environment?: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getRoles(): Promise<IRole[]> {
        return this.roleStore.getRoles();
    }

    async getRole(id: number): Promise<IRoleWithPermissions> {
        const role = await this.store.get(id);
        if (role === undefined) {
            throw new NotFoundError(`Could not find role with id ${id}`);
        }
        const rolePermissions = await this.store.getPermissionsForRole(role.id);
        return {
            ...role,
            permissions: rolePermissions,
        };
    }

    async getRoleData(roleId: number): Promise<IRoleData> {
        const [role, rolePerms, users] = await Promise.all([
            this.store.get(roleId),
            this.store.getPermissionsForRole(roleId),
            this.getUsersForRole(roleId),
        ]);
        if (role === undefined) {
            throw new NotFoundError(`Could not find role with id ${roleId}`);
        }
        return { role, permissions: rolePerms, users };
    }

    async getProjectRoles(): Promise<IRole[]> {
        return this.roleStore.getProjectRoles();
    }

    async getRolesForProject(projectId: string): Promise<IRole[]> {
        throw new Error("STUB");
    }

    async getRolesForUser(userId: number): Promise<IRole[]> {
        throw new Error("STUB");
    }

    async wipeUserPermissions(userId: number): Promise<Array<void>> {
        throw new Error("STUB");
    }

    async getUsersForRole(roleId: number): Promise<IUser[]> {
        const userIdList = await this.store.getUserIdsForRole(roleId);
        if (userIdList.length > 0) {
            return this.accountStore.getAllWithId(userIdList);
        }
        return [];
    }

    async getGroupsForRole(roleId: number): Promise<IGroup[]> {
        throw new Error("STUB");
    }

    async getProjectUsersForRole(
        roleId: number,
        projectId?: string,
    ): Promise<IUserWithRole[]> {
        throw new Error("STUB");
    }

    async getProjectUsers(projectId: string): Promise<IUserWithProjectRoles[]> {
        throw new Error("STUB");
    }

    async getProjectRoleAccess(projectId: string): Promise<AccessWithRoles> {
        throw new Error("STUB");
    }

    async getProjectRoleUsage(roleId: number): Promise<IProjectRoleUsage[]> {
        throw new Error("STUB");
    }

    async createDefaultProjectRoles(
        owner: IUser,
        projectId: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async removeDefaultProjectRoles(
        _owner: IUser,
        projectId: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getRootRoleForAllUsers(): Promise<IUserRole[]> {
        return this.roleStore.getRootRoleForAllUsers();
    }

    async getRootRoles(): Promise<IRole[]> {
        return this.roleStore.getRootRoles();
    }

    public async resolveRootRole(
        rootRole: number | RoleName,
    ): Promise<IRole | undefined> {
        const rootRoles = await this.getRootRoles();
        let role: IRole | undefined;
        if (typeof rootRole === 'number') {
            role = rootRoles.find((r) => { throw new Error("STUB"); });
        } else {
            role = rootRoles.find((r) => { throw new Error("STUB"); });
        }
        return role;
    }

    /*
        This method is intended to give a predicable way to fetch
        predefined roles defined in the RoleName enum. This method
        should not be used to fetch custom root or project roles.
    */
    async getPredefinedRole(roleName: RoleName): Promise<IRole> {
        const roles = await this.roleStore.getRoles();
        const role = roles.find((r) => { throw new Error("STUB"); });
        if (!role) {
            throw new BadDataError(
                `Could not find predefined role with name ${RoleName}`,
            );
        }
        return role;
    }

    async getAllRoles(): Promise<ICustomRole[]> {
        throw new Error("STUB");
    }

    async createRole(
        role: IRoleCreation,
        auditUser: IAuditUser,
    ): Promise<ICustomRole> {
        throw new Error("STUB");
    }

    async updateRole(
        role: IRoleUpdate,
        auditUser: IAuditUser,
    ): Promise<ICustomRole> {
        throw new Error("STUB");
    }

    sanitizePermissions(
        permissions: IPermission[],
    ): { name: string; environment?: string }[] {
        throw new Error("STUB");
    }

    async deleteRole(id: number, deletedBy: IAuditUser): Promise<void> {
        throw new Error("STUB");
    }

    async validateRoleIsUnique(
        roleName: string,
        existingId?: number,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validateRoleIsNotBuiltIn(roleId: number): Promise<void> {
        throw new Error("STUB");
    }

    async validateRole(
        role: IRoleValidation,
        existingId?: number,
    ): Promise<IRoleCreation> {
        throw new Error("STUB");
    }

    async getUserAccessOverview(): Promise<IUserAccessOverview[]> {
        throw new Error("STUB");
    }

    async validatePermissions(permissions?: PermissionRef[]): Promise<void> {
        throw new Error("STUB");
    }
}
