import { Parser } from '@json2csv/plainjs';
import type { Response } from 'express';
import type { AuthedRequest } from '../../types/core.js';
import type { IUnleashServices } from '../../services/index.js';
import type { IUnleashConfig } from '../../types/option.js';
import Controller from '../controller.js';
import { NONE } from '../../types/permissions.js';
import type {
    InstanceStatsService,
    InstanceStatsSigned,
} from '../../features/instance-stats/instance-stats-service.js';
import {
    createCsvResponseSchema,
    createResponseSchema,
} from '../../openapi/util/create-response-schema.js';
import type { InstanceAdminStatsSchema } from '../../openapi/index.js';
import { serializeDates } from '../../types/index.js';

class InstanceAdminController extends Controller {
    private instanceStatsService: InstanceStatsService;

    constructor(
        config: IUnleashConfig,
        {
            instanceStatsService,
            openApiService,
        }: Pick<IUnleashServices, 'instanceStatsService' | 'openApiService'>,
    ) {
        throw new Error("STUB");
    }

    instanceStatsExample(): InstanceStatsSigned {
        throw new Error("STUB");
    }

    private serializeStats(
        instanceStats: InstanceStatsSigned,
    ): InstanceAdminStatsSchema {
        throw new Error("STUB");
    }

    async getStatistics(
        _: AuthedRequest,
        res: Response<InstanceAdminStatsSchema>,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async getStatisticsCSV(
        _: AuthedRequest,
        res: Response<string>,
    ): Promise<void> {
        throw new Error("STUB");
    }
}

export default InstanceAdminController;
