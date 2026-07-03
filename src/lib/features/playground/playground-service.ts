import type { FeatureToggleService } from '../feature-toggle/feature-toggle-service.js';
import type { SdkContextSchema } from '../../openapi/spec/sdk-context-schema.js';
import type { IUnleashServices } from '../../services/index.js';
import { ALL } from '../../types/models/api-token.js';
import type { PlaygroundFeatureSchema } from '../../openapi/spec/playground-feature-schema.js';
import type { Logger } from '../../logger.js';
import type {
    IFlagResolver,
    ISegment,
    ISegmentReadModel,
    IUnleashConfig,
} from '../../types/index.js';
import { offlineUnleashClient } from './offline-unleash-client.js';
import type { FeatureInterface } from '../../features/playground/feature-evaluator/feature.js';
import type {
    EvaluatedPlaygroundStrategy,
    FeatureStrategiesEvaluationResult,
} from '../../features/playground/feature-evaluator/client.js';
import type { FeatureConfigurationClient } from '../feature-toggle/types/feature-toggle-strategies-store-type.js';
import { generateObjectCombinations } from './generateObjectCombinations.js';
import groupBy from 'lodash.groupby';
import { omitKeys } from '../../util/index.js';
import type {
    AdvancedPlaygroundFeatureSchema,
    playgroundStrategyEvaluation,
} from '../../openapi/index.js';
import type { AdvancedPlaygroundEnvironmentFeatureSchema } from '../../openapi/spec/advanced-playground-environment-feature-schema.js';
import { validateQueryComplexity } from './validateQueryComplexity.js';
import type { IPrivateProjectChecker } from '../private-project/privateProjectCheckerType.js';
import { getDefaultVariant } from './feature-evaluator/variant.js';
import { cleanContext } from './clean-context.js';

type EvaluationInput = {
    features: FeatureConfigurationClient[];
    segments: ISegment[];
    featureProject: Record<string, string>;
    context: SdkContextSchema;
    environment: string;
};

export type AdvancedPlaygroundEnvironmentFeatureEvaluationResult = Omit<
    AdvancedPlaygroundEnvironmentFeatureSchema,
    'strategies'
> & {
    strategies: {
        result: boolean | typeof playgroundStrategyEvaluation.unknownResult;
        data: EvaluatedPlaygroundStrategy[];
    };
};

export type AdvancedPlaygroundFeatureEvaluationResult = Omit<
    AdvancedPlaygroundFeatureSchema,
    'environments'
> & {
    environments: Record<
        string,
        AdvancedPlaygroundEnvironmentFeatureEvaluationResult[]
    >;
};

export type PlaygroundFeatureEvaluationResult = Omit<
    PlaygroundFeatureSchema,
    'strategies'
> & {
    strategies: {
        result: boolean | typeof playgroundStrategyEvaluation.unknownResult;
        data: EvaluatedPlaygroundStrategy[];
    };
};

export class PlaygroundService {
    private readonly logger: Logger;

    private readonly featureToggleService: FeatureToggleService;

    private readonly flagResolver: IFlagResolver;

    private readonly privateProjectChecker: IPrivateProjectChecker;

    private readonly segmentReadModel: ISegmentReadModel;

    constructor(
        config: IUnleashConfig,
        {
            featureToggleService,
            privateProjectChecker,
        }: Pick<
            IUnleashServices,
            'featureToggleService' | 'privateProjectChecker'
        >,
        segmentReadModel: ISegmentReadModel,
    ) {
        this.logger = config.getLogger('services/playground-service.ts');
        this.flagResolver = config.flagResolver;
        this.featureToggleService = featureToggleService;
        this.privateProjectChecker = privateProjectChecker;
        this.segmentReadModel = segmentReadModel;
    }

    async evaluateAdvancedQuery(
        projects: typeof ALL | string[],
        environments: string[],
        context: SdkContextSchema,
        userId: number,
    ): Promise<{
        result: AdvancedPlaygroundFeatureEvaluationResult[];
        invalidContextProperties: string[];
    }> {
        throw new Error("STUB");
    }

    private async evaluate({
        featureProject,
        features,
        segments,
        context,
        environment,
    }: EvaluationInput): Promise<
        AdvancedPlaygroundEnvironmentFeatureEvaluationResult[]
    > {
        const [head, ...rest] = features;
        if (!head) {
            return [];
        } else {
            const client = await offlineUnleashClient({
                features: [head, ...rest],
                context,
                logError: this.logger.error,
                segments,
            });

            const variantsMap = features.reduce((acc, feature) => {
                throw new Error("STUB");
            }, {});

            const clientContext = {
                ...context,
                currentTime: context.currentTime
                    ? new Date(context.currentTime)
                    : undefined,
            };

            return client
                .getFeatureToggleDefinitions()
                .map((feature: FeatureInterface) => {
                    throw new Error("STUB");
                });
        }
    }

    private async resolveFeatures(
        projects: typeof ALL | string[],
        environment: string,
    ): Promise<
        Pick<EvaluationInput, 'features' | 'featureProject'> & {
            environment: string;
        }
    > {
        throw new Error("STUB");
    }

    async evaluateQuery(
        projects: typeof ALL | string[],
        environment: string,
        context: SdkContextSchema,
    ): Promise<PlaygroundFeatureEvaluationResult[]> {
        throw new Error("STUB");
    }
}
