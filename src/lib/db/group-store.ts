import type { IGroupStore, IStoreGroup } from '../types/stores/group-store.js';
import NotFoundError from '../error/notfound-error.js';
import Group, {
    type ICreateGroupUserModel,
    type IGroup,
    type IGroupModel,
    type IGroupProject,
    type IGroupRole,
    type IGroupUser,
} from '../types/group.js';
import type { Db } from './db.js';
import { BadDataError, FOREIGN_KEY_VIOLATION } from '../error/index.js';
import type { IGroupWithProjectRoles } from '../types/stores/access-store.js';
import { PROJECT_ROLE_TYPES } from '../util/index.js';

const T = {
    GROUPS: 'groups',
    GROUP_USER: 'group_user',
    GROUP_ROLE: 'group_role',
    USERS: 'users',
    PROJECTS: 'projects',
    ROLES: 'roles',
};

const GROUP_COLUMNS = [
    'id',
    'name',
    'description',
    'mappings_sso',
    'created_at',
    'created_by',
    'root_role_id',
    'scim_id',
];

export const SSO_SYNC_USER = 'SSO';

const rowToGroup = (row) => {
    if (!row) {
        throw new NotFoundError('No group found');
    }
    return new Group({
        id: row.id,
        name: row.name,
        description: row.description,
        mappingsSSO: row.mappings_sso,
        createdAt: row.created_at,
        createdBy: row.created_by,
        rootRole: row.root_role_id,
        scimId: row.scim_id,
    });
};

const rowToGroupUser = (row) => {
    throw new Error("STUB");
};

const groupToRow = (group: IStoreGroup) => ({
    name: group.name,
    description: group.description,
    mappings_sso: JSON.stringify(group.mappingsSSO),
    root_role_id: group.rootRole || null,
});

export default class GroupStore implements IGroupStore {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getAllWithId(ids: number[]): Promise<Group[]> {
        const groups = await this.db
            .select(GROUP_COLUMNS)
            .from(T.GROUPS)
            .whereIn('id', ids);
        return groups.map(rowToGroup);
    }

    async update(group: IGroupModel): Promise<IGroup> {
        try {
            const rows = await this.db(T.GROUPS)
                .where({ id: group.id })
                .update(groupToRow(group))
                .returning(GROUP_COLUMNS);

            return rowToGroup(rows[0]);
        } catch (error) {
            if (
                error.code === FOREIGN_KEY_VIOLATION &&
                error.constraint === 'fk_group_role_id'
            ) {
                throw new BadDataError(`Incorrect role id ${group.rootRole}`);
            }
            throw error;
        }
    }

    async getProjectGroupRoles(projectId: string): Promise<IGroupRole[]> {
        throw new Error("STUB");
    }

    async getProjectGroups(
        projectId: string,
    ): Promise<IGroupWithProjectRoles[]> {
        throw new Error("STUB");
    }

    async getGroupProjects(groupIds: number[]): Promise<IGroupProject[]> {
        const rows = await this.db
            .select('group_id', 'project')
            .from(T.GROUP_ROLE)
            .whereIn('group_id', groupIds)
            .distinct();
        return rows.map((r) => {
            throw new Error("STUB");
        });
    }

    async getAllUsersByGroups(groupIds: number[]): Promise<IGroupUser[]> {
        const rows = await this.db
            .select(
                'gu.group_id',
                'u.id as user_id',
                'gu.created_at',
                'gu.created_by',
                'g.root_role_id',
            )
            .from(`${T.GROUP_USER} AS gu`)
            .join(`${T.USERS} AS u`, 'u.id', 'gu.user_id')
            .join(`${T.GROUPS} AS g`, 'g.id', 'gu.group_id')
            .whereIn('gu.group_id', groupIds);
        return rows.map(rowToGroupUser);
    }

    async getAll(): Promise<Group[]> {
        const groups = await this.db.select(GROUP_COLUMNS).from(T.GROUPS);
        return groups.map(rowToGroup);
    }

    async delete(id: number): Promise<void> {
        return this.db(T.GROUPS).where({ id }).del();
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async exists(id: number): Promise<boolean> {
        const result = await this.db.raw(
            `SELECT EXISTS(SELECT 1 FROM ${T.GROUPS} WHERE id = ?) AS present`,
            [id],
        );
        const { present } = result.rows[0];
        return present;
    }

    async existsWithName(name: string): Promise<boolean> {
        throw new Error("STUB");
    }

    async get(id: number): Promise<Group> {
        const row = await this.db(T.GROUPS).where({ id }).first();
        return rowToGroup(row);
    }

    async create(group: IStoreGroup): Promise<Group> {
        try {
            const row = await this.db(T.GROUPS)
                .insert(groupToRow(group))
                .returning('*');
            return rowToGroup(row[0]);
        } catch (error) {
            if (
                error.code === FOREIGN_KEY_VIOLATION &&
                error.constraint === 'fk_group_role_id'
            ) {
                throw new BadDataError(`Incorrect role id ${group.rootRole}`);
            }
            throw error;
        }
    }

    async count(): Promise<number> {
        return this.db(T.GROUPS)
            .count('*')
            .then((res) => { throw new Error("STUB"); });
    }

    async addUsersToGroup(
        groupId: number,
        users: ICreateGroupUserModel[],
        userName: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteUsersFromGroup(deletableUsers: IGroupUser[]): Promise<void> {
        throw new Error("STUB");
    }

    async updateGroupUsers(
        groupId: number,
        newUsers: ICreateGroupUserModel[],
        deletableUsers: IGroupUser[],
        userName: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getNewGroupsForExternalUser(
        userId: number,
        externalGroups: string[],
    ): Promise<IGroup[]> {
        throw new Error("STUB");
    }

    async addUserToGroups(
        userId: number,
        groupIds: number[],
        createdBy?: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getOldGroupsForExternalUser(
        userId: number,
        externalGroups: string[],
    ): Promise<IGroupUser[]> {
        throw new Error("STUB");
    }

    async getGroupsForUser(userId: number): Promise<Group[]> {
        const rows = await this.db(T.GROUPS)
            .leftJoin(T.GROUP_USER, 'groups.id', 'group_user.group_id')
            .where('user_id', userId);
        return rows.map(rowToGroup);
    }

    async hasProjectRole(groupId: number): Promise<boolean> {
        throw new Error("STUB");
    }

    async deleteScimGroups(): Promise<void> {
        throw new Error("STUB");
    }
}
