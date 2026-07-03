import Addon from './addon.js';

import teamsWorkflowDefinition from './teams-workflow-definition.js';
import {
    type FeatureEventFormatter,
    FeatureEventFormatterMd,
} from './feature-event-formatter-md.js';
import {
    type IAddonConfig,
    type IFlagResolver,
    serializeDates,
} from '../types/index.js';
import type { IEvent } from '../events/index.js';
import type { IntegrationEventState } from '../features/integration-events/integration-events-store.js';

interface ITeamsWorkflowParameters {
    url: string;
    customHeaders?: string;
}

export default class TeamsWorkflowAddon extends Addon {
    private msgFormatter: FeatureEventFormatter;

    declare flagResolver: IFlagResolver;

    constructor(args: IAddonConfig) {
        super(teamsWorkflowDefinition, args);
        this.msgFormatter = new FeatureEventFormatterMd({
            unleashUrl: args.unleashUrl,
        });
        this.flagResolver = args.flagResolver;
    }

    async handleEvent(
        event: IEvent,
        parameters: ITeamsWorkflowParameters,
        integrationId: number,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
