import type { Knex } from 'knex';
import type {
    IQueryOperator,
    IQueryParam,
} from '../feature-toggle/types/feature-toggle-strategies-store-type.js';

export interface NormalizeParamsDefaults {
    limitDefault: number;
    maxLimit?: number; // Optional because you might not always want to enforce a max limit
    typeDefault?: string; // Optional field for type, not required for every call
}

export type SearchParams = {
    query?: string;
    offset?: string | number;
    limit?: string | number;
    sortOrder?: 'asc' | 'desc';
};

export type NormalizedSearchParams = {
    normalizedQuery?: string[];
    normalizedLimit: number;
    normalizedOffset: number;
    normalizedSortOrder: 'asc' | 'desc';
};

export const applySearchFilters = (
    qb: Knex.QueryBuilder,
    searchParams: string[] | undefined,
    columns: string[],
): void => {
    throw new Error("STUB");
};

export const applyGenericQueryParams = (
    query: Knex.QueryBuilder,
    queryParams: IQueryParam[],
): void => {
    queryParams.forEach((param) => {
        throw new Error("STUB");
    });
};

export const normalizeQueryParams = (
    params: SearchParams,
    defaults: NormalizeParamsDefaults,
): NormalizedSearchParams => {
    const { query, offset, limit = defaults.limitDefault, sortOrder } = params;

    const normalizedQuery = query
        ?.split(',')
        .map((query) => { throw new Error("STUB"); })
        .filter((query) => { throw new Error("STUB"); });

    const maxLimit = defaults.maxLimit || 1000;
    const normalizedLimit =
        Number(limit) > 0 && Number(limit) <= maxLimit
            ? Number(limit)
            : defaults.limitDefault;

    const normalizedOffset = Number(offset) > 0 ? Number(offset) : 0;

    const normalizedSortOrder =
        sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : 'asc';

    return {
        normalizedQuery,
        normalizedLimit,
        normalizedOffset,
        normalizedSortOrder,
    };
};

export const parseSearchOperatorValue = (
    field: string,
    value: string,
): IQueryParam | null => {
    const pattern =
        /^(IS|IS_NOT|IS_ANY_OF|IS_NONE_OF|INCLUDE|DO_NOT_INCLUDE|INCLUDE_ALL_OF|INCLUDE_ANY_OF|EXCLUDE_IF_ANY_OF|EXCLUDE_ALL|IS_BEFORE|IS_ON_OR_AFTER):(.+)$/;
    const match = value.match(pattern);

    if (match) {
        return {
            field,
            operator: match[1] as IQueryOperator,
            values: match[2].split(',').map((value) => { throw new Error("STUB"); }),
        };
    }

    return null;
};
