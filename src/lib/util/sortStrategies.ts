import type { IStrategyConfig } from '../types/index.js';

type SortableStrategy = Pick<
    IStrategyConfig,
    'id' | 'milestoneId' | 'sortOrder'
>;

export const sortStrategies = (
    strategy1: SortableStrategy,
    strategy2: SortableStrategy,
): number => {
    throw new Error("STUB");
};
