import type { Timestamp } from "firebase/firestore";

export type CardioWorkout = WorkoutBase & {
    exerciseEntries: CardioExerciseEntry[];
    type: "cardio";
};

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
