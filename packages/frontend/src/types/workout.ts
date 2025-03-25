import type { Timestamp } from "firebase/firestore";

export interface ActiveExercise extends ExerciseEntry {
    completed: boolean;
    reps?: number;
    sets?: ActiveSet[];
    setsCount?: number;
}

export interface ActiveSet extends ExerciseSet {
    completed: boolean;
}

export interface ActiveWorkout {
    customWorkout?: boolean;
    date: Date | string;
    exerciseEntries: ActiveExercise[];
    id: string;
    name: string;
    overallNotes: string;
    planId: string;
    planName?: string;
}

export type CardioExerciseEntry = ExerciseEntry & {
    calories: NonNullable<ExerciseEntry["calories"]>;
    durationSeconds: NonNullable<ExerciseEntry["durationSeconds"]>;
    intensity: NonNullable<ExerciseEntry["intensity"]>;
};

export interface ExerciseEntry extends BaseExerciseEntry {
    sets?: ExerciseSet[];
}

export interface ExerciseSet {
    reps: number;
    weight: number;
}

export type StrengthExerciseEntry = ExerciseEntry & { sets: NonNullable<ExerciseEntry["sets"]> };

export interface Workout {
    date: Timestamp;
    exerciseEntries: ExerciseEntry[];
    exercisesExecuted?: string[];
    id: string;
    name: string;
    overallNotes: string;
    workoutDurationMinutes?: number;
}

export type WorkoutWithId = Workout & {
    id: string;
};

interface BaseExerciseEntry {
    calories?: number | undefined;
    category: string;
    distanceKm?: number | undefined;
    durationSeconds: number;
    exerciseId: string;
    exerciseNotes?: string;
    intensity?: "high" | "low" | "medium" | undefined;
}
