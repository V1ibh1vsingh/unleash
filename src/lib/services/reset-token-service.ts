import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { URL } from 'url';
import type { Logger } from '../logger.js';
import UsedTokenError from '../error/used-token-error.js';
import InvalidTokenError from '../error/invalid-token-error.js';
import type { IUnleashConfig } from '../types/option.js';
import type { IUnleashStores } from '../types/stores.js';
import type {
    IResetQuery,
    IResetToken,
    IResetTokenStore,
} from '../types/stores/reset-token-store.js';
import { hoursToMilliseconds } from 'date-fns';

interface IInviteLinks {
    [key: string]: string;
}

export default class ResetTokenService {
    private store: IResetTokenStore;

    private logger: Logger;

    private readonly unleashBase: string;

    constructor(
        { resetTokenStore }: Pick<IUnleashStores, 'resetTokenStore'>,
        { getLogger, server }: Pick<IUnleashConfig, 'getLogger' | 'server'>,
    ) {
        this.store = resetTokenStore;
        this.logger = getLogger('/services/reset-token-service.ts');
        this.unleashBase = server.unleashUrl;
    }

    async useAccessToken(token: IResetQuery): Promise<boolean> {
        throw new Error("STUB");
    }

    async getActiveInvitations(): Promise<IInviteLinks> {
        throw new Error("STUB");
    }

    expireExistingTokensForUser = async (userId: number): Promise<void> => {
        throw new Error("STUB");
    };

    async isValid(token: string): Promise<IResetToken> {
        let t: IResetToken;
        try {
            t = await this.store.getActive(token);
            if (!t.usedAt) {
                return t;
            }
        } catch (_e) {
            throw new InvalidTokenError();
        }
        throw new UsedTokenError(t.usedAt);
    }

    private getExistingInvitationUrl(token: IResetToken) {
        throw new Error("STUB");
    }

    private async createResetUrl(
        forUser: number,
        creator: string,
        path: string,
    ): Promise<URL> {
        const token = await this.createToken(forUser, creator);
        return Promise.resolve(
            new URL(`${this.unleashBase}${path}?token=${token.token}`),
        );
    }

    async createResetPasswordUrl(
        forUser: number,
        creator: string,
    ): Promise<URL> {
        throw new Error("STUB");
    }

    async createNewUserUrl(forUser: number, creator: string): Promise<URL> {
        const path = '/new-user';
        return this.createResetUrl(forUser, creator, path);
    }

    async createToken(
        tokenUser: number,
        creator: string,
        expiryDelta: number = hoursToMilliseconds(24),
    ): Promise<IResetToken> {
        const token = await this.generateToken();
        const expiry = new Date(Date.now() + expiryDelta);
        await this.expireExistingTokensForUser(tokenUser);
        return this.store.insert({
            reset_token: token,
            user_id: tokenUser,
            expires_at: expiry,
            created_by: creator,
        });
    }

    private generateToken(): Promise<string> {
        throw new Error("STUB");
    }
}
