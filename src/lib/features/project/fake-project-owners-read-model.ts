import type {
    IProjectOwnersReadModel,
    ProjectOwners,
    UserProjectOwner,
    WithProjectOwners,
} from './project-owners-read-model.type.js';

export class FakeProjectOwnersReadModel implements IProjectOwnersReadModel {
    async addOwners<T extends { id: string }>(
        projects: T[],
    ): Promise<WithProjectOwners<T>> {
        throw new Error("STUB");
    }

    async getAllUserProjectOwners(): Promise<UserProjectOwner[]> {
        throw new Error("STUB");
    }

    async getProjectOwners(): Promise<ProjectOwners> {
        throw new Error("STUB");
    }
}
