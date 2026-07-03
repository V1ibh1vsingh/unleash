import memoizee from 'memoizee';
import joi from 'joi';
const { ValidationError } = joi;
import { getAddons, type IAddonProviders } from '../addons/index.js';
import type Addon from '../addons/addon.js';
import {
    AddonConfigCreatedEvent,
    AddonConfigDeletedEvent,
    AddonConfigUpdatedEvent,
} from '../types/index.js';
import { addonSchema } from './addon-schema.js';
import NameExistsError from '../error/name-exists-error.js';
import type { IFeatureToggleStore } from '../features/feature-toggle/types/feature-toggle-store-type.js';
import type { Logger } from '../logger.js';
import type TagTypeService from '../features/tag-type/tag-type-service.js';
import type {
    IAddon,
    IAddonDto,
    IAddonStore,
} from '../types/stores/addon-store.js';
import {
    type IAuditUser,
    type IUnleashConfig,
    type IUnleashStores,
    SYSTEM_USER_AUDIT,
} from '../types/index.js';
import type { IAddonDefinition } from '../types/model.js';
import { minutesToMilliseconds } from 'date-fns';
import type EventService from '../features/events/event-service.js';
import { omitKeys } from '../util/index.js';
import { BadDataError, NotFoundError } from '../error/index.js';
import type { IntegrationEventsService } from '../features/integration-events/integration-events-service.js';
import { type IEvent, type IEventType, IEventTypes } from '../events/index.js';
import { validateUrl } from '../addons/validate-url.js';
const MASKED_VALUE = '*****';

const WILDCARD_OPTION = '*';

interface ISensitiveParams {
    [key: string]: string[];
}
export default class AddonService {
    addonStore: IAddonStore;

    featureToggleStore: IFeatureToggleStore;

    logger: Logger;

    tagTypeService: TagTypeService;

    eventService: EventService;

    addonProviders: IAddonProviders;

    sensitiveParams: ISensitiveParams;

    fetchAddonConfigs: (() => Promise<IAddon[]>) &
        memoizee.Memoized<() => Promise<IAddon[]>>;

    private eventHandlers: Map<IEventType, (event: IEvent) => Promise<void>>;

    private allowPrivateUrls: boolean;

    private allowList: string[];

    constructor(
        {
            addonStore,
            featureToggleStore,
        }: Pick<IUnleashStores, 'addonStore' | 'featureToggleStore'>,
        {
            getLogger,
            server,
            flagResolver,
            eventBus,
            allowPrivateUrlInIntegration,
            allowListIntegration,
        }: Pick<
            IUnleashConfig,
            | 'getLogger'
            | 'server'
            | 'flagResolver'
            | 'eventBus'
            | 'allowPrivateUrlInIntegration'
            | 'allowListIntegration'
        >,
        tagTypeService: TagTypeService,
        eventService: EventService,
        integrationEventsService: IntegrationEventsService,
        addons?: IAddonProviders,
    ) {
        throw new Error("STUB");
    }

    loadSensitiveParams(addonProviders: IAddonProviders): ISensitiveParams {
        throw new Error("STUB");
    }

    registerProvider(provider: Addon): void {
        throw new Error("STUB");
    }

    registerEventHandler(): void {
        throw new Error("STUB");
    }

    handleEvent(eventName: string): (event: IEvent) => Promise<void> {
        throw new Error("STUB");
    }

    // Should be used by the controller.
    async getAddons(): Promise<IAddon[]> {
        const addonConfigs = await this.addonStore.getAll();
        return addonConfigs.map((a) => { throw new Error("STUB"); });
    }

    filterSensitiveFields(addonConfig: IAddon): IAddon {
        const { sensitiveParams } = this;
        const a = { ...addonConfig };
        a.parameters = Object.keys(a.parameters).reduce((obj, paramKey) => {
            throw new Error("STUB");
        }, {});
        return a;
    }

    async getAddon(id: number): Promise<IAddon> {
        throw new Error("STUB");
    }

    getProviderDefinitions(): IAddonDefinition[] {
        const { addonProviders } = this;
        return Object.values(addonProviders).map((p) => { throw new Error("STUB"); });
    }

    async addTagTypes(providerName: string): Promise<void> {
        throw new Error("STUB");
    }

    async createAddon(data: IAddonDto, auditUser: IAuditUser): Promise<IAddon> {
        throw new Error("STUB");
    }

    async updateAddon(
        id: number,
        data: IAddonDto,
        auditUser: IAuditUser,
    ): Promise<IAddon> {
        throw new Error("STUB");
    }

    async removeAddon(id: number, auditUser: IAuditUser): Promise<void> {
        throw new Error("STUB");
    }

    async validateKnownProvider(config: Partial<IAddonDto>): Promise<boolean> {
        throw new Error("STUB");
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async validateRequiredParameters({
        provider,
        parameters,
    }): Promise<boolean> {
        throw new Error("STUB");
    }
    async validateUrlParameter({ parameters }): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {
        this.eventHandlers.forEach((handler, eventName) => {
            throw new Error("STUB");
        });
        this.eventHandlers.clear();

        Object.values(this.addonProviders).forEach((addon) => {
            throw new Error("STUB");
        });
    }
}
