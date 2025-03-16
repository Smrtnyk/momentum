import { cloneDeep } from "es-toolkit";
import { Timestamp } from "firebase/firestore";
import { defineStore } from "pinia";
import { computed, ref, toRaw } from "vue";

import type { ActiveExercise, ActiveWorkout, ExerciseEntry, WorkoutBase } from "../types/workout";
import type { TrainingPlan, WorkoutDay } from "../types/workout-plans";

import { getDateFromMaybeTimestamp } from "../helpers/date-utils";
import { logger } from "../logger/app-logger";
import { addWorkout } from "../services/workout";
import { useAuthStore } from "./auth";

const STORAGE_KEY = "active-workout";

export const useActiveWorkoutStore = defineStore("activeWorkout", () => {
    const authStore = useAuthStore();
    const activeWorkout = ref<ActiveWorkout | null>(null);
    const isWorkoutActive = computed(() => activeWorkout.value !== null);

    function withWorkout<T>(fn: (workout: ActiveWorkout) => T): T | undefined {
        if (!activeWorkout.value) return;
        return fn(activeWorkout.value);
    }

    function createBaseWorkout(
        id: string,
        name: string,
        planId: string = id,
        planName: string = name,
        isCustom = false,
    ): ActiveWorkout {
        return {
            customWorkout: isCustom,
            date: new Date(),
            exerciseEntries: [],
            id,
            name,
            overallNotes: "",
            planId,
            planName,
        };
    }

    function updateExerciseCompletion(exerciseIndex: number, completionStatus: boolean): void {
        withWorkout((workout) => {
            const exercise = workout.exerciseEntries[exerciseIndex];
            if (!exercise) return;

            exercise.completed = completionStatus;

            if (Number(exercise.sets?.length) > 0) {
                exercise.sets?.forEach((set) => {
                    set.completed = completionStatus;
                });
            }

            saveToStorage(workout);
        });
    }

    function startWorkout(plan: TrainingPlan, day: WorkoutDay): void {
        const exercises = createExercisesFromPlan(day);

        activeWorkout.value = {
            ...createBaseWorkout(day.id, day.name, plan.id, plan.name),
            exerciseEntries: exercises,
        };

        saveToStorage(activeWorkout.value);
    }

    function startCustomWorkout(name = "Custom Workout"): void {
        activeWorkout.value = createBaseWorkout("custom", name, "custom", name, true);

        saveToStorage(activeWorkout.value);
    }

    function toggleExerciseCompletion(exerciseIndex: number): void {
        withWorkout((workout) => {
            const exercise = workout.exerciseEntries[exerciseIndex];
            if (!exercise) return;

            updateExerciseCompletion(exerciseIndex, !exercise.completed);
        });
    }

    function toggleSetCompletion(exerciseIndex: number, setIndex: number): void {
        withWorkout((workout) => {
            const exercise = workout.exerciseEntries[exerciseIndex];
            if (!exercise?.sets?.[setIndex]) return;

            exercise.sets[setIndex].completed = !exercise.sets[setIndex].completed;

            const allCompleted = exercise.sets.every((set) => set.completed);
            const anyCompleted = exercise.sets.some((set) => set.completed);

            if (allCompleted && !exercise.completed) {
                exercise.completed = true;
            } else if (!anyCompleted && exercise.completed) {
                exercise.completed = false;
            }

            saveToStorage(workout);
        });
    }

    function updateSetData(
        exerciseIndex: number,
        setIndex: number,
        reps: number,
        weight: number,
    ): void {
        withWorkout((workout) => {
            const exercise = workout.exerciseEntries[exerciseIndex];
            if (!exercise?.sets?.[setIndex]) return;

            exercise.sets[setIndex].reps = reps;
            exercise.sets[setIndex].weight = weight;

            saveToStorage(workout);
        });
    }

    function addExerciseToWorkout(exercise: Omit<ActiveExercise, "completed">): void {
        withWorkout((workout) => {
            workout.exerciseEntries.push({
                ...exercise,
                completed: false,
            });

            saveToStorage(workout);
        });
    }

    function removeExerciseFromWorkout(exerciseIndex: number): void {
        withWorkout((workout) => {
            workout.exerciseEntries.splice(exerciseIndex, 1);
            saveToStorage(workout);
        });
    }

    function getWorkoutBasics(
        workout: ActiveWorkout,
    ): Pick<WorkoutBase, "date" | "name" | "overallNotes"> {
        return {
            date: Timestamp.fromDate(getDateFromMaybeTimestamp(workout.date)),
            name: workout.name,
            overallNotes: workout.customWorkout
                ? ""
                : `Completed from training plan: ${workout.planName}`,
        };
    }

    function endWorkout(): Promise<null | string> {
        if (!activeWorkout.value) return Promise.resolve(null);

        return (async () => {
            try {
                if (!activeWorkout.value) return null;

                const workout = activeWorkout.value;
                const durationMinutes = Math.round(
                    (new Date().getTime() - getDateFromMaybeTimestamp(workout.date).getTime()) /
                        60_000,
                );

                const basics = getWorkoutBasics(workout);
                const completedExercises = filterCompletedExercises(workout.exerciseEntries);

                const workoutData: Omit<WorkoutBase, "id"> = {
                    ...basics,
                    exerciseEntries: mapToExerciseEntries(completedExercises),
                    workoutDurationMinutes: durationMinutes,
                };

                const workoutId = await addWorkout(workoutData, authStore.nonNullableUser.uid);

                activeWorkout.value = null;
                saveToStorage(null);

                return workoutId;
            } catch (error) {
                logger.error("Failed to save workout:", "activeWorkoutStore", error);
                return null;
            }
        })();
    }

    function cancelWorkout(): void {
        activeWorkout.value = null;
        saveToStorage(null);
    }

    const storedWorkout = loadFromStorage();
    if (storedWorkout) {
        activeWorkout.value = storedWorkout;
    }

    return {
        activeWorkout,
        addExerciseToWorkout,
        cancelWorkout,
        endWorkout,
        isWorkoutActive,
        removeExerciseFromWorkout,
        saveToLocalStorage: () => saveToStorage(activeWorkout.value),
        startCustomWorkout,
        startWorkout,
        toggleExerciseCompletion,
        toggleSetCompletion,
        updateSetData,
    };
});

function createExercisesFromPlan(day: WorkoutDay): ActiveExercise[] {
    return day.exerciseEntries.map((exercise) => ({
        ...exercise,
        completed: false,
        durationSeconds: exercise.durationSeconds
            ? Math.round(exercise.durationSeconds)
            : undefined,
        sets: exercise.setsCount
            ? Array.from({ length: exercise.setsCount })
                  .fill(null)
                  .map(() => ({
                      completed: false,
                      reps: exercise.reps ?? 0,
                      weight: 0,
                  }))
            : [],
    }));
}

function filterCompletedExercises(exercises: ActiveExercise[]): ActiveExercise[] {
    return exercises.filter(
        (exercise) => exercise.completed ?? exercise.sets?.some((set) => set.completed),
    );
}

function loadFromStorage(): ActiveWorkout | null {
    return (
        withLocalStorage((key) => {
            const storedData = localStorage.getItem(key);
            if (!storedData) return null;

            const parsedData = JSON.parse(storedData);

            if (parsedData?.startTime) {
                parsedData.startTime = new Date(parsedData.startTime);
            }

            return parsedData;
        }, "Failed to load active workout from localStorage:") ?? null
    );
}

function mapToExerciseEntries(exercises: ActiveExercise[]): ExerciseEntry[] {
    return exercises.map((exercise) => ({
        calories: 0,
        distanceKm: exercise.distanceKm ?? 0,
        durationSeconds: exercise.durationSeconds,
        exerciseId: exercise.exerciseId,
        exerciseNotes: exercise.exerciseNotes ?? "",
        intensity: exercise.intensity ?? "high",
        sets:
            exercise.sets
                ?.filter((set) => set.completed)
                .map((set) => ({
                    reps: set.reps,
                    weight: set.weight,
                })) ?? [],
    }));
}

function saveToStorage(workout: ActiveWorkout | null): void {
    withLocalStorage((key) => {
        if (!workout) {
            localStorage.removeItem(key);
            return;
        }
        const rawData = toRaw(workout);
        const serializedData = cloneDeep(rawData);
        localStorage.setItem(key, JSON.stringify(serializedData));
    }, "Failed to save active workout to localStorage:");
}

function withLocalStorage<T>(operation: (key: string) => T, errorMsg: string): T | undefined {
    try {
        return operation(STORAGE_KEY);
    } catch (error) {
        logger.error(errorMsg, "activeWorkoutStore", error);
        return undefined;
    }
}
