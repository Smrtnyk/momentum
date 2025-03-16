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

export interface ExerciseEntry {
    calories?: number | undefined;
    distanceKm?: number | undefined;
    durationSeconds: number | undefined;
    exerciseId: string;
    exerciseNotes?: string;
    intensity?: "high" | "low" | "medium" | undefined;
    sets?: ExerciseSet[];
}

export interface ExerciseSet {
    reps: number;
    weight: number;
}
export type StrengthExerciseEntry = ExerciseEntry & { sets: NonNullable<ExerciseEntry["sets"]> };

export type Workout = WorkoutBase;

export interface WorkoutBase {
    date: Timestamp;
    exerciseEntries: ExerciseEntry[];
    id: string;
    name: string;
    overallNotes: string;
    workoutDurationMinutes?: number;
}

export type WorkoutWithId = Workout & {
    id: string;
};
