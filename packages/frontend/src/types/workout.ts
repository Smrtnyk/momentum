import type { Timestamp } from "firebase/firestore";

export type CardioWorkout = WorkoutBase & {
    exerciseEntries: CardioExerciseEntry[];
    type: "cardio";
};

export interface CircuitExerciseEntry extends BaseExerciseEntry {
    calories: number | undefined;
    distanceKm: number | undefined;
    durationSeconds: number | undefined;
    intensity: "high" | "low" | "medium" | undefined;
    sets: ExerciseSet[];
    type: "circuit";
}

export type CircuitWorkout = WorkoutBase & {
    exerciseEntries: CircuitExerciseEntry[];
    type: "circuit";
    workoutDurationMinutes: number;
};

export type StrengthWorkout = WorkoutBase & {
    exerciseEntries: StrengthExerciseEntry[];
    type: "strength";
    workoutDurationMinutes: number;
};

export type Workout = CardioWorkout | CircuitWorkout | StrengthWorkout;

export type WorkoutWithId = Workout & {
    id: string;
};

interface BaseExerciseEntry {
    exerciseId: string;
    exerciseNotes?: string;
}

interface CardioExerciseEntry extends BaseExerciseEntry {
    calories?: number;
    distanceKm?: number;
    durationMinutes: number;
    intensity: "high" | "low" | "medium";
    type: "cardio";
}

interface ExerciseSet {
    reps: number;
    weight: number;
}

interface StrengthExerciseEntry extends BaseExerciseEntry {
    sets: ExerciseSet[];
    type: "strength";
}

interface WorkoutBase {
    date: Timestamp;
    id: string;
    name: string;
    overallNotes: string;
    userId: string;
}
