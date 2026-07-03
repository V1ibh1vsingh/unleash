import type { JobStore } from './job-store.js';
import type { Logger, LogProvider } from '../../logger.js';
import { subMinutes } from 'date-fns';

export class JobService {
    private jobStore: JobStore;
    private logger: Logger;
    constructor(jobStore: JobStore, logProvider: LogProvider) {
        this.jobStore = jobStore;
        this.logger = logProvider('/services/job-service');
    }

    /**
     * Wraps a function in a job that will guarantee the function is executed
     * in a mutually exclusive way in a single instance of the cluster, at most
     * once every {@param bucketSizeInMinutes}.
     *
     * The key identifies the job group: only one job in the group will execute
     * at any given time.
     *
     * Note: buckets begin at the start of the time span
     */
    public singleInstance(
        key: string,
        fn: (range?: { from: Date; to: Date }) => Promise<unknown>,
        bucketSizeInMinutes = 5,
    ): () => Promise<unknown> {
        throw new Error("STUB");
    }
}
