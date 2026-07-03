import { BadDataError } from '../../error/index.js';

const MAX_COMPLEXITY = 30000;

export const validateQueryComplexity = (
    environmentsCount: number,
    featuresCount: number,
    contextCombinationsCount: number,
    limit = MAX_COMPLEXITY,
): void => {
    throw new Error("STUB");
};
