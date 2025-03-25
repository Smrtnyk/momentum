<template>
    <div class="weight-progress-chart">
        <apexchart type="line" height="300" :options="chartOptions" :series="series"></apexchart>

        <div class="d-flex flex-wrap justify-space-between align-center mt-2">
            <div class="chart-stats d-flex">
                <div class="stat-item mr-4" v-if="startWeight">
                    <div class="text-caption text-medium-emphasis">Starting</div>
                    <div class="text-subtitle-1 font-weight-bold">
                        {{ startWeight.toFixed(1) }} kg
                    </div>
                </div>
                <div class="stat-item mr-4" v-if="currentWeight">
                    <div class="text-caption text-medium-emphasis">Current</div>
                    <div class="text-subtitle-1 font-weight-bold">
                        {{ currentWeight.toFixed(1) }} kg
                    </div>
                </div>
                <div class="stat-item" v-if="weightChange !== 0">
                    <div class="text-caption text-medium-emphasis">Change</div>
                    <div class="text-subtitle-1 font-weight-bold" :class="weightChangeClass">
                        {{ weightChange > 0 ? "+" : "" }}{{ weightChange }} kg
                    </div>
                </div>
            </div>

            <div>
                <v-checkbox
                    v-model="showTrendline"
                    label="Show Trend"
                    color="primary"
                    hide-details
                    density="compact"
                    @change="updateChartOptions"
                ></v-checkbox>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from "apexcharts";

import { isNotNil } from "es-toolkit";
import { computed, ref, watch } from "vue";

import type { HealthMetrics } from "../../../types/health-metrics";

import { ONE_DAY } from "../../../helpers/date-utils";

const props = defineProps<{
    bodyData: HealthMetrics[];
}>();

const showTrendline = ref(true);

const weightData = computed(() => {
    return props.bodyData
        .filter((day) => isNotNil(day.weight))
        .map((day) => ({
            date: day.date.toDate(),
            dateString: day.dateString,
            weight: day.weight,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
});

const startWeight = computed(() => {
    const data = weightData.value;
    return data.length > 0 ? data[0].weight : null;
});

const currentWeight = computed(() => {
    const data = weightData.value;
    return data.length > 0 ? data[data.length - 1].weight : null;
});

const weightChange = computed(() => {
    if (!startWeight.value || !currentWeight.value) return 0;
    return Number((currentWeight.value - startWeight.value).toFixed(1));
});

const weightChangeClass = computed(() => {
    if (weightChange.value < 0) return "text-success";
    if (weightChange.value > 0) return "text-error";
    return "";
});

const trendLineData = computed(() => {
    if (!showTrendline.value || weightData.value.length < 2) return [];

    const data = weightData.value;
    const n = data.length;

    // Use reference time to avoid numerical issues with large timestamps
    const referenceTime = data[0].date.getTime();

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < n; i++) {
        // Convert to days since first measurement
        const x = (data[i].date.getTime() - referenceTime) / ONE_DAY;
        const y = data[i].weight ?? 0;

        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    }

    // Avoid division by zero
    if (sumX2 === (sumX * sumX) / n) return [];

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate weekly rate of change for weight
    const weeklyChange = slope * 7;

    // Calculate trend line endpoints
    // At x=0 (day 0)
    const firstY = intercept;
    const lastX = (data[n - 1].date.getTime() - referenceTime) / ONE_DAY;
    const lastY = intercept + slope * lastX;

    return [
        {
            meta: weeklyChange,
            x: data[0].date.getTime(),
            y: firstY,
        },
        {
            meta: weeklyChange,
            x: data[n - 1].date.getTime(),
            y: lastY,
        },
    ];
});

const series = computed(() => {
    const result = [
        {
            data: weightData.value.map((day) => ({
                x: day.date.getTime(),
                y: day.weight,
            })),
            name: "Weight",
        },
    ];

    if (showTrendline.value && trendLineData.value.length > 0) {
        result.push({
            data: trendLineData.value,
            name: "Trend",
        });
    }

    return result;
});

const chartOptions = ref<ApexOptions>({
    annotations: {
        yaxis: [],
    },
    chart: {
        background: "transparent",
        fontFamily: "inherit",
        foreColor: "#E0E0E0",
        id: "weight-chart",
        toolbar: {
            show: false,
        },
        type: "line",
        zoom: {
            enabled: false,
        },
    },
    colors: ["#7B1FA2", "#FF4081"],
    dataLabels: {
        enabled: false,
    },
    fill: {
        gradient: {
            opacityFrom: 0.5,
            opacityTo: 0.1,
            shade: "dark",
            shadeIntensity: 0.2,
            stops: [0, 100],
            type: "vertical",
        },
        type: "gradient",
    },
    grid: {
        borderColor: "#383853",
        strokeDashArray: 4,
        xaxis: {
            lines: {
                show: true,
            },
        },
        yaxis: {
            lines: {
                show: true,
            },
        },
    },
    legend: {
        horizontalAlign: "right",
        labels: {
            colors: "#E0E0E0",
        },
        position: "top",
    },
    markers: {
        hover: {
            size: 7,
        },
        size: 5,
    },
    stroke: {
        curve: "smooth",
        dashArray: [0, 5],
        width: [3, 2],
    },
    tooltip: {
        theme: "dark",
        x: {
            format: "MMM dd, yyyy",
        },
        y: {
            formatter(value: number) {
                return `${value.toFixed(1)} kg`;
            },
        },
    },
    xaxis: {
        labels: {
            format: "MMM dd",
            style: {
                colors: "#E0E0E0",
            },
        },
        tooltip: {
            enabled: false,
        },
        type: "datetime",
    },
    yaxis: {
        labels: {
            formatter(value: number) {
                return value.toFixed(1);
            },
            style: {
                colors: "#E0E0E0",
            },
        },
        title: {
            style: {
                color: "#E0E0E0",
            },
            text: "Weight (kg)",
        },
    },
});

watch([() => props.bodyData, showTrendline], () => {
    updateChartOptions();
});

function updateChartOptions(): void {
    // Calculate week by week weight loss rate if trendline is visible
    let trendAnnotation = null;

    if (showTrendline.value && trendLineData.value.length > 0) {
        // Extract weekly rate directly from trend data
        const weeklyRate = trendLineData.value[0].meta;

        if (Math.abs(weeklyRate) >= 0.1) {
            trendAnnotation = {
                borderColor: "#FF4081",
                label: {
                    borderColor: "#FF4081",
                    style: {
                        background: "#FF4081",
                        color: "#fff",
                    },
                    text: `${weeklyRate > 0 ? "+" : ""}${weeklyRate.toFixed(2)} kg/week`,
                },
                y: trendLineData.value[1].y,
            };
        }
    }

    chartOptions.value = {
        ...chartOptions.value,
        annotations: {
            yaxis: trendAnnotation ? [trendAnnotation] : [],
        },
    };
}
</script>

<style scoped>
.weight-progress-chart {
    width: 100%;
}

.stat-item {
    min-width: 80px;
}

@media (max-width: 600px) {
    .chart-stats {
        margin-bottom: 16px;
    }
}
</style>
