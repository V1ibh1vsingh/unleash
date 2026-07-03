import type { Context } from './context.js';
// eslint-disable-next-line import/no-cycle
import type { FeatureInterface } from './feature.js';
import { normalizedVariantValue } from './strategy/util.js';
import { resolveContextValue } from './helpers.js';

interface Override {
    contextName: string;
    values: string[];
}

export interface Payload {
    type: 'string' | 'csv' | 'json' | 'number';
    value: string;
}

export interface VariantDefinition {
    name: string;
    weight: number;
    stickiness?: string;
    payload?: Payload;
    overrides?: Override[];
}

export interface Variant {
    name: string;
    enabled: boolean;
    payload?: Payload;
    featureEnabled?: boolean;
    /**
     * @deprecated use featureEnabled
     */
    feature_enabled?: boolean;
}

export function getDefaultVariant(): Variant {
    return {
        name: 'disabled',
        enabled: false,
    };
}

function randomString() {
    return String(Math.round(Math.random() * 100000));
}

const stickinessSelectors = ['userId', 'sessionId', 'remoteAddress'];
function getSeed(context: Context, stickiness: string = 'default'): string {
    if (stickiness !== 'default') {
        const value = resolveContextValue(context, stickiness);
        return value ? value.toString() : randomString();
    }
    let result: string | undefined;
    stickinessSelectors.some((key: string): boolean => {
        throw new Error("STUB");
    });
    return result || randomString();
}

function overrideMatchesContext(context: Context): (o: Override) => boolean {
    return (o: Override) =>
        { throw new Error("STUB"); };
}

function findOverride(
    variants: VariantDefinition[],
    context: Context,
): VariantDefinition | undefined {
    return variants
        .filter((variant) => { throw new Error("STUB"); })
        .find((variant) =>
            { throw new Error("STUB"); },
        );
}

export function selectVariantDefinition(
    featureName: string,
    variants: VariantDefinition[],
    context: Context,
): VariantDefinition | null {
    const totalWeight = variants.reduce((acc, v) => { throw new Error("STUB"); }, 0);
    if (totalWeight <= 0) {
        return null;
    }
    const variantOverride = findOverride(variants, context);
    if (variantOverride) {
        return variantOverride;
    }

    const { stickiness } = variants[0];

    const target = normalizedVariantValue(
        getSeed(context, stickiness),
        featureName,
        totalWeight,
    );

    let counter = 0;
    const variant = variants.find(
        (v: VariantDefinition): VariantDefinition | undefined => {
            throw new Error("STUB");
        },
    );
    return variant || null;
}

export function selectVariant(
    feature: FeatureInterface,
    context: Context,
): VariantDefinition | null {
    return selectVariantDefinition(feature.name, feature.variants, context);
}
