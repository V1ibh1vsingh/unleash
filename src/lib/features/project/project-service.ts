import { subDays } from 'date-fns';
import joi from 'joi';
const { ValidationError } = joi;
import createSlug from 'slug';
import type { IAuditUser, IUser } from '../../types/user.js';
import type {
    AccessService,
    AccessWithRoles,
} from '../../services/access-service.js';
import NameExistsError from '../../error/name-exists-error.js';
import InvalidOperationError from '../../error/invalid-operation-error.js';
import { nameType } from '../../routes/util.js';
import { projectSchema } from '../../services/project-schema.js';
import NotFoundError from '../../error/notfound-error.js';
import {
    ADMIN,
    ADMIN_TOKEN_USER,
    type CreateProject,
    DEFAULT_PROJECT,
    type FeatureToggle,
    type IAccountStore,
    type IEnvironmentStore,
    type IEventStore,
    type IFeatureEnvironmentStore,
    type IFeatureNaming,
    type IFeatureToggleStore,
    type IFlagResolver,
    type IProject,
    type IProjectApplications,
    type IProjectHealth,
    type IProjectOverview,
    type IProjectOwnersReadModel,
    type IProjectRoleUsage,
    type IProjectStore,
    type IProjectUpdate,
    type IUnleashConfig,
    type IUnleashStores,
    MOVE_FEATURE_TOGGLE,
    ProjectAccessAddedEvent,
    ProjectAccessGroupRolesUpdated,
    ProjectAccessUserRolesDeleted,
    ProjectAccessUserRolesUpdated,
    ProjectArchivedEvent,
    type ProjectCreated,
    ProjectCreatedEvent,
    ProjectDeletedEvent,
    ProjectGroupAddedEvent,
    ProjectRevivedEvent,
    ProjectUpdatedEvent,
    ProjectUserRemovedEvent,
    ProjectUserUpdateRoleEvent,
    RoleName,
    SYSTEM_USER_ID,
    type IProjectReadModel,
    type IOnboardingReadModel,
    type IFeatureLifecycleReadModel,
    type IEdgeTokenStore,
} from '../../types/index.js';
import type {
    IRoleDescriptor,
    IRoleWithProject,
} from '../../types/stores/access-store.js';
import type { FeatureToggleService } from '../feature-toggle/feature-toggle-service.js';
import IncompatibleProjectError from '../../error/incompatible-project-error.js';
import { arraysHaveSameItems } from '../../util/index.js';
import type { GroupService } from '../../services/group-service.js';
import type { FavoritesService } from '../../services/favorites-service.js';
import { calculateAverageTimeToProd } from '../feature-toggle/time-to-production/time-to-production.js';
import type { IProjectStatsStore } from '../../types/stores/project-stats-store-type.js';
import { uniqueByKey } from '../../util/unique.js';
import { BadDataError, PermissionError } from '../../error/index.js';
import type { ProjectDoraMetricsSchema } from '../../openapi/index.js';
import { checkFeatureNamingData } from '../feature-naming-pattern/feature-naming-validation.js';
import type { IPrivateProjectChecker } from '../private-project/privateProjectCheckerType.js';
import type EventService from '../events/event-service.js';
import type {
    IProjectApplicationsSearchParams,
    IProjectEnterpriseSettingsUpdate,
    IProjectQuery,
    IProjectsQuery,
} from './project-store-type.js';
import type { IProjectFlagCreatorsReadModel } from './project-flag-creators-read-model.type.js';
import { throwExceedsLimitError } from '../../error/exceeds-limit-error.js';
import type EventEmitter from 'events';
import type { ApiTokenService } from '../../services/index.js';
import type { ProjectForUi } from './project-read-model-type.js';
import { canGrantProjectRole } from './can-grant-project-role.js';
import { batchExecute } from '../../util/index.js';
import metricsHelper from '../../util/metrics-helper.js';
import { FUNCTION_TIME } from '../../metric-events.js';
import type { ResourceLimitsService } from '../resource-limits/resource-limits-service.js';
import type { OnboardingStatus } from '../onboarding/onboarding-read-model-type.js';

type Days = number;
type Count = number;

export interface IProjectStats {
    avgTimeToProdCurrentWindow: Days;
    createdCurrentWindow: Count;
    createdPastWindow: Count;
    archivedCurrentWindow: Count;
    archivedPastWindow: Count;
    projectActivityCurrentWindow: Count;
    projectActivityPastWindow: Count;
    projectMembersAddedCurrentWindow: Count;
}

interface ICalculateStatus {
    projectId: string;
    updates: IProjectStats;
}

export default class ProjectService {
    private projectStore: IProjectStore;

    private projectOwnersReadModel: IProjectOwnersReadModel;

    private projectFlagCreatorsReadModel: IProjectFlagCreatorsReadModel;

    private accessService: AccessService;

    private eventStore: IEventStore;

    private featureToggleStore: IFeatureToggleStore;

    private featureEnvironmentStore: IFeatureEnvironmentStore;

    private environmentStore: IEnvironmentStore;

    private groupService: GroupService;

    private logger: any;

    private featureToggleService: FeatureToggleService;

    private privateProjectChecker: IPrivateProjectChecker;

    private accountStore: IAccountStore;

    private apiTokenService: ApiTokenService;

    private favoritesService: FavoritesService;

    private eventService: EventService;

    private projectStatsStore: IProjectStatsStore;

    private flagResolver: IFlagResolver;

    private isEnterprise: boolean;

    private resourceLimitsService: ResourceLimitsService;

    private eventBus: EventEmitter;

    private projectReadModel: IProjectReadModel;

    private onboardingReadModel: IOnboardingReadModel;

    private featureLifecycleReadModel: IFeatureLifecycleReadModel;

    private edgeTokenStore: IEdgeTokenStore;

    private timer: Function;

    constructor(
        {
            projectStore,
            projectOwnersReadModel,
            projectFlagCreatorsReadModel,
            eventStore,
            featureToggleStore,
            environmentStore,
            featureEnvironmentStore,
            accountStore,
            projectStatsStore,
            projectReadModel,
            onboardingReadModel,
            featureLifecycleReadModel,
            edgeTokenStore,
        }: Pick<
            IUnleashStores,
            | 'projectStore'
            | 'projectOwnersReadModel'
            | 'projectFlagCreatorsReadModel'
            | 'eventStore'
            | 'featureToggleStore'
            | 'environmentStore'
            | 'featureEnvironmentStore'
            | 'accountStore'
            | 'projectStatsStore'
            | 'projectReadModel'
            | 'onboardingReadModel'
            | 'featureLifecycleReadModel'
            | 'edgeTokenStore'
        >,
        config: IUnleashConfig,
        accessService: AccessService,
        featureToggleService: FeatureToggleService,
        groupService: GroupService,
        favoriteService: FavoritesService,
        eventService: EventService,
        privateProjectChecker: IPrivateProjectChecker,
        apiTokenService: ApiTokenService,
        resourceLimitsService: ResourceLimitsService,
    ) {
        this.projectStore = projectStore;
        this.projectOwnersReadModel = projectOwnersReadModel;
        this.projectFlagCreatorsReadModel = projectFlagCreatorsReadModel;
        this.environmentStore = environmentStore;
        this.featureEnvironmentStore = featureEnvironmentStore;
        this.accessService = accessService;
        this.eventStore = eventStore;
        this.featureToggleStore = featureToggleStore;
        this.apiTokenService = apiTokenService;
        this.featureToggleService = featureToggleService;
        this.favoritesService = favoriteService;
        this.privateProjectChecker = privateProjectChecker;
        this.accountStore = accountStore;
        this.groupService = groupService;
        this.eventService = eventService;
        this.projectStatsStore = projectStatsStore;
        this.logger = config.getLogger('services/project-service.js');
        this.flagResolver = config.flagResolver;
        this.isEnterprise = config.isEnterprise;
        this.resourceLimitsService = resourceLimitsService;
        this.eventBus = config.eventBus;
        this.projectReadModel = projectReadModel;
        this.onboardingReadModel = onboardingReadModel;
        this.featureLifecycleReadModel = featureLifecycleReadModel;
        this.edgeTokenStore = edgeTokenStore;
        this.timer = (functionName: string) =>
            { throw new Error("STUB"); };
    }

    async getProjects(
        query?: IProjectQuery & IProjectsQuery,
        userId?: number,
    ): Promise<ProjectForUi[]> {
        throw new Error("STUB");
    }

    async addOwnersToProjects(
        projects: ProjectForUi[],
    ): Promise<ProjectForUi[]> {
        throw new Error("STUB");
    }

    async getProject(id: string): Promise<IProject> {
        const project = await this.projectStore.get(id);
        if (project === undefined) {
            throw new NotFoundError(`Could not find project with id ${id}`);
        }
        return Promise.resolve(project);
    }

    private validateAndProcessFeatureNamingPattern = (
        featureNaming: IFeatureNaming,
    ): IFeatureNaming => {
        throw new Error("STUB");
    };

    private async validateEnvironmentsExist(environments: string[]) {
        throw new Error("STUB");
    }

    async validateProjectEnvironments(environments: string[] | undefined) {
        throw new Error("STUB");
    }

    async validateProjectLimit() {
        const { projects } =
            await this.resourceLimitsService.getResourceLimits();
        const limit = Math.max(projects, 1);
        const projectCount = await this.projectStore.count();

        if (projectCount >= limit) {
            throwExceedsLimitError(this.eventBus, {
                resource: 'project',
                limit,
            });
        }
    }

    async generateProjectId(name: string): Promise<string> {
        throw new Error("STUB");
    }

    async getAllChangeRequestEnvironments(
        newProject: CreateProject,
    ): Promise<CreateProject['changeRequestEnvironments']> {
        throw new Error("STUB");
    }

    async createProject(
        newProject: CreateProject,
        user: IUser,
        auditUser: IAuditUser,
        enableChangeRequestsForSpecifiedEnvironments: (
            environments: CreateProject['changeRequestEnvironments'],
        ) => Promise<
            ProjectCreated['changeRequestEnvironments']
        > = async () => {
            throw new Error("STUB");
        },
    ): Promise<ProjectCreated> {
        throw new Error("STUB");
    }

    async updateProject(
        updatedProject: IProjectUpdate,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateProjectEnterpriseSettings(
        updatedProject: IProjectEnterpriseSettingsUpdate,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async checkProjectsCompatibility(
        feature: FeatureToggle,
        newProjectId: string,
    ): Promise<boolean> {
        throw new Error("STUB");
    }

    async addEnvironmentToProject(
        project: string,
        environment: string,
    ): Promise<void> {
        await this.projectStore.addEnvironmentToProject(project, environment);
    }

    private async validateActiveProject(projectId: string) {
        throw new Error("STUB");
    }

    async changeProject(
        newProjectId: string,
        featureName: string,
        user: IUser,
        currentProjectId: string,
        auditUser: IAuditUser,
    ): Promise<any> {
        throw new Error("STUB");
    }

    async deleteProject(
        id: string,
        user: IUser,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async archiveProject(id: string, auditUser: IAuditUser): Promise<void> {
        throw new Error("STUB");
    }

    async reviveProject(id: string, auditUser: IAuditUser): Promise<void> {
        await this.validateProjectLimit();

        await this.projectStore.revive(id);

        await this.eventService.storeEvent(
            new ProjectRevivedEvent({
                project: id,
                auditUser,
            }),
        );
    }

    async validateId(id: string): Promise<boolean> {
        throw new Error("STUB");
    }

    async validateUniqueId(id: string): Promise<void> {
        throw new Error("STUB");
    }

    // RBAC methods
    async getAccessToProject(projectId: string): Promise<AccessWithRoles> {
        throw new Error("STUB");
    }

    /**
     * @deprecated use removeUserAccess
     */
    async removeUser(
        projectId: string,
        roleId: number,
        userId: number,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async removeUserAccess(
        projectId: string,
        userId: number,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async removeGroupAccess(
        projectId: string,
        groupId: number,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async addGroup(
        projectId: string,
        roleId: number,
        groupId: number,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    private isAdmin(userId: number, roles: IRoleWithProject[]): boolean {
        throw new Error("STUB");
    }

    private isProjectOwner(
        roles: IRoleWithProject[],
        project: string,
    ): boolean {
        throw new Error("STUB");
    }

    private async isAllowedToAddAccess(
        userAddingAccess: IAuditUser,
        projectId: string,
        rolesBeingAdded: number[],
    ): Promise<boolean> {
        throw new Error("STUB");
    }

    async addAccess(
        projectId: string,
        roles: number[],
        groups: number[],
        users: number[],
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async setRolesForUser(
        projectId: string,
        userId: number,
        newRoles: number[],
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async setRolesForGroup(
        projectId: string,
        groupId: number,
        newRoles: number[],
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async findProjectRole(
        projectId: string,
        roleId: number,
    ): Promise<IRoleDescriptor> {
        throw new Error("STUB");
    }

    /** @deprecated use projectInsightsService instead */
    async getDoraMetrics(projectId: string): Promise<ProjectDoraMetricsSchema> {
        throw new Error("STUB");
    }

    async getApplications(
        searchParams: IProjectApplicationsSearchParams,
    ): Promise<IProjectApplications> {
        throw new Error("STUB");
    }

    async getProjectFlagCreators(projectId: string) {
        throw new Error("STUB");
    }

    async changeRole(
        projectId: string,
        roleId: number,
        userId: number,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getMembers(projectId: string): Promise<number> {
        throw new Error("STUB");
    }

    async getProjectUsers(
        projectId: string,
    ): Promise<Array<Pick<IUser, 'id' | 'email' | 'username'>>> {
        throw new Error("STUB");
    }

    async isProjectUser(userId: number, projectId: string): Promise<boolean> {
        throw new Error("STUB");
    }

    async getProjectsByUser(userId: number): Promise<string[]> {
        throw new Error("STUB");
    }

    async getProjectRoleUsage(roleId: number): Promise<IProjectRoleUsage[]> {
        throw new Error("STUB");
    }

    async statusJob(): Promise<void> {
        throw new Error("STUB");
    }

    async getStatusUpdates(projectId: string): Promise<ICalculateStatus> {
        throw new Error("STUB");
    }

    async getProjectHealth(
        projectId: string,
        archived: boolean = false,
        userId?: number,
    ): Promise<IProjectHealth> {
        throw new Error("STUB");
    }

    async getProjectOverview(
        projectId: string,
        archived: boolean = false,
        userId?: number,
    ): Promise<IProjectOverview> {
        throw new Error("STUB");
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    removePropertiesForNonEnterprise(data): any {
        throw new Error("STUB");
    }
}
