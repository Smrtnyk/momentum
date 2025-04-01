<template>
    <div class="calories-time-chart">
        <div class="d-flex justify-space-between align-center mb-2">
            <v-chip-group v-model="selectedAggregation" mandatory>
                <v-chip size="small" value="auto">Auto</v-chip>
                <v-chip size="small" value="daily">Daily</v-chip>
                <v-chip size="small" value="weekly">Weekly</v-chip>
                <v-chip size="small" value="monthly">Monthly</v-chip>
            </v-chip-group>
        </div>

        <apexchart
            ref="chart"
            type="area"
            height="300"
            :options="chartOptions"
            :series="series"
            :key="`${showGoal ? 'with-goal' : 'without-goal'}-${selectedAggregation}`"
        />

        <div class="d-flex flex-wrap justify-space-between align-center mt-2">
            <div class="chart-stats d-flex">
                <div class="stat-item mr-4">
                    <div class="text-caption text-medium-emphasis">Avg. Daily</div>
                    <div class="text-subtitle-1 font-weight-bold">{{ avgCalories }} kcal</div>
                </div>
                <div class="stat-item mr-4">
                    <div class="text-caption text-medium-emphasis">Min</div>
                    <div class="text-subtitle-1 font-weight-bold">{{ minCalories }} kcal</div>
                </div>
                <div class="stat-item">
                    <div class="text-caption text-medium-emphasis">Max</div>
                    <div class="text-subtitle-1 font-weight-bold">{{ maxCalories }} kcal</div>
                </div>
            </div>

            <div>
                <v-checkbox
                    v-model="showGoal"
                    label="Show Goal"
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

import { useWindowSize } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";

import type { HealthMetrics } from "../../../types/health-metrics";
import type { AggregationMode } from "./chart-aggregation";

import { getMaxValue, getMinValue } from "../metric-utils";
import { aggregateTimeSeriesData, determineAggregationMode } from "./chart-aggregation";

const props = defineProps<{
    nutritionData: HealthMetrics[];
}>();

const showGoal = ref(true);
const selectedAggregation = ref<"auto" | AggregationMode>("auto");
const chart = ref<any>(null);
const { width } = useWindowSize();

const dailyCalories = computed(() => {
    return props.nutritionData
        .filter((day) => day.calories && day.calories.total > 0)
        .map((day) => ({
            date: day.date.toDate(),
            dateString: day.dateString,
            goal: day.calories?.goal ?? 0,
            total: day.calories?.total ?? 0,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
});

const dateRange = computed(() => {
    if (dailyCalories.value.length === 0) {
        return { endDate: new Date(), startDate: new Date() };
    }

    const startDate = dailyCalories.value[0].date;
    const endDate = dailyCalories.value[dailyCalories.value.length - 1].date;
    return { endDate, startDate };
});

const autoAggregationMode = computed(() => {
    return determineAggregationMode(dateRange.value.startDate, dateRange.value.endDate);
});

const effectiveAggregationMode = computed(() => {
    return selectedAggregation.value === "auto"
        ? autoAggregationMode.value
        : selectedAggregation.value;
});

const aggregatedCalories = computed(() => {
    return aggregateTimeSeriesData(dailyCalories.value, effectiveAggregationMode.value);
});

const avgCalories = computed(() => {
    if (dailyCalories.value.length === 0) return 0;
    const sum = dailyCalories.value.reduce((acc, day) => acc + day.total, 0);
    return Math.round(sum / dailyCalories.value.length);
});

const minCalories = computed(() => getMinValue(dailyCalories.value, (day) => day.total));
const maxCalories = computed(() => getMaxValue(dailyCalories.value, (day) => day.total));

const series = computed(() => {
    if (aggregatedCalories.value.length === 0) {
        return [{ data: [], name: "Calories" }];
    }

    return [
        {
            data: aggregatedCalories.value.map((point) => ({
                goals: [
                    {
                        name: "Goal",
                        strokeColor: "#4CAF50",
                        strokeHeight: 1,
                        value: point.avgGoal,
                    },
                ],
                max: point.maxTotal,
                min: point.minTotal,
                x: point.startDate.getTime(),
                y: point.avgTotal,
            })),
            name: "Calories",
        },
        showGoal.value
            ? {
                  data: aggregatedCalories.value.map((point) => ({
                      x: point.startDate.getTime(),
                      y: point.avgGoal,
                  })),
                  name: "Goal",
              }
            : undefined,
    ];
});

const chartOptions = ref<ApexOptions>({
    chart: {
        background: "transparent",
        fontFamily: "inherit",
        foreColor: "#E0E0E0",
        id: "calories-chart",
        toolbar: {
            autoSelected: "zoom",
            show: true,
            tools: {
                download: false,
                pan: true,
                reset: true,
                selection: false,
                zoomin: true,
                zoomout: true,
            },
        },
        type: "area",
        zoom: {
            autoScaleYaxis: true,
            enabled: true,
            type: "x",
        },
    },
    colors: ["#00BCD4", "#4CAF50"],
    dataLabels: {
        enabled: false,
    },
    fill: {
        gradient: {
            opacityFrom: 0.7,
            opacityTo: 0.2,
            shade: "dark",
            shadeIntensity: 0.3,
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
        horizontalAlign: "left",
        labels: {
            colors: "#E0E0E0",
        },
        position: "top",
    },
    markers: {
        hover: {
            size: 6,
        },
        size: 4,
    },
    stroke: {
        curve: "smooth",
        dashArray: [0, 5],
        width: [3, 2],
    },
    tooltip: {
        custom({ dataPointIndex, w }: any) {
            const dataPoint = w.config.series[0].data[dataPointIndex];

            if (effectiveAggregationMode.value === "daily" || !dataPoint.min) {
                return "";
            }

            const dateFormat = new Intl.DateTimeFormat("default", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });

            const startDate = new Date(dataPoint.x);
            const endDateObj = new Date(startDate);

            if (effectiveAggregationMode.value === "weekly") {
                endDateObj.setDate(endDateObj.getDate() + 6);
            } else {
                endDateObj.setDate(endDateObj.getDate() + 29);
            }

            return `
                <div class="custom-tooltip">
                    <div class="date-range">${dateFormat.format(startDate)} - ${dateFormat.format(endDateObj)}</div>
                    <div class="tooltip-row">
                        <span>Average:</span>
                        <span class="value">${dataPoint.y.toLocaleString()} kcal</span>
                    </div>
                    <div class="tooltip-row">
                        <span>Min:</span>
                        <span class="value">${dataPoint.min.toLocaleString()} kcal</span>
                    </div>
                    <div class="tooltip-row">
                        <span>Max:</span>
                        <span class="value">${dataPoint.max.toLocaleString()} kcal</span>
                    </div>
                </div>
            `;
        },
        theme: "dark",
        x: {
            format: "MMM dd, yyyy",
        },
        y: {
            formatter(value: number) {
                return `${value.toLocaleString()} kcal`;
            },
        },
    },
    xaxis: {
        labels: {
            datetimeUTC: false,
            format: "MMM dd",
            formatter(value, timestamp) {
                if (!timestamp) return "";

                const date = new Date(timestamp);
                if (effectiveAggregationMode.value === "daily") {
                    return date.toLocaleDateString("default", { day: "numeric", month: "short" });
                } else if (effectiveAggregationMode.value === "weekly") {
                    return `W${getWeekNumber(date)}`;
                }
                return date.toLocaleDateString("default", { month: "short", year: "numeric" });
            },
            style: {
                colors: "#E0E0E0",
            },
        },
        tickAmount: calculateOptimalTickAmount(),
        tooltip: {
            enabled: true,
        },
        type: "datetime",
    },
    yaxis: {
        labels: {
            formatter(value: number) {
                return value.toLocaleString();
            },
            style: {
                colors: "#E0E0E0",
            },
        },
        title: {
            style: {
                color: "#E0E0E0",
            },
            text: "Calories (kcal)",
        },
    },
});

watch([() => props.nutritionData, showGoal, selectedAggregation, width], () => {
    updateChartOptions();
});

onMounted(() => {
    if (dailyCalories.value.length > 0) {
        selectedAggregation.value = "auto";
    }
});

function calculateOptimalTickAmount(): number {
    const baseTickAmount = width.value < 600 ? 4 : 7;

    if (effectiveAggregationMode.value === "daily") {
        return Math.min(baseTickAmount, dailyCalories.value.length);
    }
    return Math.min(baseTickAmount, aggregatedCalories.value.length);
}

function getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86_400_000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function updateChartOptions(): void {
    chartOptions.value = {
        ...chartOptions.value,
        xaxis: {
            ...chartOptions.value.xaxis,
            tickAmount: calculateOptimalTickAmount(),
        },
    };
}
</script>

<style scoped>
.calories-time-chart {
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

:deep(.custom-tooltip) {
    background: #1e1e2d;
    border: 1px solid #2a2a3c;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 0.8rem;
}

:deep(.date-range) {
    font-weight: bold;
    margin-bottom: 4px;
    color: #00bcd4;
}

:deep(.tooltip-row) {
    display: flex;
    justify-content: space-between;
    margin: 2px 0;
}

:deep(.tooltip-row .value) {
    font-weight: bold;
    margin-left: 12px;
}
</style>
