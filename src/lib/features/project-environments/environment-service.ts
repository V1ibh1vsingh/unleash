import {
    DefaultStrategyUpdatedEvent,
    type IAuditUser,
    type IEnvironment,
    type IEnvironmentStore,
    type IFeatureEnvironmentStore,
    type IFeatureStrategiesStore,
    type IProjectsAvailableOnEnvironment,
    type ISortOrder,
    type IUnleashConfig,
    type IUnleashStores,
    ProjectEnvironmentAdded,
    ProjectEnvironmentRemoved,
    SYSTEM_USER_AUDIT,
} from '../../types/index.js';
import type { Logger } from '../../logger.js';
import {
    BadDataError,
    UNIQUE_CONSTRAINT_VIOLATION,
} from '../../error/index.js';
import NameExistsError from '../../error/name-exists-error.js';
import { sortOrderSchema } from '../../services/sort-order-schema.js';
import NotFoundError from '../../error/notfound-error.js';
import type { IProjectStore } from '../../features/project/project-store-type.js';
import type { IFlagResolver } from '../../types/experimental.js';
import type { CreateFeatureStrategySchema } from '../../openapi/index.js';
import type EventService from '../events/event-service.js';

export default class EnvironmentService {
    private logger: Logger;

    private environmentStore: IEnvironmentStore;

    private featureStrategiesStore: IFeatureStrategiesStore;

    private projectStore: IProjectStore;

    private featureEnvironmentStore: IFeatureEnvironmentStore;

    private eventService: EventService;

    private flagResolver: IFlagResolver;

    constructor(
        {
            environmentStore,
            featureStrategiesStore,
            featureEnvironmentStore,
            projectStore,
        }: Pick<
            IUnleashStores,
            | 'environmentStore'
            | 'featureStrategiesStore'
            | 'featureEnvironmentStore'
            | 'projectStore'
        >,
        {
            getLogger,
            flagResolver,
        }: Pick<IUnleashConfig, 'getLogger' | 'flagResolver'>,
        eventService: EventService,
    ) {
        this.logger = getLogger('services/environment-service.ts');
        this.environmentStore = environmentStore;
        this.featureStrategiesStore = featureStrategiesStore;
        this.featureEnvironmentStore = featureEnvironmentStore;
        this.projectStore = projectStore;
        this.eventService = eventService;
        this.flagResolver = flagResolver;
    }

    async getAll(): Promise<IEnvironment[]> {
        return this.environmentStore.getAllWithCounts();
    }

    async get(name: string): Promise<IEnvironment> {
        const env = await this.environmentStore.get(name);
        if (env === undefined) {
            throw new NotFoundError(
                `Could not find environment with name ${name}`,
            );
        }
        return env;
    }

    async exists(name: string): Promise<boolean> {
        return this.environmentStore.exists(name);
    }

    async getProjectEnvironments(
        projectId: string,
    ): Promise<IProjectsAvailableOnEnvironment[]> {
        throw new Error("STUB");
    }

    async updateSortOrder(sortOrder: ISortOrder): Promise<void> {
        throw new Error("STUB");
    }

    async toggleEnvironment(name: string, value: boolean): Promise<void> {
        throw new Error("STUB");
    }

    async addEnvironmentToProject(
        environment: string,
        projectId: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        const exists = await this.exists(environment);
        if (!exists) {
            throw new BadDataError(`Environment ${environment} does not exist`);
        }
        try {
            await this.featureEnvironmentStore.connectProject(
                environment,
                projectId,
            );
            await this.featureEnvironmentStore.connectFeatures(
                environment,
                projectId,
            );
            await this.eventService.storeEvent(
                new ProjectEnvironmentAdded({
                    project: projectId,
                    environment,
                    auditUser,
                }),
            );
        } catch (e) {
            if (e.code === UNIQUE_CONSTRAINT_VIOLATION) {
                throw new NameExistsError(
                    `${projectId} already has the environment ${environment} enabled`,
                );
            }
            throw e;
        }
    }

    async updateDefaultStrategy(
        environment: string,
        projectId: string,
        strategy: CreateFeatureStrategySchema,
        auditUser: IAuditUser,
    ): Promise<CreateFeatureStrategySchema> {
        throw new Error("STUB");
    }

    async overrideEnabledProjects(
        environmentNamesToEnable: string[],
    ): Promise<void> {
        if (environmentNamesToEnable.length === 0) {
            return Promise.resolve();
        }

        const allEnvironments = await this.environmentStore.getAll();
        const existingEnvironmentsToEnable = allEnvironments.filter((env) =>
            { throw new Error("STUB"); },
        );

        if (
            existingEnvironmentsToEnable.length !==
            environmentNamesToEnable.length
        ) {
            this.logger.warn(
                "Found environment enabled overrides but some of the specified environments don't exist, no overrides will be executed",
            );
            return Promise.resolve();
        }

        const environmentsNotAlreadyEnabled =
            existingEnvironmentsToEnable.filter((env) => { throw new Error("STUB"); });
        const environmentsToDisable = allEnvironments.filter((env) => {
            throw new Error("STUB");
        });

        await this.environmentStore.disable(environmentsToDisable);
        await this.environmentStore.enable(environmentsNotAlreadyEnabled);

        await this.remapProjectsLinks(
            environmentsToDisable,
            environmentsNotAlreadyEnabled,
        );
    }

    private async remapProjectsLinks(
        toDisable: IEnvironment[],
        toEnable: IEnvironment[],
    ) {
        const projectLinks =
            await this.projectStore.getProjectLinksForEnvironments(
                toDisable.map((env) => { throw new Error("STUB"); }),
            );

        const unlinkTasks = projectLinks.map((link) => {
            throw new Error("STUB");
        });
        await Promise.all(unlinkTasks.flat());

        const uniqueProjects = [
            ...new Set(projectLinks.map((link) => { throw new Error("STUB"); })),
        ];

        const linkTasks = uniqueProjects.flatMap((project) => {
            throw new Error("STUB");
        });

        await Promise.all(linkTasks);
    }

    async forceRemoveEnvironmentFromProject(
        environment: string,
        projectId: string,
    ): Promise<void> {
        await this.featureEnvironmentStore.disconnectFeatures(
            environment,
            projectId,
        );
        await this.featureEnvironmentStore.disconnectProject(
            environment,
            projectId,
        );
    }

    async removeEnvironmentFromProject(
        environment: string,
        projectId: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
