import type { Knex } from 'knex';
import FeatureToggleStore from '../feature-toggle-store.js';

export class FeatureToggleListBuilder {
    private db: Knex;

    public internalQuery: Knex.QueryBuilder;

    private selectColumns: (string | Knex.Raw<any>)[];

    constructor(db, selectColumns) {
        this.db = db;
        this.selectColumns = selectColumns;
    }

    getSelectColumns = () => {
        throw new Error("STUB");
    };

    query = (table: string) => {
        this.internalQuery = this.db(table);

        return this;
    };

    addSelectColumn = (column: string | Knex.Raw<any>) => {
        throw new Error("STUB");
    };

    withArchived = (includeArchived: boolean) => {
        throw new Error("STUB");
    };

    withStrategies = (filter: string) => {
        throw new Error("STUB");
    };

    withFeatureEnvironments = (filter: string) => {
        throw new Error("STUB");
    };

    withFeatureStrategySegments = () => {
        throw new Error("STUB");
    };

    withSegments = () => {
        throw new Error("STUB");
    };

    withDependentFeatureToggles = () => {
        throw new Error("STUB");
    };

    withFeatureTags = () => {
        throw new Error("STUB");
    };

    withLastSeenByEnvironment = (archived = false) => {
        throw new Error("STUB");
    };

    withFavorites = (userId: number) => {
        throw new Error("STUB");
    };

    forProject = (project: string[]) => {
        throw new Error("STUB");
    };
}
