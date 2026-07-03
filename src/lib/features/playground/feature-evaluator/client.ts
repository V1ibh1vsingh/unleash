import type { Strategy } from './strategy/index.js';
import type { FeatureInterface } from './feature.js';
import type { RepositoryInterface } from './repository/index.js';
import {
    getDefaultVariant,
    selectVariant,
    type Variant,
    type VariantDefinition,
} from './variant.js';
import type { Context } from './context.js';
import type { SegmentForEvaluation } from './strategy/strategy.js';
import type { PlaygroundStrategySchema } from '../../../openapi/index.js';
import { playgroundStrategyEvaluation } from '../../../openapi/index.js';
import { randomId } from '../../../util/index.js';

export type EvaluatedPlaygroundStrategy = Omit<
    PlaygroundStrategySchema,
    'links'
>;

export type StrategyEvaluationResult = Pick<
    EvaluatedPlaygroundStrategy,
    'result' | 'segments' | 'constraints'
>;

export type FeatureStrategiesEvaluationResult = {
    result: boolean | typeof playgroundStrategyEvaluation.unknownResult;
    variant?: Variant;
    variants?: VariantDefinition[];
    strategies: EvaluatedPlaygroundStrategy[];
    hasUnsatisfiedDependency?: boolean;
};

export default class UnleashClient {
    private repository: RepositoryInterface;

    private strategies: Strategy[];

    constructor(repository: RepositoryInterface, strategies: Strategy[]) {
        throw new Error("STUB");
    }

    private getStrategy(name: string): Strategy | undefined {
        return this.strategies.find(
            (strategy: Strategy): boolean => { throw new Error("STUB"); },
        );
    }

    isParentDependencySatisfied(
        feature: FeatureInterface | undefined,
        context: Context,
    ) {
        if (!feature?.dependencies?.length) {
            return true;
        }

        return feature.dependencies.every((parent) => {
            throw new Error("STUB");
        });
    }

    isEnabled(
        name: string,
        context: Context,
        fallback: Function,
    ): FeatureStrategiesEvaluationResult {
        const feature = this.repository.getToggle(name);

        const parentDependencySatisfied = this.isParentDependencySatisfied(
            feature,
            context,
        );
        const result = this.isFeatureEnabled(feature, context, fallback);

        return {
            ...result,
            hasUnsatisfiedDependency: !parentDependencySatisfied,
        };
    }

    isFeatureEnabled(
        feature: FeatureInterface,
        context: Context,
        fallback: Function,
    ): FeatureStrategiesEvaluationResult {
        if (!feature) {
            return fallback();
        }

        if (!Array.isArray(feature.strategies)) {
            return {
                result: false,
                strategies: [],
            };
        }

        if (feature.strategies.length === 0) {
            return {
                result: feature.enabled,
                strategies: [],
            };
        }

        const strategies = feature.strategies.map(
            (strategySelector): EvaluatedPlaygroundStrategy => {
                throw new Error("STUB");
            },
        );

        // Feature evaluation
        const overallStrategyResult = (): [
            boolean | typeof playgroundStrategyEvaluation.unknownResult,
            VariantDefinition[] | undefined,
            Variant | undefined,
        ] => {
            // if at least one strategy is enabled, then the feature is enabled
            const enabledStrategy = strategies.find(
                (strategy) => { throw new Error("STUB"); },
            );
            if (
                enabledStrategy &&
                enabledStrategy.result.evaluationStatus === 'complete'
            ) {
                return [
                    true,
                    enabledStrategy.result.variants,
                    enabledStrategy.result.variant || undefined,
                ];
            }

            // if at least one strategy is unknown, then the feature _may_ be enabled
            if (
                strategies.some(
                    (strategy) => { throw new Error("STUB"); },
                )
            ) {
                return [
                    playgroundStrategyEvaluation.unknownResult,
                    undefined,
                    undefined,
                ];
            }

            return [false, undefined, undefined];
        };

        const [result, variants, variant] = overallStrategyResult();
        const evalResults: FeatureStrategiesEvaluationResult = {
            result,
            variant,
            variants,
            strategies,
        };

        return evalResults;
    }

    getSegment(repo: RepositoryInterface) {
        return (segmentId: number): SegmentForEvaluation | undefined => {
            throw new Error("STUB");
        };
    }

    getVariant(
        name: string,
        context: Context,
        fallbackVariant?: Variant,
    ): Variant {
        return this.resolveVariant(name, context, fallbackVariant);
    }

    // This function is intended to close an issue in the proxy where feature enabled
    // state gets checked twice when resolving a variant with random stickiness and
    // gradual rollout. This is not intended for general use, prefer getVariant instead
    forceGetVariant(
        name: string,
        context: Context,
        forcedResult: Pick<
            FeatureStrategiesEvaluationResult,
            'result' | 'variant'
        >,
        fallbackVariant?: Variant,
    ): Variant {
        return this.resolveVariant(
            name,
            context,
            fallbackVariant,
            forcedResult,
        );
    }

    private resolveVariant(
        name: string,
        context: Context,
        fallbackVariant?: Variant,
        forcedResult?: Pick<
            FeatureStrategiesEvaluationResult,
            'result' | 'variant'
        >,
    ): Variant {
        const fallback = {
            feature_enabled: false,
            featureEnabled: false,
            ...(fallbackVariant || getDefaultVariant()),
        };
        const feature = this.repository.getToggle(name);

        if (
            typeof feature === 'undefined' ||
            !this.isParentDependencySatisfied(feature, context)
        ) {
            return fallback;
        }

        const result =
            forcedResult ??
            this.isFeatureEnabled(feature, context, () =>
                { throw new Error("STUB"); },
            );
        const enabled = result.result === true;
        fallback.feature_enabled = fallbackVariant?.feature_enabled ?? enabled;
        fallback.featureEnabled = fallback.feature_enabled;
        const strategyVariant = result.variant;
        if (enabled && strategyVariant) {
            return strategyVariant;
        }
        if (!enabled) {
            return fallback;
        }

        if (
            !feature.variants ||
            !Array.isArray(feature.variants) ||
            feature.variants.length === 0 ||
            !feature.enabled
        ) {
            return fallback;
        }

        const variant: VariantDefinition | null = selectVariant(
            feature,
            context,
        );
        if (variant === null) {
            return fallback;
        }

        return {
            name: variant.name,
            payload: variant.payload,
            enabled,
            feature_enabled: true,
            featureEnabled: true,
        };
    }
}
