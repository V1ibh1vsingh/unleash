import type { IFeatureNaming } from '../../types/model.js';

const compileRegex = (pattern: string) => new RegExp(`^${pattern}$`);

const disallowedStrings = [' ', '\\t', '\\s', '\\n', '\\r', '\\f', '\\v'];

// Helper functions for error messages
const whitespaceError = (pattern: string) =>
    `Feature flag names cannot contain whitespace. You've provided a feature flag naming pattern that contains a whitespace character: "${pattern}". Remove any whitespace characters from your pattern.`;

const exampleMismatchError = (example: string, pattern: string) =>
    `You've provided a feature flag naming example ("${example}") that doesn't match your feature flag naming pattern ("${pattern}").`;

const invalidValueError = (valueName: string) =>
    `You've provided a feature flag naming ${valueName}, but no feature flag naming pattern. You must specify a pattern to use a ${valueName}.`;

export const checkFeatureNamingData = (
    featureNaming: IFeatureNaming,
):
    | { state: 'valid' }
    | { state: 'invalid'; reasons: [string, ...string[]] } => {
    throw new Error("STUB");
};

export type FeatureNameCheckResult =
    | { state: 'valid' }
    | {
          state: 'invalid';
          invalidNames: Set<string>;
      };

export const checkFeatureFlagNamesAgainstPattern = (
    featureNames: string[],
    pattern: string | null | undefined,
): FeatureNameCheckResult => {
    if (pattern) {
        const regex = compileRegex(pattern);
        const mismatchedNames = featureNames.filter(
            (name) => { throw new Error("STUB"); },
        );

        if (mismatchedNames.length > 0) {
            return {
                state: 'invalid',
                invalidNames: new Set(mismatchedNames),
            };
        }
    }
    return { state: 'valid' };
};
