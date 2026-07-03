import {
    UserPreferenceUpdatedEvent,
    type IUnleashConfig,
    type IUnleashStores,
} from '../../types/index.js';
import type { IAuditUser } from '../../types/user.js';
import type {
    IUserUnsubscribeStore,
    UnsubscribeEntry,
} from './user-unsubscribe-store-type.js';
import type EventService from '../events/event-service.js';
import type { IUserSubscriptionsReadModel } from './user-subscriptions-read-model-type.js';

export class UserSubscriptionsService {
    private userUnsubscribeStore: IUserUnsubscribeStore;

    private userSubscriptionsReadModel: IUserSubscriptionsReadModel;

    private eventService: EventService;

    constructor(
        {
            userUnsubscribeStore,
            userSubscriptionsReadModel,
        }: Pick<
            IUnleashStores,
            'userUnsubscribeStore' | 'userSubscriptionsReadModel'
        >,
        { getLogger: _getLogger }: Pick<IUnleashConfig, 'getLogger'>,
        eventService: EventService,
    ) {
        this.userUnsubscribeStore = userUnsubscribeStore;
        this.userSubscriptionsReadModel = userSubscriptionsReadModel;
        this.eventService = eventService;
    }

    async getUserSubscriptions(userId: number) {
        throw new Error("STUB");
    }

    async subscribe(
        userId: number,
        subscription: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async unsubscribe(
        userId: number,
        subscription: string,
        auditUser: IAuditUser,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
