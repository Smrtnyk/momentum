<template>
    <v-card class="mb-6 workout-selector" elevation="2">
        <v-card-title class="text-h5 mb-4">Select Workout Type</v-card-title>
        <v-card-text>
            <div class="d-flex flex-wrap justify-center gap-6">
                <div
                    v-for="type in workoutTypes"
                    :key="type.value"
                    class="workout-type-container text-center"
                    @click="changeType(type.value)"
                >
                    <v-hover v-slot="{ isHovering, props }">
                        <v-card
                            v-bind="props"
                            :elevation="getElevation(type.value, !!isHovering)"
                            :class="['workout-circle', { selected: modelValue === type.value }]"
                            :color="modelValue === type.value ? type.color : 'surface'"
                            class="mx-auto d-flex align-center justify-center"
                            rounded="shaped"
                        >
                            <v-icon
                                size="x-large"
                                :color="modelValue === type.value ? 'white' : type.color"
                            >
                                {{ type.icon }}
                            </v-icon>
                        </v-card>
                    </v-hover>
                    <div
                        class="workout-label text-body-1 font-weight-medium mt-2"
                        :class="{ 'selected-text': modelValue === type.value }"
                    >
                        {{ type.label }}
                    </div>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

import type { Workout } from "../../types/workout";

interface WorkoutTypeOption {
    color: string;
    icon: string;
    label: string;
    value: Workout["type"];
}

const { modelValue } = defineProps<{ modelValue: Workout["type"] }>();
const emit = defineEmits<{
    "update:modelValue": [value: Workout["type"]];
}>();

const workoutTypes: WorkoutTypeOption[] = [
    {
        color: "primary",
        icon: "mdi-weight-lifter",
        label: "Strength",
        value: "strength",
    },
    {
        color: "secondary",
        icon: "mdi-run",
        label: "Cardio",
        value: "cardio",
    },
];

function changeType(type: Workout["type"]): void {
    if (type !== modelValue) {
        emit("update:modelValue", type);
    }
}

function getElevation(type: Workout["type"], isHovering: boolean): number {
    if (modelValue === type) {
        return 8;
    }
    return isHovering ? 4 : 2;
}
</script>

<style scoped>
.workout-circle {
    width: 100px;
    height: 100px;
    transition: all 0.3s ease;
}

.workout-circle:hover {
    transform: translateY(-5px);
}

.workout-circle.selected {
    transform: translateY(-8px);
}

.workout-type-container {
    cursor: pointer;
    min-width: 120px;
}

.selected-text {
    font-weight: bold !important;
}

@media (max-width: 600px) {
    .workout-circle {
        width: 80px;
        height: 80px;
    }

    .workout-type-container {
        min-width: 100px;
    }
}
</style>
