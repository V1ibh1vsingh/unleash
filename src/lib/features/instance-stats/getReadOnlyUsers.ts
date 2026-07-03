import type { Db } from '../../types/index.js';

export type GetReadOnlyUsers = () => Promise<number>;

export const createGetReadOnlyUsers =
    (db: Db): GetReadOnlyUsers =>
    async () => {
        throw new Error("STUB");
    };

export const createFakeGetReadOnlyUsers =
    (
        readOnlyUsers: Awaited<ReturnType<GetReadOnlyUsers>> = 0,
    ): GetReadOnlyUsers =>
    () =>
        { throw new Error("STUB"); };
