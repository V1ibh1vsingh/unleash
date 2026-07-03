import type { Logger } from '../../logger.js';

import NotFoundError from '../../error/notfound-error.js';
import type {
    IEnvironment,
    IProject,
    IProjectApplication,
    IProjectApplications,
    IProjectLinkTemplate,
    IProjectUpdate,
    IUnleashConfig,
    ProjectMode,
} from '../../types/index.js';
import type {
    IProjectHealthUpdate,
    IProjectInsert,
    IProjectQuery,
    IProjectEnterpriseSettingsUpdate,
    IProjectStore,
    ProjectEnvironment,
    IProjectApplicationsSearchParams,
} from '../../features/project/project-store-type.js';
import { DEFAULT_ENV } from '../../util/index.js';
import metricsHelper from '../../util/metrics-helper.js';
import { DB_TIME } from '../../metric-events.js';
import type EventEmitter from 'events';
import type { Db } from '../../db/db.js';
import type { CreateFeatureStrategySchema } from '../../openapi/index.js';
import { applySearchFilters } from '../feature-search/search-utils.js';

const COLUMNS = [
    'id',
    'name',
    'description',
    'created_at',
    'health',
    'updated_at',
];
const TABLE = 'projects';
const SETTINGS_COLUMNS = [
    'project_mode',
    'default_stickiness',
    'feature_limit',
    'feature_naming_pattern',
    'feature_naming_example',
    'feature_naming_description',
    'link_templates',
];
const SETTINGS_TABLE = 'project_settings';
const PROJECT_ENVIRONMENTS = 'project_environments';

export interface IEnvironmentProjectLink {
    environmentName: string;
    projectId: string;
}

export interface ProjectModeCount {
    mode: ProjectMode;
    count: number;
}

export interface IProjectMembersCount {
    count: number;
    project: string;
}

class ProjectStore implements IProjectStore {
    private db: Db;

    private logger: Logger;

    private isOss: boolean;

    private timer: Function;

    constructor(
        db: Db,
        eventBus: EventEmitter,
        { getLogger, isOss }: Pick<IUnleashConfig, 'getLogger' | 'isOss'>,
    ) {
        this.db = db;
        this.logger = getLogger('project-store.ts');
        this.timer = (action) =>
            { throw new Error("STUB"); };
        this.isOss = isOss;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    fieldToRow(data): Omit<IProjectInsert, 'mode'> {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
        };
    }

    destroy(): void {}

    async isFeatureLimitReached(id: string): Promise<boolean> {
        const stop = this.timer('isFeatureLimitReached');
        const result = await this.db.raw(
            `SELECT EXISTS(SELECT 1
                           FROM project_settings
                                    LEFT JOIN features ON project_settings.project = features.project
                           WHERE project_settings.project = ?
                             AND features.archived_at IS NULL
                           GROUP BY project_settings.project
                           HAVING project_settings.feature_limit <= COUNT(features.project)) AS present`,
            [id],
        );
        stop();
        const { present } = result.rows[0];
        return present;
    }

    async getProjectLinkTemplates(id: string): Promise<IProjectLinkTemplate[]> {
        const stop = this.timer('getProjectLinkTemplates');
        const result = await this.db
            .select('link_templates')
            .from(SETTINGS_TABLE)
            .where({ project: id })
            .first();
        stop();
        return result?.link_templates || [];
    }

    async getAll(query: IProjectQuery = {}): Promise<IProject[]> {
        const stop = this.timer('getAll');
        let projects = this.db
            .select(COLUMNS)
            .from(TABLE)
            .where(query)
            .orderBy('name', 'asc');

        projects = projects.where(`${TABLE}.archived_at`, null);
        if (this.isOss) {
            projects = projects.where('id', 'default');
        }

        const rows = await projects;
        stop();
        return rows.map(this.mapRow.bind(this));
    }

    async get(id: string): Promise<IProject> {
        const stop = this.timer('getProject');
        const extraColumns: string[] = ['archived_at'];

        const project = await this.db
            .first([...COLUMNS, ...SETTINGS_COLUMNS, ...extraColumns])
            .from(TABLE)
            .leftJoin(
                SETTINGS_TABLE,
                `${SETTINGS_TABLE}.project`,
                `${TABLE}.id`,
            )
            .where({ id })
            .then(this.mapRow.bind(this));
        stop();
        return project;
    }

    async exists(id: string): Promise<boolean> {
        const stop = this.timer('exists');
        const result = await this.db.raw(
            `SELECT EXISTS(SELECT 1 FROM ${TABLE} WHERE id = ?) AS present`,
            [id],
        );
        const { present } = result.rows[0];
        stop();
        return present;
    }

    async hasProject(id: string): Promise<boolean> {
        throw new Error("STUB");
    }

    async hasActiveProject(id: string): Promise<boolean> {
        const stop = this.timer('hasActiveProject');
        const result = await this.db.raw(
            `SELECT EXISTS(SELECT 1 FROM ${TABLE} WHERE id = ? and archived_at IS NULL) AS present`,
            [id],
        );
        const { present } = result.rows[0];
        stop();
        return present;
    }

    async updateHealth(healthUpdate: IProjectHealthUpdate): Promise<void> {
        throw new Error("STUB");
    }

    async create(project: IProjectInsert): Promise<IProject> {
        const stop = this.timer('create');
        const row = await this.db(TABLE)
            .insert({ ...this.fieldToRow(project), created_at: new Date() })
            .returning('*');
        const settingsRow = await this.db(SETTINGS_TABLE)
            .insert({
                project: project.id,
                default_stickiness: project.defaultStickiness,
                feature_limit: project.featureLimit,
                project_mode: project.mode,
            })
            .returning('*');
        stop();
        return this.mapRow({ ...row[0], ...settingsRow[0] });
    }

    private async hasProjectSettings(projectId: string): Promise<boolean> {
        const stop = this.timer('hasProjectSettings');
        const result = await this.db.raw(
            `SELECT EXISTS(SELECT 1 FROM ${SETTINGS_TABLE} WHERE project = ?) AS present`,
            [projectId],
        );
        const { present } = result.rows[0];
        stop();
        return present;
    }

    async update(data: IProjectUpdate): Promise<void> {
        const stop = this.timer('update');
        try {
            await this.db(TABLE)
                .where({ id: data.id })
                .update(this.fieldToRow(data));

            if (
                data.defaultStickiness !== undefined ||
                data.featureLimit !== undefined
            ) {
                if (await this.hasProjectSettings(data.id)) {
                    await this.db(SETTINGS_TABLE)
                        .where({ project: data.id })
                        .update({
                            default_stickiness: data.defaultStickiness,
                            feature_limit: data.featureLimit,
                        });
                } else {
                    await this.db(SETTINGS_TABLE).insert({
                        project: data.id,
                        default_stickiness: data.defaultStickiness,
                        feature_limit: data.featureLimit,
                        project_mode: 'open',
                    });
                }
            }
        } catch (err) {
            this.logger.error('Could not update project, error: ', err);
        } finally {
            stop();
        }
    }

    async updateProjectEnterpriseSettings(
        data: IProjectEnterpriseSettingsUpdate,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async importProjects(
        projects: IProjectInsert[],
        environments?: IEnvironment[],
    ): Promise<IProject[]> {
        throw new Error("STUB");
    }

    async addDefaultEnvironment(projects: any[]): Promise<void> {
        throw new Error("STUB");
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    async delete(id: string): Promise<void> {
        const stop = this.timer('delete');
        try {
            await this.db(TABLE).where({ id }).del();
        } catch (err) {
            this.logger.error('Could not delete project, error: ', err);
        } finally {
            stop();
        }
    }

    async archive(id: string): Promise<void> {
        throw new Error("STUB");
    }

    async revive(id: string): Promise<void> {
        const stop = this.timer('revive');
        await this.db(TABLE).where({ id }).update({ archived_at: null });
        stop();
    }

    async getProjectLinksForEnvironments(
        environments: string[],
    ): Promise<IEnvironmentProjectLink[]> {
        const rows = await this.db('project_environments')
            .select(['project_id', 'environment_name'])
            .whereIn('environment_name', environments);
        return rows.map(this.mapLinkRow, this);
    }

    async deleteEnvironmentForProject(
        id: string,
        environment: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async addEnvironmentToProject(
        id: string,
        environment: string,
    ): Promise<void> {
        await this.db('project_environments')
            .insert({
                project_id: id,
                environment_name: environment,
            })
            .onConflict(['project_id', 'environment_name'])
            .ignore();
    }

    async addEnvironmentToProjects(
        environment: string,
        projects: string[],
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getEnvironmentsForProject(id: string): Promise<ProjectEnvironment[]> {
        throw new Error("STUB");
    }

    async getMembersCountByProject(projectId: string): Promise<number> {
        throw new Error("STUB");
    }

    async getMembersCountByProjectAfterDate(
        projectId: string,
        date: string,
    ): Promise<number> {
        throw new Error("STUB");
    }

    async getApplicationsByProject(
        params: IProjectApplicationsSearchParams,
    ): Promise<IProjectApplications> {
        throw new Error("STUB");
    }

    async getDefaultStrategy(
        projectId: string,
        environment: string,
    ): Promise<CreateFeatureStrategySchema | undefined> {
        const rows = await this.db(PROJECT_ENVIRONMENTS)
            .select('default_strategy')
            .where({
                project_id: projectId,
                environment_name: environment,
            });

        return rows.length > 0 ? rows[0].default_strategy : undefined;
    }

    async updateDefaultStrategy(
        projectId: string,
        environment: string,
        strategy: CreateFeatureStrategySchema,
    ): Promise<CreateFeatureStrategySchema> {
        throw new Error("STUB");
    }

    async count(): Promise<number> {
        let count = this.db.from(TABLE).count('*');

        count = count.where(`${TABLE}.archived_at`, null);

        return count.then((res) => { throw new Error("STUB"); });
    }

    async getProjectModeCounts(): Promise<ProjectModeCount[]> {
        let query = this.db
            .select(
                this.db.raw(
                    `COALESCE(${SETTINGS_TABLE}.project_mode, 'open') as mode`,
                ),
            )
            .count(`${TABLE}.id as count`)
            .from(`${TABLE}`)
            .leftJoin(
                `${SETTINGS_TABLE}`,
                `${TABLE}.id`,
                `${SETTINGS_TABLE}.project`,
            )
            .groupBy(
                this.db.raw(`COALESCE(${SETTINGS_TABLE}.project_mode, 'open')`),
            );

        query = query.where(`${TABLE}.archived_at`, null);

        const result: ProjectModeCount[] = await query;

        return result.map(this.mapProjectModeCount);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    private mapProjectModeCount(row): ProjectModeCount {
        throw new Error("STUB");
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    private mapLinkRow(row): IEnvironmentProjectLink {
        throw new Error("STUB");
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    private mapRow(row): IProject {
        if (!row) {
            throw new NotFoundError('No project found');
        }

        return {
            id: row.id,
            name: row.name,
            description: row.description,
            createdAt: row.created_at,
            health: row.health ?? 100,
            updatedAt: row.updated_at || new Date(),
            ...(row.archived_at ? { archivedAt: row.archived_at } : {}),
            mode: row.project_mode || 'open',
            defaultStickiness: row.default_stickiness || 'default',
            featureLimit: row.feature_limit,
            featureNaming: {
                pattern: row.feature_naming_pattern,
                example: row.feature_naming_example,
                description: row.feature_naming_description,
            },
            linkTemplates: row.link_templates || [],
        };
    }

    private mapProjectEnvironmentRow(row: {
        environment_name: string;
        default_strategy: CreateFeatureStrategySchema;
    }): ProjectEnvironment {
        throw new Error("STUB");
    }

    private getAggregatedApplicationsData(rows): IProjectApplication[] {
        throw new Error("STUB");
    }
}

export default ProjectStore;
