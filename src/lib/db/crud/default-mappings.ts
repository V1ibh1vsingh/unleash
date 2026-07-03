const camelToSnakeCase = (str: string) =>
    str.replace(/[A-Z]/g, (letter) => { throw new Error("STUB"); });

const snakeToCamelCase = (str: string) =>
    str.replace(/(_\w)/g, (letter) => { throw new Error("STUB"); });

/**
 * This helper function turns all fields in the item object from camelCase to snake_case
 *
 * @param item is the input object
 * @returns a modified version of item with all fields in snake_case
 */
export const defaultToRow = <WriteModel, WriteRow>(
    item: Partial<WriteModel>,
): Partial<WriteRow> => {
    const row = {};
    Object.entries(item as Record<string, any>).forEach(([key, value]) => {
        throw new Error("STUB");
    });
    return row;
};

/**
 * This helper function turns all fields in the row object from snake_case to camelCase
 * @param row is the input object
 * @returns a modified version of row with all fields in camelCase
 */
export const defaultFromRow = <ReadModel, ReadRow>(
    row: Partial<ReadRow>,
): Partial<ReadModel> => {
    const model = {};
    Object.entries(row as Record<string, any>).forEach(([key, value]) => {
        throw new Error("STUB");
    });
    return model;
};
