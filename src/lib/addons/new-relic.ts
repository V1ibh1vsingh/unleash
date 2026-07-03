import Addon from './addon.js';

import definition from './new-relic-definition.js';
import Mustache from 'mustache';
import {
    type IAddonConfig,
    type IFlagResolver,
    serializeDates,
} from '../types/index.js';
import type { IEvent, IEventType } from '../events/index.js';
import {
    type FeatureEventFormatter,
    FeatureEventFormatterMd,
} from './feature-event-formatter-md.js';
import { gzip } from 'node:zlib';
import { promisify } from 'util';
import type { IntegrationEventState } from '../features/integration-events/integration-events-store.js';

const asyncGzip = promisify(gzip);

export interface INewRelicParameters {
    url: string;
    licenseKey: string;
    customHeaders?: string;
    bodyTemplate?: string;
}

interface INewRelicRequestBody {
    eventType: 'Unleash Service Event';
    unleashEventType: IEventType;
    featureName: IEvent['featureName'];
    environment: IEvent['environment'];
    createdBy: IEvent['createdBy'];
    createdByUserId: IEvent['createdByUserId'];
    createdAt: IEvent['createdAt'];
}

export default class NewRelicAddon extends Addon {
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
        parameters: INewRelicParameters,
        integrationId: number,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
