import type { Logger } from '../../logger.js';
import type { IStrategy } from '../../types/stores/strategy-store.js';
import type { IFeatureToggleStore } from '../feature-toggle/types/feature-toggle-store-type.js';
import type { IFeatureStrategiesStore } from '../feature-toggle/types/feature-toggle-strategies-store-type.js';
import {
    FeaturesExportedEvent,
    FeaturesImportedEvent,
    SYSTEM_USER,
    SYSTEM_USER_AUDIT,
    type FeatureToggleDTO,
    type IAuditUser,
    type IContextFieldStore,
    type IFeatureEnvironmentStore,
    type IFeatureStrategy,
    type IFeatureStrategySegment,
    type IFeatureTagStore,
    type IFlagResolver,
    type ITagTypeStore,
    type IUnleashConfig,
    type IUnleashStores,
    type IVariant,
    type WithRequired,
    type IFeatureLinksReadModel,
} from '../../types/index.js';
import type {
    ExportQuerySchema,
    ExportResultSchema,
    FeatureStrategySchema,
    ImportTogglesSchema,
    ImportTogglesValidateSchema,
} from '../../openapi/index.js';
import type { IUser } from '../../types/user.js';
import { BadDataError } from '../../error/index.js';
import type {
    AccessService,
    ContextService,
    DependentFeaturesService,
    EventService,
    FeatureTagService,
    FeatureToggleService,
    IUnleashServices,
    StrategyService,
    TagTypeService,
} from '../../services/index.js';
import { isValidField } from './import-context-validation.js';
import type {
    IImportTogglesStore,
    ProjectFeaturesLimit,
} from './import-toggles-store-type.js';
import {
    ImportPermissionsService,
    type Mode,
} from './import-permissions-service.js';
import { ImportValidationMessages } from './import-validation-messages.js';
import { findDuplicates } from '../../util/findDuplicates.js';
import type { FeatureNameCheckResultWithFeaturePattern } from '../feature-toggle/feature-toggle-service.js';
import type { IDependentFeaturesReadModel } from '../dependent-features/dependent-features-read-model-type.js';
import groupBy from 'lodash.groupby';
import { allSettledWithRejection } from '../../util/allSettledWithRejection.js';
import type { ISegmentReadModel } from '../segment/segment-read-model-type.js';
import { readFile } from '../../util/read-file.js';
import type FeatureLinkService from '../feature-links/feature-link-service.js';

export type IImportService = {
    validate(
        dto: ImportTogglesSchema,
        user: IUser,
    ): Promise<ImportTogglesValidateSchema>;

    import(
        dto: ImportTogglesSchema,
        user: IUser,
        auditUser: IAuditUser,
    ): Promise<void>;

    importFromFile(
        file: string,
        project: string,
        environment: string,
    ): Promise<void>;
};

export type IExportService = {
    export(
        query: ExportQuerySchema,
        auditUser: IAuditUser,
    ): Promise<ExportResultSchema>;
};

export default class ExportImportService
    implements IExportService, IImportService
{
    private logger: Logger;

    private toggleStore: IFeatureToggleStore;

    private featureStrategiesStore: IFeatureStrategiesStore;

    private importTogglesStore: IImportTogglesStore;

    private tagTypeStore: ITagTypeStore;

    private featureEnvironmentStore: IFeatureEnvironmentStore;

    private featureTagStore: IFeatureTagStore;

    private flagResolver: IFlagResolver;

    private featureToggleService: FeatureToggleService;

    private contextFieldStore: IContextFieldStore;

    private strategyService: StrategyService;

    private contextService: ContextService;

    private accessService: AccessService;

    private eventService: EventService;

    private tagTypeService: TagTypeService;

    private segmentReadModel: ISegmentReadModel;

    private featureTagService: FeatureTagService;

    private importPermissionsService: ImportPermissionsService;

    private dependentFeaturesReadModel: IDependentFeaturesReadModel;

    private dependentFeaturesService: DependentFeaturesService;

    private featureLinksReadModel: IFeatureLinksReadModel;

    private featureLinkService: FeatureLinkService;

    constructor(
        stores: Pick<
            IUnleashStores,
            | 'importTogglesStore'
            | 'featureStrategiesStore'
            | 'featureToggleStore'
            | 'featureEnvironmentStore'
            | 'tagTypeStore'
            | 'featureTagStore'
            | 'contextFieldStore'
        >,
        {
            getLogger,
            flagResolver,
        }: Pick<IUnleashConfig, 'getLogger' | 'flagResolver'>,
        {
            featureToggleService,
            strategyService,
            contextService,
            accessService,
            eventService,
            tagTypeService,
            featureTagService,
            dependentFeaturesService,
            featureLinkService,
        }: Pick<
            IUnleashServices,
            | 'featureToggleService'
            | 'strategyService'
            | 'contextService'
            | 'accessService'
            | 'eventService'
            | 'tagTypeService'
            | 'featureTagService'
            | 'dependentFeaturesService'
            | 'featureLinkService'
        >,
        dependentFeaturesReadModel: IDependentFeaturesReadModel,
        segmentReadModel: ISegmentReadModel,
        featureLinksReadModel: IFeatureLinksReadModel,
    ) {
        this.toggleStore = stores.featureToggleStore;
        this.importTogglesStore = stores.importTogglesStore;
        this.featureStrategiesStore = stores.featureStrategiesStore;
        this.featureEnvironmentStore = stores.featureEnvironmentStore;
        this.tagTypeStore = stores.tagTypeStore;
        this.featureTagStore = stores.featureTagStore;
        this.flagResolver = flagResolver;
        this.featureToggleService = featureToggleService;
        this.contextFieldStore = stores.contextFieldStore;
        this.strategyService = strategyService;
        this.contextService = contextService;
        this.accessService = accessService;
        this.eventService = eventService;
        this.tagTypeService = tagTypeService;
        this.featureTagService = featureTagService;
        this.dependentFeaturesService = dependentFeaturesService;
        this.featureLinkService = featureLinkService;
        this.importPermissionsService = new ImportPermissionsService(
            this.importTogglesStore,
            this.accessService,
            this.tagTypeService,
            this.contextService,
        );
        this.dependentFeaturesReadModel = dependentFeaturesReadModel;
        this.segmentReadModel = segmentReadModel;
        this.featureLinksReadModel = featureLinksReadModel;
        this.logger = getLogger('services/state-service.js');
    }

    async validate(
        dto: ImportTogglesSchema,
        user: IUser,
        mode = 'regular' as Mode,
    ): Promise<ImportTogglesValidateSchema> {
        const [
            unsupportedStrategies,
            usedCustomStrategies,
            unsupportedContextFields,
            archivedFeatures,
            otherProjectFeatures,
            existingProjectFeatures,
            missingPermissions,
            duplicateFeatures,
            featureNameCheckResult,
            featureLimitResult,
            unsupportedSegments,
            unsupportedDependencies,
        ] = await Promise.all([
            this.getUnsupportedStrategies(dto),
            this.getUsedCustomStrategies(dto),
            this.getUnsupportedContextFields(dto),
            this.getArchivedFeatures(dto),
            this.getOtherProjectFeatures(dto),
            this.getExistingProjectFeatures(dto),
            this.importPermissionsService.getMissingPermissions(
                dto,
                user,
                mode,
            ),
            this.getDuplicateFeatures(dto),
            this.getInvalidFeatureNames(dto),
            this.getFeatureLimit(dto),
            this.getUnsupportedSegments(dto),
            this.getMissingDependencies(dto),
        ]);

        const errors = ImportValidationMessages.compileErrors({
            projectName: dto.project,
            strategies: unsupportedStrategies,
            contextFields: unsupportedContextFields || [],
            otherProjectFeatures,
            duplicateFeatures,
            featureNameCheckResult,
            featureLimitResult,
            segments: unsupportedSegments,
            dependencies: unsupportedDependencies,
        });
        const warnings = ImportValidationMessages.compileWarnings({
            archivedFeatures,
            existingFeatures: existingProjectFeatures,
            usedCustomStrategies,
        });
        const permissions =
            ImportValidationMessages.compilePermissionErrors(
                missingPermissions,
            );

        return {
            errors,
            warnings,
            permissions,
        };
    }

    async importVerify(
        dto: ImportTogglesSchema,
        user: IUser,
        mode = 'regular' as Mode,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async fileImportVerify(dto: ImportTogglesSchema): Promise<void> {
        await allSettledWithRejection([
            this.verifyStrategies(dto),
            this.verifyContextFields(dto),
            this.verifyFeatures(dto),
            this.verifySegments(dto),
            this.verifyDependencies(dto),
        ]);
    }

    async importFeatureData(
        dto: ImportTogglesSchema,
        auditUser: IAuditUser,
    ): Promise<void> {
        await this.createOrUpdateToggles(dto, auditUser);
        await this.importToggleVariants(dto, auditUser);
        await this.importTagTypes(dto, auditUser);
        await this.importTags(dto, auditUser);
        await this.importContextFields(dto, auditUser);
        await this.importLinks(dto, auditUser);
    }

    async import(
        dto: ImportTogglesSchema,
        user: IUser,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async importFromFile(
        file: string,
        project: string,
        environment: string,
    ): Promise<void> {
        const content = await readFile(file);
        const data = JSON.parse(content);
        const dto = {
            project,
            environment,
            data,
        };
        const cleanedDto = await this.cleanData(dto);

        await this.fileImportVerify(cleanedDto);
        await this.processImport(cleanedDto, SYSTEM_USER, SYSTEM_USER_AUDIT);
    }

    private async processImport(
        dto: ImportTogglesSchema,
        user: IUser,
        auditUser: IAuditUser,
    ) {
        await this.importFeatureData(dto, auditUser);

        await this.importEnvironmentData(dto, user, auditUser);
        await this.eventService.storeEvent(
            new FeaturesImportedEvent({
                project: dto.project,
                environment: dto.environment,
                auditUser,
            }),
        );
    }

    async importEnvironmentData(
        dto: ImportTogglesSchema,
        user: IUser,
        auditUser: IAuditUser,
    ): Promise<void> {
        await this.deleteStrategies(dto);
        await this.importStrategies(dto, auditUser);
        await this.importToggleStatuses(dto, user, auditUser);
        await this.importDependencies(dto, user, auditUser);
    }

    private async importLinks(dto: ImportTogglesSchema, auditUser: IAuditUser) {
        await this.importTogglesStore.deleteLinksForFeatures(
            (dto.data.links ?? []).map((featureLink) => { throw new Error("STUB"); }),
        );

        const links = dto.data.links || [];
        for (const featureLink of links) {
            for (const link of featureLink.links) {
                await this.featureLinkService.createLink(
                    dto.project,
                    {
                        featureName: featureLink.feature,
                        url: link.url,
                        title: link.title || undefined,
                    },
                    auditUser,
                );
            }
        }
    }

    private async importDependencies(
        dto: ImportTogglesSchema,
        user: IUser,
        auditUser: IAuditUser,
    ) {
        await Promise.all(
            (dto.data.dependencies || []).flatMap((dependency) => {
                throw new Error("STUB");
            }),
        );
    }

    private async importToggleStatuses(
        dto: ImportTogglesSchema,
        user: IUser,
        auditUser: IAuditUser,
    ) {
        await Promise.all(
            (dto.data.featureEnvironments || []).map((featureEnvironment) =>
                { throw new Error("STUB"); },
            ),
        );
    }

    private async importStrategies(
        dto: ImportTogglesSchema,
        auditUser: IAuditUser,
    ) {
        const hasFeatureName = (
            featureStrategy: FeatureStrategySchema,
        ): featureStrategy is WithRequired<
            FeatureStrategySchema,
            'featureName'
        > => { throw new Error("STUB"); };
        await Promise.all(
            dto.data.featureStrategies
                ?.filter(hasFeatureName)
                .map(({ featureName, ...restOfFeatureStrategy }) =>
                    { throw new Error("STUB"); },
                ),
        );
    }

    private async deleteStrategies(dto: ImportTogglesSchema) {
        return this.importTogglesStore.deleteStrategiesForFeatures(
            dto.data.features.map((feature) => { throw new Error("STUB"); }),
            dto.environment,
        );
    }

    private async importTags(dto: ImportTogglesSchema, auditUser: IAuditUser) {
        await this.importTogglesStore.deleteTagsForFeatures(
            dto.data.features.map((feature) => { throw new Error("STUB"); }),
        );

        const featureTags = dto.data.featureTags || [];
        for (const tag of featureTags) {
            if (tag.tagType) {
                await this.featureTagService.addTag(
                    tag.featureName,
                    {
                        type: tag.tagType,
                        value: tag.tagValue,
                    },
                    auditUser,
                );
            }
        }
    }

    private async importContextFields(
        dto: ImportTogglesSchema,
        auditUser: IAuditUser,
    ) {
        const newContextFields = (await this.getNewContextFields(dto)) || [];
        await Promise.all(
            newContextFields.map((contextField) =>
                { throw new Error("STUB"); },
            ),
        );
    }

    private async importTagTypes(
        dto: ImportTogglesSchema,
        auditUser: IAuditUser,
    ) {
        const newTagTypes = await this.getNewTagTypes(dto);
        return Promise.all(
            newTagTypes.map((tagType) => {
                throw new Error("STUB");
            }),
        );
    }

    private async importToggleVariants(
        dto: ImportTogglesSchema,
        auditUser: IAuditUser,
    ) {
        const featureEnvsWithVariants =
            dto.data.featureEnvironments?.filter(
                (featureEnvironment) =>
                    { throw new Error("STUB"); },
            ) || [];
        await Promise.all(
            featureEnvsWithVariants.map((featureEnvironment) => {
                throw new Error("STUB");
            }),
        );
    }

    private async createOrUpdateToggles(
        dto: ImportTogglesSchema,
        auditUser: IAuditUser,
    ) {
        const existingFeatures = await this.getExistingProjectFeatures(dto);

        for (const feature of dto.data.features) {
            if (existingFeatures.includes(feature.name)) {
                const { archivedAt, createdAt, ...rest } = feature;
                await this.featureToggleService.updateFeatureToggle(
                    dto.project,
                    rest as FeatureToggleDTO,
                    feature.name,
                    auditUser,
                );
            } else {
                await this.featureToggleService.validateName(feature.name);
                const { archivedAt, createdAt, ...rest } = feature;
                await this.featureToggleService.createFeatureToggle(
                    dto.project,
                    rest as FeatureToggleDTO,
                    auditUser,
                );
            }
        }
    }

    private async getUnsupportedSegments(
        dto: ImportTogglesSchema,
    ): Promise<string[]> {
        const supportedSegments = await this.segmentReadModel.getAll();
        const targetProject = dto.project;
        return dto.data.segments
            ? dto.data.segments
                  .filter(
                      (importingSegment) =>
                          { throw new Error("STUB"); },
                  )

                  .map((it) => { throw new Error("STUB"); })
            : [];
    }

    private async getMissingDependencies(
        dto: ImportTogglesSchema,
    ): Promise<string[]> {
        const dependentFeatures =
            dto.data.dependencies?.flatMap((dependency) =>
                { throw new Error("STUB"); },
            ) || [];
        const importedFeatures = dto.data.features.map((f) => { throw new Error("STUB"); });

        const missingFromImported = dependentFeatures.filter(
            (feature) => { throw new Error("STUB"); },
        );

        let missingFeatures: string[] = [];

        if (missingFromImported.length) {
            const featuresFromStore = (
                await this.toggleStore.getAllByNames(missingFromImported)
            ).map((f) => { throw new Error("STUB"); });
            missingFeatures = missingFromImported.filter(
                (feature) => { throw new Error("STUB"); },
            );
        }
        return missingFeatures;
    }

    private async verifySegments(dto: ImportTogglesSchema) {
        const unsupportedSegments = await this.getUnsupportedSegments(dto);
        if (unsupportedSegments.length > 0) {
            throw new BadDataError(
                `Unsupported segments: ${unsupportedSegments.join(', ')}`,
            );
        }
    }

    private async verifyDependencies(dto: ImportTogglesSchema) {
        const unsupportedDependencies = await this.getMissingDependencies(dto);
        if (unsupportedDependencies.length > 0) {
            throw new BadDataError(
                `The following dependent features are missing: ${unsupportedDependencies.join(
                    ', ',
                )}`,
            );
        }
    }

    private async verifyContextFields(dto: ImportTogglesSchema) {
        const unsupportedContextFields =
            await this.getUnsupportedContextFields(dto);
        if (Array.isArray(unsupportedContextFields)) {
            const [firstError, ...remainingErrors] =
                unsupportedContextFields.map((field) => {
                    throw new Error("STUB");
                });
            if (firstError !== undefined) {
                throw new BadDataError(
                    'Some of the context fields you are trying to import are not supported.',
                    [firstError, ...remainingErrors],
                );
            }
        }
    }

    private async verifyFeatures(dto: ImportTogglesSchema) {
        const otherProjectFeatures = await this.getOtherProjectFeatures(dto);
        if (otherProjectFeatures.length > 0) {
            throw new BadDataError(
                `These features exist already in other projects: ${otherProjectFeatures.join(
                    ', ',
                )}`,
            );
        }
    }

    private async cleanData(dto: ImportTogglesSchema) {
        const removedFeaturesDto = await this.removeArchivedFeatures(dto);
        return this.remapSegments(removedFeaturesDto);
    }

    private async remapSegments(dto: ImportTogglesSchema) {
        const existingSegments = await this.segmentReadModel.getAll();

        const segmentMapping = new Map(
            dto.data.segments?.map((segment) => { throw new Error("STUB"); }),
        );

        return {
            ...dto,
            data: {
                ...dto.data,
                featureStrategies: dto.data.featureStrategies.map(
                    (strategy) => { throw new Error("STUB"); },
                ),
            },
        };
    }

    async removeArchivedFeatures(
        dto: ImportTogglesSchema,
    ): Promise<ImportTogglesSchema> {
        const archivedFeatures = await this.getArchivedFeatures(dto);
        const featureTags =
            dto.data.featureTags?.filter(
                (tag) => { throw new Error("STUB"); },
            ) || [];
        return {
            ...dto,
            data: {
                ...dto.data,
                features: dto.data.features.filter(
                    (feature) => { throw new Error("STUB"); },
                ),
                featureEnvironments: dto.data.featureEnvironments?.filter(
                    (environment) =>
                        { throw new Error("STUB"); },
                ),
                featureStrategies: dto.data.featureStrategies.filter(
                    (strategy) =>
                        { throw new Error("STUB"); },
                ),
                featureTags,
                tagTypes: dto.data.tagTypes?.filter((tagType) =>
                    { throw new Error("STUB"); },
                ),
            },
        };
    }

    private async verifyStrategies(dto: ImportTogglesSchema) {
        const unsupportedStrategies = await this.getUnsupportedStrategies(dto);

        const [firstError, ...remainingErrors] = unsupportedStrategies.map(
            (strategy) => {
                throw new Error("STUB");
            },
        );
        if (firstError !== undefined) {
            throw new BadDataError(
                'Some of the strategies you are trying to import are not supported.',
                [firstError, ...remainingErrors],
            );
        }
    }

    private async getInvalidFeatureNames({
        project,
        data,
    }: ImportTogglesSchema): Promise<FeatureNameCheckResultWithFeaturePattern> {
        return this.featureToggleService.checkFeatureFlagNamesAgainstProjectPattern(
            project,
            data.features.map((f) => { throw new Error("STUB"); }),
        );
    }

    private async getFeatureLimit({
        project,
        data,
    }: ImportTogglesSchema): Promise<ProjectFeaturesLimit> {
        return this.importTogglesStore.getProjectFeaturesLimit(
            [...new Set(data.features.map((f) => { throw new Error("STUB"); }))],
            project,
        );
    }

    private async getUnsupportedStrategies(
        dto: ImportTogglesSchema,
    ): Promise<FeatureStrategySchema[]> {
        const supportedStrategies = await this.strategyService.getStrategies();
        return dto.data.featureStrategies.filter(
            (featureStrategy) =>
                { throw new Error("STUB"); },
        );
    }

    private async getUsedCustomStrategies(dto: ImportTogglesSchema) {
        const supportedStrategies = await this.strategyService.getStrategies();
        const uniqueFeatureStrategies = [
            ...new Set(
                dto.data.featureStrategies.map((strategy) => { throw new Error("STUB"); }),
            ),
        ];
        return uniqueFeatureStrategies.filter(
            this.isCustomStrategy(supportedStrategies),
        );
    }

    isCustomStrategy = (
        supportedStrategies: IStrategy[],
    ): ((x: string) => boolean) => {
        throw new Error("STUB");
    };

    private async getUnsupportedContextFields(dto: ImportTogglesSchema) {
        const availableContextFields = await this.contextService.getAll();
        const targetProject = dto.project;

        return dto.data.contextFields?.filter((importingField) => {
            throw new Error("STUB");
        });
    }

    private async getArchivedFeatures(dto: ImportTogglesSchema) {
        return this.importTogglesStore.getArchivedFeatures(
            dto.data.features.map((feature) => { throw new Error("STUB"); }),
        );
    }

    private async getOtherProjectFeatures(dto: ImportTogglesSchema) {
        const otherProjectsFeatures =
            await this.importTogglesStore.getFeaturesInOtherProjects(
                dto.data.features.map((feature) => { throw new Error("STUB"); }),
                dto.project,
            );
        return otherProjectsFeatures.map(
            (it) => { throw new Error("STUB"); },
        );
    }

    private async getExistingProjectFeatures(dto: ImportTogglesSchema) {
        return this.importTogglesStore.getFeaturesInProject(
            dto.data.features.map((feature) => { throw new Error("STUB"); }),
            dto.project,
        );
    }

    private getDuplicateFeatures(dto: ImportTogglesSchema) {
        return findDuplicates(dto.data.features.map((feature) => { throw new Error("STUB"); }));
    }

    private async getNewTagTypes(dto: ImportTogglesSchema) {
        const existingTagTypes = (await this.tagTypeService.getAll()).map(
            (tagType) => { throw new Error("STUB"); },
        );
        const newTagTypes = (dto.data.tagTypes || []).filter(
            (tagType) => { throw new Error("STUB"); },
        );
        return [
            ...new Map(newTagTypes.map((item) => { throw new Error("STUB"); })).values(),
        ];
    }

    private async getNewContextFields(dto: ImportTogglesSchema) {
        const availableContextFields = await this.contextService.getAll();

        return dto.data.contextFields?.filter(
            (contextField) =>
                { throw new Error("STUB"); },
        );
    }

    async export(
        query: ExportQuerySchema,
        auditUser: IAuditUser,
    ): Promise<ExportResultSchema> {
        throw new Error("STUB");
    }

    addSegmentsToStrategies(
        featureStrategies: IFeatureStrategy[],
        strategySegments: IFeatureStrategySegment[],
    ): void {
        throw new Error("STUB");
    }
}
