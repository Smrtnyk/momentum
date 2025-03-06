<template>
    <div class="calories-time-chart">
        <apexchart
            type="area"
            height="300"
            :options="chartOptions"
            :series="series"
            :key="showGoal ? 'with-goal' : 'without-goal'"
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
import { computed, ref, watch } from "vue";

import type { HealthMetrics } from "../../../types/health-metrics";

import { getMaxValue, getMinValue } from "../metric-utils";

const props = defineProps<{
    nutritionData: HealthMetrics[];
}>();

const showGoal = ref(true);

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

const avgCalories = computed(() => {
    if (dailyCalories.value.length === 0) return 0;
    const sum = dailyCalories.value.reduce((acc, day) => acc + day.total, 0);
    return Math.round(sum / dailyCalories.value.length);
});

const minCalories = computed(() => getMinValue(dailyCalories.value, (day) => day.total));

const maxCalories = computed(() => getMaxValue(dailyCalories.value, (day) => day.total));

const series = computed(() => {
    if (dailyCalories.value.length === 0) {
        return [{ data: [], name: "Calories" }];
    }

    const seriesData = [
        {
            data: dailyCalories.value.map((day) => ({
                x: day.date.getTime(),
                y: day.total,
            })),
            name: "Calories",
        },
    ];

    if (showGoal.value) {
        seriesData.push({
            data: dailyCalories.value.map((day) => ({
                x: day.date.getTime(),
                y: day.goal,
            })),
            name: "Goal",
        });
    }

    return seriesData;
});

const chartOptions = ref({
    chart: {
        background: "transparent",
        fontFamily: "inherit",
        foreColor: "#E0E0E0",
        id: "calories-chart",
        toolbar: {
            show: false,
        },
        type: "area",
        zoom: {
            enabled: false,
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
        horizontalAlign: "right",
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

watch([() => props.nutritionData, showGoal], updateChartOptions);

function updateChartOptions(): void {
    chartOptions.value = {
        ...chartOptions.value,
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
</style>
