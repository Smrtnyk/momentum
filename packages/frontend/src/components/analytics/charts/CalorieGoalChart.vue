<template>
    <div class="calorie-goal-chart">
        <apexchart
            v-if="hasData"
            type="line"
            height="300"
            :options="chartOptions"
            :series="series"
        ></apexchart>

        <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-2"
            icon="mdi-calories"
            text="No calorie data available for the selected period"
        ></v-alert>

        <div class="d-flex flex-wrap justify-space-between align-center mt-4">
            <div class="stat-card mx-2 mb-2">
                <div class="text-caption text-medium-emphasis">Avg. Daily Calorie Goal</div>
                <div class="text-h6 font-weight-bold">{{ formatNumber(avgGoal) }} kcal</div>
            </div>

            <div class="stat-card mx-2 mb-2">
                <div class="text-caption text-medium-emphasis">Avg. Success Rate</div>
                <v-progress-linear
                    :model-value="avgSuccessRate"
                    color="success"
                    height="6"
                    rounded
                    class="mt-1"
                >
                    <span class="font-weight-bold">{{ avgSuccessRate }}%</span>
                </v-progress-linear>
            </div>

            <div class="stat-card mx-2 mb-2">
                <div class="text-caption text-medium-emphasis">Days On Target</div>
                <div class="text-h6 font-weight-bold">{{ daysOnTarget }} / {{ totalDays }}</div>
            </div>

            <div class="stat-card mx-2 mb-2">
                <div class="text-caption text-medium-emphasis">Average Surplus/Deficit</div>
                <div
                    class="text-h6 font-weight-bold"
                    :class="avgDifference < 0 ? 'text-success' : 'text-error'"
                >
                    {{ avgDifference > 0 ? "+" : "" }}{{ formatNumber(avgDifference) }} kcal
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isNotNil } from "es-toolkit";
import { computed } from "vue";

import type { HealthMetrics } from "../../../types/health-metrics";

import { formatChartDate, formatDateWithDay } from "../../../helpers/date-utils";

const props = defineProps<{
    nutritionData: HealthMetrics[];
}>();

const processedData = computed(() => {
    const daysWithCalories = props.nutritionData.filter(hasDayCalories);

    daysWithCalories.sort((a, b) => a.date.toMillis() - b.date.toMillis());

    let totalGoal = 0;
    let totalDifference = 0;
    let daysOnTarget = 0;

    const successRates: number[] = [];

    daysWithCalories.forEach(function (day) {
        const goal = day.calories.goal;
        const actual = day.calories.total;

        const evaluation = evaluateGoalAchievement(actual, goal);
        totalGoal += goal;
        totalDifference += actual - goal;

        if (evaluation.isOnTarget) {
            daysOnTarget++;
        }

        successRates.push(evaluation.percentage);
    });

    return {
        avgDifference:
            daysWithCalories.length > 0 ? Math.round(totalDifference / daysWithCalories.length) : 0,
        avgGoal: daysWithCalories.length > 0 ? Math.round(totalGoal / daysWithCalories.length) : 0,
        avgSuccessRate:
            daysWithCalories.length > 0
                ? Math.round(
                      successRates.reduce((sum, rate) => sum + rate, 0) / daysWithCalories.length,
                  )
                : 0,
        daysOnTarget,
        daysWithCalories,
        totalDays: daysWithCalories.length,
    };
});

const hasData = computed(() => {
    return processedData.value.daysWithCalories.length > 0;
});

const avgGoal = computed(() => processedData.value.avgGoal);
const avgSuccessRate = computed(() => processedData.value.avgSuccessRate);
const daysOnTarget = computed(() => processedData.value.daysOnTarget);
const totalDays = computed(() => processedData.value.totalDays);
const avgDifference = computed(() => processedData.value.avgDifference);

const series = computed(() => {
    if (!hasData.value) {
        return [
            { data: [], name: "Calories", type: "column" },
            { data: [], name: "Goal", type: "line" },
        ];
    }

    const data = processedData.value.daysWithCalories;

    return [
        {
            data: data.map(function (day) {
                return {
                    goalMet:
                        Math.abs(day.calories.total - day.calories.goal) <= day.calories.goal * 0.1,
                    x: day.date.toDate().getTime(),
                    y: day.calories.total,
                };
            }),
            name: "Calories",
            type: "column",
        },
        {
            data: data.map((day) => ({
                x: day.date.toDate().getTime(),
                y: day.calories.goal,
            })),
            name: "Goal",
            type: "line",
        },
    ];
});

const colorCategories = computed(() => {
    if (!hasData.value) return [];

    const data = processedData.value.daysWithCalories;

    return data.map(function (day) {
        // Determine category based on goal relationship
        const diff = day.calories.total - day.calories.goal;
        const isGoalMet = Math.abs(diff) <= day.calories.goal * 0.1;

        if (isGoalMet) return "onTarget";
        if (diff > 0) return "overGoal";
        return "underGoal";
    });
});

const goalLine = computed(() => {
    if (!hasData.value) return [];

    const data = processedData.value.daysWithCalories;

    return data.map((day) => ({
        goalMet: Math.abs(day.calories.total - day.calories.goal) <= day.calories.goal * 0.1,
        x: day.date.toDate().getTime(),
        y: day.calories.goal,
    }));
});

const chartOptions = computed(() => {
    return {
        // Draw goal line as annotation
        annotations: {
            // Draw a line for each goal point
            points: hasData.value
                ? goalLine.value.map((point) => ({
                      label: {
                          borderColor: "transparent",
                          text: "",
                      },
                      marker: {
                          size: 0,
                      },
                      x: point.x,
                      y: point.y,
                  }))
                : [],
            xaxis: [],
            yaxis: [],
        },
        chart: {
            background: "transparent",
            fontFamily: "inherit",
            foreColor: "#E0E0E0",
            id: "calorie-goal-chart",
            stacked: false,
            toolbar: {
                show: false,
            },
            type: "bar",
            zoom: {
                enabled: false,
            },
        },
        colors: ["#4CAF50", "#F44336", "#FF9800"],
        dataLabels: {
            enabled: false,
        },
        fill: {
            opacity: 0.85,
        },
        grid: {
            borderColor: "#383853",
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: true,
                },
            },
        },
        legend: {
            customLegendItems: ["On Target", "Over Goal", "Under Goal"],
            horizontalAlign: "right",
            labels: {
                colors: "#E0E0E0",
            },
            position: "top",
        },
        plotOptions: {
            bar: {
                barHeight: "80%",
                borderRadius: 5,
                columnWidth: "60%",
                distributed: true,
            },
        },
        stroke: {
            colors: ["#4CAF50"],
            curve: "smooth",
            width: [0],
        },
        tooltip: {
            custom({ dataPointIndex, seriesIndex, w }: any) {
                // Access the data at the current point
                // Only process for the bars series
                if (seriesIndex !== 0) return;

                const data = w.config.series[0].data[dataPointIndex];
                const actual = data.y;
                const date = new Date(data.x);

                // Find the corresponding goal from the line series
                const goal =
                    w.config.series[1].data.find(
                        (point: any) => new Date(point.x).toDateString() === date.toDateString(),
                    )?.y ?? 0;

                const diff = actual - goal;
                const { category, percentage } = evaluateGoalAchievement(actual, goal);

                let statusText = "On Target";
                let statusColor = "#4CAF50";

                if (category === "under") {
                    statusText = "Under Goal";
                    statusColor = "#3F51B5";
                } else if (category === "over") {
                    statusText = "Over Goal";
                    statusColor = "#FF9800";
                }

                return `
                    <div class="apexcharts-tooltip-title">
                        ${formatDateWithDay(date)}
                    </div>
                    <div style="padding: 8px;">
                        <div><strong>Actual:</strong> ${actual.toLocaleString()} kcal</div>
                        <div><strong>Goal:</strong> ${goal.toLocaleString()} kcal</div>
                        <div><strong>Difference:</strong> ${diff > 0 ? "+" : ""}${diff.toLocaleString()} kcal</div>
                        <div style="margin-top: 5px; color: ${statusColor};">
                            <strong>Status:</strong> ${statusText} (${percentage.toFixed(0)}% match)
                        </div>
                    </div>
                `;
            },
            intersect: false,
            shared: true,
            theme: "dark",
            x: {
                formatter(val: number) {
                    return formatChartDate(new Date(val));
                },
            },
            y: {
                formatter(val: number) {
                    return `${val.toLocaleString()} kcal`;
                },
            },
        },
        xaxis: {
            categories: colorCategories.value,
            labels: {
                format: "MMM dd",
                style: {
                    colors: "#E0E0E0",
                },
            },
            type: "datetime",
        },
        yaxis: {
            labels: {
                formatter(val: number) {
                    return val.toLocaleString();
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
    };
});

function evaluateGoalAchievement(
    actual: number,
    goal: number,
): {
    category: "on_target" | "over" | "under";
    isOnTarget: boolean;
    percentage: number;
} {
    const difference = actual - goal;
    const percentDifference = (difference / goal) * 100;

    const successPercentage = Math.max(0, 100 - Math.abs(percentDifference));

    // 5% under goal is acceptable
    const underThreshold = -5;
    // 7% over goal is acceptable
    const overThreshold = 7;

    let category: "on_target" | "over" | "under";
    let isOnTarget = false;

    if (percentDifference < underThreshold) {
        category = "under";
    } else if (percentDifference > overThreshold) {
        category = "over";
    } else {
        category = "on_target";
        isOnTarget = true;
    }

    return { category, isOnTarget, percentage: successPercentage };
}

function formatNumber(value: number): string {
    return value.toLocaleString();
}

function hasDayCalories(day: HealthMetrics): day is HealthMetrics & {
    calories: NonNullable<HealthMetrics["calories"]>;
} {
    return isNotNil(day.calories) && day.calories.total > 0 && day.calories.goal > 0;
}
</script>

<style scoped>
.calorie-goal-chart {
    width: 100%;
}

.stat-card {
    flex: 1;
    min-width: 150px;
    background-color: #27293d;
    border-radius: 8px;
    padding: 12px;
    transition: all 0.2s ease;
}

.stat-card:hover {
    background-color: #2d2f44;
}

.text-success {
    color: #4caf50 !important;
}

.text-error {
    color: #f44336 !important;
}

@media (max-width: 600px) {
    .stat-card {
        min-width: calc(50% - 16px);
    }
}
</style>
