import ky, { type Options } from 'ky';
import http from 'node:http';
import https from 'node:https';
import { addonDefinitionSchema } from './addon-schema.js';
import type { Logger } from '../logger.js';
import type { IAddonConfig, IAddonDefinition } from '../types/model.js';
import type { IEvent } from '../events/index.js';
import type { IntegrationEventsService } from '../features/integration-events/integration-events-service.js';
import type { IntegrationEventWriteModel } from '../features/integration-events/integration-events-store.js';
import type EventEmitter from 'events';
import type { IFlagResolver } from '../types/index.js';
import { ADDON_EVENTS_HANDLED } from '../metric-events.js';
import {
    type ValidatedUrl,
    validateUrl,
    type ValidateUrlOptions,
} from './validate-url.js';

export type FetchRetryOptions = Omit<
    Options,
    'fetch' | 'redirect' | 'retry'
> & {
    validateUrlOptions?: ValidateUrlOptions;
};

export default abstract class Addon {
    logger: Logger;

    _name: string;

    _definition: IAddonDefinition;

    integrationEventsService: IntegrationEventsService;

    eventBus: EventEmitter;

    flagResolver: IFlagResolver;

    allowPrivateUrls: boolean;

    allowList: string[];

    constructor(
        definition: IAddonDefinition,
        {
            getLogger,
            integrationEventsService,
            flagResolver,
            eventBus,
            allowPrivateUrls,
            allowList,
        }: IAddonConfig,
    ) {
        throw new Error("STUB");
    }

    get name(): string {
        throw new Error("STUB");
    }

    get definition(): IAddonDefinition {
        throw new Error("STUB");
    }

    async fetchRetry(
        url: string,
        options: FetchRetryOptions = {},
        retries: number = 1,
    ): Promise<Response> {
        throw new Error("STUB");
    }

    abstract handleEvent(
        event: IEvent,
        parameters: any,
        integrationId: number,
    ): Promise<void>;

    async registerEvent(
        integrationEvent: IntegrationEventWriteModel,
    ): Promise<void> {
        throw new Error("STUB");
    }

    destroy?(): void;
}

export const fetchPinned = async (
    validated: ValidatedUrl,
    options: Omit<Options, 'fetch' | 'redirect' | 'throwHttpErrors'>,
): Promise<Response> => {
    throw new Error("STUB");
};

const fetchWithPinnedLookup = async (
    input: Parameters<typeof fetch>[0],
    init: Parameters<typeof fetch>[1],
    validated: ValidatedUrl,
): Promise<Response> => {
    const request = new Request(input, init);
    const body = request.body
        ? Buffer.from(await request.arrayBuffer())
        : undefined;
    const requestUrl = new URL(request.url);
    const client = requestUrl.protocol === 'https:' ? https : http;

    return new Promise<Response>((resolve, reject) => {
        throw new Error("STUB");
    });
};

const getErrorStatus = (error: unknown): number => {
    throw new Error("STUB");
};
