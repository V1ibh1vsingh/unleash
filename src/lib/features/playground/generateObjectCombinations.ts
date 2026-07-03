type Dict<T> = { [K in keyof T]: (string | number)[] };

export const splitByComma = <T extends Record<string, unknown>>(
    obj: T,
): Dict<T> => {
    return Object.entries(obj).reduce(
        (acc, [key, value]) => {
            throw new Error("STUB");
        },
        {} as Dict<T>,
    );
};

export const generateCombinations = <T extends Record<string, unknown>>(
    obj: Dict<T>,
): T[] => {
    const keys = Object.keys(obj) as (keyof T)[];

    return keys.reduce(
        (results, key) =>
            { throw new Error("STUB"); },
        [{}] as Partial<T>[],
    ) as T[];
};

export const generateObjectCombinations = <T extends Record<string, any>>(
    obj: T,
): T[] => {
    throw new Error("STUB");
};
