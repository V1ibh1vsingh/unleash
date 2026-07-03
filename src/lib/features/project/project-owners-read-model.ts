import type { Db } from '../../db/db.js';
import { RoleName } from '../../types/index.js';
import { generateImageUrl } from '../../util/index.js';
import type {
    GroupProjectOwner,
    IProjectOwnersReadModel,
    ProjectOwners,
    ProjectOwnersDictionary,
    UserProjectOwner,
    WithProjectOwners,
} from './project-owners-read-model.type.js';

const T = {
    ROLE_USER: 'role_user',
    GROUP_ROLE: 'group_role',
    ROLES: 'roles',
    USERS: 'users',
};

export class ProjectOwnersReadModel implements IProjectOwnersReadModel {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    static addOwnerData<T extends { id: string }>(
        projects: T[],
        owners: ProjectOwnersDictionary,
    ): WithProjectOwners<T> {
        throw new Error("STUB");
    }

    private async getAllProjectUsersByRole(
        roleId: number,
    ): Promise<Record<string, UserProjectOwner[]>> {
        throw new Error("STUB");
    }

    private async getAllProjectGroupsByRole(
        roleId: number,
    ): Promise<Record<string, GroupProjectOwner[]>> {
        throw new Error("STUB");
    }

    async getProjectOwnersDictionary(): Promise<ProjectOwnersDictionary> {
        throw new Error("STUB");
    }

    async getAllUserProjectOwners(
        projects?: Set<string>,
    ): Promise<UserProjectOwner[]> {
        throw new Error("STUB");
    }

    async addOwners<T extends { id: string }>(
        projects: T[],
    ): Promise<WithProjectOwners<T>> {
        throw new Error("STUB");
    }

    async getProjectOwners(projectId: string): Promise<ProjectOwners> {
        throw new Error("STUB");
    }
}
