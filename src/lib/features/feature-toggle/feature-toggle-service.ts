import {
    CREATE_FEATURE_STRATEGY,
    EnvironmentVariantEvent,
    FeatureArchivedEvent,
    FeatureChangeProjectEvent,
    FeatureCreatedEvent,
    FeatureDeletedEvent,
    FeatureEnvironmentEvent,
    FeatureMetadataUpdateEvent,
    FeatureRevivedEvent,
    FeatureStaleEvent,
    FeatureStrategyAddEvent,
    FeatureStrategyRemoveEvent,
    FeatureStrategyUpdateEvent,
    type FeatureToggle,
    type FeatureToggleDTO,
    type FeatureToggleView,
    type FeatureToggleWithEnvironment,
    type IAuditUser,
    type IConstraint,
    type IDependency,
    type IFeatureCollaboratorsReadModel,
    type IFeatureEnvironmentInfo,
    type IFeatureEnvironmentStore,
    type IFeatureLifecycleStage,
    type IFeatureLinksReadModel,
    type IFeatureNaming,
    type IFeatureOverview,
    type IFeatureStrategy,
    type IFeatureTagStore,
    type IFeatureToggleClientStore,
    type IFeatureToggleQuery,
    type IFeatureToggleStore,
    type IFeatureTypeCount,
    type IFlagResolver,
    type IProjectStore,
    type ISegment,
    type IStrategyConfig,
    type IStrategyStore,
    type IUnleashConfig,
    type IUnleashStores,
    type IVariant,
    PotentiallyStaleOnEvent,
    type Saved,
    SKIP_CHANGE_REQUEST,
    StrategiesOrderChangedEvent,
    type StrategyIds,
    SYSTEM_USER_AUDIT,
    type Unsaved,
    UPDATE_FEATURE_ENVIRONMENT_VARIANTS,
    WeightType,
} from '../../types/index.js';
import type { Logger } from '../../logger.js';
import {
    ForbiddenError,
    FOREIGN_KEY_VIOLATION,
    OperationDeniedError,
    PatternError,
    PermissionError,
    BadDataError,
    NameExistsError,
    InvalidOperationError,
} from '../../error/index.js';
import {
    featureMetadataSchema,
    nameSchema,
    variantsArraySchema,
} from '../../schema/feature-schema.js';
import NotFoundError from '../../error/notfound-error.js';
import type {
    FeatureConfigurationClient,
    IFeatureStrategiesStore,
} from './types/feature-toggle-strategies-store-type.js';
import { DEFAULT_ENV } from '../../util/index.js';
import type { Operation } from 'fast-json-patch';
import fastJsonPatch from 'fast-json-patch';
const { applyPatch, deepClone } = fastJsonPatch;
import type { IConstraintsReadModel } from '../constraints/constraints-read-model-type.js';
import type { SetStrategySortOrderSchema } from '../../openapi/spec/set-strategy-sort-order-schema.js';
import {
    getDefaultStrategy,
    getProjectDefaultStrategy,
} from '../playground/feature-evaluator/helpers.js';
import type { AccessService } from '../../services/access-service.js';
import type { IUser } from '../../types/index.js';
import type { IFeatureProjectUserParams } from './feature-toggle-controller.js';
import { unique } from '../../util/unique.js';
import type { ISegmentService } from '../segment/segment-service-interface.js';
import type { IChangeRequestAccessReadModel } from '../change-request-access-service/change-request-access-read-model.js';
import { checkFeatureFlagNamesAgainstPattern } from '../feature-naming-pattern/feature-naming-validation.js';
import type { IDependentFeaturesReadModel } from '../dependent-features/dependent-features-read-model-type.js';
import type EventService from '../events/event-service.js';
import type { DependentFeaturesService } from '../dependent-features/dependent-features-service.js';
import type { FeatureToggleInsert } from './feature-toggle-store.js';
import ArchivedFeatureError from '../../error/archivedfeature-error.js';
import { FEATURES_CREATED_BY_PROCESSED } from '../../metric-events.js';
import { allSettledWithRejection } from '../../util/allSettledWithRejection.js';
import type EventEmitter from 'node:events';
import type { IFeatureLifecycleReadModel } from '../feature-lifecycle/feature-lifecycle-read-model-type.js';
import { throwExceedsLimitError } from '../../error/exceeds-limit-error.js';
import type { Collaborator } from './types/feature-collaborators-read-model-type.js';
import { sortStrategies } from '../../util/sortStrategies.js';
import type FeatureLinkService from '../feature-links/feature-link-service.js';
import type { IFeatureLink } from '../feature-links/feature-links-read-model-type.js';
import type { ResourceLimitsService } from '../resource-limits/resource-limits-service.js';
interface IFeatureContext {
    featureName: string;
    projectId: string;
}

interface IFeatureStrategyContext extends IFeatureContext {
    environment: string;
}
export interface IGetFeatureParams {
    featureName: string;
    archived?: boolean;
    projectId?: string;
    environmentVariants?: boolean;
    userId?: number;
}

export type FeatureNameCheckResultWithFeaturePattern =
    | {
          state: 'valid';
      }
    | {
          state: 'invalid';
          invalidNames: Set<string>;
          featureNaming: IFeatureNaming;
      };

export type Stores = Pick<
    IUnleashStores,
    | 'featureStrategiesStore'
    | 'featureToggleStore'
    | 'clientFeatureToggleStore'
    | 'projectStore'
    | 'featureTagStore'
    | 'featureEnvironmentStore'
    | 'strategyStore'
>;

export type Config = Pick<
    IUnleashConfig,
    'getLogger' | 'flagResolver' | 'eventBus'
>;

export type ServicesAndReadModels = {
    segmentService: ISegmentService;
    accessService: AccessService;
    eventService: EventService;
    changeRequestAccessReadModel: IChangeRequestAccessReadModel;
    dependentFeaturesReadModel: IDependentFeaturesReadModel;
    dependentFeaturesService: DependentFeaturesService;
    featureLifecycleReadModel: IFeatureLifecycleReadModel;
    featureCollaboratorsReadModel: IFeatureCollaboratorsReadModel;
    featureLinkService: FeatureLinkService;
    featureLinksReadModel: IFeatureLinksReadModel;
    resourceLimitsService: ResourceLimitsService;
    constraintsReadModel: IConstraintsReadModel;
};

export class FeatureToggleService {
    private logger: Logger;

    private featureStrategiesStore: IFeatureStrategiesStore;

    private strategyStore: IStrategyStore;

    private featureToggleStore: IFeatureToggleStore;

    private clientFeatureToggleStore: IFeatureToggleClientStore;

    private tagStore: IFeatureTagStore;

    private featureEnvironmentStore: IFeatureEnvironmentStore;

    private projectStore: IProjectStore;

    private constraintsReadModel: IConstraintsReadModel;

    private segmentService: ISegmentService;

    private accessService: AccessService;

    private eventService: EventService;

    private flagResolver: IFlagResolver;

    private changeRequestAccessReadModel: IChangeRequestAccessReadModel;

    private dependentFeaturesReadModel: IDependentFeaturesReadModel;

    private featureLifecycleReadModel: IFeatureLifecycleReadModel;

    private featureCollaboratorsReadModel: IFeatureCollaboratorsReadModel;

    private featureLinksReadModel: IFeatureLinksReadModel;

    private featureLinkService: FeatureLinkService;

    private dependentFeaturesService: DependentFeaturesService;

    private eventBus: EventEmitter;

    private resourceLimitsService: ResourceLimitsService;

    constructor(
        {
            featureStrategiesStore,
            featureToggleStore,
            clientFeatureToggleStore,
            projectStore,
            featureTagStore,
            featureEnvironmentStore,
            strategyStore,
        }: Stores,
        { getLogger, flagResolver, eventBus }: Config,
        {
            segmentService,
            accessService,
            eventService,
            changeRequestAccessReadModel,
            dependentFeaturesReadModel,
            dependentFeaturesService,
            featureLifecycleReadModel,
            featureCollaboratorsReadModel,
            featureLinksReadModel,
            featureLinkService,
            resourceLimitsService,
            constraintsReadModel,
        }: ServicesAndReadModels,
    ) {
        this.logger = getLogger('services/feature-toggle-service.ts');
        this.featureStrategiesStore = featureStrategiesStore;
        this.strategyStore = strategyStore;
        this.featureToggleStore = featureToggleStore;
        this.clientFeatureToggleStore = clientFeatureToggleStore;
        this.tagStore = featureTagStore;
        this.projectStore = projectStore;
        this.featureEnvironmentStore = featureEnvironmentStore;
        this.constraintsReadModel = constraintsReadModel;
        this.segmentService = segmentService;
        this.accessService = accessService;
        this.eventService = eventService;
        this.flagResolver = flagResolver;
        this.changeRequestAccessReadModel = changeRequestAccessReadModel;
        this.dependentFeaturesReadModel = dependentFeaturesReadModel;
        this.dependentFeaturesService = dependentFeaturesService;
        this.featureLifecycleReadModel = featureLifecycleReadModel;
        this.featureCollaboratorsReadModel = featureCollaboratorsReadModel;
        this.featureLinksReadModel = featureLinksReadModel;
        this.featureLinkService = featureLinkService;
        this.eventBus = eventBus;
        this.resourceLimitsService = resourceLimitsService;
    }

    async validateFeaturesContext(
        featureNames: string[],
        projectId: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validateFeatureBelongsToProject(
        { featureName, projectId }: IFeatureContext,
        exposeExistingFeature: boolean = true,
    ): Promise<void> {
        const id = await this.featureToggleStore.getProjectId(featureName);

        if (id !== projectId) {
            throw new NotFoundError(
                `There's no feature named "${featureName}" in project "${projectId}"${
                    id !== undefined && exposeExistingFeature
                        ? `, but there's a feature with that name in project "${id}"`
                        : '.'
                }`,
            );
        }
    }

    async validateFeatureIsNotArchived(
        featureName: string,
        _project: string,
    ): Promise<void> {
        const toggle = await this.featureToggleStore.get(featureName);
        if (toggle === undefined) {
            throw new NotFoundError(`Could not find feature ${featureName}`);
        }
        if (toggle.archived || toggle.archivedAt) {
            throw new ArchivedFeatureError();
        }
    }

    async validateNoChildren(featureName: string): Promise<void> {
        throw new Error("STUB");
    }

    async validateNoOrphanParents(featureNames: string[]): Promise<void> {
        throw new Error("STUB");
    }

    validateUpdatedProperties(
        { featureName, projectId }: IFeatureContext,
        existingStrategy: IFeatureStrategy,
    ): void {
        if (existingStrategy.projectId !== projectId) {
            throw new InvalidOperationError(
                'You can not change the projectId for an activation strategy.',
            );
        }

        if (existingStrategy.featureName !== featureName) {
            throw new InvalidOperationError(
                'You can not change the featureName for an activation strategy.',
            );
        }
    }

    async validateProjectCanAccessSegments(
        projectId: string,
        segmentIds?: number[],
    ): Promise<void> {
        if (segmentIds && segmentIds.length > 0) {
            await Promise.all(
                segmentIds.map((segmentId) =>
                    { throw new Error("STUB"); },
                ),
            ).then((segments) => {
                throw new Error("STUB");
            });
        }
    }

    async validateStrategyLimit(featureEnv: {
        projectId: string;
        environment: string;
        featureName: string;
    }) {
        const { featureEnvironmentStrategies: limit } =
            await this.resourceLimitsService.getResourceLimits();
        const existingCount = (
            await this.featureStrategiesStore.getStrategiesForFeatureEnv(
                featureEnv.projectId,
                featureEnv.featureName,
                featureEnv.environment,
            )
        ).length;
        if (existingCount >= limit) {
            throwExceedsLimitError(this.eventBus, {
                resource: 'strategy',
                limit,
            });
        }
    }

    private async validateConstraintsLimit(constraints: {
        updated: IConstraint[];
        existing: IConstraint[];
    }) {
        const {
            constraints: constraintsLimit,
            constraintValues: constraintValuesLimit,
        } = await this.resourceLimitsService.getResourceLimits();

        if (
            constraints.updated.length > constraintsLimit &&
            constraints.updated.length > constraints.existing.length
        ) {
            throwExceedsLimitError(this.eventBus, {
                resource: 'constraints',
                limit: constraintsLimit,
            });
        }

        const isSameLength =
            constraints.existing.length === constraints.updated.length;
        const constraintOverLimit = constraints.updated.find(
            (constraint, i) => {
                throw new Error("STUB");
            },
        );

        if (constraintOverLimit) {
            throwExceedsLimitError(this.eventBus, {
                resource: `constraint values for ${constraintOverLimit.contextName}`,
                limit: constraintValuesLimit,
                resourceNameOverride: 'constraint values',
            });
        }
    }

    async validateStrategyType(
        strategyName: string | undefined,
    ): Promise<void> {
        if (strategyName !== undefined) {
            const exists = await this.strategyStore.exists(strategyName);
            if (!exists) {
                throw new BadDataError(
                    `Could not find strategy type with name ${strategyName}`,
                );
            }
        }
    }

    async patchFeature(
        project: string,
        featureName: string,
        operations: Operation[],
        auditUser: IAuditUser,
    ): Promise<FeatureToggle> {
        throw new Error("STUB");
    }

    featureStrategyToPublic(
        featureStrategy: IFeatureStrategy,
        segments: ISegment[] = [],
    ): Saved<IStrategyConfig> {
        const result: Saved<IStrategyConfig> = {
            id: featureStrategy.id,
            name: featureStrategy.strategyName,
            title: featureStrategy.title,
            disabled: featureStrategy.disabled,
            constraints: featureStrategy.constraints || [],
            parameters: featureStrategy.parameters,
            variants: featureStrategy.variants || [],
            sortOrder: featureStrategy.sortOrder,
            segments: segments.map((segment) => { throw new Error("STUB"); }) ?? [],
        };

        return result;
    }

    async updateStrategiesSortOrder(
        context: IFeatureStrategyContext,
        sortOrders: SetStrategySortOrderSchema,
        auditUser: IAuditUser,
        user?: IUser,
    ): Promise<Saved<any>> {
        throw new Error("STUB");
    }

    async unprotectedUpdateStrategiesSortOrder(
        context: IFeatureStrategyContext,
        sortOrders: SetStrategySortOrderSchema,
        auditUser: IAuditUser,
    ): Promise<Saved<any>> {
        throw new Error("STUB");
    }

    async createStrategy(
        strategyConfig: Unsaved<IStrategyConfig>,
        context: IFeatureStrategyContext,
        auditUser: IAuditUser,
        user?: IUser,
    ): Promise<Saved<IStrategyConfig>> {
        await this.stopWhenChangeRequestsEnabled(
            context.projectId,
            context.environment,
            user,
        );
        return this.unprotectedCreateStrategy(
            strategyConfig,
            context,
            auditUser,
        );
    }

    private async parametersWithDefaults(
        projectId: string,
        featureName: string,
        strategyName: string,
        params: IFeatureStrategy['parameters'] | undefined,
    ) {
        if (strategyName === 'flexibleRollout') {
            const stickiness =
                !params?.stickiness || params?.stickiness === ''
                    ? await this.featureStrategiesStore.getDefaultStickiness(
                          projectId,
                      )
                    : params?.stickiness;
            return {
                ...params,
                rollout: params?.rollout ?? '100',
                stickiness,
                groupId: params?.groupId ?? featureName,
            };
        } else {
            // We don't really have good defaults for the other kinds of known strategies, so return an empty map.
            return params ?? {};
        }
    }
    private async standardizeStrategyConfig(
        projectId: string,
        featureName: string,
        strategyConfig: Unsaved<IStrategyConfig>,
        existing?: IFeatureStrategy,
    ): Promise<
        { name: string } & Pick<
            Partial<IStrategyConfig>,
            | 'title'
            | 'disabled'
            | 'variants'
            | 'sortOrder'
            | 'constraints'
            | 'parameters'
        >
    > {
        const { name, title, disabled, sortOrder } = strategyConfig;
        let { constraints, parameters, variants } = strategyConfig;
        if (constraints && constraints.length > 0) {
            await this.validateConstraintsLimit({
                updated: constraints,
                existing: existing?.constraints ?? [],
            });
            constraints =
                await this.constraintsReadModel.validateConstraints(
                    constraints,
                );
        }

        parameters = await this.parametersWithDefaults(
            projectId,
            featureName,
            name,
            strategyConfig.parameters,
        );
        if (variants && variants.length > 0) {
            await variantsArraySchema.validateAsync(variants);
            const fixedVariants = this.fixVariantWeights(variants);
            variants = fixedVariants;
        }

        return {
            name,
            title,
            disabled,
            sortOrder,
            constraints,
            variants,
            parameters,
        };
    }
    async unprotectedCreateStrategy(
        strategyConfig: Unsaved<IStrategyConfig>,
        context: IFeatureStrategyContext,
        auditUser: IAuditUser,
    ): Promise<Saved<IStrategyConfig>> {
        const { featureName, projectId, environment } = context;
        await this.validateFeatureBelongsToProject(context);

        await this.validateStrategyType(strategyConfig.name);
        await this.validateProjectCanAccessSegments(
            projectId,
            strategyConfig.segments,
        );

        const standardizedConfig = await this.standardizeStrategyConfig(
            projectId,
            featureName,
            strategyConfig,
        );

        await this.validateStrategyLimit({
            featureName,
            projectId,
            environment,
        });

        try {
            const newFeatureStrategy =
                await this.featureStrategiesStore.createStrategyFeatureEnv({
                    ...standardizedConfig,
                    strategyName: standardizedConfig.name,
                    constraints: standardizedConfig.constraints || [],
                    variants: standardizedConfig.variants || [],
                    parameters: standardizedConfig.parameters || {},
                    projectId,
                    featureName,
                    environment,
                });

            if (
                strategyConfig.segments &&
                Array.isArray(strategyConfig.segments)
            ) {
                await this.segmentService.updateStrategySegments(
                    newFeatureStrategy.id,
                    strategyConfig.segments,
                );
            }

            const segments = await this.segmentService.getByStrategy(
                newFeatureStrategy.id,
            );

            const strategy = this.featureStrategyToPublic(
                newFeatureStrategy,
                segments,
            );

            await this.eventService.storeEvent(
                new FeatureStrategyAddEvent({
                    project: projectId,
                    featureName,
                    environment,
                    data: strategy,
                    auditUser,
                }),
            );
            return strategy;
        } catch (e) {
            if (e.code === FOREIGN_KEY_VIOLATION) {
                throw new BadDataError(
                    'You have not added the current environment to the project',
                );
            }
            throw e;
        }
    }

    /**
     * PUT /api/admin/projects/:projectId/features/:featureName/strategies/:strategyId ?
     * {
     *
     * }
     * @param id
     * @param updates
     * @param context - Which context does this strategy live in (projectId, featureName, environment)
     * @param auditUser - Audit info about the user performing the update
     * @param user - Optional User object performing the action
     */
    async updateStrategy(
        id: string,
        updates: Partial<IStrategyConfig>,
        context: IFeatureStrategyContext,
        auditUser: IAuditUser,
        user?: IUser,
    ): Promise<Saved<IStrategyConfig>> {
        await this.stopWhenChangeRequestsEnabled(
            context.projectId,
            context.environment,
            user,
        );
        return this.unprotectedUpdateStrategy(
            id,
            updates,
            context,
            auditUser,
            user,
        );
    }

    async optionallyDisableFeature(
        featureName: string,
        environment: string,
        projectId: string,
        auditUser: IAuditUser,
        user?: IUser,
    ): Promise<void> {
        const strategies =
            await this.featureStrategiesStore.getStrategiesForFeatureEnv(
                projectId,
                featureName,
                environment,
            );
        const hasOnlyDisabledStrategies = strategies.every(
            (strategy) => { throw new Error("STUB"); },
        );
        if (hasOnlyDisabledStrategies) {
            await this.unprotectedUpdateEnabled(
                projectId,
                featureName,
                environment,
                false,
                auditUser,
                user,
            );
        }
    }

    async unprotectedUpdateStrategy(
        id: string,
        updates: Partial<IStrategyConfig>,
        context: IFeatureStrategyContext,
        auditUser: IAuditUser,
        user?: IUser,
    ): Promise<Saved<IStrategyConfig>> {
        const { projectId, environment, featureName } = context;
        const existingStrategy = await this.featureStrategiesStore.get(id);
        if (existingStrategy === undefined) {
            throw new NotFoundError(`Could not find strategy with id ${id}`);
        }
        this.validateUpdatedProperties(context, existingStrategy);
        await this.validateStrategyType(updates.name);
        await this.validateProjectCanAccessSegments(
            projectId,
            updates.segments,
        );
        const existingSegments = await this.segmentService.getByStrategy(id);

        if (existingStrategy.id === id) {
            const standardizedUpdates = await this.standardizeStrategyConfig(
                projectId,
                featureName,
                { ...updates, name: updates.name! },
                existingStrategy,
            );
            const strategy = await this.featureStrategiesStore.updateStrategy(
                id,
                standardizedUpdates,
            );

            if (updates.segments && Array.isArray(updates.segments)) {
                await this.segmentService.updateStrategySegments(
                    strategy.id,
                    updates.segments,
                );
            }

            const segments = await this.segmentService.getByStrategy(
                strategy.id,
            );

            // Store event!
            const data = this.featureStrategyToPublic(strategy, segments);
            const preData = this.featureStrategyToPublic(
                existingStrategy,
                existingSegments,
            );
            await this.eventService.storeEvent(
                new FeatureStrategyUpdateEvent({
                    project: projectId,
                    featureName,
                    environment,
                    data,
                    preData,
                    auditUser,
                }),
            );
            await this.optionallyDisableFeature(
                featureName,
                environment,
                projectId,
                auditUser,
                user,
            );
            return data;
        }
        throw new NotFoundError(`Could not find strategy with id ${id}`);
    }

    async updateStrategyParameter(
        id: string,
        name: string,
        value: string | number,
        context: IFeatureStrategyContext,
        auditUser: IAuditUser,
    ): Promise<Saved<IStrategyConfig>> {
        throw new Error("STUB");
    }

    /**
     * DELETE /api/admin/projects/:projectId/features/:featureName/environments/:environmentName/strategies/:strategyId
     * {
     *
     * }
     * @param id - strategy id
     * @param context - Which context does this strategy live in (projectId, featureName, environment)
     * @param auditUser - Audit information about user performing the action (userid, username, ip)
     * @param user
     */
    async deleteStrategy(
        id: string,
        context: IFeatureStrategyContext,
        auditUser: IAuditUser,
        user?: IUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async unprotectedDeleteStrategy(
        id: string,
        context: IFeatureStrategyContext,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getStrategiesForEnvironment(
        project: string,
        featureName: string,
        environment: string = DEFAULT_ENV,
    ): Promise<Saved<IStrategyConfig>[]> {
        this.logger.debug('getStrategiesForEnvironment');
        const hasEnv = await this.featureEnvironmentStore.featureHasEnvironment(
            environment,
            featureName,
        );
        if (hasEnv) {
            const featureStrategies =
                await this.featureStrategiesStore.getStrategiesForFeatureEnv(
                    project,
                    featureName,
                    environment,
                );
            const result: Saved<IStrategyConfig>[] = [];
            for (const strat of featureStrategies) {
                const segments =
                    (await this.segmentService.getByStrategy(strat.id)).map(
                        (segment) => { throw new Error("STUB"); },
                    ) ?? [];
                result.push({
                    id: strat.id,
                    name: strat.strategyName,
                    constraints: strat.constraints,
                    parameters: strat.parameters,
                    variants: strat.variants,
                    title: strat.title,
                    disabled: strat.disabled,
                    sortOrder: strat.sortOrder,
                    milestoneId: strat.milestoneId,
                    segments,
                });
            }
            return result;
        }
        throw new NotFoundError(
            `Feature ${featureName} does not have environment ${environment}`,
        );
    }

    /**
     * GET /api/admin/projects/:project/features/:featureName
     * @param featureName
     * @param archived - return archived or non archived toggles
     * @param projectId - provide if you're requesting the feature in the context of a specific project.
     * @param userId
     */
    async getFeature({
        featureName,
        archived,
        projectId,
        environmentVariants,
        userId,
    }: IGetFeatureParams): Promise<FeatureToggleView> {
        throw new Error("STUB");
    }

    async getVariantsForEnv(
        featureName: string,
        environment: string,
    ): Promise<IVariant[]> {
        throw new Error("STUB");
    }

    async getFeatureMetadata(featureName: string): Promise<FeatureToggle> {
        throw new Error("STUB");
    }

    async getClientFeatures(
        query?: IFeatureToggleQuery,
    ): Promise<FeatureConfigurationClient[]> {
        const result = await this.clientFeatureToggleStore.getFrontendApiClient(
            query || {},
        );
        return result.map(
            ({
                name,
                type,
                enabled,
                project,
                stale,
                strategies,
                variants,
                description,
                impressionData,
                dependencies,
            }) => { throw new Error("STUB"); },
        );
    }

    async getPlaygroundFeatures(
        query?: IFeatureToggleQuery,
    ): Promise<FeatureConfigurationClient[]> {
        throw new Error("STUB");
    }

    async getFeatureOverview(
        params: IFeatureProjectUserParams,
    ): Promise<IFeatureOverview[]> {
        return this.featureStrategiesStore.getFeatureOverview(params);
    }

    async getFeatureTypeCounts(
        params: IFeatureProjectUserParams,
    ): Promise<IFeatureTypeCount[]> {
        throw new Error("STUB");
    }

    async getFeatureToggle(
        featureName: string,
    ): Promise<FeatureToggleWithEnvironment> {
        throw new Error("STUB");
    }

    private async validateFeatureFlagLimit() {
        const currentFlagCount = await this.featureToggleStore.count();
        const { featureFlags: limit } =
            await this.resourceLimitsService.getResourceLimits();
        if (currentFlagCount >= limit) {
            throwExceedsLimitError(this.eventBus, {
                resource: 'feature flag',
                limit,
            });
        }
    }

    private async validateActiveProject(projectId: string) {
        throw new Error("STUB");
    }

    async createFeatureToggle(
        projectId: string,
        value: FeatureToggleDTO,
        auditUser: IAuditUser,
        isValidated: boolean = false,
    ): Promise<FeatureToggle> {
        this.logger.info(
            `${auditUser.username} creates feature flag ${value.name}`,
        );
        await this.validateName(value.name);
        await this.validateFeatureFlagNameAgainstPattern(value.name, projectId);

        const projectExists =
            await this.projectStore.hasActiveProject(projectId);

        if (await this.projectStore.isFeatureLimitReached(projectId)) {
            throw new InvalidOperationError(
                'You have reached the maximum number of feature flags for this project.',
            );
        }

        await this.validateFeatureFlagLimit();

        if (projectExists) {
            let featureData: FeatureToggleInsert;
            if (isValidated) {
                featureData = { createdByUserId: auditUser.id, ...value };
            } else {
                const validated =
                    await featureMetadataSchema.validateAsync(value);
                featureData = {
                    createdByUserId: auditUser.id,
                    ...validated,
                };
            }
            const featureName = featureData.name;
            const createdToggle = await this.featureToggleStore.create(
                projectId,
                featureData,
            );
            await this.featureEnvironmentStore.connectFeatureToEnvironmentsForProject(
                featureName,
                projectId,
            );

            if (value.variants && value.variants.length > 0) {
                const environments =
                    await this.featureEnvironmentStore.getEnvironmentsForFeature(
                        featureName,
                    );

                await this.featureEnvironmentStore.setVariantsToFeatureEnvironments(
                    featureName,
                    environments.map((env) => { throw new Error("STUB"); }),
                    value.variants,
                );
            }

            if (value.tags && value.tags.length > 0) {
                const mapTagsToFeatureTagInserts = value.tags.map((tag) => { throw new Error("STUB"); });
                await this.tagStore.tagFeatures(mapTagsToFeatureTagInserts);
            }

            await this.eventService.storeEvent(
                new FeatureCreatedEvent({
                    featureName,
                    project: projectId,
                    data: createdToggle,
                    auditUser,
                }),
            );

            await this.addLinksFromTemplates(projectId, featureName, auditUser);

            return createdToggle;
        }
        throw new NotFoundError(
            `Active project with id ${projectId} does not exist`,
        );
    }

    async checkFeatureFlagNamesAgainstProjectPattern(
        projectId: string,
        featureNames: string[],
    ): Promise<FeatureNameCheckResultWithFeaturePattern> {
        try {
            const project = await this.projectStore.get(projectId);
            if (project === undefined) {
                throw new NotFoundError(
                    `Could not find project with id: ${projectId}`,
                );
            }
            const patternData = project.featureNaming;
            const namingPattern = patternData?.pattern;

            if (namingPattern) {
                const result = checkFeatureFlagNamesAgainstPattern(
                    featureNames,
                    namingPattern,
                );

                if (result.state === 'invalid') {
                    return {
                        ...result,
                        featureNaming: patternData,
                    };
                }
            }
        } catch (error) {
            // the project doesn't exist, so there's nothing to
            // validate against
            this.logger.info(
                "Got an error when trying to validate flag naming patterns. It is probably because the target project doesn't exist. Here's the error:",
                error.message,
            );

            return { state: 'valid' };
        }

        return { state: 'valid' };
    }

    async validateFeatureFlagNameAgainstPattern(
        featureName: string,
        projectId?: string,
    ): Promise<void> {
        if (projectId) {
            const result =
                await this.checkFeatureFlagNamesAgainstProjectPattern(
                    projectId,
                    [featureName],
                );

            if (result.state === 'invalid') {
                const namingPattern = result.featureNaming.pattern;
                const namingExample = result.featureNaming.example;
                const namingDescription = result.featureNaming.description;

                const error = `The feature flag name "${featureName}" does not match the project's naming pattern: "${namingPattern}".`;
                const example = namingExample
                    ? ` Here's an example of a name that does match the pattern: "${namingExample}"."`
                    : '';
                const description = namingDescription
                    ? ` The pattern's description is: "${namingDescription}"`
                    : '';
                throw new PatternError(`${error}${example}${description}`, [
                    `The flag name does not match the pattern.`,
                ]);
            }
        }
    }

    async cloneFeatureToggle(
        featureName: string,
        projectId: string,
        newFeatureName: string,
        auditUser: IAuditUser,
        user: IUser,
        replaceGroupId: boolean = true,
    ): Promise<FeatureToggle> {
        throw new Error("STUB");
    }
    private async validateCloneFeaturePermissions(
        projectId: string,
        environments: FeatureToggleWithEnvironment['environments'],
        user: IUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateFeatureToggle(
        projectId: string,
        updatedFeature: FeatureToggleDTO,
        featureName: string,
        auditUser: IAuditUser,
    ): Promise<FeatureToggle> {
        await this.validateFeatureBelongsToProject({
            featureName,
            projectId,
        });

        this.logger.info(
            `${auditUser.username} updates feature flag ${featureName}`,
        );

        const featureData =
            await featureMetadataSchema.validateAsync(updatedFeature);

        const preData = await this.featureToggleStore.get(featureName);

        const featureToggle = await this.featureToggleStore.update(projectId, {
            ...featureData,
            name: featureName,
        });
        if (preData === undefined) {
            throw new NotFoundError(
                `Could find feature toggle with name ${featureName}`,
            );
        }
        await this.eventService.storeEvent(
            new FeatureMetadataUpdateEvent({
                auditUser,
                data: featureToggle,
                preData,
                featureName,
                project: projectId,
            }),
        );
        return featureToggle;
    }

    async getFeatureCountForProject(projectId: string): Promise<number> {
        throw new Error("STUB");
    }

    async removeAllStrategiesForEnv(
        toggleName: string,
        environment: string = DEFAULT_ENV,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getStrategy(strategyId: string): Promise<Saved<IStrategyConfig>> {
        const strategy =
            await this.featureStrategiesStore.getStrategyById(strategyId);

        const segments = await this.segmentService.getByStrategy(strategyId);
        let result: Saved<IStrategyConfig> = {
            id: strategy.id,
            name: strategy.strategyName,
            constraints: strategy.constraints || [],
            parameters: strategy.parameters,
            variants: strategy.variants || [],
            segments: [],
            title: strategy.title,
            disabled: strategy.disabled,
            sortOrder: strategy.sortOrder,
        };

        if (segments && segments.length > 0) {
            result = {
                ...result,
                segments: segments.map((segment) => { throw new Error("STUB"); }),
            };
        }
        return result;
    }

    async getEnvironmentInfo(
        project: string,
        environment: string,
        featureName: string,
    ): Promise<IFeatureEnvironmentInfo> {
        throw new Error("STUB");
    }

    // todo: store events for this change.
    async deleteEnvironment(
        projectId: string,
        environment: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    /** Validations  */
    async validateName(name: string): Promise<string> {
        await nameSchema.validateAsync({ name });
        await this.validateUniqueFeatureName(name);
        return name;
    }

    async validateUniqueFeatureName(name: string): Promise<void> {
        let msg: string;
        try {
            const feature = await this.featureToggleStore.get(name);
            if (feature === undefined) {
                return;
            }
            msg = feature.archived
                ? 'An archived flag with that name already exists'
                : 'A flag with that name already exists';
        } catch (_error) {
            return;
        }
        throw new NameExistsError(msg);
    }

    async hasFeature(name: string): Promise<boolean> {
        throw new Error("STUB");
    }

    async updateStale(
        featureName: string,
        isStale: boolean,
        auditUser: IAuditUser,
    ): Promise<any> {
        throw new Error("STUB");
    }

    async archiveToggle(
        featureName: string,
        user: IUser,
        auditUser: IAuditUser,
        projectId?: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async unprotectedArchiveToggle(
        featureName: string,
        auditUser: IAuditUser,
        projectId?: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async archiveToggles(
        featureNames: string[],
        user: IUser,
        auditUser: IAuditUser,
        projectId: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validateArchiveToggles(featureNames: string[]): Promise<{
        hasDeletedDependencies: boolean;
        parentsWithChildFeatures: string[];
    }> {
        throw new Error("STUB");
    }

    async unprotectedArchiveToggles(
        featureNames: string[],
        projectId: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async setToggleStaleness(
        featureNames: string[],
        stale: boolean,
        projectId: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async bulkUpdateEnabled(
        project: string,
        featureNames: string[],
        environment: string,
        enabled: boolean,
        auditUser: IAuditUser,
        user?: IUser,
        shouldActivateDisabledStrategies = false,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateEnabled(
        project: string,
        featureName: string,
        environment: string,
        enabled: boolean,
        auditUser: IAuditUser,
        user?: IUser,
        shouldActivateDisabledStrategies = false,
    ): Promise<FeatureToggle> {
        await this.stopWhenChangeRequestsEnabled(project, environment, user);
        if (enabled) {
            await this.stopWhenCannotCreateStrategies(
                project,
                environment,
                featureName,
                user,
            );
        }

        return this.unprotectedUpdateEnabled(
            project,
            featureName,
            environment,
            enabled,
            auditUser,
            user,
            shouldActivateDisabledStrategies,
        );
    }

    async unprotectedUpdateEnabled(
        project: string,
        featureName: string,
        environment: string,
        enabled: boolean,
        auditUser: IAuditUser,
        user?: IUser,
        shouldActivateDisabledStrategies = false,
    ): Promise<FeatureToggle> {
        await this.validateFeatureBelongsToProject({
            featureName,
            projectId: project,
        });
        const hasEnvironment =
            await this.featureEnvironmentStore.featureHasEnvironment(
                environment,
                featureName,
            );

        if (!hasEnvironment) {
            throw new NotFoundError(
                `Could not find environment ${environment} for feature: ${featureName}`,
            );
        }

        await this.validateFeatureIsNotArchived(featureName, project);

        if (enabled) {
            const strategies = await this.getStrategiesForEnvironment(
                project,
                featureName,
                environment,
            );
            const hasDisabledStrategies = strategies.some(
                (strategy) => { throw new Error("STUB"); },
            );

            if (hasDisabledStrategies && shouldActivateDisabledStrategies) {
                await Promise.all(
                    strategies.map((strategy) =>
                        { throw new Error("STUB"); },
                    ),
                );
            }

            const hasOnlyDisabledStrategies = strategies.every(
                (strategy) => { throw new Error("STUB"); },
            );

            const shouldCreate =
                hasOnlyDisabledStrategies && !shouldActivateDisabledStrategies;

            if (strategies.length === 0 || shouldCreate) {
                const projectEnvironmentDefaultStrategy =
                    await this.projectStore.getDefaultStrategy(
                        project,
                        environment,
                    );
                const strategy =
                    projectEnvironmentDefaultStrategy != null
                        ? getProjectDefaultStrategy(
                              projectEnvironmentDefaultStrategy,
                              featureName,
                          )
                        : getDefaultStrategy(featureName);

                await this.unprotectedCreateStrategy(
                    strategy,
                    {
                        environment,
                        projectId: project,
                        featureName,
                    },
                    auditUser,
                );
            }
        }
        const updatedEnvironmentStatus =
            await this.featureEnvironmentStore.setEnvironmentEnabledStatus(
                environment,
                featureName,
                enabled,
            );
        const feature = await this.featureToggleStore.get(featureName);

        if (updatedEnvironmentStatus > 0) {
            await this.eventService.storeEvent(
                new FeatureEnvironmentEvent({
                    enabled,
                    project,
                    featureName,
                    environment,
                    auditUser,
                }),
            );
        }
        return feature!; // If we get here we know the toggle exists
    }

    async changeProject(
        featureName: string,
        newProject: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    // TODO: add project id.
    async deleteFeature(
        featureName: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteFeatures(
        featureNames: string[],
        projectId: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async reviveFeatures(
        featureNames: string[],
        projectId: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    // TODO: add project id.
    async reviveFeature(
        featureName: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getProjectId(name: string): Promise<string | undefined> {
        return this.featureToggleStore.getProjectId(name);
    }

    async updateFeatureStrategyProject(
        featureName: string,
        newProjectId: string,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateVariants(
        featureName: string,
        project: string,
        newVariants: Operation[],
        user: IUser,
        auditUser: IAuditUser,
    ): Promise<FeatureToggle> {
        throw new Error("STUB");
    }

    async updateVariantsOnEnv(
        featureName: string,
        project: string,
        environment: string,
        newVariants: Operation[],
        user: IUser,
        auditUser: IAuditUser,
    ): Promise<IVariant[]> {
        throw new Error("STUB");
    }

    async saveVariants(
        featureName: string,
        project: string,
        newVariants: IVariant[],
        auditUser: IAuditUser,
    ): Promise<FeatureToggle> {
        throw new Error("STUB");
    }

    private async verifyLegacyVariants(featureName: string) {
        throw new Error("STUB");
    }

    async saveVariantsOnEnv(
        projectId: string,
        featureName: string,
        environment: string,
        newVariants: IVariant[],
        auditUser: IAuditUser,
        oldVariants?: IVariant[],
    ): Promise<IVariant[]> {
        throw new Error("STUB");
    }

    async legacySaveVariantsOnEnv(
        projectId: string,
        featureName: string,
        environment: string,
        newVariants: IVariant[],
        auditUser: IAuditUser,
        oldVariants?: IVariant[],
    ): Promise<IVariant[]> {
        await variantsArraySchema.validateAsync(newVariants);
        const fixedVariants = this.fixVariantWeights(newVariants);
        const theOldVariants: IVariant[] =
            oldVariants ||
            (
                await this.featureEnvironmentStore.get({
                    featureName,
                    environment,
                })
            )?.variants ||
            [];

        await this.eventService.storeEvent(
            new EnvironmentVariantEvent({
                featureName,
                environment,
                project: projectId,
                oldVariants: theOldVariants,
                newVariants: fixedVariants,
                auditUser,
            }),
        );
        await this.featureEnvironmentStore.setVariantsToFeatureEnvironments(
            featureName,
            [environment],
            fixedVariants,
        );
        return fixedVariants;
    }

    async crProtectedSaveVariantsOnEnv(
        projectId: string,
        featureName: string,
        environment: string,
        newVariants: IVariant[],
        user: IUser,
        auditUser: IAuditUser,
        oldVariants?: IVariant[],
    ): Promise<IVariant[]> {
        throw new Error("STUB");
    }

    async crProtectedSetVariantsOnEnvs(
        projectId: string,
        featureName: string,
        environments: string[],
        newVariants: IVariant[],
        _user: IUser,
        auditUser: IAuditUser,
    ): Promise<IVariant[]> {
        throw new Error("STUB");
    }

    async setVariantsOnEnvs(
        projectId: string,
        featureName: string,
        environments: string[],
        newVariants: IVariant[],
        auditUser: IAuditUser,
    ): Promise<IVariant[]> {
        throw new Error("STUB");
    }

    fixVariantWeights(variants: IVariant[]): IVariant[] {
        let variableVariants = variants.filter((x) => {
            throw new Error("STUB");
        });

        if (variants.length > 0 && variableVariants.length === 0) {
            throw new BadDataError(
                'There must be at least one "variable" variant',
            );
        }

        const fixedVariants = variants.filter((x) => {
            throw new Error("STUB");
        });

        const fixedWeights = fixedVariants.reduce((a, v) => { throw new Error("STUB"); }, 0);

        if (fixedWeights > 1000) {
            throw new BadDataError(
                'The traffic distribution total must equal 100%',
            );
        }

        const averageWeight = Math.floor(
            (1000 - fixedWeights) / variableVariants.length,
        );
        let remainder = (1000 - fixedWeights) % variableVariants.length;

        variableVariants = variableVariants.map((x) => {
            throw new Error("STUB");
        });
        return variableVariants
            .concat(fixedVariants)
            .sort((a, b) => { throw new Error("STUB"); });
    }

    private async stopWhenChangeRequestsEnabled(
        project: string,
        environment?: string,
        user?: IUser,
    ) {
        const canBypass = environment
            ? await this.changeRequestAccessReadModel.canBypassChangeRequest(
                  project,
                  environment,
                  user,
              )
            : await this.changeRequestAccessReadModel.canBypassChangeRequestForProject(
                  project,
                  user,
              );
        if (!canBypass) {
            throw new PermissionError(SKIP_CHANGE_REQUEST);
        }
    }

    private async stopWhenCannotCreateStrategies(
        project: string,
        environment: string,
        featureName: string,
        user?: IUser,
    ) {
        const hasEnvironment =
            await this.featureEnvironmentStore.featureHasEnvironment(
                environment,
                featureName,
            );

        if (hasEnvironment) {
            const strategies = await this.getStrategiesForEnvironment(
                project,
                featureName,
                environment,
            );
            if (strategies.length === 0) {
                const canAddStrategies =
                    user &&
                    (await this.accessService.hasPermission(
                        user,
                        CREATE_FEATURE_STRATEGY,
                        project,
                        environment,
                    ));
                if (!canAddStrategies) {
                    throw new PermissionError(
                        CREATE_FEATURE_STRATEGY,
                        environment,
                    );
                }
            }
        }
    }

    async updatePotentiallyStaleFeatures(): Promise<void> {
        throw new Error("STUB");
    }

    async setFeatureCreatedByUserIdFromEvents(): Promise<void> {
        throw new Error("STUB");
    }

    async addLinksFromTemplates(
        projectId: string,
        featureName: string,
        auditUser: IAuditUser,
    ) {
        const featureLinksFromTemplates = (
            await this.projectStore.getProjectLinkTemplates(projectId)
        ).map((template) => { throw new Error("STUB"); });

        return Promise.all(
            featureLinksFromTemplates.map((link) =>
                { throw new Error("STUB"); },
            ),
        );
    }
}
