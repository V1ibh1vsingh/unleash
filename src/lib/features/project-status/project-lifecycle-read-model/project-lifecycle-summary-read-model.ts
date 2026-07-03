import type { Db } from '../../../db/db.js';
import type { IFeatureToggleStore } from '../../../types/index.js';
import { subDays } from 'date-fns';
import type {
    IProjectLifecycleSummaryReadModel,
    ProjectLifecycleSummary,
} from './project-lifecycle-read-model-type.js';

type FlagsInStage = {
    initial: number;
    'pre-live': number;
    live: number;
    completed: number;
    archived: number;
};

type AverageTimeInStage = {
    initial: number | null;
    'pre-live': number | null;
    live: number | null;
    completed: number | null;
};

export class ProjectLifecycleSummaryReadModel
    implements IProjectLifecycleSummaryReadModel
{
    private db: Db;
    private featureToggleStore: IFeatureToggleStore;

    constructor(db: Db, featureToggleStore: IFeatureToggleStore) {
        this.db = db;
        this.featureToggleStore = featureToggleStore;
    }

    async getAverageTimeInEachStage(
        projectId: string,
    ): Promise<AverageTimeInStage> {
        throw new Error("STUB");
    }

    async getCurrentFlagsInEachStage(projectId: string): Promise<FlagsInStage> {
        throw new Error("STUB");
    }

    async getArchivedFlagsLast30Days(projectId: string): Promise<number> {
        throw new Error("STUB");
    }

    async getProjectLifecycleSummary(
        projectId: string,
    ): Promise<ProjectLifecycleSummary> {
        throw new Error("STUB");
    }
}
