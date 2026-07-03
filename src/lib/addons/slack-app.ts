import {
    WebClient,
    ErrorCode,
    WebClientEvent,
    type CodedError,
    type Methods as SlackSDK,
    type WebAPIPlatformError,
    type WebAPIRequestError,
    type WebAPIRateLimitedError,
    type WebAPIHTTPError,
    type KnownBlock,
    type Block,
} from '@slack/web-api';
import Addon from './addon.js';

import slackAppDefinition from './slack-app-definition.js';
import {
    type IAddonConfig,
    type IFlagResolver,
    serializeDates,
} from '../types/index.js';
import {
    type FeatureEventFormatter,
    FeatureEventFormatterMd,
    LinkStyle,
} from './feature-event-formatter-md.js';
import type { IEvent } from '../events/index.js';
import type { IntegrationEventState } from '../features/integration-events/integration-events-store.js';

interface ISlackAppAddonParameters {
    accessToken: string;
    defaultChannels: string;
}

export type SlackClientProvider = (accessToken: string) => SlackSDK;
const defaultClientProvider: SlackClientProvider = (accessToken: string) => {
    throw new Error("STUB");
};

export default class SlackAppAddon extends Addon {
    private msgFormatter: FeatureEventFormatter;

    declare flagResolver: IFlagResolver;

    private accessToken?: string;

    private slackClient?: SlackSDK;

    constructor(
        args: IAddonConfig,
        readonly clientProvider: SlackClientProvider = defaultClientProvider,
    ) {
        super(slackAppDefinition, args);
        this.msgFormatter = new FeatureEventFormatterMd({
            unleashUrl: args.unleashUrl,
            linkStyle: LinkStyle.SLACK,
        });
        this.flagResolver = args.flagResolver;
    }

    async handleEvent(
        event: IEvent,
        parameters: ISlackAppAddonParameters,
        integrationId: number,
    ): Promise<void> {
        throw new Error("STUB");
    }

    getUniqueArray<T>(arr: T[]): T[] {
        throw new Error("STUB");
    }

    registerEarlyFailureEvent(
        integrationId: number,
        event: IEvent,
        earlyFailureMessage: string,
    ): void {
        throw new Error("STUB");
    }

    findTaggedChannels({ tags }: Pick<IEvent, 'tags'>): string[] {
        throw new Error("STUB");
    }

    getDefaultChannels(defaultChannels?: string): string[] {
        throw new Error("STUB");
    }

    parseError(error: Error | CodedError): string {
        throw new Error("STUB");
    }
}
