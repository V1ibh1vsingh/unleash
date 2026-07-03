import type { Db } from '../../types/index.js';

const TABLE = 'edge_node_presence';

export type EdgeInstanceUsage = Record<string, number>;
export type GetEdgeInstances = () => Promise<EdgeInstanceUsage>;

export const createGetEdgeInstances =
    (db: Db): GetEdgeInstances =>
    async () => {
        throw new Error("STUB");
    };

export const createFakeGetEdgeInstances =
    (
        edgeInstances: Awaited<ReturnType<GetEdgeInstances>> = {},
    ): GetEdgeInstances =>
    () =>
        { throw new Error("STUB"); };
