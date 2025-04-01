<template>
    <div class="custom-workout-plan-creator">
        <v-form @submit.prevent="savePlan">
            <v-card-text>
                <v-text-field
                    v-model="planName"
                    label="Plan Name"
                    variant="outlined"
                    density="comfortable"
                    :rules="[required]"
                ></v-text-field>

                <v-textarea
                    v-model="planDescription"
                    label="Description"
                    variant="outlined"
                    density="comfortable"
                    :rules="[required]"
                    rows="2"
                ></v-textarea>

                <div class="d-flex flex-wrap gap-4">
                    <v-select
                        v-model="planLevel"
                        label="Difficulty Level"
                        :items="difficultyLevels"
                        variant="outlined"
                        density="comfortable"
                        class="flex-grow-1"
                    ></v-select>

                    <v-select
                        v-model="planType"
                        label="Plan Type"
                        :items="planTypes"
                        variant="outlined"
                        density="comfortable"
                        class="flex-grow-1"
                    ></v-select>
                </div>

                <div class="d-flex flex-wrap gap-4">
                    <v-text-field
                        v-model.number="durationWeeks"
                        label="Duration (weeks)"
                        type="number"
                        min="1"
                        variant="outlined"
                        density="comfortable"
                        class="flex-grow-1"
                    ></v-text-field>

                    <v-text-field
                        v-model.number="frequency"
                        label="Frequency (days/week)"
                        type="number"
                        min="1"
                        max="7"
                        variant="outlined"
                        density="comfortable"
                        class="flex-grow-1"
                    ></v-text-field>
                </div>

                <v-select
                    v-model="location"
                    label="Location"
                    :items="locationOptions"
                    variant="outlined"
                    density="comfortable"
                ></v-select>

                <v-combobox
                    v-model="goals"
                    label="Goals"
                    multiple
                    chips
                    small-chips
                    variant="outlined"
                    density="comfortable"
                ></v-combobox>
            </v-card-text>

            <v-divider></v-divider>

            <!-- Workout days -->
            <v-card-text>
                <div class="text-h6 font-weight-medium mb-4">Workout Days</div>

                <v-expansion-panels v-model="openPanel">
                    <v-expansion-panel
                        v-for="(day, dayIndex) in workoutDays"
                        :key="dayIndex"
                        class="mb-3"
                    >
                        <v-expansion-panel-title>
                            <div class="d-flex align-center w-100">
                                <v-text-field
                                    v-model="day.name"
                                    label="Day Name"
                                    density="compact"
                                    variant="plain"
                                    hide-details
                                    @click.stop
                                    class="flex-grow-1"
                                ></v-text-field>
                                <v-btn
                                    icon
                                    variant="text"
                                    density="compact"
                                    color="error"
                                    @click.stop="removeWorkoutDay(dayIndex)"
                                >
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </div>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            <v-textarea
                                v-model="day.overallNotes"
                                label="Day Notes"
                                variant="outlined"
                                density="comfortable"
                                rows="2"
                                class="mb-4"
                            ></v-textarea>

                            <WorkoutPlanExercisesList
                                v-model="day.exerciseEntries"
                                @add-exercise="openAddExerciseDialog(dayIndex)"
                            />
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-btn prepend-icon="mdi-plus" variant="tonal" class="mt-4" @click="addWorkoutDay">
                    Add Workout Day
                </v-btn>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="close"> Cancel </v-btn>
                <v-btn color="primary" type="submit" :loading="saving" :disabled="!isFormValid">
                    Save Workout Plan
                </v-btn>
            </v-card-actions>
        </v-form>
    </div>
</template>

<script setup lang="ts">
import { isNumber } from "es-toolkit/compat";
import { computed, onMounted, ref } from "vue";

import type {
    DifficultyLevel,
    ExercisePlanEntry,
    TrainingPlan,
    TrainingPlanType,
    WorkoutDay,
    WorkoutLocation,
} from "../../types/workout-plans";

import { globalDialog } from "../../composables/useDialog";
import { required } from "../../helpers/form-validators";
import { logger } from "../../logger/app-logger";
import { saveCustomWorkoutPlan } from "../../services/workout-plans";
import { useAuthStore } from "../../stores/auth";
import { useGlobalStore } from "../../stores/global";
import AddExerciseToPlan from "./AddExerciseToPlan.vue";
import WorkoutPlanExercisesList from "./WorkoutPlanExercisesList.vue";

const emit = defineEmits<{
    (e: "close"): void;
    (e: "saved", plan: TrainingPlan): void;
}>();

const authStore = useAuthStore();
const globalStore = useGlobalStore();

const saving = ref(false);
const planName = ref("");
const planDescription = ref("");
const planLevel = ref<DifficultyLevel>("beginner");
const planType = ref<TrainingPlan["type"]>("strength");
const durationWeeks = ref(4);
const frequency = ref(3);
const location = ref("anywhere");
const goals = ref<string[]>([]);
const workoutDays = ref<WorkoutDay[]>([]);
const openPanel = ref(0);

const difficultyLevels = [
    { title: "Beginner", value: "beginner" },
    { title: "Intermediate", value: "intermediate" },
    { title: "Advanced", value: "advanced" },
];

const planTypes: { title: string; value: TrainingPlanType }[] = [
    { title: "Strength", value: "strength" },
    { title: "Cardio", value: "cardio" },
    { title: "Hybrid", value: "hybrid" },
];

const locationOptions: { title: string; value: WorkoutLocation }[] = [
    { title: "Anywhere", value: "anywhere" },
    { title: "Home", value: "home" },
    { title: "Gym", value: "gym" },
];

const isFormValid = computed((): boolean => {
    return (
        planName.value.trim().length > 0 &&
        planDescription.value.trim().length > 0 &&
        isNumber(durationWeeks.value) &&
        frequency.value > 0 &&
        workoutDays.value.length > 0 &&
        workoutDays.value.every(
            (day) => day.name.trim().length > 0 && day.exerciseEntries.length > 0,
        )
    );
});

function addWorkoutDay(): void {
    const newDay: WorkoutDay = {
        exerciseEntries: [],
        id: globalThis.crypto.randomUUID(),
        name: `Day ${workoutDays.value.length + 1}`,
    };

    workoutDays.value.push(newDay);
    openPanel.value = workoutDays.value.length - 1;
}

function close(): void {
    emit("close");
}

function openAddExerciseDialog(dayIndex: number): void {
    globalDialog.openDialog(
        AddExerciseToPlan,
        {
            onAdd(exercise: ExercisePlanEntry) {
                workoutDays.value[dayIndex].exerciseEntries.push(exercise);
            },
        },
        { title: "Add Exercise to Plan" },
    );
}

function removeWorkoutDay(index: number): void {
    workoutDays.value.splice(index, 1);

    if (openPanel.value >= workoutDays.value.length) {
        openPanel.value = Math.max(0, workoutDays.value.length - 1);
    }
}

async function savePlan(): Promise<void> {
    if (!isFormValid.value) return;

    try {
        saving.value = true;
        const userId = authStore.nonNullableUser.uid;
        const plan: TrainingPlan = {
            author: userId,
            description: planDescription.value,
            durationWeeks: durationWeeks.value,
            frequency: frequency.value,
            goals: goals.value,
            id: globalThis.crypto.randomUUID(),
            isCustom: true,
            level: planLevel.value,
            location: location.value as any,
            name: planName.value,
            type: planType.value,
            workoutDays: workoutDays.value,
        };

        await saveCustomWorkoutPlan(userId, plan);

        globalStore.notify("Custom workout plan created successfully!");
        emit("saved", plan);
        close();
    } catch (error) {
        globalStore.notifyError("Failed to save workout plan");
        logger.error("Failed to save workout plan:", "CustomWorkoutPlanCreator", error);
    } finally {
        saving.value = false;
    }
}

onMounted(addWorkoutDay);
</script>

<style scoped>
.gap-4 {
    gap: 16px;
}

:deep(.v-expansion-panel-text__wrapper) {
    padding-left: 10px !important;
    padding-right: 10px !important;
}
</style>
