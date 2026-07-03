import { ulid } from 'ulidx';
import type { ReleasePlanTemplate } from './release-plan-template.js';
import type { ReleasePlanMilestone } from './release-plan-milestone.js';
import { CRUDStore, type CrudStoreConfig } from '../../db/crud/crud-store.js';
import type { Row } from '../../db/crud/row-type.js';
import type { Db } from '../../db/db.js';
import { NotFoundError } from '../../error/index.js';

const TABLE = 'release_plan_definitions';

export type ReleasePlanTemplateWriteModel = Omit<
    ReleasePlanTemplate,
    'id' | 'createdAt' | 'milestones'
>;

const fromRow = (row: any): ReleasePlanTemplate => {
    return {
        id: row.id,
        name: row.name,
        createdAt: row.created_at,
        description: row.description,
        discriminator: row.discriminator,
        createdByUserId: row.created_by_user_id,
    };
};

export class ReleasePlanTemplateStore extends CRUDStore<
    ReleasePlanTemplate,
    ReleasePlanTemplateWriteModel,
    Row<ReleasePlanTemplate>,
    ReleasePlanTemplate,
    string
> {
    constructor(db: Db, config: CrudStoreConfig) {
        super(TABLE, db, config, { fromRow });
    }

    override async getAll(): Promise<ReleasePlanTemplate[]> {
        const endTimer = this.timer('getAll');
        const templates = await this.db<ReleasePlanTemplate>(TABLE)
            .where('discriminator', 'template')
            .where('archived_at', null)
            .orderBy('created_at');
        endTimer();
        return templates.map(({ milestones, ...template }) =>
            { throw new Error("STUB"); },
        );
    }

    override async count(
        query?: Partial<ReleasePlanTemplateWriteModel>,
    ): Promise<number> {
        let countQuery = this.db(this.tableName)
            .where('discriminator', 'template')
            .whereNull('archived_at')
            .count('*');
        if (query) {
            countQuery = countQuery.where(this.toRow(query));
        }
        const { count } = (await countQuery.first()) ?? { count: 0 };
        return Number(count);
    }

    async checkNameAlreadyExists(name: string, id?: string): Promise<boolean> {
        throw new Error("STUB");
    }

    processReleasePlanTemplateRows(templateRows): ReleasePlanTemplate {
        throw new Error("STUB");
    }

    async getById(id: string): Promise<ReleasePlanTemplate> {
        throw new Error("STUB");
    }

    override async insert(
        item: ReleasePlanTemplateWriteModel,
    ): Promise<ReleasePlanTemplate> {
        const endTimer = this.timer('insert');
        const row = this.toRow(item);
        row.id = ulid();
        const [inserted] = await this.db(TABLE).insert(row).returning('*');
        endTimer();
        return fromRow(inserted);
    }

    async archive(id: string): Promise<void> {
        throw new Error("STUB");
    }
}
