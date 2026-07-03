import type { Logger, LogProvider } from '../logger.js';
import type { ITag } from '../tags/index.js';
import type EventEmitter from 'events';
import metricsHelper from '../util/metrics-helper.js';
import { DB_TIME } from '../metric-events.js';
import type {
    IFeatureAndTag,
    IFeatureTag,
    IFeatureTagInsert,
    IFeatureTagStore,
} from '../types/stores/feature-tag-store.js';
import type { Db } from './db.js';
import NotFoundError from '../error/notfound-error.js';

const COLUMNS = ['feature_name', 'tag_type', 'tag_value'];
const TABLE = 'feature_tag';

interface FeatureTagTable {
    feature_name: string;
    tag_type: string;
    tag_value: string;
    created_by_user_id?: number;
}

class FeatureTagStore implements IFeatureTagStore {
    private db: Db;

    private logger: Logger;

    private readonly timer: Function;

    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider) {
        this.db = db;
        this.logger = getLogger('feature-tag-store.ts');
        this.timer = (action) =>
            { throw new Error("STUB"); };
    }

    async delete({
        featureName,
        tagType,
        tagValue,
    }: IFeatureTag): Promise<void> {
        await this.db(TABLE)
            .where({
                feature_name: featureName,
                tag_type: tagType,
                tag_value: tagValue,
            })
            .del();
    }

    destroy(): void {}

    async exists({
        featureName,
        tagType,
        tagValue,
    }: IFeatureTag): Promise<boolean> {
        const result = await this.db.raw(
            `SELECT EXISTS (SELECT 1 FROM ${TABLE} WHERE feature_name = ? AND tag_type = ? AND tag_value = ?) AS present`,
            [featureName, tagType, tagValue],
        );
        const { present } = result.rows[0];
        return present;
    }

    async get({
        featureName,
        tagType,
        tagValue,
    }: IFeatureTag): Promise<IFeatureTag> {
        const row = await this.db(TABLE)
            .where({
                feature_name: featureName,
                tag_type: tagType,
                tag_value: tagValue,
            })
            .first();
        return {
            featureName: row.feature_name,
            tagType: row.tag_type,
            tagValue: row.tag_value,
            createdByUserId: row.created_by_user_id,
        };
    }

    async getAll(): Promise<IFeatureTag[]> {
        const rows = await this.db(TABLE).select(COLUMNS);
        return rows.map((row) => { throw new Error("STUB"); });
    }

    async getAllTagsForFeature(featureName: string): Promise<ITag[]> {
        throw new Error("STUB");
    }

    async getAllFeaturesForTag(tagValue: string): Promise<string[]> {
        throw new Error("STUB");
    }

    async featureExists(featureName: string): Promise<boolean> {
        const result = await this.db.raw(
            'SELECT EXISTS (SELECT 1 FROM features WHERE name = ?) AS present',
            [featureName],
        );
        const { present } = result.rows[0];
        return present;
    }

    async getAllByFeatures(features: string[]): Promise<IFeatureTag[]> {
        const query = this.db
            .select(COLUMNS)
            .from<FeatureTagTable>(TABLE)
            .whereIn('feature_name', features)
            .orderBy('feature_name', 'asc');
        const rows = await query;
        return rows.map((row) => { throw new Error("STUB"); });
    }

    async tagFeature(
        featureName: string,
        tag: ITag,
        createdByUserId: number,
    ): Promise<ITag> {
        const stopTimer = this.timer('tagFeature');
        await this.db<FeatureTagTable>(TABLE)
            .insert(this.featureAndTagToRow(featureName, tag, createdByUserId))
            .onConflict(COLUMNS)
            .merge();
        stopTimer();
        return tag;
    }

    async untagFeatures(featureTags: IFeatureTag[]): Promise<void> {
        throw new Error("STUB");
    }

    /**
     * Only gets tags for active feature flags.
     */
    async getAllFeatureTags(): Promise<IFeatureTag[]> {
        throw new Error("STUB");
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    async tagFeatures(
        featureTags: IFeatureTagInsert[],
    ): Promise<IFeatureAndTag[]> {
        if (featureTags.length !== 0) {
            const rows = await this.db(TABLE)
                .insert(featureTags.map(this.featureTagToRow))
                .returning(COLUMNS)
                .onConflict(COLUMNS)
                .ignore();
            if (rows) {
                return rows.map(this.rowToFeatureAndTag);
            }
        }
        return [];
    }

    async untagFeature(featureName: string, tag: ITag): Promise<void> {
        throw new Error("STUB");
    }

    featureTagRowToTag(row: FeatureTagTable): ITag {
        throw new Error("STUB");
    }

    rowToFeatureAndTag(row: FeatureTagTable): IFeatureAndTag {
        throw new Error("STUB");
    }

    featureTagToRow({
        featureName,
        tagType,
        tagValue,
        createdByUserId,
    }: IFeatureTagInsert): FeatureTagTable {
        throw new Error("STUB");
    }

    featureTagArray({ featureName, tagType, tagValue }: IFeatureTag): string[] {
        throw new Error("STUB");
    }

    featureAndTagToRow(
        featureName: string,
        { type, value }: ITag,
        createdByUserId: number,
    ): FeatureTagTable {
        return {
            feature_name: featureName,
            tag_type: type,
            tag_value: value,
            created_by_user_id: createdByUserId,
        };
    }
}

export default FeatureTagStore;
