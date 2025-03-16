<template>
    <div class="step-count-chart">
        <apexchart
            v-if="stepsData.length > 0"
            type="bar"
            height="300"
            :options="chartOptions"
            :series="series"
        ></apexchart>

        <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-2"
            icon="mdi-shoe-print"
            text="No step data available for the selected period"
        ></v-alert>

        <div class="d-flex flex-wrap justify-space-between align-center mt-2">
            <div class="d-flex gap-2">
                <v-chip
                    :color="showWeeklyAverage ? 'primary' : undefined"
                    variant="outlined"
                    size="small"
                    @click="toggleWeeklyAverage"
                >
                    <v-icon start size="small">mdi-chart-line</v-icon>
                    Weekly Average
                </v-chip>

                <v-chip
                    :color="showGoalLine ? 'primary' : undefined"
                    variant="outlined"
                    size="small"
                    @click="toggleGoalLine"
                >
                    <v-icon start size="small">mdi-flag</v-icon>
                    Goal Line
                </v-chip>
            </div>

            <div class="mt-2 mt-sm-0">
                <v-text-field
                    v-model.number="stepGoal"
                    hide-details
                    density="compact"
                    variant="outlined"
                    label="Step Goal"
                    type="number"
                    min="1000"
                    max="50000"
                    step="1000"
                    style="max-width: 150px"
                    class="step-goal-input"
                    @update:model-value="updateChartOptions"
                ></v-text-field>
            </div>
        </div>

        <div class="d-flex flex-wrap mt-4">
            <v-card variant="outlined" class="stat-card mx-2 mb-2">
                <v-card-text class="d-flex flex-column align-center pa-2">
                    <div class="text-caption text-medium-emphasis">Daily Average</div>
                    <div class="text-h6 font-weight-bold">{{ formatNumber(avgSteps) }}</div>
                    <div class="text-caption">steps</div>
                </v-card-text>
            </v-card>

            <v-card variant="outlined" class="stat-card mx-2 mb-2">
                <v-card-text class="d-flex flex-column align-center pa-2">
                    <div class="text-caption text-medium-emphasis">Week Highest</div>
                    <div class="text-h6 font-weight-bold">{{ formatNumber(maxSteps) }}</div>
                    <div class="text-caption">steps</div>
                </v-card-text>
            </v-card>

            <v-card variant="outlined" class="stat-card mx-2 mb-2">
                <v-card-text class="d-flex flex-column align-center pa-2">
                    <div class="text-caption text-medium-emphasis">Goal Success</div>
                    <div class="text-h6 font-weight-bold">{{ goalSuccessRate }}%</div>
                    <div class="text-caption">of days</div>
                </v-card-text>
            </v-card>

            <v-card variant="outlined" class="stat-card mx-2 mb-2">
                <v-card-text class="d-flex flex-column align-center pa-2">
                    <div class="text-caption text-medium-emphasis">Total Distance</div>
                    <div class="text-h6 font-weight-bold">{{ totalDistance }}</div>
                    <div class="text-caption text-center text-medium-emphasis mt-1">
                        Distance estimated based on your height{{
                            authStore.userProfile?.height ? "" : " (using average stride length)"
                        }}
                    </div>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from "apexcharts";

import { computed, ref, watch } from "vue";

import type { HealthMetrics } from "../../../types/health-metrics";

interface AverageChartDataPoint {
    x: number;
    y: number;
}

interface ChartSeries {
    data: AverageChartDataPoint[] | StepChartDataPoint[];
    name: string;
    type: string;
}

interface StepChartDataPoint {
    goalMet: boolean;
    x: number;
    y: number;
}

interface StepDataPoint {
    date: Date;
    dateString: string;
    steps: number;
}

const props = defineProps<{
    bodyData: HealthMetrics[];
}>();

const showWeeklyAverage = ref(true);
const showGoalLine = ref(true);
const stepGoal = ref(10_000);

const stepsData = computed<StepDataPoint[]>(() => {
    return props.bodyData
        .filter((day) => day.steps !== undefined && day.steps > 0)
        .map((day) => ({
            date: day.date.toDate(),
            dateString: day.dateString,
            steps: day.steps as number,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
});

const avgSteps = computed(() => {
    if (stepsData.value.length === 0) return 0;
    const total = stepsData.value.reduce((sum, day) => sum + day.steps, 0);
    return Math.round(total / stepsData.value.length);
});

const maxSteps = computed(() => getMaxValue(stepsData.value, (day) => day.steps));

const goalSuccessRate = computed(() => {
    if (stepsData.value.length === 0) return 0;
    const daysMetGoal = stepsData.value.filter((day) => day.steps >= stepGoal.value).length;
    return Math.round((daysMetGoal / stepsData.value.length) * 100);
});

import { useAuthStore } from "../../../stores/auth";
import { CHART_COLORS } from "../colors";
import { calculateMovingAverage, getMaxValue } from "../metric-utils";
import { getLineChartStyleOptions } from "./chart-options";

const authStore = useAuthStore();

const totalDistance = computed(() => {
    const totalSteps = stepsData.value.reduce((sum, day) => sum + day.steps, 0);

    // Calculate stride length based on user height and gender
    // Default fallback
    let strideLength = 0.762;

    if (authStore.userProfile) {
        const height = authStore.userProfile.height;
        const gender = authStore.userProfile.gender;

        if (height) {
            if (gender === "Male") {
                // For men: height (cm) * 0.415 / 100 (to convert to meters)
                strideLength = (height * 0.415) / 100;
            } else {
                // For women: height (cm) * 0.413 / 100 (to convert to meters)
                strideLength = (height * 0.413) / 100;
            }
        }
    }

    const distanceInMeters = totalSteps * strideLength;
    // Convert to km
    return Number(distanceInMeters / 1000).toFixed(2);
});

const movingAverageData = computed(() =>
    calculateMovingAverage(stepsData.value, (day) => day.steps, 7),
);

const series = computed<ChartSeries[]>(() => {
    const stepsChartData: StepChartDataPoint[] = stepsData.value.map((day) => ({
        goalMet: day.steps >= stepGoal.value,
        x: day.date.getTime(),
        y: day.steps,
    }));

    const mainSeries: ChartSeries = {
        data: stepsChartData,
        name: "Steps",
        type: "column",
    };

    const result: ChartSeries[] = [mainSeries];

    if (showWeeklyAverage.value && movingAverageData.value.length > 0) {
        const averageSeries: ChartSeries = {
            data: movingAverageData.value,
            name: "7-Day Average",
            type: "line",
        };
        result.push(averageSeries);
    }

    return result;
});

const chartOptions = ref<ApexOptions>({
    annotations: {
        yaxis: [],
    },
    chart: getLineChartStyleOptions("steps-chart"),
    colors: ["#2196F3", "#9C27B0"],
    dataLabels: {
        enabled: false,
    },
    fill: {
        gradient: {
            opacityFrom: 0.7,
            opacityTo: 0.2,
            shade: "dark",
            shadeIntensity: 0.5,
            stops: [0, 100],
            type: "vertical",
        },
        type: ["solid", "gradient"],
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
    plotOptions: {
        bar: {
            borderRadius: 3,
            colors: {
                ranges: [
                    {
                        color: "#2196F3",
                        from: 0,
                        to: 10_000,
                    },
                ],
            },
            columnWidth: "60%",
        },
    },

    states: {
        hover: {
            filter: {
                type: "darken",
            },
        },
    },
    stroke: {
        curve: "smooth",
        width: [0, 3],
    },
    tooltip: {
        intersect: true,
        shared: false,
        theme: "dark",
        x: {
            format: "MMM dd, yyyy",
        },
        y: {
            formatter(value: number) {
                return `${value.toLocaleString()} steps`;
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
                return formatCompactNumber(value);
            },
            style: {
                colors: "#E0E0E0",
            },
        },
        title: {
            style: {
                color: "#E0E0E0",
            },
            text: "Steps",
        },
    },
});

function toggleGoalLine(): void {
    showGoalLine.value = !showGoalLine.value;
    updateChartOptions();
}

function toggleWeeklyAverage(): void {
    showWeeklyAverage.value = !showWeeklyAverage.value;
    updateChartOptions();
}

watch(() => props.bodyData, updateChartOptions);

function formatCompactNumber(value: number): string {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
}

function formatNumber(value: number): string {
    return value.toLocaleString();
}

function updateChartOptions(): void {
    const goalRanges = [
        {
            color: CHART_COLORS.primary,
            from: 0,
            to: stepGoal.value - 1,
        },
        {
            color: CHART_COLORS.success,
            from: stepGoal.value,
            to: 100_000,
        },
    ];

    const goalLineAnnotation = showGoalLine.value
        ? [
              {
                  borderColor: CHART_COLORS.goal,
                  borderDash: [5, 5],
                  borderWidth: 2,
                  label: {
                      borderColor: CHART_COLORS.goal,
                      position: "right",
                      style: {
                          background: CHART_COLORS.goal,
                          color: CHART_COLORS.text,
                      },
                      text: `Goal: ${formatCompactNumber(stepGoal.value)}`,
                  },
                  y: stepGoal.value,
              },
          ]
        : [];

    chartOptions.value = {
        ...chartOptions.value,
        annotations: {
            yaxis: goalLineAnnotation,
        },
        plotOptions: {
            ...chartOptions.value.plotOptions,
            bar: {
                ...chartOptions.value.plotOptions?.bar,
                colors: {
                    ranges: goalRanges,
                },
            },
        },
    };
}
</script>

<style scoped>
.step-count-chart {
    width: 100%;
}

.gap-2 {
    gap: 8px;
}

.stat-card {
    flex: 1;
    min-width: 100px;
    background-color: v-bind("CHART_COLORS.cardBackground");
    border-radius: 8px;
    transition: all 0.2s ease;
}

.stat-card:hover {
    background-color: v-bind("CHART_COLORS.hoverBackground");
}

@media (max-width: 600px) {
    .step-goal-input {
        width: 100%;
    }

    .stat-card {
        min-width: calc(50% - 16px);
    }
}
</style>
