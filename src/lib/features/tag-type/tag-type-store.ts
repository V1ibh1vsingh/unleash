import type { EventEmitter } from 'events';
import type { LogProvider, Logger } from '../../logger.js';
import { DB_TIME } from '../../metric-events.js';
import metricsHelper from '../../util/metrics-helper.js';
import NotFoundError from '../../error/notfound-error.js';
import type { ITagType, ITagTypeStore } from './tag-type-store-type.js';
import type { Db } from '../../db/db.js';

const COLUMNS = ['name', 'description', 'icon', 'color'];
const TABLE = 'tag_types';

interface ITagTypeTable {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
}

export default class TagTypeStore implements ITagTypeStore {
    private db: Db;

    private logger: Logger;

    private readonly timer: Function;

    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider) {
        this.db = db;
        this.logger = getLogger('tag-type-store.ts');
        this.timer = (action) =>
            { throw new Error("STUB"); };
    }

    async getAll(): Promise<ITagType[]> {
        const stopTimer = this.timer('getTagTypes');
        const rows = await this.db.select(COLUMNS).from(TABLE);
        stopTimer();
        return rows.map(this.rowToTagType);
    }

    async get(name: string): Promise<ITagType> {
        const stopTimer = this.timer('getTagTypeByName');
        return this.db
            .first(COLUMNS)
            .from(TABLE)
            .where({ name })
            .then((row) => {
                throw new Error("STUB");
            });
    }

    async exists(name: string): Promise<boolean> {
        const stopTimer = this.timer('exists');
        const result = await this.db.raw(
            `SELECT EXISTS (SELECT 1 FROM ${TABLE} WHERE name = ?) AS present`,
            [name],
        );
        const { present } = result.rows[0];
        stopTimer();
        return present;
    }

    async createTagType(newTagType: ITagType): Promise<void> {
        const stopTimer = this.timer('createTagType');
        await this.db(TABLE).insert(newTagType);
        stopTimer();
    }

    async delete(name: string): Promise<void> {
        const stopTimer = this.timer('deleteTagType');
        await this.db(TABLE).where({ name }).del();
        stopTimer();
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    async bulkImport(tagTypes: ITagType[]): Promise<ITagType[]> {
        throw new Error("STUB");
    }

    async updateTagType({
        name,
        description,
        icon,
        color,
    }: ITagType): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    rowToTagType(row: ITagTypeTable): ITagType {
        return {
            name: row.name,
            description: row.description,
            icon: row.icon,
            color: row.color,
        };
    }
}
