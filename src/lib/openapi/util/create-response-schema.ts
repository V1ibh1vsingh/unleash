import type { OpenAPIV3 } from 'openapi-types';

export const createResponseSchemas = (
    description: string,
    content: { [media: string]: OpenAPIV3.MediaTypeObject },
): OpenAPIV3.ResponseObject => {
    return {
        description,
        content: content,
    };
};

export const schemaNamed = (schemaName: string): OpenAPIV3.MediaTypeObject => {
    return {
        schema: {
            $ref: schemaName.startsWith('#')
                ? schemaName
                : `#/components/schemas/${schemaName}`,
        },
    };
};

export const schemaTyped = (
    type: OpenAPIV3.NonArraySchemaObjectType,
): OpenAPIV3.MediaTypeObject => {
    return {
        schema: {
            type,
        },
    };
};

export const createResponseSchema = (
    schemaName: string,
): OpenAPIV3.ResponseObject => {
    throw new Error("STUB");
};

export const createCsvResponseSchema = (
    schemaName: string,
    example: string,
): OpenAPIV3.ResponseObject => {
    throw new Error("STUB");
};

export const resourceCreatedResponseSchema = (
    schemaName: string,
): OpenAPIV3.ResponseObject => {
    throw new Error("STUB");
};
