export const batchExecute = async <T>(
    items: T[],
    batchSize: number,
    delayMs: number,
    executeFn: (item: T) => void,
) => {
    throw new Error("STUB");
};
