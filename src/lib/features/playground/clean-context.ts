import type { SdkContextSchema } from '../../openapi/index.js';

export const cleanContext = (
    context: SdkContextSchema,
): { context: SdkContextSchema; removedProperties: string[] } => {
    throw new Error("STUB");
};
