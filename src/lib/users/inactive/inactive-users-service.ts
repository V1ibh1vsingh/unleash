import {
    type IAuditUser,
    type IUnleashConfig,
    type IUnleashStores,
    serializeDates,
} from '../../types/index.js';
import type { IInactiveUsersStore } from './types/inactive-users-store-type.js';
import type { Logger } from '../../logger.js';
import type { InactiveUserSchema } from '../../openapi/index.js';
import type { UserService } from '../../services/index.js';

export class InactiveUsersService {
    private inactiveUsersStore: IInactiveUsersStore;
    private readonly logger: Logger;
    private userService: UserService;
    private readonly userInactivityThresholdInDays: number;
    constructor(
        { inactiveUsersStore }: Pick<IUnleashStores, 'inactiveUsersStore'>,
        {
            getLogger,
            userInactivityThresholdInDays,
        }: Pick<IUnleashConfig, 'getLogger' | 'userInactivityThresholdInDays'>,
        services: {
            userService: UserService;
        },
    ) {
        this.logger = getLogger('services/client-feature-toggle-service.ts');
        this.inactiveUsersStore = inactiveUsersStore;
        this.userService = services.userService;
        this.userInactivityThresholdInDays = userInactivityThresholdInDays;
    }

    async getInactiveUsers(): Promise<InactiveUserSchema[]> {
        throw new Error("STUB");
    }

    async deleteInactiveUsers(
        calledByUser: IAuditUser,
        userIds: number[],
    ): Promise<void> {
        throw new Error("STUB");
    }
}
