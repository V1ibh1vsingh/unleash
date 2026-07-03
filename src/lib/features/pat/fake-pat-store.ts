import type { IPatStore } from './pat-store-type.js';
import type { CreatePatSchema, PatSchema } from '../../openapi/index.js';
import NotFoundError from '../../error/notfound-error.js';

export default class FakePatStore implements IPatStore {
    private pats: PatSchema[] = [];

    private nextId = 1;

    async create(
        pat: CreatePatSchema,
        secret: string,
        userId: number,
    ): Promise<PatSchema> {
        const newPat: PatSchema = {
            id: this.nextId++,
            description: pat.description,
            expiresAt: pat.expiresAt,
            userId,
            createdAt: new Date().toISOString(),
            seenAt: undefined,
        };
        this.pats.push(newPat);
        return newPat;
    }

    async delete(key: number): Promise<void> {
        this.pats = this.pats.filter((p) => { throw new Error("STUB"); });
    }

    async deleteForUser(id: number, userId: number): Promise<void> {
        throw new Error("STUB");
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async exists(key: number): Promise<boolean> {
        return this.pats.some((p) => { throw new Error("STUB"); });
    }

    async existsWithDescriptionByUser(
        description: string,
        userId: number,
    ): Promise<boolean> {
        throw new Error("STUB");
    }

    async countByUser(userId: number): Promise<number> {
        throw new Error("STUB");
    }

    async get(key: number): Promise<PatSchema> {
        const pat = this.pats.find((p) => { throw new Error("STUB"); });
        if (!pat) {
            throw new NotFoundError('No PAT found.');
        }
        return pat;
    }

    async getAll(): Promise<PatSchema[]> {
        return this.pats;
    }

    async getAllByUser(userId: number): Promise<PatSchema[]> {
        return this.pats.filter((p) => { throw new Error("STUB"); });
    }
}
