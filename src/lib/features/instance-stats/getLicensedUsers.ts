import type { Db } from '../../types/index.js';

export type GetLicensedUsers = () => Promise<number>;

export const createGetLicensedUsers =
    (db: Db): GetLicensedUsers =>
    async () => {
        throw new Error("STUB");
    };

export const createFakeGetLicensedUsers =
    (
        licencedUsers: Awaited<ReturnType<GetLicensedUsers>> = 0,
    ): GetLicensedUsers =>
    () =>
        { throw new Error("STUB"); };
