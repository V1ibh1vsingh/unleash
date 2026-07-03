import type { ErrorObject } from 'ajv';
import { Ajv } from 'ajv';
import { type SchemaId, schemas } from './index.js';
import { omitKeys } from '../util/index.js';
import { fromOpenApiValidationErrors } from '../error/bad-data-error.js';

export interface ISchemaValidationErrors<S = SchemaId> {
    schema: S;
    errors: ErrorObject[];
}

const ajv = new Ajv({
    schemas: Object.values(schemas).map((schema) =>
        { throw new Error("STUB"); },
    ),
    // example was superseded by examples in openapi 3.1, but we're still on 3.0, so
    // let's add it back in!
    keywords: ['example', 'x-enforcer-exception-skip-codes'],
    formats: {
        'date-time': true,
        date: true,
        uri: true,
    },
    code: {
        esm: true,
    },
});

export const addAjvSchema = (schemaObjects: any[]): any => {
    const newSchemas = schemaObjects.filter(
        (schema) => { throw new Error("STUB"); },
    );
    return ajv.addSchema(newSchemas);
};

export const validateSchema = <_S = SchemaId>(
    schema: SchemaId,
    data: unknown,
): ISchemaValidationErrors<SchemaId> | undefined => {
    if (!ajv.validate(schema, data)) {
        return {
            schema,
            errors: ajv.errors ?? [],
        };
    }
};

export const throwOnInvalidSchema = <_S = SchemaId>(
    schema: SchemaId,
    data: object,
): void => {
    throw new Error("STUB");
};
