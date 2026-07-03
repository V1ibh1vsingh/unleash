import type { LogProvider } from '../../logger.js';

import type { Db } from '../../db/db.js';
import { USER_COLUMNS_PUBLIC, USERS_TABLE } from './user-store.js';
import type { Row } from '../../db/crud/row-type.js';

type UpdatedUser = {
    id: number;
    name?: string;
    username?: string;
    email?: string;
    imageUrl?: string;
    seenAt?: Date;
    createdAt?: Date;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    seatType?: string;
    companyRole?: string;
    productUpdatesEmailConsent?: boolean;
};
const toResponse = (row: Row<UpdatedUser>): UpdatedUser => {
    throw new Error("STUB");
};
export class UserUpdatesReadModel {
    private db: Db;

    constructor(db: Db, _getLogger: LogProvider) {
        this.db = db;
    }

    async getLastUpdatedAt(): Promise<{
        lastUpdatedAt: Date;
        userId: number;
    } | null> {
        throw new Error("STUB");
    }

    /** @deprecated */
    async getUsersUpdatedAfter(
        date: Date,
        limit: number = 100,
    ): Promise<UpdatedUser[]> {
        throw new Error("STUB");
    }

    async getUsersUpdatedAfterOrEqual(
        date: Date,
        limit: number = 100,
        afterId: number = 0,
    ): Promise<UpdatedUser[]> {
        throw new Error("STUB");
    }
}
