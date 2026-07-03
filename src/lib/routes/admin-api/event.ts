import type { Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type EventService from '../../features/events/event-service.js';
import { ADMIN, NONE } from '../../types/permissions.js';
import type { IEvent, IEventList } from '../../events/index.js';
import Controller from '../controller.js';
import { anonymiseKeys } from '../../util/anonymise.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import {
    eventsSchema,
    type EventsSchema,
} from '../../../lib/openapi/spec/events-schema.js';
import { serializeDates } from '../../../lib/types/serialize-dates.js';
import {
    featureEventsSchema,
    type FeatureEventsSchema,
} from '../../../lib/openapi/spec/feature-events-schema.js';
import { getStandardResponses } from '../../../lib/openapi/util/standard-responses.js';
import type { IFlagResolver } from '../../types/experimental.js';
import type { IAuthRequest } from '../unleash-types.js';
import {
    eventCreatorsSchema,
    type ProjectFlagCreatorsSchema,
} from '../../openapi/index.js';
import { extractUserIdFromUser } from '../../util/index.js';

const ANON_KEYS = ['email', 'username', 'createdBy'];
const version = 1 as const;
export default class EventController extends Controller {
    private eventService: EventService;

    private flagResolver: IFlagResolver;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            eventService,
            openApiService,
        }: Pick<IUnleashServices, 'eventService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    maybeAnonymiseEvents(events: IEvent[]): IEvent[] {
        if (this.flagResolver.isEnabled('anonymiseEventLog')) {
            return anonymiseKeys(events, ANON_KEYS);
        }
        return events;
    }

    async getEvents(
        req: IAuthRequest<any, any, any, { project?: string }>,
        res: Response<EventsSchema>,
    ): Promise<void> {
        const { user, query } = req;
        const { project } = query;
        let eventList: IEventList;
        if (project) {
            eventList = await this.eventService.searchEvents(
                {
                    project: `IS:${project}`,
                    offset: 0,
                    limit: 50,
                },
                extractUserIdFromUser(user),
            );
        } else {
            eventList = await this.eventService.getEvents();
        }

        const response: EventsSchema = {
            version,
            events: serializeDates(this.maybeAnonymiseEvents(eventList.events)),
            totalEvents: eventList.totalEvents,
        };

        this.openApiService.respondWithValidation(
            200,
            res,
            eventsSchema.$id,
            response,
        );
    }

    async getEventsForToggle(
        req: IAuthRequest<{ featureName: string }>,
        res: Response<FeatureEventsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getEventCreators(
        _req: IAuthRequest,
        res: Response<ProjectFlagCreatorsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
