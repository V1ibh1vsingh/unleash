import type { TestResult } from 'owasp-password-strength-test';
import { type ApiErrorSchema, UnleashError } from './unleash-error.js';

type ValidationError = {
    validationErrors: string[];
    message: string;
};

class OwaspValidationError extends UnleashError {
    statusCode = 400;

    private details: [ValidationError];

    constructor(testResult: TestResult) {
        throw new Error("STUB");
    }

    toJSON(): ApiErrorSchema {
        return {
            ...super.toJSON(),
            details: this.details,
        };
    }
}
export default OwaspValidationError;
