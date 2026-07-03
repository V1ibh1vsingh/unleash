import type { Request, Response } from 'express';
import Controller from '../controller.js';
import type { IFlagResolver, IUnleashConfig } from '../../types/index.js';
import type AddonService from '../../services/addon-service.js';

import {
    ADMIN,
    CREATE_ADDON,
    DELETE_ADDON,
    NONE,
    UPDATE_ADDON,
} from '../../types/permissions.js';
import type { IAuthRequest } from '../unleash-types.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import {
    type AddonSchema,
    addonSchema,
} from '../../openapi/spec/addon-schema.js';
import { serializeDates } from '../../types/serialize-dates.js';
import {
    type AddonsSchema,
    addonsSchema,
} from '../../openapi/spec/addons-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import type { AddonCreateUpdateSchema } from '../../openapi/spec/addon-create-update-schema.js';
import {
    type BasePaginationParameters,
    basePaginationParameters,
} from '../../openapi/spec/base-pagination-parameters.js';
import {
    type IntegrationEventsSchema,
    integrationEventsSchema,
} from '../../openapi/spec/integration-events-schema.js';
import { BadDataError } from '../../error/index.js';
import type {
    IntegrationEventsService,
    IUnleashServices,
} from '../../services/index.js';

type AddonServices = Pick<
    IUnleashServices,
    'addonService' | 'openApiService' | 'integrationEventsService'
>;

const PATH = '/';

class AddonController extends Controller {
    private addonService: AddonService;

    private openApiService: OpenApiService;

    private integrationEventsService: IntegrationEventsService;

    private flagResolver: IFlagResolver;

    constructor(
        config: IUnleashConfig,
        {
            addonService,
            openApiService,
            integrationEventsService,
        }: AddonServices,
    ) {
        throw new Error("STUB");
    }

    async getAddons(_req: Request, res: Response<AddonsSchema>): Promise<void> {
        let addons = await this.addonService.getAddons();
        let providers = this.addonService.getProviderDefinitions();

        if (!this.flagResolver.isEnabled('serviceNowIntegration')) {
            addons = addons.filter((addon) => { throw new Error("STUB"); });
            providers = providers.filter(
                (provider) => { throw new Error("STUB"); },
            );
        }

        this.openApiService.respondWithValidation(200, res, addonsSchema.$id, {
            addons: serializeDates(addons),
            providers: serializeDates(providers),
        });
    }

    async getAddon(
        req: Request<{ id: number }, any, any, any>,
        res: Response<AddonSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async updateAddon(
        req: IAuthRequest<{ id: number }, any, AddonCreateUpdateSchema, any>,
        res: Response<AddonSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async createAddon(
        req: IAuthRequest<AddonCreateUpdateSchema, any, any, any>,
        res: Response<AddonSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async deleteAddon(
        req: IAuthRequest<{ id: number }, any, any, any>,
        res: Response<void>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getIntegrationEvents(
        req: IAuthRequest<
            { id: number },
            unknown,
            unknown,
            BasePaginationParameters
        >,
        res: Response<IntegrationEventsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
export default AddonController;
