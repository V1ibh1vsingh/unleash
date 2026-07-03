import type { Db } from '../../db/db.js';
import type { IProjectFlagCreatorsReadModel } from './project-flag-creators-read-model.type.js';

export class ProjectFlagCreatorsReadModel
    implements IProjectFlagCreatorsReadModel
{
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getFlagCreators(
        project: string,
    ): Promise<Array<{ id: number; name: string }>> {
        throw new Error("STUB");
    }
}
