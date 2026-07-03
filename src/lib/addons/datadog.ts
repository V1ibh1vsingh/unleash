import Addon from './addon.js';

import definition from './datadog-definition.js';
import Mustache from 'mustache';
import {
    type IAddonConfig,
    type IFlagResolver,
    serializeDates,
} from '../types/index.js';
import {
    type FeatureEventFormatter,
    FeatureEventFormatterMd,
} from './feature-event-formatter-md.js';
import type { IEvent } from '../events/index.js';
import type { IntegrationEventState } from '../features/integration-events/integration-events-store.js';

interface IDatadogParameters {
    url?: string;
    apiKey: string;
    sourceTypeName?: string;
    customHeaders?: string;
    bodyTemplate?: string;
}

interface DDRequestBody {
    text: string;
    title: string;
    tags?: string[];
    source_type_name?: string;
}

export default class DatadogAddon extends Addon {
    private msgFormatter: FeatureEventFormatter;

    declare flagResolver: IFlagResolver;

    constructor(config: IAddonConfig) {
        super(definition, config);
        this.msgFormatter = new FeatureEventFormatterMd({
            unleashUrl: config.unleashUrl,
        });
        this.flagResolver = config.flagResolver;
    }

    async handleEvent(
        event: IEvent,
        parameters: IDatadogParameters,
        integrationId: number,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
