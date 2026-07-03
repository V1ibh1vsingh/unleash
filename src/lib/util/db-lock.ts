import pg from 'pg';
const { Client } = pg;
import type { IDBOption } from '../types/index.js';
import type { Logger } from '../logger.js';
import { cloneDbConfig } from './clone-db-config.js';

export const defaultLockKey = 479341;
export const defaultTimeout = 30 * 60000;

interface IDbLockOptions {
    timeout: number;
    lockKey: number;
    logger: Logger;
}

const defaultOptions: IDbLockOptions = {
    timeout: defaultTimeout,
    lockKey: defaultLockKey,
    logger: { ...console, fatal: console.error },
};

export const withDbLock =
    (dbConfig: IDBOption, config = defaultOptions) =>
    <A extends any[], R>(fn: (...args: A) => Promise<R>) =>
    { throw new Error("STUB"); };
