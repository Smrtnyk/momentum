import { cloneDeep } from "es-toolkit";
import { Timestamp } from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, toRaw } from "vue";

import type { CardioWorkout, CircuitWorkout, StrengthWorkout } from "../types/workout";
import type { ExerciseSet, PlanCategory, TrainingPlan, WorkoutDay } from "../types/workout-plans";

import { logger } from "../logger/app-logger";
import { addWorkout } from "../services/workout";
import { useAuthStore } from "./auth";

export interface ActiveExercise extends ExerciseSet {
    actualDistance?: number;
    actualDuration?: number | undefined;
    actualSets?:
        | undefined
        | {
              completed: boolean;
              reps: number;
              weight: number;
          }[];
    completed: boolean;
}

interface ActiveWorkout {
    dayId: string;
    dayName: string;
    exercises: ActiveExercise[];
    planCategory: PlanCategory;
    planId: string;
    planName: string;
    startTime: Date;
}

export const useActiveWorkoutStore = defineStore("activeWorkout", () => {
    const authStore = useAuthStore();
    const activeWorkout = ref<ActiveWorkout | null>(null);
    const isWorkoutActive = computed(() => activeWorkout.value !== null);

    function startWorkout(plan: TrainingPlan, day: WorkoutDay): void {
        const exercises: ActiveExercise[] = day.exercises.map(function (exercise) {
            return {
                ...exercise,
                actualDuration: exercise.duration ? Math.round(exercise.duration / 60) : undefined,
                actualSets: exercise.sets
                    ? Array.from({ length: exercise.sets })
                          .fill(null)
                          .map(() => ({
                              completed: false,
                              reps: exercise.reps || 0,
                              weight: 0,
                          }))
                    : undefined,
                completed: false,
            };
        });

        activeWorkout.value = {
            dayId: day.id,
            dayName: day.name,
            exercises,
            planCategory: plan.category,
            planId: plan.id,
            planName: plan.name,
            startTime: new Date(),
        };

        saveToLocalStorage();
    }

    function toggleExerciseCompletion(exerciseIndex: number): void {
        if (!activeWorkout.value) {
            return;
        }

        const newCompletedStatus = !activeWorkout.value.exercises[exerciseIndex].completed;
        activeWorkout.value.exercises[exerciseIndex].completed = newCompletedStatus;
        // If the exercise has sets, set all of them to the same completion status
        if (activeWorkout.value.exercises[exerciseIndex].actualSets) {
            activeWorkout.value.exercises[exerciseIndex].actualSets.forEach((set) => {
                set.completed = newCompletedStatus;
            });
        }

        saveToLocalStorage();
    }

    function toggleSetCompletion(exerciseIndex: number, setIndex: number): void {
        if (!activeWorkout.value?.exercises[exerciseIndex].actualSets) {
            return;
        }

        activeWorkout.value.exercises[exerciseIndex].actualSets[setIndex].completed =
            !activeWorkout.value.exercises[exerciseIndex].actualSets[setIndex].completed;

        saveToLocalStorage();
    }

    function updateSetData(
        exerciseIndex: number,
        setIndex: number,
        reps: number,
        weight: number,
    ): void {
        if (!activeWorkout.value?.exercises[exerciseIndex].actualSets) {
            return;
        }

        activeWorkout.value.exercises[exerciseIndex].actualSets[setIndex].reps = reps;
        activeWorkout.value.exercises[exerciseIndex].actualSets[setIndex].weight = weight;

        saveToLocalStorage();
    }

    async function endWorkout(): Promise<null | string> {
        if (!activeWorkout.value) return null;

        try {
            const durationMinutes = Math.round(
                (new Date().getTime() - activeWorkout.value.startTime.getTime()) / 60_000,
            );

            // Determine workout type based on plan category and exercise structure
            const isCardioWorkout = activeWorkout.value.planCategory === "cardio";
            const isCircuitWorkout =
                isCardioWorkout &&
                activeWorkout.value.exercises.some(
                    (exercise) =>
                        exercise.reps !== undefined ||
                        (exercise.actualSets && exercise.actualSets.length > 0),
                );

            if (isCardioWorkout && !isCircuitWorkout) {
                const workout: Omit<CardioWorkout, "id"> = {
                    date: Timestamp.fromDate(activeWorkout.value.startTime),
                    exerciseEntries: activeWorkout.value.exercises
                        .filter(({ completed }) => completed)
                        .map((exercise) => ({
                            calories: 0,
                            distanceKm: exercise.actualDistance ?? 0,
                            durationMinutes:
                                exercise.actualDuration ??
                                (exercise.duration ? Math.round(exercise.duration / 60) : 0),
                            exerciseId: exercise.exerciseId,
                            exerciseNotes: exercise.notes ?? "",
                            intensity: "medium",
                            type: "cardio",
                        })),
                    name: `${activeWorkout.value.planName}: ${activeWorkout.value.dayName}`,
                    overallNotes: `Completed from training plan: ${activeWorkout.value.planName}`,
                    type: "cardio",
                    userId: authStore.nonNullableUser.uid,
                };

                const workoutId = await addWorkout(workout);
                activeWorkout.value = null;
                clearFromLocalStorage();
                return workoutId;
            } else if (isCircuitWorkout) {
                const workout: Omit<CircuitWorkout, "id"> = {
                    date: Timestamp.fromDate(activeWorkout.value.startTime),
                    exerciseEntries: activeWorkout.value.exercises
                        .filter(function (exercise) {
                            return (
                                exercise.completed ||
                                exercise.actualSets?.some((set) => set.completed)
                            );
                        })
                        .map((exercise) => ({
                            // Include cardio metrics if available
                            // Could calculate based on exercise  -- FIXME
                            calories: 0,
                            distanceKm: exercise.actualDistance ?? 0,
                            durationSeconds: exercise.duration,
                            exerciseId: exercise.exerciseId,
                            exerciseNotes: exercise.notes ?? "",
                            // Most circuit training is high intensity
                            intensity: "high",
                            sets: exercise.actualSets
                                ? exercise.actualSets
                                      .filter((set) => set.completed)
                                      .map((set) => ({
                                          reps: set.reps,
                                          weight: set.weight,
                                      }))
                                : [
                                      {
                                          reps: exercise.reps || 0,
                                          weight: 0,
                                      },
                                  ],
                            type: "circuit",
                        })),
                    name: `${activeWorkout.value.planName}: ${activeWorkout.value.dayName}`,
                    overallNotes: `Completed from training plan: ${activeWorkout.value.planName}`,
                    type: "circuit",
                    userId: authStore.nonNullableUser.uid,
                    workoutDurationMinutes: durationMinutes,
                };

                const workoutId = await addWorkout(workout);
                activeWorkout.value = null;
                clearFromLocalStorage();
                return workoutId;
            }
            const workout: Omit<StrengthWorkout, "id"> = {
                date: Timestamp.fromDate(activeWorkout.value.startTime),
                exerciseEntries: activeWorkout.value.exercises
                    .filter(function (exercise) {
                        return (
                            exercise.completed || exercise.actualSets?.some((set) => set.completed)
                        );
                    })
                    .map((exercise) => ({
                        exerciseId: exercise.exerciseId,
                        exerciseNotes: exercise.notes ?? "",
                        sets: exercise.actualSets
                            ? exercise.actualSets
                                  .filter((set) => set.completed)
                                  .map((set) => ({
                                      reps: set.reps,
                                      weight: set.weight,
                                  }))
                            : [
                                  {
                                      reps: exercise.reps || 0,
                                      weight: 0,
                                  },
                              ],
                        type: "strength",
                    })),
                name: `${activeWorkout.value.planName}: ${activeWorkout.value.dayName}`,
                overallNotes: `Completed from training plan: ${activeWorkout.value.planName}`,
                type: "strength",
                userId: authStore.nonNullableUser.uid,
                workoutDurationMinutes: durationMinutes,
            };

            const workoutId = await addWorkout(workout);

            activeWorkout.value = null;
            clearFromLocalStorage();

            return workoutId;
        } catch (error) {
            logger.error("Failed to save workout:", "activeWorkoutStore", error);
            return null;
        }
    }

    function cancelWorkout(): void {
        activeWorkout.value = null;
        clearFromLocalStorage();
    }

    function saveToLocalStorage(): void {
        try {
            const storageKey = `active-workout`;

            const rawData = toRaw(activeWorkout.value);
            const serializedData = cloneDeep(rawData);

            localStorage.setItem(storageKey, JSON.stringify(serializedData));
        } catch (error) {
            logger.error(
                "Failed to save active workout to localStorage:",
                "activeWorkoutStore",
                error,
            );
        }
    }

    function loadFromLocalStorage(): void {
        try {
            const storageKey = `active-workout`;

            const storedData = localStorage.getItem(storageKey);
            if (!storedData) return;

            const parsedData = JSON.parse(storedData);

            if (parsedData) {
                parsedData.startTime = new Date(parsedData.startTime);
            }

            activeWorkout.value = parsedData;
        } catch (error) {
            logger.error(
                "Failed to load active workout from localStorage:",
                "activeWorkoutStore",
                error,
            );
        }
    }

    loadFromLocalStorage();

    return {
        activeWorkout,
        cancelWorkout,
        endWorkout,
        isWorkoutActive,
        startWorkout,
        toggleExerciseCompletion,
        toggleSetCompletion,
        updateSetData,
    };
});

function clearFromLocalStorage(): void {
    try {
        const storageKey = `active-workout`;
        localStorage.removeItem(storageKey);
    } catch (error) {
        logger.error(
            "Failed to clear active workout from localStorage:",
            "activeWorkoutStore",
            error,
        );
    }
}
