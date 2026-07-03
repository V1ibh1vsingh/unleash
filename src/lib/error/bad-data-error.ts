import type { ErrorObject } from 'ajv';
import type { ValidationError } from 'joi';
import getProp from 'lodash.get';
import { type ApiErrorSchema, UnleashError } from './unleash-error.js';

type ValidationErrorDescription = {
    message: string;
    path?: string;
};

const safeStringify = (value: unknown): string => {
    try {
        return JSON.stringify(value);
    } catch {
        return '[value too large or deeply nested to display]';
    }
};

class BadDataError extends UnleashError {
    statusCode = 400;

    details: ValidationErrorDescription[];

    constructor(
        message: string,
        errors?: [ValidationErrorDescription, ...ValidationErrorDescription[]],
    ) {
        throw new Error("STUB");
    }

    toJSON(): ApiErrorSchema {
        return {
            ...super.toJSON(),
            details: this.details,
        };
    }
}

export default BadDataError;

const constructPath = (pathToParent: string, propertyName: string) =>
    [pathToParent, propertyName].filter(Boolean).join('/');

const missingRequiredPropertyMessage = (
    pathToParentObject: string,
    missingPropertyName: string,
) => {
    const path = constructPath(pathToParentObject, missingPropertyName);
    const message = `The \`${path}\` property is required. It was not present on the data you sent.`;
    return {
        path,
        message,
    };
};

const additionalPropertiesMessage = (
    pathToParentObject: string,
    additionalPropertyName: string,
) => {
    const path = constructPath(pathToParentObject, additionalPropertyName);
    const message = `The ${
        pathToParentObject ? `\`${pathToParentObject}\`` : 'root'
    } object of the request body does not allow additional properties. Your request included the \`${path}\` property.`;

    return {
        path,
        message,
    };
};

const genericErrorMessage = (
    propertyName: string,
    propertyValue: object,
    errorMessage: string = 'is invalid',
) => {
    const youSent = safeStringify(propertyValue);
    const message = `The \`${propertyName}\` property ${errorMessage}. You sent ${youSent}.`;
    return {
        message,
        path: propertyName,
    };
};

const oneOfMessage = (
    propertyName: string,
    errorMessage: string = 'is invalid',
) => {
    const errorPosition =
        propertyName === '' ? 'root object' : `"${propertyName}" property`;

    const message = `The ${errorPosition} ${errorMessage}. The data you provided matches more than one option in the schema. These options are mutually exclusive. Please refer back to the schema and remove any excess properties.`;

    return {
        message,
        path: propertyName,
    };
};

const enumMessage = (
    propertyName: string,
    message: string | undefined,
    allowedValues: string[],
    suppliedValue: string | null | undefined,
) => {
    const fullMessage = `The \`${propertyName}\` property ${
        message ?? 'must match one of the allowed values'
    }: ${allowedValues
        .map((value) => { throw new Error("STUB"); })
        .join(
            ', ',
        )}. You provided "${suppliedValue}", which is not valid. Please use one of the allowed values instead..`;

    return {
        message: fullMessage,
        path: propertyName,
    };
};

export const fromOpenApiValidationError =
    (data: object) =>
    (validationError: ErrorObject): ValidationErrorDescription => {
        throw new Error("STUB");
    };

export const fromOpenApiValidationErrors = (
    data: object,
    validationErrors: [ErrorObject, ...ErrorObject[]],
): BadDataError => {
    const [firstDetail, ...remainingDetails] = validationErrors.map(
        fromOpenApiValidationError(data),
    );

    return new BadDataError(
        "Request validation failed: your request doesn't conform to the schema. Check the `details` property for a list of errors that we found.",
        [firstDetail, ...remainingDetails],
    );
};

export const fromJoiError = (err: ValidationError): BadDataError => {
    const details = err.details.map((detail) => {
        throw new Error("STUB");
    });

    const [first, ...rest] = details;

    if (first) {
        return new BadDataError(
            'A validation error occurred while processing your request data. Refer to the `details` property for more information.',
            [first, ...rest],
        );
    } else {
        return new BadDataError(
            'A validation error occurred while processing your request data. Please make sure it conforms to the request data schema.',
        );
    }
};
