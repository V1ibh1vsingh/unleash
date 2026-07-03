import { ADMIN } from '../../types/permissions.js';
import {
    type EmailService,
    TemplateFormat,
} from '../../services/email-service.js';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type { Request, Response } from 'express';
import Controller from '../controller.js';
import type { Logger } from '../../logger.js';
import sanitize from 'sanitize-filename';

export default class EmailController extends Controller {
    private emailService: EmailService;

    private logger: Logger;

    constructor(
        config: IUnleashConfig,
        { emailService }: Pick<IUnleashServices, 'emailService'>,
    ) {
        throw new Error("STUB");
    }

    async getHtmlPreview(req: Request, res: Response): Promise<void> {
        throw new Error("STUB");
    }

    async getTextPreview(req: Request, res: Response): Promise<void> {
        throw new Error("STUB");
    }
}
