export type ProductivityReportMetrics = {
    health: number;
    flagsCreated: number;
    productionUpdates: number;
    previousMonth: {
        health: number;
        flagsCreated: number;
        productionUpdates: number;
    } | null;
};

const RED = '#d93644';
const GREEN = '#68a611';
const ORANGE = '#d76500';

const ARROW_UP = '&#9650;';
const ARROW_DOWN = '&#9660;';

export const productivityReportViewModel = ({
    unleashUrl,
    userEmail,
    userName,
    metrics,
}: {
    unleashUrl: string;
    userEmail: string;
    userName: string;
    metrics: ProductivityReportMetrics;
}) => {
    throw new Error("STUB");
};
