import type { Exercise, Muscle } from "../types/exercise";

import { cardioExercises } from "../data/cardio-exercises";
import { strengthExercises } from "../data/strength-exercises";

export function getExerciseById(exerciseId: string): Exercise {
    const strengthExercise = strengthExercises.find((x) => x.exerciseId === exerciseId);

    if (strengthExercise) {
        return strengthExercise;
    }

    const cardioExercise = cardioExercises.find((x) => x.exerciseId === exerciseId);

    if (cardioExercise) {
        return cardioExercise;
    }

    throw new Error("Unknow exercise id");
}

export function getMuscleById(exerciseId: string): Muscle {
    return (
        getMuscleGroups().find((muscle) => muscle.exerciseId === exerciseId) ?? {
            exerciseId,
            name: exerciseId,
        }
    );
}

export function getMuscleGroups(): Muscle[] {
    return [
        { exerciseId: "chest", name: "Chest" },
        { exerciseId: "back", name: "Back" },
        { exerciseId: "legs", name: "Legs" },
        { exerciseId: "shoulders", name: "Shoulders" },
        { exerciseId: "arms", name: "Arms" },
        { exerciseId: "core", name: "Core" },
    ];
}
