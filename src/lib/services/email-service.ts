import { createTransport, type Transporter } from 'nodemailer';
import Mustache from 'mustache';
import path from 'path';
import { existsSync, readFileSync } from 'fs';
import type { Logger } from '../logger.js';
import NotFoundError from '../error/notfound-error.js';
import type { IUnleashConfig } from '../types/option.js';
import {
    type ProductivityReportMetrics,
    productivityReportViewModel,
} from '../features/productivity-report/productivity-report-view-model.js';
import { fileURLToPath } from 'node:url';
import type { IFlagResolver } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface IAuthOptions {
    user: string;
    pass: string;
}

export enum TemplateFormat {
    HTML = 'html',
    PLAIN = 'plain',
}

export enum TransporterType {
    SMTP = 'smtp',
    JSON = 'json',
}

export interface IEmailEnvelope {
    from: string;
    to: string;
    bcc?: string;
    subject: string;
    html: string;
    text: string;
    attachments?: {
        filename: string;
        path: string;
        cid: string;
    }[];
    headers?: Record<string, string>;
}

export interface ICrApprovalParameters {
    changeRequestLink: string;
    changeRequestTitle: string;
    requesterName: string;
    requesterEmail: string;
}

const RESET_MAIL_SUBJECT = 'Unleash - Reset your password';
const GETTING_STARTED_SUBJECT = 'Welcome to Unleash';
const PRODUCTIVITY_REPORT = 'Unleash - productivity report';
const SCHEDULED_CHANGE_CONFLICT_SUBJECT =
    'Unleash - Scheduled changes can no longer be applied';
const SCHEDULED_EXECUTION_FAILED_SUBJECT =
    'Unleash - Scheduled change request could not be applied';
const REQUESTED_CR_APPROVAL_SUBJECT =
    'Unleash - new change request waiting to be reviewed';
export const MAIL_ACCEPTED = '250 Accepted';

export type ChangeRequestScheduleConflictData =
    | { reason: 'flag archived'; flagName: string }
    | {
          reason: 'strategy deleted';
          flagName: string;
          strategyId: string;
      }
    | {
          reason: 'strategy updated';
          flagName: string;
          strategyId: string;
      }
    | {
          reason: 'segment updated';
          segment: { id: number; name: string };
      }
    | {
          reason: 'environment variants updated';
          flagName: string;
          environment: string;
      };

export type TransportProvider = () => Transporter;
export class EmailService {
    private logger: Logger;
    private config: IUnleashConfig;

    private readonly mailer?: Transporter;

    private readonly sender: string;

    private flagResolver: IFlagResolver;

    constructor(config: IUnleashConfig, transportProvider?: TransportProvider) {
        throw new Error("STUB");
    }

    async sendRequestedCRApprovalEmail(
        recipient: string,
        crApprovalParams: ICrApprovalParameters,
    ): Promise<IEmailEnvelope> {
        throw new Error("STUB");
    }
    async sendScheduledExecutionFailedEmail(
        recipient: string,
        changeRequestLink: string,
        changeRequestTitle: string,
        scheduledAt: string,
        errorMessage: string,
    ): Promise<IEmailEnvelope> {
        throw new Error("STUB");
    }

    async sendScheduledChangeConflictEmail(
        recipient: string,
        conflictScope: 'flag' | 'strategy',
        conflictingChangeRequestId: number | undefined,
        changeRequests: {
            id: number;
            scheduledAt: string;
            link: string;
            title?: string;
        }[],
        flagName: string,
        project: string,
        strategyId?: string,
    ) {
        throw new Error("STUB");
    }

    async sendScheduledChangeSuspendedEmail(
        recipient: string,
        conflictData: ChangeRequestScheduleConflictData,

        conflictingChangeRequestId: number | undefined,
        changeRequests: {
            id: number;
            scheduledAt: string;
            link: string;
            title?: string;
        }[],
        project: string,
    ) {
        throw new Error("STUB");
    }

    async sendResetMail(
        name: string,
        recipient: string,
        resetLink: string,
    ): Promise<IEmailEnvelope> {
        throw new Error("STUB");
    }

    async sendGettingStartedMail(
        name: string,
        recipient: string,
        unleashUrl: string,
        passwordLink?: string,
    ): Promise<IEmailEnvelope> {
        if (this.configured()) {
            const year = new Date().getFullYear();
            const context = {
                passwordLink,
                name: this.stripSpecialCharacters(name),
                year,
                unleashUrl,
                recipient,
            };

            const gettingStartedTemplate = 'getting-started';

            // If the password link is the base Unleash URL, we remove it from the context
            // This can happen if the instance is using SSO instead of password-based authentication
            // In that case, our template should show the alternative path: You don't set a password, you log in with SSO
            if (passwordLink === unleashUrl) {
                delete context.passwordLink;
            }

            const bodyHtml = await this.compileTemplate(
                gettingStartedTemplate,
                TemplateFormat.HTML,
                context,
            );
            const bodyText = await this.compileTemplate(
                gettingStartedTemplate,
                TemplateFormat.PLAIN,
                context,
            );
            const email = {
                from: this.sender,
                to: recipient,
                subject: GETTING_STARTED_SUBJECT,
                html: bodyHtml,
                text: bodyText,
            };
            process.nextTick(() => {
                throw new Error("STUB");
            });
            return Promise.resolve(email);
        }
        return new Promise((res) => {
            throw new Error("STUB");
        });
    }

    async sendProductivityReportEmail(
        userEmail: string,
        userName: string,
        metrics: ProductivityReportMetrics,
    ): Promise<IEmailEnvelope> {
        throw new Error("STUB");
    }

    isEnabled(): boolean {
        return this.mailer !== undefined;
    }

    async compileTemplate(
        templateName: string,
        format: TemplateFormat,
        context: unknown,
    ): Promise<string> {
        try {
            const template = this.resolveTemplate(templateName, format);
            return await Promise.resolve(Mustache.render(template, context));
        } catch (e) {
            this.logger.info(`Could not find template ${templateName}`);
            return Promise.reject(e);
        }
    }

    private resolveTemplate(
        templateName: string,
        format: TemplateFormat,
    ): string {
        const topPath = path.resolve(__dirname, '../../mailtemplates');
        const template = path.join(
            topPath,
            templateName,
            `${templateName}.${format}.mustache`,
        );
        if (existsSync(template)) {
            return readFileSync(template, 'utf-8');
        }
        throw new NotFoundError('Could not find template');
    }

    private resolveTemplateAttachment(
        templateName: string,
        filename: string,
        cid: string,
    ): {
        filename: string;
        path: string;
        cid: string;
    } {
        throw new Error("STUB");
    }

    configured(): boolean {
        return this.sender !== 'not-configured' && this.mailer !== undefined;
    }

    stripSpecialCharacters(str: string): string {
        return str?.replace(/[`~!@#$%^&*()_|+=?;:'",.<>{}[\]\\/]/gi, '');
    }
}
