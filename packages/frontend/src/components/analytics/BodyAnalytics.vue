<template>
    <div class="body-analytics">
        <v-row class="mb-6">
            <v-col cols="12">
                <div class="text-h6 mb-2 text-center">Weight Tracking</div>
                <v-card elevation="0">
                    <WeightProgressChart :body-data="bodyData" />
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <div class="text-h6 mb-2 text-center">
                    Body Composition
                    <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" size="small" color="grey-lighten-1" class="ml-1">
                                mdi-information-outline
                            </v-icon>
                        </template>
                        Track your body fat percentage to see data here
                    </v-tooltip>
                </div>
                <v-card elevation="0">
                    <div v-if="hasBfData">
                        <BodyFatChart :body-data="bodyData" />
                    </div>
                    <v-card-text v-else class="d-flex flex-column align-center justify-center py-8">
                        <v-icon
                            icon="mdi-scale-balance"
                            size="64"
                            color="grey-lighten-3"
                            class="mb-3"
                        ></v-icon>
                        <div class="text-h6 text-medium-emphasis">No body fat data</div>
                        <p class="text-body-2 text-medium-emphasis text-center mt-2">
                            Track your body fat percentage to see composition analytics
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <div class="text-h6 mb-2 text-center">Hydration Tracking</div>
                <v-card elevation="0">
                    <WaterIntakeChart :body-data="bodyData" />
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-4">
            <v-col cols="12">
                <div class="text-h6 mb-2 text-center">Step Count</div>
                <v-card elevation="0">
                    <StepCountChart :body-data="bodyData" />
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-4">
            <v-col cols="12">
                <div class="text-h6 mb-2 text-center">Body Metrics Summary</div>
                <v-card elevation="0">
                    <v-list>
                        <!-- Weight Section -->
                        <v-list-subheader>Weight Metrics</v-list-subheader>

                        <v-list-item>
                            <template v-slot:prepend>
                                <v-avatar color="indigo-lighten-1" size="36" class="mr-3">
                                    <v-icon icon="mdi-scale" color="white"></v-icon>
                                </v-avatar>
                            </template>
                            <v-list-item-title>Current Weight</v-list-item-title>
                            <v-list-item-subtitle>
                                {{ currentWeight ? `${currentWeight} kg` : "No data available" }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item v-if="weightChange !== 0">
                            <template v-slot:prepend>
                                <v-avatar color="indigo-lighten-2" size="36" class="mr-3">
                                    <v-icon
                                        :icon="weightChange < 0 ? 'mdi-arrow-down' : 'mdi-arrow-up'"
                                        color="white"
                                    ></v-icon>
                                </v-avatar>
                            </template>
                            <v-list-item-title>Weight Change</v-list-item-title>
                            <v-list-item-subtitle>
                                <span :class="weightChange < 0 ? 'text-success' : 'text-warning'">
                                    {{ weightChange < 0 ? "" : "+" }}{{ weightChange }} kg
                                </span>
                                during this period
                            </v-list-item-subtitle>
                        </v-list-item>

                        <!-- Body Fat Section -->
                        <v-divider></v-divider>
                        <v-list-subheader>Body Composition</v-list-subheader>

                        <v-list-item>
                            <template v-slot:prepend>
                                <v-avatar color="deep-purple-lighten-1" size="36" class="mr-3">
                                    <v-icon icon="mdi-percent" color="white"></v-icon>
                                </v-avatar>
                            </template>
                            <v-list-item-title>Body Fat Percentage</v-list-item-title>
                            <v-list-item-subtitle>
                                {{ currentBodyFat ? `${currentBodyFat}%` : "No data available" }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <!-- Activity Section -->
                        <v-divider></v-divider>
                        <v-list-subheader>Activity & Hydration</v-list-subheader>

                        <v-list-item>
                            <template v-slot:prepend>
                                <v-avatar color="teal-lighten-1" size="36" class="mr-3">
                                    <v-icon icon="mdi-shoe-print" color="white"></v-icon>
                                </v-avatar>
                            </template>
                            <v-list-item-title>Average Daily Steps</v-list-item-title>
                            <v-list-item-subtitle>
                                {{
                                    avgSteps ? avgSteps.toLocaleString() : "No step data available"
                                }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <template v-slot:prepend>
                                <v-avatar color="light-blue-lighten-1" size="36" class="mr-3">
                                    <v-icon icon="mdi-water" color="white"></v-icon>
                                </v-avatar>
                            </template>
                            <v-list-item-title>Average Water Intake</v-list-item-title>
                            <v-list-item-subtitle>
                                {{
                                    avgWaterIntake
                                        ? `${avgWaterIntake} ml per day`
                                        : "No water tracking data"
                                }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { DateRangeOption } from "../../types/analytics";
import type { HealthMetrics } from "../../types/health-metrics";

import BodyFatChart from "./charts/BodyFatChart.vue";
import StepCountChart from "./charts/StepCountChart.vue";
import WaterIntakeChart from "./charts/WaterIntakeChart.vue";
import WeightProgressChart from "./charts/WeightProgressChart.vue";
import { calculateAverage, filterHealthMetricsBy, getFirstLastAndChange } from "./metric-utils";

const props = defineProps<{
    bodyData: HealthMetrics[];
    dateRange: DateRangeOption;
}>();

const hasBfData = computed(() => {
    return props.bodyData.some((day) => day.bodyFat !== undefined);
});

const weightData = computed(() => {
    const withWeight = filterHealthMetricsBy(props.bodyData, "weight");

    if (withWeight.length === 0) {
        return { change: 0, current: null };
    }

    const { change, last } = getFirstLastAndChange(withWeight, (day) => day.weight as number);

    return { change, current: last };
});

const currentWeight = computed(() => weightData.value.current);
const weightChange = computed(() => weightData.value.change);

const currentBodyFat = computed(() => {
    const withBf = filterHealthMetricsBy(props.bodyData, "bodyFat", "desc");
    return withBf.length > 0 ? withBf[0].bodyFat?.percentage : null;
});

const avgSteps = computed(() =>
    calculateAverage(
        props.bodyData,
        (day) => day.steps ?? 0,
        (day) => day.steps !== undefined && day.steps > 0,
    ),
);

const avgWaterIntake = computed(() =>
    calculateAverage(
        props.bodyData,
        (day) => day.waterIntake,
        (day) => day.waterIntake > 0,
    ),
);
</script>

<style scoped>
.body-analytics {
    padding-bottom: 20px;
}
</style>
