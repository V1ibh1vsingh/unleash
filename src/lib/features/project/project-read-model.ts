import type { IFlagResolver } from '../../types/index.js';
import type { Knex } from 'knex';
import type { Db } from '../../db/db.js';
import type {
    IProjectReadModel,
    ProjectForInsights,
    ProjectForUi,
} from './project-read-model-type.js';
import type { IProjectQuery, IProjectsQuery } from './project-store-type.js';
import metricsHelper from '../../util/metrics-helper.js';
import type EventEmitter from 'events';
import type { IProjectMembersCount } from './project-store.js';
type Raw<T = any> = Knex.Raw<T>;

const TABLE = 'projects';
const DB_TIME = 'db_time';

const mapProjectForUi = (row): ProjectForUi => {
    throw new Error("STUB");
};

const mapProjectForInsights = (row): ProjectForInsights => {
    throw new Error("STUB");
};

export class ProjectReadModel implements IProjectReadModel {
    private db: Db;

    private timer: Function;

    constructor(db: Db, eventBus: EventEmitter, _flagResolver: IFlagResolver) {
        this.db = db;
        this.timer = (action) =>
            { throw new Error("STUB"); };
    }

    async getFeatureProject(
        featureName: string,
    ): Promise<{ project: string; createdAt: Date } | null> {
        const result = await this.db<{ project: string; created_at: Date }>(
            'features',
        )
            .join('projects', 'features.project', '=', 'projects.id')
            .select('features.project', 'projects.created_at')
            .where('features.name', featureName)
            .first();

        if (!result) return null;

        return { project: result.project, createdAt: result.created_at };
    }

    async getProjectsForAdminUi(
        query?: IProjectQuery & IProjectsQuery,
        userId?: number,
    ): Promise<ProjectForUi[]> {
        throw new Error("STUB");
    }

    async getProjectsForInsights(
        query?: IProjectQuery,
    ): Promise<ProjectForInsights[]> {
        throw new Error("STUB");
    }

    private async getMembersCount(): Promise<IProjectMembersCount[]> {
        throw new Error("STUB");
    }

    async getProjectsByUser(userId: number): Promise<string[]> {
        throw new Error("STUB");
    }

    async getProjectsFavoritedByUser(userId: number): Promise<string[]> {
        throw new Error("STUB");
    }
}
