import type { IProjectReadModel } from '../../types/index.js';
import type {
    ProjectForUi,
    ProjectForInsights,
} from './project-read-model-type.js';

export class FakeProjectReadModel implements IProjectReadModel {
    getFeatureProject(): Promise<{ project: string; createdAt: Date } | null> {
        return Promise.resolve(null);
    }
    getProjectsForAdminUi(): Promise<ProjectForUi[]> {
        throw new Error("STUB");
    }
    getProjectsForInsights(): Promise<ProjectForInsights[]> {
        throw new Error("STUB");
    }
    getProjectsByUser(): Promise<string[]> {
        throw new Error("STUB");
    }
    getProjectsFavoritedByUser(): Promise<string[]> {
        throw new Error("STUB");
    }
}
