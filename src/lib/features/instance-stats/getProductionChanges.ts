import type { Db } from '../../types/index.js';

export type GetProductionChanges = () => Promise<{
    last30: number;
    last60: number;
    last90: number;
}>;

export const createGetProductionChanges =
    (db: Db): GetProductionChanges =>
    async () => {
        throw new Error("STUB");
    };
export const createFakeGetProductionChanges =
    (
        changesInProduction: Awaited<ReturnType<GetProductionChanges>> = {
            last30: 0,
            last60: 0,
            last90: 0,
        },
    ): GetProductionChanges =>
    () =>
        { throw new Error("STUB"); };
