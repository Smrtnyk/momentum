<template>
    <div class="meal-distribution-chart">
        <apexchart
            v-if="hasData"
            type="pie"
            height="350"
            :options="chartOptions"
            :series="series"
        ></apexchart>

        <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-2"
            icon="mdi-food"
            text="No meal distribution data available for the selected period"
        ></v-alert>

        <div v-if="hasData" class="d-flex justify-center flex-wrap mt-4">
            <v-chip
                v-for="(value, meal) in mealData.averages"
                :key="meal"
                :color="CHART_COLORS.meals[meal as Meal['mealType']]"
                size="small"
                variant="elevated"
                :prepend-icon="getMealIcon(meal)"
                class="mx-1 mb-2"
            >
                {{ formatMealName(meal) }}: {{ value }} kcal
            </v-chip>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { HealthMetrics, Meal } from "../../../types/health-metrics";

import { CHART_COLORS } from "../colors";

const props = defineProps<{
    nutritionData: HealthMetrics[];
}>();

const mealData = computed(() => {
    const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;
    const totalsByMeal: Record<string, number> = {
        breakfast: 0,
        dinner: 0,
        lunch: 0,
        snack: 0,
    };

    let daysWithData = 0;

    props.nutritionData.forEach(function (day) {
        if (!day.calories?.byMeal) return;

        let hasData = false;
        for (const mealType of mealTypes) {
            if (day.calories.byMeal[mealType] > 0) {
                totalsByMeal[mealType] += day.calories.byMeal[mealType];
                hasData = true;
            }
        }

        if (hasData) {
            daysWithData++;
        }
    });

    if (daysWithData === 0) {
        return { averages: {}, total: 0 };
    }

    const averages: Record<string, number> = {};
    let total = 0;

    for (const mealType of mealTypes) {
        averages[mealType] = Math.round(totalsByMeal[mealType] / daysWithData);
        total += averages[mealType];
    }

    return { averages, total };
});

const hasData = computed(() => {
    return mealData.value.total > 0;
});

const series = computed(() => {
    if (!hasData.value) return [0, 0, 0, 0];

    return [
        mealData.value.averages.breakfast ?? 0,
        mealData.value.averages.lunch ?? 0,
        mealData.value.averages.dinner ?? 0,
        mealData.value.averages.snack ?? 0,
    ];
});

function getPercentage(value: number): number {
    if (mealData.value.total === 0) return 0;
    return Math.round((value / mealData.value.total) * 100);
}

const chartColors: Record<string, string> = {
    breakfast: "#FFC107",
    dinner: "#673AB7",
    lunch: "#4CAF50",
    snack: "#FF5722",
};

const chartOptions = computed(() => {
    return {
        chart: {
            animations: {
                dynamicAnimation: {
                    enabled: true,
                },
                enabled: true,
                speed: 400,
            },
            background: "transparent",
            fontFamily: "inherit",
            foreColor: "#E0E0E0",
            id: "meal-distribution-chart",
            type: "pie",
        },
        colors: Object.values(chartColors),
        dataLabels: {
            dropShadow: {
                blur: 2,
                enabled: true,
                left: 1,
                opacity: 0.5,
                top: 1,
            },
            enabled: true,
            formatter(val: number) {
                return `${val.toFixed(1)}%`;
            },
            style: {
                colors: ["#ffffff"],
                fontSize: "14px",
                fontWeight: "bold",
                textShadow: "0px 1px 1px rgba(0, 0, 0, 0.5)",
            },
        },
        labels: ["Breakfast", "Lunch", "Dinner", "Snacks"],
        legend: {
            fontSize: "14px",
            formatter(seriesName: string, opts: any) {
                const index = opts.seriesIndex;
                const value = series.value[index];
                const percent = getPercentage(value);
                return `${seriesName}: ${percent}%`;
            },
            horizontalAlign: "center",
            itemMargin: {
                horizontal: 10,
                vertical: 5,
            },
            labels: {
                colors: "#E0E0E0",
            },
            markers: {
                height: 12,
                radius: 4,
                strokeColor: "#1E1E2F",
                strokeWidth: 0,
                width: 12,
            },
            position: "bottom",
        },
        plotOptions: {
            pie: {
                customScale: 0.9,
                dataLabels: {
                    minAngleToShowLabel: 10,
                    offset: -5,
                },
                endAngle: 360,
                offsetX: 0,
                offsetY: 0,
                startAngle: 0,
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        offsetY: 0,
                        position: "bottom",
                    },
                },
            },
        ],
        states: {
            active: {
                filter: {
                    type: "darken",
                    value: 0.35,
                },
            },
            hover: {
                filter: {
                    type: "darken",
                    value: 0.85,
                },
            },
        },
        stroke: {
            colors: ["#1E1E2F"],
            width: 2,
        },
        tooltip: {
            theme: "dark",
            y: {
                formatter(val: number) {
                    const percentage =
                        mealData.value.total > 0
                            ? ((val / mealData.value.total) * 100).toFixed(1)
                            : 0;
                    return `${val.toLocaleString()} kcal (${percentage}%)`;
                },
            },
        },
    };
});

function formatMealName(meal: string): string {
    return meal.charAt(0).toUpperCase() + meal.slice(1);
}

function getMealIcon(meal: string): string {
    switch (meal) {
        case "breakfast":
            return "mdi-coffee";
        case "dinner":
            return "mdi-food-turkey";
        case "lunch":
            return "mdi-food";
        case "snack":
            return "mdi-food-apple";
        default:
            return "mdi-food";
    }
}
</script>
