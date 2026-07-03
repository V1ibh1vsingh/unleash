import type { Db } from '../../../db/db.js';
import type {
    IFeatureLastSeenResults,
    ILastSeenReadModel,
} from './types/last-seen-read-model-type.js';

const TABLE = 'last_seen_at_metrics';

export class LastSeenAtReadModel implements ILastSeenReadModel {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getForFeature(features: string[]): Promise<IFeatureLastSeenResults> {
        throw new Error("STUB");
    }
}
