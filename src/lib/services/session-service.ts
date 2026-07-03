import type { IUnleashStores } from '../types/stores.js';
import type { IUnleashConfig } from '../types/option.js';
import type { Logger } from '../logger.js';
import type { ISession, ISessionStore } from '../types/stores/session-store.js';
import { compareDesc, minutesToMilliseconds } from 'date-fns';
import memoizee from 'memoizee';

export default class SessionService {
    private logger: Logger;

    private sessionStore: ISessionStore;
    private resolveMaxSessions: () => Promise<number>;

    constructor(
        { sessionStore }: Pick<IUnleashStores, 'sessionStore'>,
        { getLogger }: Pick<IUnleashConfig, 'getLogger'>,
    ) {
        this.logger = getLogger('lib/services/session-service.ts');
        this.sessionStore = sessionStore;

        this.resolveMaxSessions = memoizee(
            async () => { throw new Error("STUB"); },
            {
                promise: true,
                maxAge: minutesToMilliseconds(1),
            },
        );
    }

    async getActiveSessions(): Promise<ISession[]> {
        throw new Error("STUB");
    }

    async getSessionsForUser(userId: number): Promise<ISession[]> {
        throw new Error("STUB");
    }

    async getSession(sid: string): Promise<ISession | undefined> {
        throw new Error("STUB");
    }

    async deleteSessionsForUser(userId: number): Promise<void> {
        throw new Error("STUB");
    }

    /**
     * Deletes all sessions for a user except the one identified by `keepSid`.
     * Used to log the user out everywhere else (e.g. after a password change)
     * while keeping the session that triggered the change alive.
     */
    async deleteSessionsForUserExcept(
        userId: number,
        keepSid: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteStaleSessionsForUser(
        userId: number,
        maxSessions: number,
    ): Promise<number> {
        throw new Error("STUB");
    }

    async deleteSession(sid: string): Promise<void> {
        throw new Error("STUB");
    }

    async insertSession({
        sid,
        sess,
    }: Pick<ISession, 'sid' | 'sess'>): Promise<ISession> {
        throw new Error("STUB");
    }

    async getSessionsCount() {
        return Object.fromEntries(
            (await this.sessionStore.getSessionsCount()).map(
                ({ userId, count }) => { throw new Error("STUB"); },
            ),
        );
    }

    async getMaxSessionsCount() {
        throw new Error("STUB");
    }
}
