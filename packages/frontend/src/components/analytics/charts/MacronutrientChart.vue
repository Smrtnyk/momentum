<template>
    <div class="macronutrient-chart">
        <apexchart
            v-if="hasMacroData"
            type="donut"
            height="300"
            :options="chartOptions"
            :series="series"
        ></apexchart>

        <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-2"
            icon="mdi-food-apple"
            text="No macronutrient data available for the selected period"
        ></v-alert>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { HealthMetrics } from "../../../types/health-metrics";

import { CHART_COLORS } from "../colors";

const props = defineProps<{
    nutritionData: HealthMetrics[];
}>();

function calculateAverage(total: number, count: number): number {
    return count > 0 ? Math.round(total / count) : 0;
}

const macroData = computed(() => {
    const totals = {
        carbs: { days: 0, sum: 0 },
        fat: { days: 0, sum: 0 },
        protein: { days: 0, sum: 0 },
    };

    for (const day of props.nutritionData) {
        if (!day.calories) continue;

        if (day.calories.protein !== undefined && day.calories.protein > 0) {
            totals.protein.sum += day.calories.protein;
            totals.protein.days++;
        }

        if (day.calories.carbs !== undefined && day.calories.carbs > 0) {
            totals.carbs.sum += day.calories.carbs;
            totals.carbs.days++;
        }

        if (day.calories.fat !== undefined && day.calories.fat > 0) {
            totals.fat.sum += day.calories.fat;
            totals.fat.days++;
        }
    }

    return {
        carbs: calculateAverage(totals.carbs.sum, totals.carbs.days),
        fat: calculateAverage(totals.fat.sum, totals.fat.days),
        protein: calculateAverage(totals.protein.sum, totals.protein.days),
    };
});

const hasMacroData = computed(() => {
    const { carbs, fat, protein } = macroData.value;
    return protein > 0 || carbs > 0 || fat > 0;
});

const macroCalories = computed(() => {
    const { carbs, fat, protein } = macroData.value;
    return {
        carbs: carbs * 4,
        fat: fat * 9,
        protein: protein * 4,
    };
});

const totalCalories = computed(() => {
    const { carbs, fat, protein } = macroCalories.value;
    return protein + carbs + fat;
});

const series = computed(() => {
    // Safe default values
    if (!hasMacroData.value) return [1, 1, 1];

    // Only include non-zero macros in the chart
    const seriesData = [];
    const macros = macroData.value;

    if (macros.protein > 0) seriesData.push(macroCalories.value.protein);
    if (macros.carbs > 0) seriesData.push(macroCalories.value.carbs);
    if (macros.fat > 0) seriesData.push(macroCalories.value.fat);

    // Safety check - if all are zero, show placeholder values
    return seriesData.length > 0 ? seriesData : [1, 1, 1];
});

const percentages = computed(() => {
    if (totalCalories.value === 0) return { carbs: 0, fat: 0, protein: 0 };

    return {
        carbs: Math.round((macroCalories.value.carbs / totalCalories.value) * 100),
        fat: Math.round((macroCalories.value.fat / totalCalories.value) * 100),
        protein: Math.round((macroCalories.value.protein / totalCalories.value) * 100),
    };
});

const chartLabels = computed(() => {
    const labels = [];
    const macros = macroData.value;

    if (macros.protein > 0) labels.push("Protein");
    if (macros.carbs > 0) labels.push("Carbs");
    if (macros.fat > 0) labels.push("Fat");

    return labels.length > 0 ? labels : ["Protein", "Carbs", "Fat"];
});

const chartOptions = ref({
    chart: {
        background: "transparent",
        fontFamily: "inherit",
        foreColor: CHART_COLORS.text,
        id: "macro-chart",
        type: "donut",
    },
    colors: [
        CHART_COLORS.macronutrients.protein,
        CHART_COLORS.macronutrients.carbs,
        CHART_COLORS.macronutrients.fat,
    ],
    dataLabels: {
        enabled: false,
    },
    labels: chartLabels.value,
    legend: {
        fontSize: "14px",
        formatter(seriesName: string, opts: any) {
            const index = opts.seriesIndex;
            let percent = percentages.value.protein;
            let grams = macroData.value.protein;

            if (index === 1) {
                percent = percentages.value.carbs;
                grams = macroData.value.carbs;
            } else if (index === 2) {
                percent = percentages.value.fat;
                grams = macroData.value.fat;
            }

            return `${seriesName}: ${percent}% (${grams}g)`;
        },
        horizontalAlign: "center",
        itemMargin: {
            horizontal: 15,
            vertical: 5,
        },
        labels: {
            colors: CHART_COLORS.text,
        },
        markers: {
            strokeWidth: 0,
        },
        position: "bottom",
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    name: {
                        color: CHART_COLORS.text,
                        fontSize: "16px",
                        show: true,
                    },
                    show: true,
                    total: {
                        color: CHART_COLORS.text,
                        fontSize: "16px",
                        formatter() {
                            return `${totalCalories.value.toLocaleString()} kcal`;
                        },
                        label: "Total",
                        show: true,
                    },
                    value: {
                        color: CHART_COLORS.text,
                        fontSize: "14px",
                        formatter(val: string) {
                            return `${val} kcal`;
                        },
                        show: true,
                    },
                },
                size: "65%",
            },
        },
    },
    responsive: [
        {
            breakpoint: 480,
            options: {
                legend: {
                    position: "bottom",
                },
            },
        },
    ],
    stroke: {
        colors: [CHART_COLORS.cardBackground],
        width: 2,
    },
    tooltip: {
        theme: "dark",
        y: {
            formatter(val: number) {
                const pct = Math.round((val / totalCalories.value) * 100);
                return `${val.toLocaleString()} kcal (${pct}%)`;
            },
        },
    },
});
</script>

<style scoped>
.macronutrient-chart {
    width: 100%;
    min-height: 300px;
}
</style>
