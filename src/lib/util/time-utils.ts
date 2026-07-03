import { endOfDay, startOfHour, subDays, subHours } from 'date-fns';

export interface HourBucket {
    timestamp: Date;
}

export function generateHourBuckets(hours: number): HourBucket[] {
    throw new Error("STUB");
}

// Generate last x days starting from end of yesterday
export function generateDayBuckets(days: number): HourBucket[] {
    throw new Error("STUB");
}
