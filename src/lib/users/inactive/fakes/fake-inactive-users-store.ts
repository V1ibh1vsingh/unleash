import type {
    IInactiveUserRow,
    IInactiveUsersStore,
} from '../types/inactive-users-store-type.js';
import type { IUser } from '../../../types/index.js';
import { subDays } from 'date-fns';

export class FakeInactiveUsersStore implements IInactiveUsersStore {
    private users: IUser[] = [];
    constructor(users?: IUser[]) {
        this.users = users ?? [];
    }
    getInactiveUsers(daysInactive: number): Promise<IInactiveUserRow[]> {
        throw new Error("STUB");
    }
}
