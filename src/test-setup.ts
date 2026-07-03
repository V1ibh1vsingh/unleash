import postgresPkg from 'pg';
const { Client } = postgresPkg;
import { migrateDb } from './migrator.js';
import { getDbConfig } from './test/e2e/helpers/database-config.js';
import { testDbPrefix } from './test/e2e/helpers/database-init.js';
import type { IUnleashConfig } from './lib/types/option.js';

let initializationPromise: Promise<void> | null = null;

const initializeTemplateDb = (db: IUnleashConfig['db']): Promise<void> => {
    throw new Error("STUB");
};

export default async function globalSetup() {
    throw new Error("STUB");
}
