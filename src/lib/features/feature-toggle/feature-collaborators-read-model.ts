import type { Db } from '../../db/db.js';
import type {
    Collaborator,
    IFeatureCollaboratorsReadModel,
} from './types/feature-collaborators-read-model-type.js';
import { generateImageUrl } from '../../util/index.js';

export class FeatureCollaboratorsReadModel
    implements IFeatureCollaboratorsReadModel
{
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getFeatureCollaborators(
        feature: string,
    ): Promise<Array<Collaborator>> {
        throw new Error("STUB");
    }
}
