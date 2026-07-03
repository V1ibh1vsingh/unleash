import type EventEmitter from 'events';
import timer from './timer.js';

// wrapTimer keeps track of the timing of a async operation and emits
// a event on the given eventBus once the operation is complete
//
// the returned function is designed to stop the timer and emit the event
//
// Usage:
// Define the timer function. It can  be done once per class.
// this.timer = (action: string) =>
//     metricsHelper.wrapTimer(eventBus, DB_TIME, {
//         store: 'client-feature-toggle-read-model',
//         action,
//     });
//
// Before performing an operation, start the timer:
// const stopTimer = this.timer(`timer-name`);
// // perform operation and then stop timer
// stopTimer();

const wrapTimer = (
    eventBus: EventEmitter,
    event: string,
    args: Record<string, unknown> = {},
) => {
    throw new Error("STUB");
};

const metricsHelper = {
    wrapTimer,
};
export default metricsHelper;
