import type { IUser } from '../../types/index.js';
import type {
    BasePersonalProject,
    IPersonalDashboardReadModel,
    PersonalFeature,
} from './personal-dashboard-read-model-type.js';

export class FakePersonalDashboardReadModel
    implements IPersonalDashboardReadModel
{
    async getLatestHealthScores(
        _project: string,
        _count: number,
    ): Promise<number[]> {
        throw new Error("STUB");
    }

    async getPersonalFeatures(_userId: number): Promise<PersonalFeature[]> {
        throw new Error("STUB");
    }

    async getPersonalProjects(_userId: number): Promise<BasePersonalProject[]> {
        throw new Error("STUB");
    }

    async getAdmins(): Promise<IUser[]> {
        throw new Error("STUB");
    }
}
