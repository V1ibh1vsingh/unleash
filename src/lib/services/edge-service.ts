import {
    ApiTokenType,
    type Db,
    type IUnleashConfig,
    type IUnleashStores,
    SYSTEM_USER_AUDIT,
} from '../types/index.js';
import type { Logger } from '../logger.js';
import type {
    EdgeTokenSchema,
    ValidatedEdgeTokensSchema,
} from '../openapi/index.js';
import type { ApiTokenService } from './api-token-service.js';
import type { EdgeEnvironmentsProjectsListSchema } from '../openapi/index.js';
import type {
    EdgeClient,
    IEdgeTokenStore,
} from '../types/stores/edge-store.js';
import { InvalidOperationError } from '../error/index.js';
import {
    decryptSecret,
    encryptSecret,
} from '../features/edgetokens/edge-verification.js';
import { EdgeTokenStore } from '../features/edgetokens/edge-token-store.js';
import {
    createApiTokenService,
    createFakeApiTokenService,
} from '../features/api-tokens/createApiTokenService.js';
import type { IUnleashServices } from './index.js';
import { FakeEdgeTokenStore } from '../features/edgetokens/fake-edge-token-store.js';

type ReplayProtectionArgs = {
    clientId: string;
    nonce: string;
    expiresAt: Date;
};

export const createTransactionalEdgeService = (
    db: Db,
    config: IUnleashConfig,
) => {
    const edgeTokenStore = new EdgeTokenStore(db, config.eventBus, config);
    const transactionalApiTokenService = createApiTokenService(db, config);
    return new EdgeService(
        { edgeTokenStore },
        { apiTokenService: transactionalApiTokenService },
        config,
    );
};

export const createFakeEdgeService = (config: IUnleashConfig) => {
    const fakeEdgeTokenStore = new FakeEdgeTokenStore();
    const fakeApiTokenService = createFakeApiTokenService(config);
    return new EdgeService(
        { edgeTokenStore: fakeEdgeTokenStore },
        fakeApiTokenService,
        config,
    );
};

export default class EdgeService {
    private logger: Logger;

    private apiTokenService: ApiTokenService;

    private edgeTokenStore: IEdgeTokenStore;

    private readonly edgeMasterKey: string | undefined;

    constructor(
        { edgeTokenStore }: Pick<IUnleashStores, 'edgeTokenStore'>,
        { apiTokenService }: Pick<IUnleashServices, 'apiTokenService'>,
        {
            getLogger,
            edgeMasterKey,
        }: Pick<IUnleashConfig, 'getLogger' | 'edgeMasterKey'>,
    ) {
        this.logger = getLogger('lib/services/edge-service.ts');
        this.apiTokenService = apiTokenService;
        this.edgeTokenStore = edgeTokenStore;
        this.edgeMasterKey = edgeMasterKey;
    }

    async getValidTokens(tokens: string[]): Promise<ValidatedEdgeTokensSchema> {
        throw new Error("STUB");
    }

    async notSeenBefore({
        clientId,
        nonce,
        expiresAt,
    }: ReplayProtectionArgs): Promise<boolean> {
        try {
            await this.edgeTokenStore.registerNonce(clientId, nonce, expiresAt);
            return true;
        } catch (_e) {}
        return false;
    }
    async loadClient(clientId: string): Promise<EdgeClient | undefined> {
        return this.edgeTokenStore.loadClient(clientId);
    }

    decryptedClientSecret(client: EdgeClient): Buffer {
        if (this.edgeMasterKey === undefined) {
            throw new InvalidOperationError(
                'You have to define an EDGE_MASTER_SECRET for this to be supported',
            );
        }
        return decryptSecret(
            Buffer.from(this.edgeMasterKey, 'base64'),
            client.secret_enc,
        );
    }

    async saveClient(clientId: string, secret: string): Promise<void> {
        if (this.edgeMasterKey === undefined) {
            throw new InvalidOperationError('EDGE_MASTER_KEY was not defined');
        }
        const masterSecretBuffer = Buffer.from(this.edgeMasterKey, 'base64');
        if (masterSecretBuffer.length !== 32) {
            throw new InvalidOperationError(
                'You must define a 32 byte secret in the EDGE_MASTER_SECRET environment variable',
            );
        }
        const secretEnc = encryptSecret(masterSecretBuffer, secret);
        await this.edgeTokenStore.saveClient(clientId, secretEnc);
        this.logger.info('Successfully set client secret');
    }

    async getOrCreateTokens(
        clientId: string,
        tokenRequest: EdgeEnvironmentsProjectsListSchema,
    ): Promise<ValidatedEdgeTokensSchema> {
        throw new Error("STUB");
    }

    async deleteExpiredNonces() {
        throw new Error("STUB");
    }

    async deleteAllTokens() {
        throw new Error("STUB");
    }
}

const truncate = (projects: string[], max_length: number) =>
    { throw new Error("STUB"); };
