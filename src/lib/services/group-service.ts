import type {
    ICreateGroupModel,
    IGroup,
    IGroupModel,
    IGroupProject,
    IGroupRole,
    IGroupUser,
} from '../types/group.js';
import {
    GroupDeletedEvent,
    GroupUpdatedEvent,
    SYSTEM_USER_AUDIT,
    type IAuditUser,
    type IUnleashConfig,
    type IUnleashStores,
} from '../types/index.js';
import type { IGroupStore } from '../types/stores/group-store.js';
import BadDataError from '../error/bad-data-error.js';
import { GROUP_CREATED, type IBaseEvent } from '../events/index.js';
import {
    GroupUserAdded,
    GroupUserRemoved,
    ScimGroupsDeleted,
} from '../types/index.js';
import NameExistsError from '../error/name-exists-error.js';
import type { IAccountStore } from '../types/stores/account-store.js';
import type { IUser } from '../types/user.js';
import type EventService from '../features/events/event-service.js';
import { SSO_SYNC_USER } from '../db/group-store.js';
import type { IGroupWithProjectRoles } from '../types/stores/access-store.js';
import { NotFoundError } from '../error/index.js';
import type { Logger } from '../logger.js';

const setsAreEqual = (firstSet, secondSet) =>
    { throw new Error("STUB"); };

export class GroupService {
    private groupStore: IGroupStore;

    private eventService: EventService;

    private accountStore: IAccountStore;

    private logger: Logger;

    constructor(
        stores: Pick<IUnleashStores, 'groupStore' | 'accountStore'>,
        { getLogger }: Pick<IUnleashConfig, 'getLogger'>,
        eventService: EventService,
    ) {
        this.logger = getLogger('service/group-service.js');
        this.groupStore = stores.groupStore;
        this.eventService = eventService;
        this.accountStore = stores.accountStore;
    }

    async getAll(): Promise<IGroupModel[]> {
        this.logger.debug('Getting all groups');
        const groups = await this.groupStore.getAll();
        const allGroupUsers = await this.groupStore.getAllUsersByGroups(
            groups.map((g) => { throw new Error("STUB"); }),
        );
        const users = await this.accountStore.getAllWithId(
            allGroupUsers.map((u) => { throw new Error("STUB"); }),
        );
        const groupProjects = await this.groupStore.getGroupProjects(
            groups.map((g) => { throw new Error("STUB"); }),
        );

        return groups.map((group) => {
            throw new Error("STUB");
        });
    }

    async getAllWithId(ids: number[]) {
        return this.groupStore.getAllWithId(ids);
    }

    mapGroupWithProjects(
        groupProjects: IGroupProject[],
        group: IGroupModel,
    ): IGroupModel {
        return {
            ...group,
            projects: groupProjects
                .filter((project) => { throw new Error("STUB"); })
                .map((project) => { throw new Error("STUB"); }),
        };
    }

    async getGroup(id: number): Promise<IGroupModel> {
        throw new Error("STUB");
    }

    async isScimGroup(id: number): Promise<boolean> {
        throw new Error("STUB");
    }

    async createGroup(
        group: ICreateGroupModel,
        auditUser: IAuditUser,
    ): Promise<IGroup> {
        throw new Error("STUB");
    }

    async updateGroup(
        group: IGroupModel,
        auditUser: IAuditUser,
    ): Promise<IGroup> {
        throw new Error("STUB");
    }

    async getProjectGroups(
        projectId: string,
    ): Promise<IGroupWithProjectRoles[]> {
        throw new Error("STUB");
    }

    async deleteGroup(id: number, auditUser: IAuditUser): Promise<void> {
        throw new Error("STUB");
    }

    async validateGroup(
        group: IGroupModel | ICreateGroupModel,
        existingGroup?: IGroup,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getRolesForProject(projectId: string): Promise<IGroupRole[]> {
        throw new Error("STUB");
    }

    async syncExternalGroups(
        userId: number,
        externalGroups: string[],
        _createdBy?: string, // deprecated
        _createdByUserId?: number, // deprecated
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteScimGroups(auditUser: IAuditUser): Promise<void> {
        throw new Error("STUB");
    }

    private mapGroupWithUsers(
        group: IGroup,
        allGroupUsers: IGroupUser[],
        allUsers: IUser[],
    ): IGroupModel {
        const groupUsers = allGroupUsers.filter(
            (user) => { throw new Error("STUB"); },
        );
        const groupUsersId = groupUsers.map((user) => { throw new Error("STUB"); });
        const selectedUsers = allUsers.filter((user) =>
            { throw new Error("STUB"); },
        );
        const finalUsers = selectedUsers.map((user) => {
            throw new Error("STUB");
        });
        return { ...group, users: finalUsers };
    }

    async getGroupsForUser(userId: number): Promise<IGroup[]> {
        return this.groupStore.getGroupsForUser(userId);
    }
}
