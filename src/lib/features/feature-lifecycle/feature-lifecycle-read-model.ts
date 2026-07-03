import type { Db } from '../../db/db.js';
import type {
    IFeatureLifecycleReadModel,
    StageCount,
    StageCountByProject,
} from './feature-lifecycle-read-model-type.js';
import { getCurrentStage } from './get-current-stage.js';
import type {
    IFeatureLifecycleStage,
    IProjectLifecycleStageDuration,
    StageName,
} from '../../types/index.js';
import { calculateStageDurations } from './calculate-stage-durations.js';
import type { FeatureLifecycleProjectItem } from './feature-lifecycle-store-type.js';

type DBType = {
    feature: string;
    stage: StageName;
    status: string | null;
    created_at: Date;
};

type DBProjectType = DBType & {
    project: string;
};

export class FeatureLifecycleReadModel implements IFeatureLifecycleReadModel {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getStageCount(accessibleProjects?: string[]): Promise<StageCount[]> {
        throw new Error("STUB");
    }

    async getStageCountByProject(): Promise<StageCountByProject[]> {
        const { rows } = await this.db.raw(`
            SELECT
                f.project,
                ls.stage,
                COUNT(*) AS feature_count
            FROM (
                SELECT DISTINCT ON (fl.feature)
                    fl.feature,
                    fl.stage,
                    fl.created_at
                FROM
                    feature_lifecycles fl
                ORDER BY
                    fl.feature, fl.created_at DESC
            ) AS ls
            JOIN
                features f ON f.name = ls.feature
            GROUP BY
                f.project,
                ls.stage;
        `);

        return rows.map((row) => { throw new Error("STUB"); });
    }

    async findCurrentStage(
        feature: string,
    ): Promise<IFeatureLifecycleStage | undefined> {
        throw new Error("STUB");
    }

    private async getAll(): Promise<FeatureLifecycleProjectItem[]> {
        const results = await this.db('feature_lifecycles as flc')
            .select('flc.feature', 'flc.stage', 'flc.created_at', 'f.project')
            .leftJoin('features as f', 'f.name', 'flc.feature')
            .orderBy('created_at', 'asc');

        return results.map(
            ({ feature, stage, created_at, project }: DBProjectType) => { throw new Error("STUB"); },
        );
    }

    public async getAllWithStageDuration(): Promise<
        IProjectLifecycleStageDuration[]
    > {
        const featureLifeCycles = await this.getAll();
        return calculateStageDurations(featureLifeCycles);
    }
}
