import type EventEmitter from 'events';
import type { Logger, LogProvider } from '../logger.js';
import NotFoundError from '../error/notfound-error.js';
import type { ISession, ISessionStore } from '../types/stores/session-store.js';
import { addDays } from 'date-fns';
import type { Db } from './db.js';

const TABLE = 'unleash_session';

interface ISessionRow {
    sid: string;
    sess: string;
    created_at: Date;
    expired?: Date;
}

export default class SessionStore implements ISessionStore {
    private logger: Logger;

    private eventBus: EventEmitter;

    private db: Db;

    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider) {
        this.db = db;
        this.eventBus = eventBus;
        this.logger = getLogger('lib/db/session-store.ts');
    }

    async getActiveSessions(): Promise<ISession[]> {
        throw new Error("STUB");
    }

    async getSessionsForUser(userId: number): Promise<ISession[]> {
        throw new Error("STUB");
    }

    async get(sid: string): Promise<ISession> {
        const row = await this.db<ISessionRow>(TABLE)
            .where('sid', '=', sid)
            .first();
        if (row) {
            return this.rowToSession(row);
        }
        throw new NotFoundError(`Could not find session with sid ${sid}`);
    }

    async deleteSessionsForUser(userId: number): Promise<void> {
        throw new Error("STUB");
    }

    async deleteSessionsForUserExcept(
        userId: number,
        keepSid: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async delete(sid: string): Promise<void> {
        await this.db<ISessionRow>(TABLE).where('sid', '=', sid).del();
    }

    async insertSession(data: Omit<ISession, 'createdAt'>): Promise<ISession> {
        throw new Error("STUB");
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async exists(sid: string): Promise<boolean> {
        const result = await this.db.raw(
            `SELECT EXISTS (SELECT 1 FROM ${TABLE} WHERE sid = ?) AS present`,
            [sid],
        );
        const { present } = result.rows[0];
        return present;
    }

    async getAll(): Promise<ISession[]> {
        const rows = await this.db<ISessionRow>(TABLE);
        return rows.map(this.rowToSession);
    }

    private rowToSession(row: ISessionRow): ISession {
        return {
            sid: row.sid,
            sess: row.sess,
            createdAt: row.created_at,
            expired: row.expired,
        };
    }

    async getSessionsCount(): Promise<{ userId: number; count: number }[]> {
        const rows = await this.db(TABLE)
            .select(this.db.raw("sess->'user'->>'id' AS user_id"))
            .count('* as count')
            .groupBy('user_id');

        return rows.map((row) => { throw new Error("STUB"); });
    }

    async getMaxSessionsCount(): Promise<number> {
        throw new Error("STUB");
    }
}
