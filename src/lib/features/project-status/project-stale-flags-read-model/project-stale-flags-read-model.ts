import type { Db } from '../../../types/index.js';
import type { IProjectStaleFlagsReadModel } from './project-stale-flags-read-model-type.js';

export class ProjectStaleFlagsReadModel implements IProjectStaleFlagsReadModel {
    constructor(private db: Db) {}

    async getStaleFlagCountForProject(projectId: string): Promise<number> {
        throw new Error("STUB");
    }
}
