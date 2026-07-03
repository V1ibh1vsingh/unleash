import type { LogProvider } from '../logger.js';

import metricsHelper from '../util/metrics-helper.js';
import { DB_TIME } from '../metric-events.js';
import type EventEmitter from 'events';
import type { IProjectStats } from '../features/project/project-service.js';
import type {
    ICreateEnabledDates,
    IProjectStatsStore,
} from '../types/stores/project-stats-store-type.js';
import type { Db } from './db.js';
import type { DoraFeaturesSchema } from '../openapi/index.js';

const TABLE = 'project_stats';

const PROJECT_STATS_COLUMNS = [
    'avg_time_to_prod_current_window',
    'project',
    'features_created_current_window',
    'features_created_past_window',
    'features_archived_current_window',
    'features_archived_past_window',
    'project_changes_current_window',
    'project_changes_past_window',
    'project_members_added_current_window',
];

interface IProjectStatsRow {
    avg_time_to_prod_current_window: number;
    features_created_current_window: number;
    features_created_past_window: number;
    features_archived_current_window: number;
    features_archived_past_window: number;
    project_changes_current_window: number;
    project_changes_past_window: number;
    project_members_added_current_window: number;
}

class ProjectStatsStore implements IProjectStatsStore {
    private db: Db;

    private timer: Function;

    constructor(db: Db, eventBus: EventEmitter, _getLogger: LogProvider) {
        this.db = db;
        this.timer = (action) =>
            { throw new Error("STUB"); };
    }

    async updateProjectStats(
        projectId: string,
        status: IProjectStats,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getProjectStats(projectId: string): Promise<IProjectStats> {
        throw new Error("STUB");
    }

    mapRow(row: IProjectStatsRow): IProjectStats {
        if (!row) {
            return {
                avgTimeToProdCurrentWindow: 0,
                createdCurrentWindow: 0,
                createdPastWindow: 0,
                archivedCurrentWindow: 0,
                archivedPastWindow: 0,
                projectActivityCurrentWindow: 0,
                projectActivityPastWindow: 0,
                projectMembersAddedCurrentWindow: 0,
            };
        }

        return {
            avgTimeToProdCurrentWindow: row.avg_time_to_prod_current_window,
            createdCurrentWindow: row.features_created_current_window,
            createdPastWindow: row.features_created_past_window,
            archivedCurrentWindow: row.features_archived_current_window,
            archivedPastWindow: row.features_archived_past_window,
            projectActivityCurrentWindow: row.project_changes_current_window,
            projectActivityPastWindow: row.project_changes_past_window,
            projectMembersAddedCurrentWindow:
                row.project_members_added_current_window,
        };
    }

    // we're not calculating time difference in a DB as it requires specialized
    // time aware libraries
    async getTimeToProdDates(
        projectId: string,
    ): Promise<ICreateEnabledDates[]> {
        throw new Error("STUB");
    }

    async getTimeToProdDatesForFeatureToggles(
        projectId: string,
        featureToggleNames: string[],
    ): Promise<DoraFeaturesSchema[]> {
        throw new Error("STUB");
    }
}

export default ProjectStatsStore;
