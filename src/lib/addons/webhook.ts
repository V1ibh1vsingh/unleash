import Mustache from 'mustache';
import Addon from './addon.js';
import definition from './webhook-definition.js';
import type { IEvent } from '../events/index.js';
import {
    type IAddonConfig,
    type IFlagResolver,
    serializeDates,
} from '../types/index.js';
import type { IntegrationEventState } from '../features/integration-events/integration-events-store.js';
import {
    type FeatureEventFormatter,
    FeatureEventFormatterMd,
} from './feature-event-formatter-md.js';

interface IParameters {
    url: string;
    serviceName?: string;
    bodyTemplate?: string;
    contentType?: string;
    authorization?: string;
    customHeaders?: string;
}

const isInsideDoubleQuotedString = (value: string, offset: number): boolean => {
    throw new Error("STUB");
};

export default class Webhook extends Addon {
    private msgFormatter: FeatureEventFormatter;

    declare flagResolver: IFlagResolver;

    constructor(args: IAddonConfig) {
        super(definition, args);
        this.msgFormatter = new FeatureEventFormatterMd({
            unleashUrl: args.unleashUrl,
        });
        this.flagResolver = args.flagResolver;
    }

    async handleEvent(
        event: IEvent,
        parameters: IParameters,
        integrationId: number,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
