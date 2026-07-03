import type { LastSeenInput } from './last-seen-service.js';
import type { ILastSeenStore } from './types/last-seen-store-type.js';

export class FakeLastSeenStore implements ILastSeenStore {
    setLastSeen(data: LastSeenInput[]): Promise<void> {
        throw new Error("STUB");
    }

    cleanLastSeen(): Promise<void> {
        throw new Error("STUB");
    }
}
