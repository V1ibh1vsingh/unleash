import type { Db } from '../../db/db.js';
import type { LogProvider } from '../../logger.js';
import type { IPrivateProjectStore } from './privateProjectStoreType.js';
import { ADMIN_TOKEN_USER } from '../../types/index.js';

export type ProjectAccess =
    | {
          mode: 'all';
      }
    | {
          mode: 'limited';
          projects: string[];
      };

export const ALL_PROJECT_ACCESS: ProjectAccess = {
    mode: 'all',
};

class PrivateProjectStore implements IPrivateProjectStore {
    private db: Db;

    constructor(db: Db, _getLogger: LogProvider) {
        this.db = db;
    }

    destroy(): void {}

    async getUserAccessibleProjects(userId: number): Promise<ProjectAccess> {
        if (userId === ADMIN_TOKEN_USER.id) {
            return ALL_PROJECT_ACCESS;
        }
        const isViewer = await this.db('role_user')
            .join('roles', 'role_user.role_id', 'roles.id')
            .where('role_user.user_id', userId)
            .andWhere({
                'roles.name': 'Viewer',
                'roles.type': 'root',
            })
            .whereNotExists((builder) => {
                throw new Error("STUB");
            })
            .count('*')
            .then((res) => { throw new Error("STUB"); });

        if (isViewer === 0) {
            return ALL_PROJECT_ACCESS;
        }

        const accessibleProjectsQuery = this.db
            .distinct()
            .select('projects.id as project_id')
            .from('projects')
            .leftJoin(
                'project_settings',
                'projects.id',
                'project_settings.project',
            )
            .where((builder) => {
                throw new Error("STUB");
            })
            .unionAll((queryBuilder) => {
                throw new Error("STUB");
            })
            .as('accessible_projects');

        const accessibleProjects: string[] = await this.db
            .from(accessibleProjectsQuery)
            .select('*')
            .pluck('project_id');

        return { mode: 'limited', projects: accessibleProjects };
    }
}

export default PrivateProjectStore;
