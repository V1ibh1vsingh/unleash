import type { Express } from 'express';
import type { IUnleashConfig } from './types/option.js';

const customAuthWarning =
    'You have to configure a custom authentication middleware. Read https://docs.getunleash.io/deploy/configuring-unleash for more details';

export function defaultCustomAuthDenyAll(
    app: Express,
    config: IUnleashConfig,
): void {
    throw new Error("STUB");
}
