import type { ApexOptions } from "apexcharts";

export function getLineChartStyleOptions(id: string): NonNullable<ApexOptions["chart"]> {
    return {
        background: "transparent",
        fontFamily: "inherit",
        foreColor: "#E0E0E0",
        id,
        stacked: false,
        toolbar: {
            show: false,
        },
        type: "line",
        zoom: {
            enabled: false,
        },
    };
}
