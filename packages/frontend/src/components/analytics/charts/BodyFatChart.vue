<template>
    <div class="body-fat-chart">
        <apexchart
            v-if="hasData"
            type="line"
            height="300"
            :options="computedChartOptions"
            :series="series"
        ></apexchart>

        <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-2"
            icon="mdi-percent"
            text="No body fat data available for the selected period"
        ></v-alert>

        <div v-if="hasData && methods.length > 0" class="d-flex justify-center flex-wrap mt-4">
            <v-chip
                v-for="method in methods"
                :key="method"
                :color="getMethodColor(method)"
                size="small"
                variant="outlined"
                class="mx-1 mb-2"
            >
                <v-icon start size="x-small" :icon="getMethodIcon(method)"></v-icon>
                {{ method }}
            </v-chip>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isNotNil } from "es-toolkit";
import { computed, ref } from "vue";

import type { HealthMetrics } from "../../../types/health-metrics";

import { useAuthStore } from "../../../stores/auth";
import { CHART_COLORS } from "../colors";
import { calculateTrendLine } from "../metric-utils";

interface BodyFatDataPoint {
    date: Date;
    dateString: string;
    method: null | string;
    percentage: number;
}

interface ChartDataPoint {
    meta?: number;
    method?: null | string;
    x: number;
    y: number;
}

interface ChartSeries {
    data: ChartDataPoint[];
    name: string;
}

const props = defineProps<{
    bodyData: HealthMetrics[];
}>();

const authStore = useAuthStore();

const { bodyFatCategories: bfCatColors, border, text } = CHART_COLORS;

const bodyFatCategories = {
    Female: {
        athletic: { color: bfCatColors.athletic, label: "Athletic", max: 20, min: 14 },
        average: { color: bfCatColors.average, label: "Average", max: 31, min: 25 },
        essential: { color: bfCatColors.essential, label: "Essential Fat", max: 13, min: 10 },
        fitness: { color: bfCatColors.fitness, label: "Fitness", max: 24, min: 21 },
        obese: { color: bfCatColors.obese, label: "Obese", max: 50, min: 39 },
        overweight: { color: bfCatColors.overweight, label: "Overweight", max: 38, min: 32 },
    },
    Male: {
        athletic: { color: bfCatColors.athletic, label: "Athletic", max: 13, min: 6 },
        average: { color: bfCatColors.average, label: "Average", max: 24, min: 18 },
        essential: { color: bfCatColors.essential, label: "Essential Fat", max: 5, min: 2 },
        fitness: { color: bfCatColors.fitness, label: "Fitness", max: 17, min: 14 },
        obese: { color: bfCatColors.obese, label: "Obese", max: 50, min: 31 },
        overweight: { color: bfCatColors.overweight, label: "Overweight", max: 30, min: 25 },
    },
};

const userCategories = computed(() => {
    const gender = authStore.userProfile?.gender ?? "Male";
    return bodyFatCategories[gender];
});

const bodyFatData = computed<BodyFatDataPoint[]>(() => {
    return props.bodyData
        .filter((day) => isNotNil(day.bodyFat))
        .map((day) => ({
            date: day.date.toDate(),
            dateString: day.dateString,
            method: day.bodyFat?.method ?? null,
            percentage: day.bodyFat?.percentage ?? 0,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
});

const hasData = computed(() => bodyFatData.value.length > 0);

const chartAnnotations = computed(() => {
    if (!hasData.value) return [];

    // Get min and max body fat from data to determine which categories to show
    const minBodyFat = Math.max(2, Math.min(...bodyFatData.value.map((d) => d.percentage)) - 5);
    const maxBodyFat = Math.min(50, Math.max(...bodyFatData.value.map((d) => d.percentage)) + 5);

    const annotations = [];

    for (const category of Object.values(userCategories.value)) {
        // Only show categories that overlap with our visible range
        if (category.max >= minBodyFat && category.min <= maxBodyFat) {
            annotations.push({
                borderColor: category.color,
                fillColor: category.color,
                label: {
                    borderColor: category.color,
                    style: {
                        background: category.color,
                        color: text,
                    },
                    text: category.label,
                },
                opacity: 0.1,
                y: category.min,
                y2: category.max,
            });
        }
    }

    return annotations;
});

const methods = computed<string[]>(() => {
    if (!hasData.value) return [];

    const methodSet = new Set<string>();

    bodyFatData.value.forEach((entry) => {
        if (entry.method) {
            methodSet.add(entry.method);
        }
    });

    return Array.from(methodSet);
});

const trendLineData = computed(() => {
    if (!hasData.value || bodyFatData.value.length < 3) return [];

    const trendPoints = calculateTrendLine(
        bodyFatData.value,
        (day) => day.percentage,
        (day) => day.date.getTime(),
    );

    return [
        {
            data: trendPoints,
            name: "Trend",
        },
    ];
});

const series = computed<ChartSeries[]>(() => {
    if (!hasData.value) {
        return [];
    }

    const mainSeries: ChartSeries[] = [
        {
            data: bodyFatData.value.map((entry) => ({
                method: entry.method,
                x: entry.date.getTime(),
                y: entry.percentage,
            })),
            name: "Body Fat",
        },
    ];

    if (trendLineData.value.length > 0) {
        mainSeries.push(trendLineData.value[0]);
    }

    return mainSeries;
});

const methodColors: Record<string, string> = {
    bioelectrical: "#E91E63",
    caliper: "#9C27B0",
    dexa: "#673AB7",
    navy: "#3F51B5",
    scale: "#2196F3",
    visual: "#00BCD4",
};

const baseChartOptions = ref({
    chart: {
        background: "transparent",
        fontFamily: "inherit",
        foreColor: text,
        id: "body-fat-chart",
        toolbar: {
            show: false,
        },
        type: "line",
        zoom: {
            enabled: false,
        },
    },
    colors: ["#7B1FA2", "#FF9800"],
    dataLabels: {
        enabled: false,
    },
    fill: {
        gradient: {
            opacityFrom: 0.7,
            opacityTo: 0.2,
            shade: "dark",
            shadeIntensity: 0.5,
            stops: [0, 90, 100],
            type: "vertical",
        },
        type: ["gradient", "solid"],
    },
    grid: {
        borderColor: border,
        strokeDashArray: 4,
        xaxis: {
            lines: {
                show: true,
            },
        },
    },
    legend: {
        horizontalAlign: "right",
        labels: {
            colors: text,
        },
        position: "top",
    },
    markers: {
        discrete: [
            {
                fillColor({ dataPointIndex, seriesIndex, w }: any) {
                    const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
                    if (!dataPoint.method) return "#7B1FA2";

                    return methodColors[dataPoint.method.toLowerCase()] ?? "#7B1FA2";
                },
                seriesIndex: 0,
                strokeColor: "#FFFFFF",
            },
        ],
        hover: {
            size: 8,
        },
        size: [6, 0],
        strokeWidth: 2,
    },
    stroke: {
        curve: "smooth",
        dashArray: [0, 5],
        width: [3, 2],
    },
    tooltip: {
        intersect: true,
        shared: false,
        theme: "dark",
        x: {
            format: "MMM dd, yyyy",
        },
        y: [
            {
                formatter(val: number, { dataPointIndex, seriesIndex, w }: any) {
                    if (seriesIndex === 0) {
                        const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
                        let methodStr = "";
                        if (dataPoint.method) {
                            methodStr = ` (${dataPoint.method})`;
                        }
                        return `${val.toFixed(1)}%${methodStr}`;
                    }
                    return `${val.toFixed(1)}%`;
                },
            },
            {
                formatter(val: number, { dataPointIndex, seriesIndex, w }: any) {
                    const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
                    const changePerWeek = dataPoint.meta;
                    const sign = changePerWeek >= 0 ? "+" : "";
                    return `Trend: ${sign}${changePerWeek.toFixed(2)}% per week`;
                },
            },
        ],
    },
    xaxis: {
        labels: {
            format: "MMM dd",
            style: {
                colors: "#E0E0E0",
            },
        },
        type: "datetime",
    },
    yaxis: {
        decimalsInFloat: 1,
        forceNiceScale: true,
        labels: {
            formatter(val: number) {
                return `${val.toFixed(1)}%`;
            },
            style: {
                colors: "#E0E0E0",
            },
        },
        title: {
            style: {
                color: "#E0E0E0",
            },
            text: "Body Fat (%)",
        },
    },
});

const computedChartOptions = computed(() => {
    const options = JSON.parse(JSON.stringify(baseChartOptions.value));

    options.annotations = {
        yaxis: chartAnnotations.value,
    };

    if (hasData.value) {
        const minBodyFat = Math.max(0, Math.min(...bodyFatData.value.map((d) => d.percentage)) - 2);
        const maxBodyFat = Math.min(
            50,
            Math.max(...bodyFatData.value.map((d) => d.percentage)) + 5,
        );

        options.yaxis = {
            ...options.yaxis,
            max: maxBodyFat,
            min: minBodyFat,
        };
    }

    return options;
});

function getMethodColor(method: string): string {
    const color = methodColors[method.toLowerCase()];
    return color ? color.replace("#", "") : "purple";
}

function getMethodIcon(method: string): string {
    switch (method.toLowerCase()) {
        case "bioelectrical":
            return "mdi-lightning-bolt";
        case "caliper":
            return "mdi-pinch";
        case "dexa":
            return "mdi-radioactive";
        case "navy":
            return "mdi-tape-measure";
        case "scale":
            return "mdi-scale-bathroom";
        case "visual":
            return "mdi-eye";
        default:
            return "mdi-help-circle";
    }
}
</script>

<style scoped>
.body-fat-chart {
    width: 100%;
}
</style>
