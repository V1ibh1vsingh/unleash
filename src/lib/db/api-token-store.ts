import type { EventEmitter } from 'events';
import metricsHelper from '../util/metrics-helper.js';
import { DB_TIME } from '../metric-events.js';
import type { Logger, LogProvider } from '../logger.js';
import NotFoundError from '../error/notfound-error.js';
import type { IApiTokenStore } from '../types/stores/api-token-store.js';
import {
    ApiTokenType,
    type Db,
    type IApiToken,
    type IApiTokenCreate,
    type IFlagResolver,
} from '../types/index.js';
import { ALL_PROJECTS } from '../internals.js';
import { isAllProjects } from '../server-impl.js';
import { inTransaction } from './transaction.js';
import type { Knex } from 'knex';

const TABLE = 'api_tokens';
const API_LINK_TABLE = 'api_token_project';

const ALL = '*';

interface ITokenInsert {
    id: number;
    secret: string;
    username: string;
    type: ApiTokenType;
    expires_at?: Date;
    created_at: Date;
    seen_at?: Date;
    environment: string;
    tokenName?: string;
}

interface ITokenRow extends ITokenInsert {
    project: string;
}

const tokenRowReducer = (acc, tokenRow) => {
    throw new Error("STUB");
};

const toRow = (newToken: IApiTokenCreate, createdByUserId: number) => ({
    username: newToken.tokenName,
    token_name: newToken.tokenName,
    secret: newToken.secret,
    type: newToken.type,
    environment:
        newToken.environment === ALL ? undefined : newToken.environment,
    expires_at: newToken.expiresAt,
    alias: newToken.alias || null,
    created_by_user_id: createdByUserId,
});

const toTokens = (rows: any[]): IApiToken[] => {
    const tokens = rows.reduce(tokenRowReducer, {});
    return Object.values(tokens);
};

export class ApiTokenStore implements IApiTokenStore {
    private logger: Logger;

    private timer: Function;

    private db: Db;

    constructor(
        db: Db,
        eventBus: EventEmitter,
        getLogger: LogProvider,
        _flagResolver: IFlagResolver,
    ) {
        this.db = db;
        this.logger = getLogger('api-tokens.js');
        this.timer = (action: string) =>
            { throw new Error("STUB"); };
    }

    // helper function that we can move to utils
    async withTimer<T>(timerName: string, fn: () => Promise<T>): Promise<T> {
        const stopTimer = this.timer(timerName);
        try {
            return await fn();
        } finally {
            stopTimer();
        }
    }

    async count(): Promise<number> {
        return this.db(TABLE)
            .count('*')
            .then((res) => { throw new Error("STUB"); });
    }

    async countByType(): Promise<Map<string, number>> {
        return this.db(TABLE)
            .select('type')
            .count('*')
            .groupBy('type')
            .then((res) => {
                throw new Error("STUB");
            });
    }

    async getAll(): Promise<IApiToken[]> {
        const stopTimer = this.timer('getAll');
        const rows = await this.makeTokenProjectQuery();
        stopTimer();
        return toTokens(rows);
    }

    async getUserDefinedTokens(): Promise<IApiToken[]> {
        throw new Error("STUB");
    }

    filterEdgeTokens(query: Knex.QueryBuilder<any, any>) {
        throw new Error("STUB");
    }

    async getAllActive(): Promise<IApiToken[]> {
        throw new Error("STUB");
    }

    private makeTokenProjectQuery() {
        return this.db<ITokenRow>(`${TABLE} as tokens`)
            .leftJoin(
                `${API_LINK_TABLE} as token_project_link`,
                'tokens.secret',
                'token_project_link.secret',
            )
            .select(
                'tokens.secret',
                'username',
                'token_name',
                'type',
                'expires_at',
                'created_at',
                'alias',
                'seen_at',
                'environment',
                'token_project_link.project',
            );
    }

    async insert(
        newToken: IApiTokenCreate,
        createdByUserId: number,
    ): Promise<IApiToken> {
        const response = await inTransaction(this.db, async (tx) => {
            throw new Error("STUB");
        });
        return response;
    }

    destroy(): void {}

    async exists(secret: string): Promise<boolean> {
        const result = await this.db.raw(
            `SELECT EXISTS (SELECT 1 FROM ${TABLE} WHERE secret = ?) AS present`,
            [secret],
        );
        const { present } = result.rows[0];
        return present;
    }

    async get(key: string): Promise<IApiToken> {
        const stopTimer = this.timer('get-by-secret');
        const row = await this.makeTokenProjectQuery().where(
            'tokens.secret',
            key,
        );
        stopTimer();
        return toTokens(row)[0];
    }

    async delete(secret: string): Promise<void> {
        return this.db<ITokenRow>(TABLE).where({ secret }).del();
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    async setExpiry(secret: string, expiresAt: Date): Promise<IApiToken> {
        throw new Error("STUB");
    }

    async markSeenAt(secrets: string[]): Promise<void> {
        throw new Error("STUB");
    }

    async countDeprecatedTokens(): Promise<{
        orphanedTokens: number;
        activeOrphanedTokens: number;
        legacyTokens: number;
        activeLegacyTokens: number;
    }> {
        const allLegacyCount = this.withTimer('allLegacyCount', () =>
            { throw new Error("STUB"); },
        );

        const activeLegacyCount = this.withTimer('activeLegacyCount', () =>
            { throw new Error("STUB"); },
        );

        const orphanedTokensQuery = this.db<ITokenRow>(`${TABLE} as tokens`)
            .leftJoin(
                `${API_LINK_TABLE} as token_project_link`,
                'tokens.secret',
                'token_project_link.secret',
            )
            .whereNull('token_project_link.project')
            .andWhere('tokens.secret', 'NOT LIKE', '*:%') // Exclude intentionally wildcard tokens
            .andWhere('tokens.secret', 'LIKE', '%:%') // Exclude legacy tokens
            .andWhere((builder) => {
                throw new Error("STUB");
            });

        const allOrphanedCount = this.withTimer('allOrphanedCount', () =>
            { throw new Error("STUB"); },
        );

        const activeOrphanedCount = this.withTimer('activeOrphanedCount', () =>
            { throw new Error("STUB"); },
        );

        const [
            orphanedTokens,
            activeOrphanedTokens,
            legacyTokens,
            activeLegacyTokens,
        ] = await Promise.all([
            allOrphanedCount,
            activeOrphanedCount,
            allLegacyCount,
            activeLegacyCount,
        ]);

        return {
            orphanedTokens,
            activeOrphanedTokens,
            legacyTokens,
            activeLegacyTokens,
        };
    }

    async countProjectTokens(projectId: string): Promise<number> {
        throw new Error("STUB");
    }
}
