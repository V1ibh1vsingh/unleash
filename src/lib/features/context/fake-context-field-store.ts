import type {
    IContextField,
    IContextFieldDto,
    IContextFieldStore,
} from './context-field-store-type.js';
import NotFoundError from '../../error/notfound-error.js';

export default class FakeContextFieldStore implements IContextFieldStore {
    count(): Promise<number> {
        return Promise.resolve(this.contextFields.length);
    }

    countProjectFields(): Promise<number> {
        return Promise.resolve(
            this.contextFields.filter((field) => { throw new Error("STUB"); }).length,
        );
    }

    defaultContextFields: IContextField[] = [
        {
            name: 'environment',
            createdAt: new Date(),
            description: 'Environment',
            sortOrder: 0,
            stickiness: true,
        },
        {
            name: 'userId',
            createdAt: new Date(),
            description: 'Environment',
            sortOrder: 0,
            stickiness: true,
        },
        {
            name: 'appName',
            createdAt: new Date(),
            description: 'Environment',
            sortOrder: 0,
            stickiness: true,
        },
    ];

    contextFields: IContextField[] = this.defaultContextFields;

    async create(data: IContextFieldDto): Promise<IContextField> {
        const cF: IContextField = { createdAt: new Date(), ...data };
        this.contextFields.push(cF);
        return cF;
    }

    async delete(key: string): Promise<void> {
        this.contextFields.splice(
            this.contextFields.findIndex((cF) => { throw new Error("STUB"); }),
            1,
        );
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async exists(key: string): Promise<boolean> {
        return this.contextFields.some((cF) => { throw new Error("STUB"); });
    }

    async get(key: string): Promise<IContextField> {
        const contextField = this.contextFields.find((cF) => { throw new Error("STUB"); });
        if (contextField) {
            return contextField;
        }
        throw new NotFoundError(
            `Could not find contextField with name : ${key}`,
        );
    }

    async getAll(): Promise<IContextField[]> {
        return this.contextFields;
    }

    async update(data: IContextFieldDto): Promise<IContextField> {
        await this.delete(data.name);
        return this.create(data);
    }
}
