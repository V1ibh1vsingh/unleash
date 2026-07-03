import type { ITagType, ITagTypeStore } from './tag-type-store-type.js';

import { NotFoundError } from '../../error/index.js';

export default class FakeTagTypeStore implements ITagTypeStore {
    tagTypes: ITagType[] = [];

    async bulkImport(tagTypes: ITagType[]): Promise<ITagType[]> {
        throw new Error("STUB");
    }

    async createTagType(newTagType: ITagType): Promise<void> {
        this.tagTypes.push(newTagType);
    }

    async delete(key: string): Promise<void> {
        this.tagTypes.splice(
            this.tagTypes.findIndex((tt) => { throw new Error("STUB"); }),
            1,
        );
    }

    async deleteAll(): Promise<void> {
        throw new Error("STUB");
    }

    destroy(): void {}

    async exists(key: string): Promise<boolean> {
        return this.tagTypes.some((t) => { throw new Error("STUB"); });
    }

    async get(key: string): Promise<ITagType> {
        const tagType = this.tagTypes.find((t) => { throw new Error("STUB"); });
        if (tagType) {
            return tagType;
        }
        throw new NotFoundError('Could not find tag type');
    }

    async getAll(): Promise<ITagType[]> {
        return this.tagTypes;
    }

    async updateTagType(tagType: ITagType): Promise<void> {
        throw new Error("STUB");
    }
}
