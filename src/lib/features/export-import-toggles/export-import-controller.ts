import type { Response } from 'express';
import Controller from '../../routes/controller.js';
import type {
    IExportService,
    IImportService,
} from './export-import-service.js';
import type { OpenApiService, IUnleashServices } from '../../services/index.js';
import type { WithTransactional } from '../../db/transaction.js';
import {
    type IUnleashConfig,
    NONE,
    serializeDates,
} from '../../types/index.js';
import {
    createRequestSchema,
    createResponseSchema,
    emptyResponse,
    type ExportQuerySchema,
    exportResultSchema,
    getStandardResponses,
    type ImportTogglesSchema,
    importTogglesValidateSchema,
} from '../../openapi/index.js';
import type { IAuthRequest } from '../../routes/unleash-types.js';
import { extractUsername } from '../../util/index.js';
import { BadDataError } from '../../error/index.js';
import ApiUser from '../../types/api-user.js';

class ExportImportController extends Controller {
    private exportService: IExportService;

    private importService: WithTransactional<IImportService>;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            exportService,
            importService,
            openApiService,
        }: Pick<
            IUnleashServices,
            'exportService' | 'importService' | 'openApiService'
        >,
    ) {
        throw new Error("STUB");
    }

    async export(
        req: IAuthRequest<unknown, unknown, ExportQuerySchema, unknown>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async validateImport(
        req: IAuthRequest<unknown, unknown, ImportTogglesSchema, unknown>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async importData(
        req: IAuthRequest<unknown, unknown, ImportTogglesSchema, unknown>,
        res: Response,
    ): Promise<void> {
        throw new Error("STUB");
    }
}
export default ExportImportController;
