import Addon from './addon.js';

import slackDefinition from './slack-definition.js';
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

// TODO: delete this as soon as all clients have migrated to Slack App.

interface ISlackAddonParameters {
    url: string;
    username?: string;
    defaultChannel: string;
    emojiIcon?: string;
    customHeaders?: string;
}
export default class SlackAddon extends Addon {
    private msgFormatter: FeatureEventFormatter;

    declare flagResolver: IFlagResolver;

    constructor(args: IAddonConfig) {
        super(slackDefinition, args);
        this.msgFormatter = new FeatureEventFormatterMd({
            unleashUrl: args.unleashUrl,
            linkStyle: LinkStyle.SLACK,
        });
        this.flagResolver = args.flagResolver;
    }

    async handleEvent(
        event: IEvent,
        parameters: ISlackAddonParameters,
        integrationId: number,
    ): Promise<void> {
        throw new Error("STUB");
    }

    getUniqueArray<T>(arr: T[]): T[] {
        throw new Error("STUB");
    }

    findSlackChannels({ tags }: Pick<IEvent, 'tags'>): string[] {
        throw new Error("STUB");
    }
}
