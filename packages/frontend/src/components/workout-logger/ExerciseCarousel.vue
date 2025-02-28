<script setup lang="ts">
import { computed } from "vue";

import type { WorkoutWithId } from "../../types/workout";

import { cardioExercises } from "../../data/cardio-exercises";
import { strengthExercises } from "../../data/strength-exercises";
import { required } from "../../helpers/form-validators";
import { isCardioWorkout, isStrengthWorkout } from "../../services/workout";

const props = defineProps<{
    modelValue: number;
    workout: WorkoutWithId;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: number];
}>();

const intensityLevels = ["low", "medium", "high"];

const exercises = computed(function () {
    return props.workout.type === "strength" ? strengthExercises : cardioExercises;
});

function addSet(exerciseIndexVal: number): void {
    if (isStrengthWorkout(props.workout)) {
        props.workout.exerciseEntries[exerciseIndexVal].sets.push({
            reps: 0,
            weight: 0,
        });
    }
}

function getExerciseName(entry: { exerciseId: string }): string {
    const exercise = exercises.value.find(function ({ id }) {
        return id === entry.exerciseId;
    });
    return exercise?.name || "";
}

function navigateExercise(direction: number): void {
    const newIndex = props.modelValue + direction;
    if (newIndex >= 0 && newIndex < props.workout.exerciseEntries.length) {
        emit("update:modelValue", newIndex);
    }
}

function removeExercise(index: number): void {
    if (props.workout.exerciseEntries.length > 1) {
        props.workout.exerciseEntries.splice(index, 1);

        if (props.modelValue >= props.workout.exerciseEntries.length) {
            emit("update:modelValue", props.workout.exerciseEntries.length - 1);
        }
    }
}

function removeSet(exerciseIndexVal: number, setIndex: number): void {
    if (isStrengthWorkout(props.workout)) {
        const sets = props.workout.exerciseEntries[exerciseIndexVal].sets;
        if (sets.length > 1) {
            sets.splice(setIndex, 1);
        }
    }
}

function updateActiveIndex(index: number): void {
    emit("update:modelValue", index);
}
</script>

<template>
    <v-card v-if="workout.exerciseEntries.length > 0" class="mb-6" elevation="2">
        <v-card-text class="pa-0">
            <!-- Carousel Navigation Header -->
            <div class="d-flex align-center px-4 pt-4">
                <v-btn
                    icon="mdi-chevron-left"
                    variant="text"
                    :disabled="modelValue === 0"
                    @click="navigateExercise(-1)"
                    density="comfortable"
                ></v-btn>

                <div class="text-subtitle-1 font-weight-medium mx-auto text-center exercise-title">
                    {{
                        getExerciseName(workout.exerciseEntries[modelValue]) ||
                        (isStrengthWorkout(workout)
                            ? `Exercise ${modelValue + 1}`
                            : `Cardio Activity ${modelValue + 1}`)
                    }}
                </div>

                <v-btn
                    icon="mdi-chevron-right"
                    variant="text"
                    :disabled="modelValue === workout.exerciseEntries.length - 1"
                    @click="navigateExercise(1)"
                    density="comfortable"
                ></v-btn>

                <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    @click="removeExercise(modelValue)"
                    :disabled="workout.exerciseEntries.length <= 1"
                    density="comfortable"
                ></v-btn>
            </div>

            <!-- Carousel Indicators -->
            <div class="d-flex justify-center my-2">
                <div class="exercise-indicators">
                    <div
                        v-for="(_, idx) in workout.exerciseEntries"
                        :key="idx"
                        class="exercise-indicator"
                        :class="{ active: idx === modelValue }"
                        @click="updateActiveIndex(idx)"
                    ></div>
                </div>
            </div>

            <!-- Exercise Content -->
            <v-window
                :model-value="modelValue"
                @update:model-value="updateActiveIndex"
                class="exercise-carousel"
            >
                <template v-if="isStrengthWorkout(workout)">
                    <v-window-item
                        v-for="(entry, idx) in workout.exerciseEntries"
                        :key="idx"
                        class="pa-4"
                    >
                        <!-- Strength Exercise Content -->
                        <v-autocomplete
                            v-model="entry.exerciseId"
                            :items="exercises"
                            item-title="name"
                            item-value="id"
                            label="Select Exercise"
                            variant="outlined"
                            :rules="[required]"
                            clearable
                        />

                        <div class="text-subtitle-1 mt-4 mb-2 d-flex align-center">
                            <span>Sets</span>
                            <v-spacer></v-spacer>
                            <v-btn
                                density="comfortable"
                                size="small"
                                color="primary"
                                variant="text"
                                @click="addSet(idx)"
                                prepend-icon="mdi-plus"
                            >
                                Add Set
                            </v-btn>
                        </div>

                        <v-table density="compact">
                            <thead>
                                <tr>
                                    <th width="20%">Set</th>
                                    <th width="35%">Reps</th>
                                    <th width="35%">Weight</th>
                                    <th width="10%"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(set, sIdx) in entry.sets" :key="sIdx">
                                    <td class="text-center">{{ sIdx + 1 }}</td>
                                    <td>
                                        <v-text-field
                                            v-model.number="set.reps"
                                            type="number"
                                            variant="underlined"
                                            density="compact"
                                            hide-details
                                        />
                                    </td>
                                    <td>
                                        <v-text-field
                                            v-model.number="set.weight"
                                            type="number"
                                            variant="underlined"
                                            density="compact"
                                            suffix="kg"
                                            hide-details
                                        />
                                    </td>
                                    <td class="text-center">
                                        <v-btn
                                            icon
                                            variant="text"
                                            color="error"
                                            size="small"
                                            @click="removeSet(idx, sIdx)"
                                            :disabled="entry.sets.length <= 1"
                                        >
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-window-item>
                </template>

                <template v-if="isCardioWorkout(workout)">
                    <v-window-item
                        v-for="(entry, idx) in workout.exerciseEntries"
                        :key="idx"
                        class="pa-4"
                    >
                        <!-- Cardio Exercise Content -->
                        <v-autocomplete
                            v-model="entry.exerciseId"
                            :items="exercises"
                            item-title="name"
                            item-value="id"
                            label="Select Activity"
                            variant="outlined"
                            :rules="[required]"
                            clearable
                        />

                        <v-row class="mt-2">
                            <v-col cols="6">
                                <v-text-field
                                    v-model.number="entry.durationMinutes"
                                    type="number"
                                    label="Duration"
                                    suffix="minutes"
                                    variant="outlined"
                                    :rules="[required]"
                                />
                            </v-col>

                            <v-col cols="6">
                                <v-text-field
                                    v-model.number="entry.distanceKm"
                                    type="number"
                                    label="Distance"
                                    suffix="km"
                                    variant="outlined"
                                    step="0.1"
                                />
                            </v-col>

                            <v-col cols="6">
                                <v-select
                                    v-model="entry.intensity"
                                    :items="intensityLevels"
                                    label="Intensity"
                                    variant="outlined"
                                />
                            </v-col>

                            <v-col cols="6">
                                <v-text-field
                                    v-model.number="entry.calories"
                                    type="number"
                                    label="Calories"
                                    suffix="kcal"
                                    variant="outlined"
                                />
                            </v-col>
                        </v-row>
                    </v-window-item>
                </template>
            </v-window>
        </v-card-text>
    </v-card>
</template>

<style scoped>
.exercise-carousel {
    min-height: 300px;
    position: relative;
}

.exercise-indicators {
    display: flex;
    gap: 8px;
    margin: 12px 0;
}

.exercise-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
}

.exercise-indicator.active {
    background-color: rgb(var(--v-theme-primary));
    width: 24px;
    border-radius: 4px;
}

.exercise-title {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Fade transition for carousel */
.v-window-item {
    transition: opacity 0.5s ease;
}
</style>
