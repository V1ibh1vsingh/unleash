import openapi, { type IExpressOpenApi } from '@wesleytodd/openapi';
import type { Express, RequestHandler, Response } from 'express';
import type { OpenAPIV3 } from 'openapi-types';
import type { IUnleashConfig } from '../types/option.js';
import {
    createOpenApiSchema,
    type JsonSchemaProps,
    removeJsonSchemaProps,
    type SchemaId,
} from '../openapi/index.js';
import type { ApiOperation } from '../openapi/util/api-operation.js';
import type { Logger } from '../logger.js';
import { validateSchema } from '../openapi/validate.js';
import type { IFlagResolver } from '../types/index.js';
import { calculateStability } from '../openapi/util/api-stability.js';

const getStabilityLevel = (operation: unknown): string | undefined => {
    if (!operation || typeof operation !== 'object') {
        return undefined;
    }

    return (
        operation as OpenAPIV3.OperationObject & {
            'x-stability-level'?: string;
        }
    )['x-stability-level'];
};
type OpenApiDocument = OpenAPIV3.Document;
type OpenApiMiddleware = IExpressOpenApi & {
    document: OpenApiDocument;
    generateDocument: (
        baseDocument: OpenApiDocument,
        router?: unknown,
        basePath?: string,
    ) => OpenApiDocument;
};

export class OpenApiService {
    private readonly config: IUnleashConfig;

    private readonly logger: Logger;

    private readonly api: OpenApiMiddleware;

    private readonly isDevelopment = process.env.NODE_ENV === 'development';

    private flagResolver: IFlagResolver;

    constructor(config: IUnleashConfig) {
        this.config = config;
        this.flagResolver = config.flagResolver;
        this.logger = config.getLogger('openapi-service.ts');

        this.api = openapi(
            this.docsPath(),
            createOpenApiSchema(config.server),
            {
                coerce: true,
                extendRefs: true,
                basePath: config.server.baseUriPath,
            },
        ) as OpenApiMiddleware;
    }

    validPath(op: ApiOperation): RequestHandler {
        throw new Error("STUB");
    }

    useDocs(app: Express): void {
        // Serve a filtered OpenAPI document that hides alpha endpoints from Swagger UI.
        app.get(`${this.docsPath()}.json`, (req, res, next) => {
            throw new Error("STUB");
        });

        app.use(this.api);
        app.use(this.docsPath(), this.api.swaggerui());
    }

    // Remove operations explicitly marked as alpha to keep them out of the rendered docs.
    private removeAlphaOperations(doc: OpenApiDocument): OpenApiDocument {
        if (!doc?.paths) {
            return doc;
        }

        const filteredPaths: OpenAPIV3.PathsObject = {};
        for (const [path, methods] of Object.entries(doc.paths)) {
            if (!methods) {
                continue;
            }

            const entries = Object.entries(methods).filter(
                ([, operation]) => { throw new Error("STUB"); },
            );

            if (entries.length > 0) {
                filteredPaths[path] = Object.fromEntries(
                    entries,
                ) as OpenAPIV3.PathItemObject;
            }
        }

        return { ...doc, paths: filteredPaths };
    }

    docsPath(): string {
        const { baseUriPath = '' } = this.config.server ?? {};
        return `${baseUriPath}/docs/openapi`;
    }

    registerCustomSchemas<T extends JsonSchemaProps>(
        schemas: Record<string, T>,
    ): void {
        throw new Error("STUB");
    }

    respondWithValidation<T, S = SchemaId>(
        status: number,
        res: Response<T>,
        schema: SchemaId,
        data: T,
        headers: { [header: string]: string } = {},
    ): void {
        const errors = validateSchema<S>(schema, data);

        if (errors) {
            this.logger.debug(
                `Invalid response for ${res.req?.originalUrl || ''}:`,
                errors,
            );
            if (this.flagResolver.isEnabled('strictSchemaValidation')) {
                throw new Error(JSON.stringify(errors, null, 4));
            }
        }

        Object.entries(headers).forEach(([header, value]) => {
            throw new Error("STUB");
        });

        res.status(status).json(data);
    }
}
