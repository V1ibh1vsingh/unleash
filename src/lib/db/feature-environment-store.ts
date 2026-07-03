import type EventEmitter from 'events';
import type {
    FeatureEnvironmentKey,
    IFeatureEnvironmentStore,
} from '../types/stores/feature-environment-store.js';
import metricsHelper from '../util/metrics-helper.js';
import { DB_TIME } from '../metric-events.js';
import type { IFeatureEnvironment, IVariant } from '../types/model.js';
import NotFoundError from '../error/notfound-error.js';
import type { Db } from './db.js';
import type { IUnleashConfig } from '../types/index.js';
import { randomId } from '../util/index.js';

const T = {
    featureEnvs: 'feature_environments',
    featureStrategies: 'feature_strategies',
    features: 'features',
};

interface IFeatureEnvironmentRow {
    environment: string;
    feature_name: string;
    enabled: boolean;
    variants?: [];
}

export class FeatureEnvironmentStore implements IFeatureEnvironmentStore {
    private db: Db;

    private readonly timer: Function;

    private readonly isOss: boolean;
    constructor(
        db: Db,
        eventBus: EventEmitter,
        { isOss }: Pick<IUnleashConfig, 'isOss'>,
    ) {
        this.db = db;
        this.timer = (action) =>
            { throw new Error("STUB"); };
        this.isOss = isOss;
    }

    async delete({
        featureName,
        environment,
    }: FeatureEnvironmentKey): Promise<void> {
        const stopTimer = this.timer('delete');
        await this.db(T.featureEnvs)
            .where('feature_name', featureName)
            .andWhere('environment', environment)
            .del();
        stopTimer();
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async exists({
        featureName,
        environment,
    }: FeatureEnvironmentKey): Promise<boolean> {
        const stopTimer = this.timer('exists');
        const result = await this.db.raw(
            `SELECT EXISTS (SELECT 1 FROM ${T.featureEnvs} WHERE feature_name = ? AND environment = ?) AS present`,
            [featureName, environment],
        );
        stopTimer();
        const { present } = result.rows[0];
        return present;
    }

    async get({
        featureName,
        environment,
    }: FeatureEnvironmentKey): Promise<IFeatureEnvironment> {
        const stopTimer = this.timer('get');
        const md = await this.db(T.featureEnvs)
            .where('feature_name', featureName)
            .andWhere('environment', environment)
            .first();
        stopTimer();
        if (md) {
            return {
                enabled: md.enabled,
                featureName,
                environment,
                variants: md.variants,
                lastSeenAt: md.last_seen_at,
            };
        }
        throw new NotFoundError(
            `Could not find ${featureName} in ${environment}`,
        );
    }

    addOssFilterIfNeeded(queryBuilder) {
        if (this.isOss) {
            return queryBuilder
                .join(
                    'environments',
                    'environments.name',
                    '=',
                    `${T.featureEnvs}.environment`,
                )
                .whereIn('environments.name', [
                    'default',
                    'development',
                    'production',
                ])
                .select([
                    'feature_name',
                    'environment',
                    'variants',
                    'last_seen_at',
                    `${T.featureEnvs}.enabled`,
                ]);
        }
        return queryBuilder;
    }

    async getAll(query?: Object): Promise<IFeatureEnvironment[]> {
        const stopTimer = this.timer('getAll');
        let rows = this.db(T.featureEnvs);
        if (query) {
            rows = rows.where(query);
        }
        this.addOssFilterIfNeeded(rows);
        const result = await rows;
        stopTimer();
        return result.map((r) => { throw new Error("STUB"); });
    }

    async getAllByFeatures(
        features: string[],
        environment?: string,
    ): Promise<IFeatureEnvironment[]> {
        const stopTimer = this.timer('getAllByFeatures');
        let rows = this.db(T.featureEnvs)
            .whereIn('feature_name', features)
            .orderBy('feature_name', 'asc');
        if (environment) {
            rows = rows.where({ environment });
        }
        this.addOssFilterIfNeeded(rows);
        const result = await rows;
        stopTimer();
        return result.map((r) => { throw new Error("STUB"); });
    }

    async disableEnvironmentIfNoStrategies(
        featureName: string,
        environment: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async addEnvironmentToFeature(
        featureName: string,
        environment: string,
        enabled: boolean = false,
    ): Promise<void> {
        throw new Error("STUB");
    }

    // TODO: move to project store.
    async disconnectFeatures(
        environment: string,
        project: string,
    ): Promise<void> {
        const stopTimer = this.timer('disconnectFeatures');
        const featureSelector = this.db('features')
            .where({ project })
            .select('name');
        await this.db(T.featureEnvs)
            .where({ environment })
            .andWhere('feature_name', 'IN', featureSelector)
            .del();
        await this.db('feature_strategies').where({
            environment,
            project_name: project,
        });
        stopTimer();
    }

    async featureHasEnvironment(
        environment: string,
        featureName: string,
    ): Promise<boolean> {
        const stopTimer = this.timer('featureHasEnvironment');
        const result = await this.db.raw(
            `SELECT EXISTS (SELECT 1 FROM ${T.featureEnvs} WHERE feature_name = ? AND environment = ?)  AS present`,
            [featureName, environment],
        );
        stopTimer();
        const { present } = result.rows[0];
        return present;
    }

    async getEnvironmentsForFeature(
        featureName: string,
    ): Promise<IFeatureEnvironment[]> {
        const stopTimer = this.timer('getEnvironmentsForFeature');
        const envs = await this.db(T.featureEnvs).where(
            'feature_name',
            featureName,
        );
        stopTimer();
        if (envs) {
            return envs.map((r) => { throw new Error("STUB"); });
        }
        return [];
    }

    async getEnvironmentMetaData(
        environment: string,
        featureName: string,
    ): Promise<IFeatureEnvironment> {
        throw new Error("STUB");
    }

    async isEnvironmentEnabled(
        featureName: string,
        environment: string,
    ): Promise<boolean> {
        throw new Error("STUB");
    }

    async removeEnvironmentForFeature(
        featureName: string,
        environment: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async setEnvironmentEnabledStatus(
        environment: string,
        featureName: string,
        enabled: boolean,
    ): Promise<number> {
        const stopTimer = this.timer('setEnvironmentEnabledStatus');
        const result = await this.db(T.featureEnvs).update({ enabled }).where({
            environment,
            feature_name: featureName,
            enabled: !enabled,
        });
        stopTimer();
        return result;
    }

    async connectProject(
        environment: string,
        projectId: string,
        idempotent?: boolean, // default false to respect old behavior
    ): Promise<void> {
        const stopTimer = this.timer('connectProject');
        const query = this.db('project_environments').insert({
            environment_name: environment,
            project_id: projectId,
        });
        if (idempotent) {
            await query.onConflict(['environment_name', 'project_id']).ignore();
        } else {
            await query;
        }
        stopTimer();
    }

    async connectFeatures(
        environment: string,
        projectId: string,
    ): Promise<void> {
        const stopTimer = this.timer('connectFeatures');
        const featuresToEnable = await this.db('features')
            .select('name')
            .where({
                project: projectId,
            });
        const rows: IFeatureEnvironmentRow[] = featuresToEnable.map((f) => { throw new Error("STUB"); });
        if (rows.length > 0) {
            await this.db<IFeatureEnvironmentRow>('feature_environments')
                .insert(rows)
                .onConflict(['environment', 'feature_name'])
                .ignore();
        }
        stopTimer();
    }

    async disconnectProject(
        environment: string,
        projectId: string,
    ): Promise<void> {
        const stopTimer = this.timer('disconnectProject');
        await this.db('project_environments')
            .where({ environment_name: environment, project_id: projectId })
            .del();
        stopTimer();
    }

    async connectFeatureToEnvironmentsForProject(
        featureName: string,
        projectId: string,
        enabledIn: { [environment: string]: boolean } = {},
    ): Promise<void> {
        const stopTimer = this.timer('connectFeatureToEnvironmentsForProject');
        const environmentsToEnable = await this.db('project_environments')
            .select('environment_name')
            .where({ project_id: projectId });
        await Promise.all(
            environmentsToEnable.map(async (env) => {
                throw new Error("STUB");
            }),
        );
        stopTimer();
    }

    async copyEnvironmentFeaturesByProjects(
        sourceEnvironment: string,
        destinationEnvironment: string,
        projects: string[],
    ): Promise<void> {
        throw new Error("STUB");
    }

    async addVariantsToFeatureEnvironment(
        featureName: string,
        environment: string,
        variants: IVariant[],
    ): Promise<void> {
        throw new Error("STUB");
    }

    async setVariantsToFeatureEnvironments(
        featureName: string,
        environments: string[],
        variants: IVariant[],
    ): Promise<void> {
        const stopTimer = this.timer('setVariantsToFeatureEnvironments');
        const v = variants || [];
        v.sort((a, b) => { throw new Error("STUB"); });
        const variantsString = JSON.stringify(v);
        const records = environments.map((env) => { throw new Error("STUB"); });
        await this.db(T.featureEnvs)
            .insert(records)
            .onConflict(['feature_name', 'environment'])
            .merge(['variants']);
        stopTimer();
    }

    async addFeatureEnvironment(
        featureEnvironment: IFeatureEnvironment,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async cloneStrategies(
        sourceEnvironment: string,
        destinationEnvironment: string,
        projects: string[],
    ): Promise<void> {
        throw new Error("STUB");
    }

    async variantExists(featureName: string): Promise<boolean> {
        throw new Error("STUB");
    }
}
