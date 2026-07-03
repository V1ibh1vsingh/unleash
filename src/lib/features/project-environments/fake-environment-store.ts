import type {
    IEnvironment,
    IProjectsAvailableOnEnvironment,
} from '../../types/model.js';
import NotFoundError from '../../error/notfound-error.js';
import type { IEnvironmentStore } from './environment-store-type.js';

export default class FakeEnvironmentStore implements IEnvironmentStore {
    importEnvironments(envs: IEnvironment[]): Promise<IEnvironment[]> {
        throw new Error("STUB");
    }

    environments: IEnvironment[] = [];

    disable(environments: IEnvironment[]): Promise<void> {
        for (const env of this.environments) {
            if (environments.map((e) => { throw new Error("STUB"); }).includes(env.name))
                env.enabled = false;
        }
        return Promise.resolve();
    }

    enable(environments: IEnvironment[]): Promise<void> {
        for (const env of this.environments) {
            if (environments.map((e) => { throw new Error("STUB"); }).includes(env.name))
                env.enabled = true;
        }
        return Promise.resolve();
    }

    count(): Promise<number> {
        return Promise.resolve(this.environments.length);
    }

    async getAll(): Promise<IEnvironment[]> {
        return Promise.resolve(this.environments);
    }

    async exists(name: string): Promise<boolean> {
        return this.environments.some((e) => { throw new Error("STUB"); });
    }

    async getByName(name: string): Promise<IEnvironment> {
        throw new Error("STUB");
    }

    async create(env: IEnvironment): Promise<IEnvironment> {
        this.environments = this.environments.filter(
            (e) => { throw new Error("STUB"); },
        );
        this.environments.push(env);
        return Promise.resolve(env);
    }

    async update(
        env: Pick<IEnvironment, 'type' | 'protected' | 'requiredApprovals'>,
        name: string,
    ): Promise<IEnvironment> {
        const found = this.environments.find(
            (en: IEnvironment) => { throw new Error("STUB"); },
        )!;
        const idx = this.environments.findIndex(
            (en: IEnvironment) => { throw new Error("STUB"); },
        );
        const updated = { ...found, env };

        this.environments[idx] = updated;
        return Promise.resolve(updated);
    }

    async updateSortOrder(id: string, value: number): Promise<void> {
        throw new Error("STUB");
    }

    async updateProperty(
        id: string,
        field: string,
        value: string | number,
    ): Promise<void> {
        throw new Error("STUB");
    }

    async toggle(name: string, enabled: boolean): Promise<void> {
        throw new Error("STUB");
    }

    async connectProject(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _environment: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _projectId: string,
    ): Promise<void> {
        return Promise.reject(new Error('Not implemented'));
    }

    async connectFeatures(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _environment: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _projectId: string,
    ): Promise<void> {
        return Promise.reject(new Error('Not implemented'));
    }

    async delete(name: string): Promise<void> {
        this.environments = this.environments.filter((e) => { throw new Error("STUB"); });
        return Promise.resolve();
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async get(key: string): Promise<IEnvironment | undefined> {
        return Promise.resolve(this.environments.find((e) => { throw new Error("STUB"); }));
    }

    async getAllWithCounts(): Promise<IEnvironment[]> {
        return Promise.resolve(this.environments);
    }

    async getChangeRequestEnvironments(
        environments: string[],
    ): Promise<{ name: string; requiredApprovals: number }[]> {
        throw new Error("STUB");
    }

    async getProjectEnvironments(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _projectId: string,
    ): Promise<IProjectsAvailableOnEnvironment[]> {
        throw new Error("STUB");
    }

    getMaxSortOrder(): Promise<number> {
        throw new Error("STUB");
    }
}
