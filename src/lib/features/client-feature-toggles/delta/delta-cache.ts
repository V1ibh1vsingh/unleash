import type { DeltaEvent } from './client-feature-toggle-delta.js';
import {
    DELTA_EVENT_TYPES,
    type DeltaHydrationEvent,
} from './client-feature-toggle-delta-types.js';

export class DeltaCache {
    private events: DeltaEvent[] = [];
    private maxLength: number;
    private hydrationEvent: DeltaHydrationEvent;

    constructor(hydrationEvent: DeltaHydrationEvent, maxLength: number = 20) {
        throw new Error("STUB");
    }

    private addBaseEventFromHydration(
        hydrationEvent: DeltaHydrationEvent,
    ): void {
        throw new Error("STUB");
    }

    public addEvents(events: DeltaEvent[]): void {
        throw new Error("STUB");
    }

    public getEvents(): DeltaEvent[] {
        return this.events;
    }

    public isMissingRevision(revisionId: number): boolean {
        throw new Error("STUB");
    }

    public getHydrationEvent(): DeltaHydrationEvent {
        throw new Error("STUB");
    }

    private updateHydrationEvent(events: DeltaEvent[]): void {
        throw new Error("STUB");
    }

    private sortHydrationEvent(): void {
        throw new Error("STUB");
    }
}
