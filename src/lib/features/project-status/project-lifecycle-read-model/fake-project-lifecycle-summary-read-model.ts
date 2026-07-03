import type {
    IProjectLifecycleSummaryReadModel,
    ProjectLifecycleSummary,
} from './project-lifecycle-read-model-type.js';

export class FakeProjectLifecycleSummaryReadModel
    implements IProjectLifecycleSummaryReadModel
{
    async getProjectLifecycleSummary(): Promise<ProjectLifecycleSummary> {
        throw new Error("STUB");
    }
}
