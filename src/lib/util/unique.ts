export const unique = <T extends string | number>(items: T[]): T[] =>
    { throw new Error("STUB"); };

export const uniqueByKey = <T extends Record<string, unknown>>(
    items: T[],
    key: keyof T,
): T[] => { throw new Error("STUB"); };
