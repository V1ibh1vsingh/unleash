import type { ReleasePlan } from './release-plan.js';
import type { ReleasePlanMilestoneStrategy } from './release-plan-milestone-strategy.js';
import { CRUDStore, type CrudStoreConfig } from '../../db/crud/crud-store.js';
import type { Row } from '../../db/crud/row-type.js';
import type { Db } from '../../db/db.js';
import { defaultToRow } from '../../db/crud/default-mappings.js';
import type { IAuditUser } from '../../types/index.js';

const TABLE = 'release_plan_definitions';

type ReleasePlanWriteModel = Omit<
    ReleasePlan,
    'discriminator' | 'createdAt' | 'milestones'
>;

const selectColumns = [
    'rpd.id AS planId',
    'rpd.discriminator AS planDiscriminator',
    'rpd.name AS planName',
    'rpd.description as planDescription',
    'rpd.feature_name as planFeatureName',
    'rpd.environment as planEnvironment',
    'rpd.created_by_user_id as planCreatedByUserId',
    'rpd.created_at as planCreatedAt',
    'rpd.active_milestone_id as planActiveMilestoneId',
    'rpd.release_plan_template_id as planTemplateId',
    'mi.id AS milestoneId',
    'mi.name AS milestoneName',
    'mi.sort_order AS milestoneSortOrder',
    'ms.id AS strategyId',
    'ms.sort_order AS strategySortOrder',
    'ms.title AS strategyTitle',
    'ms.strategy_name AS strategyName',
    'ms.parameters AS strategyParameters',
    'ms.constraints AS strategyConstraints',
    'ms.variants AS strategyVariants',
    'ms.disabled AS strategyDisabled',
    'mss.segment_id AS segmentId',
];
const processReleasePlanRows = (templateRows): ReleasePlan[] =>
    { throw new Error("STUB"); };

const processMilestoneStrategyRows = (
    rows: any,
): ReleasePlanMilestoneStrategy[] => {
    throw new Error("STUB");
};

export class ReleasePlanStore extends CRUDStore<
    ReleasePlan,
    ReleasePlanWriteModel,
    Row<ReleasePlan>,
    ReleasePlan,
    string
> {
    constructor(db: Db, config: CrudStoreConfig) {
        super(TABLE, db, config, {
            fromRow: (row) => {
                throw new Error("STUB");
            },
            toRow: (item) => { throw new Error("STUB"); },
        });
    }

    override async count(
        query?: Partial<ReleasePlanWriteModel>,
    ): Promise<number> {
        let countQuery = this.db(this.tableName)
            .where('discriminator', 'plan')
            .count('*');
        if (query) {
            countQuery = countQuery.where(this.toRow(query));
        }
        const { count } = (await countQuery.first()) ?? { count: 0 };
        return Number(count);
    }

    async getByFeatureFlagEnvironmentAndPlanId(
        featureName: string,
        environment: string,
        planId: string,
    ): Promise<ReleasePlan> {
        throw new Error("STUB");
    }

    async getByPlanId(planId: string): Promise<ReleasePlan | undefined> {
        throw new Error("STUB");
    }

    async activateStrategiesForMilestone(
        planId: string,
        auditUser: IAuditUser,
    ): Promise<ReleasePlanMilestoneStrategy[]> {
        throw new Error("STUB");
    }

    async deactivateStrategiesForMilestone(
        templateId: string,
    ): Promise<ReleasePlanMilestoneStrategy[]> {
        throw new Error("STUB");
    }

    async getActiveStrategiesForPlan(
        planId: string,
    ): Promise<ReleasePlanMilestoneStrategy[]> {
        throw new Error("STUB");
    }

    async activateStrategySegmentsForMilestone(
        milestone_id: string,
    ): Promise<number[]> {
        throw new Error("STUB");
    }

    async featureAndEnvironmentHasPlan(
        featureName: string,
        environment: string,
    ): Promise<boolean> {
        throw new Error("STUB");
    }

    async getByEnvironmentAndProjects(
        environment: string,
        projects: string[],
    ): Promise<ReleasePlan[]> {
        throw new Error("STUB");
    }
}
