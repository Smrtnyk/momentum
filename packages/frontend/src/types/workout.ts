import type { Timestamp } from "firebase/firestore";

export interface CardioExerciseEntry extends BaseExerciseEntry {
    distanceKm?: number;
    durationMinutes: number;
    intensity: "high" | "low" | "medium";
    type: "cardio";
}

export type CardioWorkout = WorkoutBase & {
    exerciseEntries: CardioExerciseEntry[];
    type: "cardio";
};

export interface ExerciseEntry {
    exerciseId: string;
    exerciseNotes?: string;
    sets: ExerciseSet[];
}

export interface ExerciseSet {
    reps: number;
    weight: number;
}

export interface StrengthExerciseEntry extends BaseExerciseEntry {
    sets: ExerciseSet[];
    type: "strength";
}

export type StrengthWorkout = WorkoutBase & {
    exerciseEntries: StrengthExerciseEntry[];
    type: "strength";
    workoutDurationMinutes: number;
};

export type Workout = CardioWorkout | StrengthWorkout;

export type WorkoutWithId = Workout & {
    id: string;
};

interface BaseExerciseEntry {
    exerciseId: string;
    exerciseNotes?: string;
}

interface WorkoutBase {
    date: Timestamp;
    name: string;
    overallNotes: string;
    userId: string;
}
