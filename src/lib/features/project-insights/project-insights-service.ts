import type {
    IFeatureOverview,
    IFeatureStrategiesStore,
    IFeatureToggleStore,
    IFeatureTypeStore,
    IProjectStore,
    IUnleashStores,
} from '../../types/index.js';
import { calculateAverageTimeToProd } from '../feature-toggle/time-to-production/time-to-production.js';
import type { IProjectStatsStore } from '../../types/stores/project-stats-store-type.js';
import type {
    ProjectDoraMetricsSchema,
    ProjectInsightsSchema,
} from '../../openapi/index.js';
import { calculateProjectHealth } from '../../domain/project-health/project-health.js';
import { subDays } from 'date-fns';

export class ProjectInsightsService {
    private projectStore: IProjectStore;

    private featureToggleStore: IFeatureToggleStore;

    private featureTypeStore: IFeatureTypeStore;

    private featureStrategiesStore: IFeatureStrategiesStore;

    private projectStatsStore: IProjectStatsStore;

    constructor({
        projectStore,
        featureToggleStore,
        featureTypeStore,
        projectStatsStore,
        featureStrategiesStore,
    }: Pick<
        IUnleashStores,
        | 'projectStore'
        | 'featureToggleStore'
        | 'projectStatsStore'
        | 'featureTypeStore'
        | 'featureStrategiesStore'
    >) {
        this.projectStore = projectStore;
        this.featureToggleStore = featureToggleStore;
        this.featureTypeStore = featureTypeStore;
        this.featureStrategiesStore = featureStrategiesStore;
        this.projectStatsStore = projectStatsStore;
    }

    async getDoraMetrics(projectId: string): Promise<ProjectDoraMetricsSchema> {
        throw new Error("STUB");
    }

    private async getHealthInsights(projectId: string) {
        throw new Error("STUB");
    }

    private async getProjectHealth(
        projectId: string,
        archived: boolean = false,
        userId?: number,
    ): Promise<{
        technicalDebt: number;
        features: IFeatureOverview[];
        /**
         * @deprecated
         */
        health: number;
    }> {
        throw new Error("STUB");
    }

    private async getProjectMembers(
        projectId: string,
    ): Promise<ProjectInsightsSchema['members']> {
        throw new Error("STUB");
    }

    async getProjectInsights(projectId: string) {
        throw new Error("STUB");
    }
}
