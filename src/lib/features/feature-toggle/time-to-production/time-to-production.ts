import { differenceInDays } from 'date-fns';
import type { ICreateEnabledDates } from '../../../types/stores/project-stats-store-type.js';

const calculateTimeToProdForFeatures = (
    items: ICreateEnabledDates[],
): number[] =>
    items.map((item) => { throw new Error("STUB"); });

export const calculateAverageTimeToProd = (
    items: ICreateEnabledDates[],
): number => {
    throw new Error("STUB");
};
