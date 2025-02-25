<template>
    <v-card class="mb-6" elevation="2">
        <v-card-title class="text-h5 mb-4">Select Workout Type</v-card-title>
        <v-card-text>
            <div class="d-flex gap-4 flex-wrap">
                <v-btn
                    variant="flat"
                    size="x-large"
                    :color="modelValue === 'strength' ? 'primary' : 'surface'"
                    @click="changeType('strength')"
                    class="flex-grow-1"
                >
                    <v-icon left>mdi-weight-lifter</v-icon>
                    Strength Training
                </v-btn>

                <v-btn
                    variant="flat"
                    size="x-large"
                    :color="modelValue === 'cardio' ? 'secondary' : 'surface'"
                    @click="changeType('cardio')"
                    class="flex-grow-1"
                >
                    <v-icon left>mdi-run</v-icon>
                    Cardio
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

type WorkoutType = "cardio" | "strength";

const props = defineProps<{ modelValue: WorkoutType }>();
const emit = defineEmits<(e: "update:modelValue", value: WorkoutType) => void>();

function changeType(type: WorkoutType): void {
    if (type !== props.modelValue) {
        emit("update:modelValue", type);
    }
}
</script>
