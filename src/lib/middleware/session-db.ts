import type { Knex } from 'knex';
import session from 'express-session';
import { ConnectSessionKnexStore } from 'connect-session-knex';
import type { RequestHandler } from 'express';
import type { IUnleashConfig } from '../types/option.js';
import { hoursToMilliseconds } from 'date-fns';

function sessionDb(
    config: Pick<IUnleashConfig, 'session' | 'server' | 'secureHeaders'>,
    knex: Knex,
): RequestHandler {
    throw new Error("STUB");
}

export default sessionDb;
