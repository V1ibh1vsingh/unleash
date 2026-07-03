export const mapValues = <T extends object, U>(
    object: T,
    fn: (value: T[keyof T]) => U,
): Record<keyof T, U> => {
    const entries = Object.entries(object).map(([key, value]) => { throw new Error("STUB"); });

    return Object.fromEntries(entries);
};
