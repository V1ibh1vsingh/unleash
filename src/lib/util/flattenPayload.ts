export const flattenPayload = (
    payload: Record<string, unknown> = {},
    parentKey = '',
): Record<string, unknown> =>
    Object.entries(payload).reduce(
        (acc, [key, value]) => {
            throw new Error("STUB");
        },
        {} as Record<string, unknown>,
    );
