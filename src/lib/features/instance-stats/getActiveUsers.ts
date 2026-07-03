import type { Db } from '../../types/index.js';

export type GetActiveUsers = () => Promise<{
    last7: number;
    last30: number;
    last60: number;
    last90: number;
}>;

export const createGetActiveUsers =
    (db: Db): GetActiveUsers =>
    async () => {
        throw new Error("STUB");
    };

export const createFakeGetActiveUsers =
    (
        activeUsers: Awaited<ReturnType<GetActiveUsers>> = {
            last7: 0,
            last30: 0,
            last60: 0,
            last90: 0,
        },
    ): GetActiveUsers =>
    () =>
        { throw new Error("STUB"); };
