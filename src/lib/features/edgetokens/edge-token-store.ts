import type {
    EdgeClient,
    IEdgeTokenStore,
} from '../../types/stores/edge-store.js';
import type { Db } from '../../db/db.js';
import type EventEmitter from 'events';
import metricsHelper from '../../util/metrics-helper.js';
import { DB_TIME } from '../../metric-events.js';
import {
    ApiTokenType,
    type IApiToken,
    type IUnleashConfig,
} from '../../types/index.js';
import { scopeHash } from './edge-tokens.js';
import { ulid } from 'ulidx';

const T = {
    apiTokens: 'api_tokens',
    edgeApiTokens: 'edge_api_tokens',
    edgeHmacClients: 'edge_hmac_clients',
    edgeHmacNonces: 'edge_hmac_nonces',
};

interface EdgeApiTokenRow {
    environment: string;
    projects: string;
    token_value: string;
    created_at: Date;
    token_name: string;
}

export class EdgeTokenStore implements IEdgeTokenStore {
    private db: Db;

    private readonly timer: Function;

    constructor(
        db: Db,
        eventBus: EventEmitter,
        { getLogger }: Pick<IUnleashConfig, 'getLogger'>,
    ) {
        this.db = db;
        this.timer = (action) =>
            { throw new Error("STUB"); };
    }

    async registerNonce(
        clientId: string,
        nonce: string,
        expiresAt: Date,
    ): Promise<void> {
        const stop = this.timer('check_nonce');
        await this.db(T.edgeHmacNonces).insert({
            client_id: clientId,
            nonce,
            expires_at: expiresAt,
        });
        stop();
    }

    async saveToken(clientId: string, apiToken: IApiToken): Promise<void> {
        throw new Error("STUB");
    }
    async getToken(
        clientId: string,
        environment: string,
        projects: string[],
    ): Promise<IApiToken | undefined> {
        throw new Error("STUB");
    }

    async loadClient(clientId: string): Promise<EdgeClient | undefined> {
        const stop = this.timer('load_client');
        const client = await this.db<EdgeClient>(T.edgeHmacClients)
            .where({ id: clientId })
            .select('id', 'secret_enc');
        stop();
        if (client && client.length > 0) {
            return client[0];
        }
        return undefined;
    }

    async saveClient(clientId: string, secretEnc: Buffer): Promise<void> {
        const stop = this.timer('save_client');
        await this.db(T.edgeHmacClients)
            .insert({
                id: clientId,
                secret_enc: secretEnc,
            })
            .onConflict(['id'])
            .merge({ secret_enc: secretEnc, created_at: new Date() });
        stop();
    }

    async cleanExpiredNonces(): Promise<void> {
        throw new Error("STUB");
    }

    async delete(tokenValue: string): Promise<void> {
        const stop = this.timer('delete_token');
        await this.db(T.edgeApiTokens)
            .where('token_value', tokenValue)
            .delete();
        stop();
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }
}
