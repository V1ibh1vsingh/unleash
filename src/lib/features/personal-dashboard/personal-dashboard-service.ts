import type {
    IProjectOwnersReadModel,
    UserProjectOwner,
} from '../project/project-owners-read-model.type.js';
import type {
    IPersonalDashboardReadModel,
    PersonalFeature,
    PersonalProject,
} from './personal-dashboard-read-model-type.js';
import type { IProjectReadModel } from '../project/project-read-model-type.js';
import type { IPrivateProjectChecker } from '../private-project/privateProjectCheckerType.js';
import type {
    IAccessStore,
    IAccountStore,
    IEventStore,
    IOnboardingReadModel,
    MinimalUser,
} from '../../types/index.js';
import type { FeatureEventFormatter } from '../../addons/feature-event-formatter-md.js';
import { generateImageUrl } from '../../util/index.js';
import type { PersonalDashboardProjectDetailsSchema } from '../../openapi/index.js';
import type { IRoleWithProject } from '../../types/stores/access-store.js';
import { NotFoundError } from '../../error/index.js';
import type { IEvent } from '../../events/index.js';

type PersonalDashboardProjectDetailsUnserialized = Omit<
    PersonalDashboardProjectDetailsSchema,
    'latestEvents'
> & {
    latestEvents: {
        createdBy: string;
        summary: string;
        createdByImageUrl: string;
        id: number;
        createdAt: Date;
    }[];
};

export class PersonalDashboardService {
    private personalDashboardReadModel: IPersonalDashboardReadModel;

    private projectOwnersReadModel: IProjectOwnersReadModel;

    private projectReadModel: IProjectReadModel;

    private privateProjectChecker: IPrivateProjectChecker;

    private eventStore: IEventStore;

    private featureEventFormatter: FeatureEventFormatter;

    private accountStore: IAccountStore;

    private onboardingReadModel: IOnboardingReadModel;

    private accessStore: IAccessStore;

    constructor(
        personalDashboardReadModel: IPersonalDashboardReadModel,
        projectOwnersReadModel: IProjectOwnersReadModel,
        projectReadModel: IProjectReadModel,
        onboardingReadModel: IOnboardingReadModel,
        eventStore: IEventStore,
        featureEventFormatter: FeatureEventFormatter,
        privateProjectChecker: IPrivateProjectChecker,
        accountStore: IAccountStore,
        accessStore: IAccessStore,
    ) {
        this.personalDashboardReadModel = personalDashboardReadModel;
        this.projectOwnersReadModel = projectOwnersReadModel;
        this.projectReadModel = projectReadModel;
        this.onboardingReadModel = onboardingReadModel;
        this.eventStore = eventStore;
        this.featureEventFormatter = featureEventFormatter;
        this.privateProjectChecker = privateProjectChecker;
        this.accountStore = accountStore;
        this.accessStore = accessStore;
    }

    getPersonalFeatures(userId: number): Promise<PersonalFeature[]> {
        throw new Error("STUB");
    }

    async getPersonalProjects(userId: number): Promise<PersonalProject[]> {
        throw new Error("STUB");
    }

    async getProjectOwners(userId: number): Promise<UserProjectOwner[]> {
        throw new Error("STUB");
    }

    async getPersonalProjectDetails(
        userId: number,
        projectId: string,
    ): Promise<PersonalDashboardProjectDetailsUnserialized> {
        throw new Error("STUB");
    }

    async getAdmins(): Promise<MinimalUser[]> {
        throw new Error("STUB");
    }
}
