import type { Db } from '../../db/db.js';
import type {
    ChangeRequestStrategy,
    IChangeRequestSegmentUsageReadModel,
} from './change-request-segment-usage-read-model.js';

export class ChangeRequestSegmentUsageReadModel
    implements IChangeRequestSegmentUsageReadModel
{
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    public async getStrategiesUsedInActiveChangeRequests(
        segmentId: number,
    ): Promise<ChangeRequestStrategy[]> {
        const query = this.db.raw(
            `SELECT events.*, cr.project, cr.environment, cr.title
             FROM change_request_events events
             JOIN change_requests cr ON events.change_request_id = cr.id
             WHERE cr.state NOT IN ('Applied', 'Cancelled', 'Rejected')
             AND events.action IN ('updateStrategy', 'addStrategy');`,
        );

        const queryResult = await query;
        const strategies = queryResult.rows
            .filter((row) => { throw new Error("STUB"); })
            .map((row) => {
                throw new Error("STUB");
            });

        return strategies;
    }
}
