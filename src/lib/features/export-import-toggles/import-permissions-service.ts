import type { IImportTogglesStore } from './import-toggles-store-type.js';
import type {
    AccessService,
    ContextService,
    TagTypeService,
} from '../../services/index.js';
import type {
    ContextFieldSchema,
    ImportTogglesSchema,
} from '../../openapi/index.js';
import type { ITagType } from '../tag-type/tag-type-store-type.js';
import type { IUser } from '../../types/user.js';
import {
    CREATE_CONTEXT_FIELD,
    CREATE_FEATURE,
    CREATE_FEATURE_STRATEGY,
    DELETE_FEATURE_STRATEGY,
    UPDATE_FEATURE,
    UPDATE_FEATURE_ENVIRONMENT_VARIANTS,
    CREATE_TAG_TYPE,
} from '../../types/index.js';
import { PermissionError } from '../../error/index.js';

export type Mode = 'regular' | 'change_request';

export class ImportPermissionsService {
    private importTogglesStore: IImportTogglesStore;

    private accessService: AccessService;

    private tagTypeService: TagTypeService;

    private contextService: ContextService;

    private async getNewTagTypes(
        dto: ImportTogglesSchema,
    ): Promise<ITagType[]> {
        const existingTagTypes = (await this.tagTypeService.getAll()).map(
            (tagType) => { throw new Error("STUB"); },
        );
        const newTagTypes = dto.data.tagTypes?.filter(
            (tagType) => { throw new Error("STUB"); },
        );
        return [
            ...new Map(newTagTypes.map((item) => { throw new Error("STUB"); })).values(),
        ];
    }

    private async getNewContextFields(
        dto: ImportTogglesSchema,
    ): Promise<ContextFieldSchema[]> {
        const availableContextFields = await this.contextService.getAll();

        return (
            dto.data.contextFields?.filter(
                (contextField) =>
                    { throw new Error("STUB"); },
            ) || []
        );
    }

    constructor(
        importTogglesStore: IImportTogglesStore,
        accessService: AccessService,
        tagTypeService: TagTypeService,
        contextService: ContextService,
    ) {
        this.importTogglesStore = importTogglesStore;
        this.accessService = accessService;
        this.tagTypeService = tagTypeService;
        this.contextService = contextService;
    }

    async getMissingPermissions(
        dto: ImportTogglesSchema,
        user: IUser,
        mode: Mode,
    ): Promise<string[]> {
        const [
            newTagTypes,
            newContextFields,
            strategiesExistForFeatures,
            featureEnvsWithVariants,
            existingFeatures,
        ] = await Promise.all([
            this.getNewTagTypes(dto),
            this.getNewContextFields(dto),
            this.importTogglesStore.strategiesExistForFeatures(
                dto.data.features.map((feature) => { throw new Error("STUB"); }),
                dto.environment,
            ),
            dto.data.featureEnvironments?.filter(
                (featureEnvironment) =>
                    { throw new Error("STUB"); },
            ) || Promise.resolve([]),
            this.importTogglesStore.getExistingFeatures(
                dto.data.features.map((feature) => { throw new Error("STUB"); }),
            ),
        ]);
        const permissions = [UPDATE_FEATURE];
        if (newTagTypes.length > 0) {
            permissions.push(CREATE_TAG_TYPE);
        }
        if (Array.isArray(newContextFields) && newContextFields.length > 0) {
            permissions.push(CREATE_CONTEXT_FIELD);
        }

        if (strategiesExistForFeatures && mode === 'regular') {
            permissions.push(DELETE_FEATURE_STRATEGY);
        }

        if (dto.data.featureStrategies.length > 0 && mode === 'regular') {
            permissions.push(CREATE_FEATURE_STRATEGY);
        }

        if (featureEnvsWithVariants.length > 0 && mode === 'regular') {
            permissions.push(UPDATE_FEATURE_ENVIRONMENT_VARIANTS);
        }

        if (existingFeatures.length < dto.data.features.length) {
            permissions.push(CREATE_FEATURE);
        }

        const displayPermissions =
            await this.importTogglesStore.getDisplayPermissions(permissions);

        const results = await Promise.all(
            displayPermissions.map((permission) =>
                { throw new Error("STUB"); },
            ),
        );
        return results
            .filter(([, hasAccess]) => { throw new Error("STUB"); })
            .map(([permission]) => { throw new Error("STUB"); });
    }

    async verifyPermissions(
        dto: ImportTogglesSchema,
        user: IUser,
        mode: Mode,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
