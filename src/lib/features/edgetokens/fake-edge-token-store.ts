import type { IApiToken, IEdgeTokenStore } from '../../types/index.js';
import type { EdgeClient } from '../../types/stores/edge-store.js';

export class FakeEdgeTokenStore implements IEdgeTokenStore {
    registerNonce(
        clientId: string,
        nonce: string,
        expiresAt: Date,
    ): Promise<void> {
        return Promise.resolve(undefined);
    }

    getToken(
        clientId: string,
        environment: string,
        projects: string[],
    ): Promise<IApiToken | undefined> {
        throw new Error("STUB");
    }

    loadClient(clientId: string): Promise<EdgeClient | undefined> {
        return Promise.resolve(undefined);
    }

    saveToken(clientId: string, token: IApiToken): Promise<void> {
        throw new Error("STUB");
    }

    saveClient(clientId: string, secretEnc: Buffer): Promise<void> {
        return Promise.resolve(undefined);
    }

    cleanExpiredNonces(): Promise<void> {
        throw new Error("STUB");
    }

    delete(tokenValue: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    deleteAll(): Promise<void> {
        throw new Error("STUB");
    }
}
