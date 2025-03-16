<template>
    <div class="water-intake-chart">
        <apexchart
            v-if="waterData.length > 0"
            type="bar"
            height="300"
            :options="chartOptions"
            :series="series"
        />

        <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-2"
            icon="mdi-water"
            text="No water intake data available for the selected period"
        ></v-alert>

        <div class="d-flex flex-wrap justify-space-between align-center mt-2">
            <div>
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
                    v-model.number="waterGoal"
                    hide-details
                    density="compact"
                    variant="outlined"
                    label="Water Goal (ml)"
                    type="number"
                    min="500"
                    max="5000"
                    step="100"
                    style="max-width: 150px"
                    class="water-goal-input"
                    @update:model-value="updateChartOptions"
                ></v-text-field>
            </div>
        </div>

        <div class="d-flex flex-wrap mt-4">
            <v-card variant="outlined" class="stat-card mx-2 mb-2">
                <v-card-text class="d-flex flex-column align-center pa-2">
                    <div class="text-caption text-medium-emphasis">Daily Average</div>
                    <div class="text-h6 font-weight-bold">{{ formatNumber(avgWater) }}</div>
                    <div class="text-caption">ml</div>
                </v-card-text>
            </v-card>

            <v-card variant="outlined" class="stat-card mx-2 mb-2">
                <v-card-text class="d-flex flex-column align-center pa-2">
                    <div class="text-caption text-medium-emphasis">Goal Achievement</div>
                    <div class="text-h6 font-weight-bold">{{ goalSuccessRate }}%</div>
                    <div class="text-caption">of days</div>
                </v-card-text>
            </v-card>

            <v-card variant="outlined" class="stat-card mx-2 mb-2">
                <v-card-text class="d-flex flex-column align-center pa-2">
                    <div class="text-caption text-medium-emphasis">Consistency</div>
                    <div class="text-h6 font-weight-bold">{{ consistency }}%</div>
                    <div class="text-caption">tracked days</div>
                </v-card-text>
            </v-card>

            <v-card variant="outlined" class="stat-card mx-2 mb-2">
                <v-card-text class="d-flex flex-column align-center pa-2">
                    <div class="text-caption text-medium-emphasis">Total Volume</div>
                    <div class="text-h6 font-weight-bold">{{ (totalWater / 1000).toFixed(1) }}</div>
                    <div class="text-caption">liters</div>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from "apexcharts";

import { computed, ref, watch } from "vue";

import type { HealthMetrics } from "../../../types/health-metrics";

import { formatFullDate, getDaysBetween } from "../../../helpers/date-utils";
import { CHART_COLORS } from "../colors";

const props = defineProps<{
    bodyData: HealthMetrics[];
}>();

const showGoalLine = ref(true);
const waterGoal = ref(2500);

const waterData = computed(() => {
    return props.bodyData
        .filter((day) => day.waterIntake !== undefined)
        .map((day) => ({
            date: day.date.toDate(),
            dateString: day.dateString,
            waterIntake: day.waterIntake,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
});

const avgWater = computed(() => {
    if (waterData.value.length === 0) return 0;
    const total = waterData.value.reduce((sum, day) => sum + day.waterIntake, 0);
    return Math.round(total / waterData.value.length);
});

const goalSuccessRate = computed(() => {
    if (waterData.value.length === 0) return 0;
    const daysMetGoal = waterData.value.filter((day) => day.waterIntake >= waterGoal.value).length;
    return Math.round((daysMetGoal / waterData.value.length) * 100);
});

const consistency = computed(() => {
    if (waterData.value.length < 2) return 100;

    const firstDate = waterData.value[0].date;
    const lastDate = waterData.value[waterData.value.length - 1].date;
    const dayDiff = getDaysBetween(firstDate, lastDate) + 1;

    return Math.round((waterData.value.length / dayDiff) * 100);
});

const totalWater = computed(() => {
    return waterData.value.reduce((sum, day) => sum + day.waterIntake, 0);
});

const series = computed(() => {
    return [
        {
            data: waterData.value.map((day) => ({
                goalMet: day.waterIntake >= waterGoal.value,
                x: day.date.getTime(),
                y: day.waterIntake,
            })),
            name: "Water Intake",
        },
    ];
});

const chartOptions = ref<ApexOptions>({
    annotations: {
        yaxis: [],
    },
    chart: {
        background: "transparent",
        fontFamily: "inherit",
        foreColor: CHART_COLORS.text,
        id: "water-intake-chart",
        toolbar: {
            show: false,
        },
        type: "bar",
        zoom: {
            enabled: false,
        },
    },
    colors: [CHART_COLORS.primary],
    dataLabels: {
        enabled: false,
    },
    fill: {
        gradient: {
            gradientToColors: ["#03A9F4"],
            inverseColors: false,
            opacityFrom: 0.85,
            opacityTo: 0.65,
            shade: "dark",
            shadeIntensity: 0.2,
            stops: [0, 100],
            type: "vertical",
        },
        type: "gradient",
    },
    grid: {
        borderColor: CHART_COLORS.border,
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
        show: false,
    },
    plotOptions: {
        bar: {
            borderRadius: 6,
            colors: {
                ranges: [
                    {
                        color: CHART_COLORS.primary,
                        from: 0,
                        to: 2499,
                    },
                    {
                        color: CHART_COLORS.success,
                        from: 2500,
                        to: 10_000,
                    },
                ],
            },
            columnWidth: "60%",
            dataLabels: {
                position: "top",
            },
            distributed: false,
        },
    },
    tooltip: {
        custom({ dataPointIndex, seriesIndex, w }: any) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const goalMet = data.goalMet;
            const color = goalMet ? CHART_COLORS.success : CHART_COLORS.primary;
            const iconColor = goalMet ? CHART_COLORS.success : CHART_COLORS.goal;
            const icon = goalMet ? "check-circle" : "alert-circle";

            return `
                <div class="apexcharts-tooltip-title" style="font-family: inherit; font-size: 12px; margin-bottom: 4px;">
                    ${formatFullDate(new Date(data.x))}
                </div>
                <div style="padding: 8px 10px; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; background-color: ${color};"></span>
                    <span style="font-weight: bold; margin-right: 8px;">${data.y.toLocaleString()} ml</span>
                    <span style="color: ${iconColor}; display: flex; align-items: center;">
                        <svg width="16" height="16" viewBox="0 0 24 24" style="margin-right: 4px;">
                            <path fill="${iconColor}" d="M${icon === "check-circle" ? "12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" : "13 13H11V7H13M13 17H11V15H13M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2Z"}"/>
                        </svg>
                        ${goalMet ? "Goal achieved" : `${Math.round((data.y / waterGoal.value) * 100)}% of goal`}
                    </span>
                </div>
            `;
        },
        theme: "dark",
        x: {
            format: "MMM dd, yyyy",
        },
        y: {
            formatter(value: number) {
                return `${value.toLocaleString()} ml`;
            },
        },
    },
    xaxis: {
        labels: {
            format: "MMM dd",
            style: {
                colors: CHART_COLORS.text,
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
                colors: CHART_COLORS.text,
            },
        },
        title: {
            style: {
                color: CHART_COLORS.text,
            },
            text: "Water Intake (ml)",
        },
    },
});

function toggleGoalLine(): void {
    showGoalLine.value = !showGoalLine.value;
    updateChartOptions();
}

watch([() => props.bodyData, waterGoal, showGoalLine], updateChartOptions);

function formatCompactNumber(value: number): string {
    if (value >= 1000) {
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
            to: waterGoal.value - 1,
        },
        {
            color: CHART_COLORS.success,
            from: waterGoal.value,
            to: 10_000,
        },
    ];

    const goalLineAnnotation = showGoalLine.value
        ? [
              {
                  borderColor: CHART_COLORS.goalBlue,
                  borderDash: [5, 5],
                  borderWidth: 2,
                  label: {
                      borderColor: CHART_COLORS.goalBlue,
                      position: "right",
                      style: {
                          background: CHART_COLORS.goalBlue,
                          color: CHART_COLORS.text,
                      },
                      text: `Goal: ${formatCompactNumber(waterGoal.value)}`,
                  },
                  y: waterGoal.value,
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
.water-intake-chart {
    width: 100%;
}

.stat-card {
    flex: 1;
    min-width: 100px;
    background-color: #27293d;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.stat-card:hover {
    background-color: #2d2f44;
}

@media (max-width: 600px) {
    .water-goal-input {
        width: 100%;
    }

    .stat-card {
        min-width: calc(50% - 16px);
    }
}
</style>
