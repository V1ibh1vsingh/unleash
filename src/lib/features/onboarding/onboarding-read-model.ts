import type { Db } from '../../db/db.js';
import type {
    IOnboardingReadModel,
    InstanceOnboarding,
    ProjectOnboarding,
    OnboardingStatus,
} from './onboarding-read-model-type.js';
import { FEATURE_ENVIRONMENT_ENABLED } from '../../events/index.js';

const instanceEventLookup = {
    'first-user-login': 'firstLogin',
    'second-user-login': 'secondLogin',
    'first-flag': 'firstFeatureFlag',
    'first-pre-live': 'firstPreLive',
    'first-live': 'firstLive',
};

const projectEventLookup = {
    'first-flag': 'firstFeatureFlag',
    'first-pre-live': 'firstPreLive',
    'first-live': 'firstLive',
};

export class OnboardingReadModel implements IOnboardingReadModel {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getInstanceOnboardingMetrics(): Promise<InstanceOnboarding> {
        const eventsResult = await this.db('onboarding_events_instance').select(
            'event',
            'time_to_event',
        );

        const events: InstanceOnboarding = {
            firstLogin: null,
            secondLogin: null,
            firstFeatureFlag: null,
            firstPreLive: null,
            firstLive: null,
        };

        for (const event of eventsResult) {
            const eventType = instanceEventLookup[event.event];
            if (eventType) {
                events[eventType] = event.time_to_event;
            }
        }

        return events as InstanceOnboarding;
    }

    async getProjectsOnboardingMetrics(): Promise<Array<ProjectOnboarding>> {
        const lifecycleResults = await this.db(
            'onboarding_events_project',
        ).select('project', 'event', 'time_to_event');

        const projects: Array<ProjectOnboarding> = [];

        lifecycleResults.forEach((result) => {
            throw new Error("STUB");
        });

        return projects;
    }

    async getOnboardingStatusForProject(
        projectId: string,
    ): Promise<OnboardingStatus | null> {
        throw new Error("STUB");
    }

    async getOnboardingStatusesForProjects(
        projectIds: string[],
    ): Promise<Map<string, OnboardingStatus>> {
        throw new Error("STUB");
    }
}
