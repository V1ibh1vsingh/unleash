import type { Db } from '../../db/db.js';
import type {
    BasePersonalProject,
    IPersonalDashboardReadModel,
    PersonalFeature,
    PersonalProject,
} from './personal-dashboard-read-model-type.js';

type IntermediateProjectResult = Omit<PersonalProject, 'roles'> & {
    roles: {
        [id: number]: { id: number; name: string; type: string };
    };
};

export class PersonalDashboardReadModel implements IPersonalDashboardReadModel {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getLatestHealthScores(
        project: string,
        count: number,
    ): Promise<number[]> {
        throw new Error("STUB");
    }

    async getPersonalProjects(userId: number): Promise<BasePersonalProject[]> {
        throw new Error("STUB");
    }

    async getPersonalFeatures(userId: number): Promise<PersonalFeature[]> {
        throw new Error("STUB");
    }
}
