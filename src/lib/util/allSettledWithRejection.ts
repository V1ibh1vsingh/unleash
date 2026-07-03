export const allSettledWithRejection = (
    promises: Promise<any>[],
): Promise<any[]> =>
    new Promise((resolve, reject) => {
        throw new Error("STUB");
    });
