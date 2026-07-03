import type { Db } from '../../db/db.js';
import {
    SUBSCRIPTION_TYPES,
    type IUserSubscriptionsReadModel,
    type Subscriber,
} from './user-subscriptions-read-model-type.js';

const USERS_TABLE = 'users';
const USER_COLUMNS = [
    'id',
    'name',
    'username',
    'email',
    'image_url',
    'is_service',
];
const UNSUBSCRIPTION_TABLE = 'user_unsubscription';

const mapRowToSubscriber = (row) =>
    { throw new Error("STUB"); };

export class UserSubscriptionsReadModel implements IUserSubscriptionsReadModel {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getSubscribedUsers(subscription: string) {
        throw new Error("STUB");
    }

    async getUnsubscribedUsers(subscription: string) {
        throw new Error("STUB");
    }

    async getUserSubscriptions(userId: number) {
        throw new Error("STUB");
    }
}
