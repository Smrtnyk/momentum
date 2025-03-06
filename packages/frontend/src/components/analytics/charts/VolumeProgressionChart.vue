<template>
    <div class="volume-progression-chart">
        <apexchart
            v-if="volumeData.length > 0"
            type="area"
            height="300"
            :options="chartOptions"
            :series="series"
        ></apexchart>

        <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-2"
            icon="mdi-weight"
            text="No strength workout data available for the selected period"
        ></v-alert>

        <div v-if="volumeData.length > 0" class="text-center mt-2">
            <v-chip
                :color="showAverage ? 'secondary' : undefined"
                variant="outlined"
                size="small"
                @click="toggleAverage"
                class="mx-1"
            >
                <v-icon start size="small">mdi-chart-line-variant</v-icon>
                Moving Average
            </v-chip>

            <v-chip
                :color="showTrend ? 'warning' : undefined"
                variant="outlined"
                size="small"
                @click="toggleTrend"
                class="mx-1"
            >
                <v-icon start size="small">mdi-trending-up</v-icon>
                Trend
            </v-chip>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { ExerciseSet, StrengthExerciseEntry, WorkoutWithId } from "../../../types/workout";

import { isStrengthExercise } from "../../../services/workout";
import { calculateMovingAverage, calculateTrendLine } from "../metric-utils";

interface ChartSeries {
    data: MainChartDataPoint[] | SimpleChartDataPoint[];
    name: string;
    type: string;
}

interface MainChartDataPoint {
    workoutName: string;
    x: number;
    y: number;
}

interface SimpleChartDataPoint {
    x: number;
    y: number;
}

interface VolumeDataPoint {
    date: Date;
    name: string;
    volume: number;
}

const props = defineProps<{
    workoutData: WorkoutWithId[];
}>();

const showAverage = ref(true);
const showTrend = ref(true);

const volumeData = computed<VolumeDataPoint[]>(() => {
    return props.workoutData
        .sort((a, b) => a.date.toMillis() - b.date.toMillis())
        .map(function (workout) {
            const totalVolume = workout.exerciseEntries
                .filter(isStrengthExercise)
                .reduce((total, entry) => total + calculateEntryVolume(entry), 0);

            return {
                date: workout.date.toDate(),
                name: workout.name,
                volume: Math.round(totalVolume),
            };
        });
});

const movingAverageData = computed(() =>
    calculateMovingAverage(volumeData.value, (day) => day.volume, 3),
);

const trendLineData = computed(() =>
    calculateTrendLine(
        volumeData.value,
        (day) => day.volume,
        (day) => day.date.getTime(),
    ),
);

const series = computed<ChartSeries[]>(() => {
    const mainSeries: ChartSeries = {
        data: volumeData.value.map((d) => ({
            workoutName: d.name,
            x: d.date.getTime(),
            y: d.volume,
        })),
        name: "Volume",
        type: "area",
    };

    const result: ChartSeries[] = [mainSeries];

    if (showAverage.value && movingAverageData.value.length > 0) {
        result.push({
            data: movingAverageData.value,
            name: "Moving Average",
            type: "line",
        });
    }

    if (showTrend.value && trendLineData.value.length > 0) {
        result.push({
            data: trendLineData.value,
            name: "Trend",
            type: "line",
        });
    }

    return result;
});

const chartOptions = ref({
    chart: {
        background: "transparent",
        fontFamily: "inherit",
        foreColor: "#E0E0E0",
        id: "volume-progression",
        stacked: false,
        toolbar: {
            show: false,
        },
        type: "area",
        zoom: {
            enabled: false,
        },
    },
    colors: ["#00BCD4", "#FF4081", "#FFC107"],
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
        opacity: [0.6, 1, 1],
        type: ["gradient", "solid", "solid"],
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
        size: [4, 0, 0],
        strokeWidth: 2,
    },
    stroke: {
        curve: ["smooth", "smooth", "straight"],
        dashArray: [0, 0, 5],
        width: [3, 3, 2],
    },
    tooltip: {
        intersect: false,
        shared: true,
        theme: "dark",
        x: {
            format: "MMM dd, yyyy",
        },
        y: {
            formatter(value: number, { dataPointIndex, seriesIndex, w }: any) {
                if (seriesIndex === 0) {
                    const point = w.config.series[0].data[dataPointIndex];
                    return `${formatNumber(value)} kg (${point.workoutName})`;
                }
                return `${formatNumber(value)} kg`;
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
        type: "datetime",
    },
    yaxis: {
        labels: {
            formatter(value: number) {
                return formatNumber(value);
            },
            style: {
                colors: "#E0E0E0",
            },
        },
        title: {
            style: {
                color: "#E0E0E0",
            },
            text: "Volume (kg)",
        },
    },
});

function calculateEntryVolume(entry: StrengthExerciseEntry): number {
    return entry.sets.reduce((setTotal, set) => setTotal + calculateSetVolume(set), 0);
}

function calculateSetVolume(set: ExerciseSet): number {
    return set.reps * set.weight;
}

function formatNumber(value: number): string {
    return value.toLocaleString();
}

function toggleAverage(): void {
    showAverage.value = !showAverage.value;
}

function toggleTrend(): void {
    showTrend.value = !showTrend.value;
}
</script>

<style scoped>
.volume-progression-chart {
    width: 100%;
}
</style>
