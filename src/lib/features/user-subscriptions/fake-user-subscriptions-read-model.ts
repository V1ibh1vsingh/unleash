import type { IUserSubscriptionsReadModel } from './user-subscriptions-read-model-type.js';

export class FakeUserSubscriptionsReadModel
    implements IUserSubscriptionsReadModel
{
    async getSubscribedUsers(_subscription: string) {
        throw new Error("STUB");
    }

    async getUnsubscribedUsers(_subscription: string) {
        throw new Error("STUB");
    }

    async getUserSubscriptions() {
        throw new Error("STUB");
    }
}
