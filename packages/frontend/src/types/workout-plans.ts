export type DifficultyLevel = "advanced" | "beginner" | "intermediate";
export interface ExercisePlanEntry {
    distanceKm?: number | undefined;
    durationSeconds?: number | undefined;
    exerciseId: string;
    exerciseNotes?: string;
    reps?: number;
    restTime: number;
    setsCount: number;
}
export interface TrainingPlan {
    author: string;
    description: string;
    durationWeeks: number;
    equipment?: string[];
    frequency: number;
    goals: string[];
    id: string;
    image?: string;
    isCustom?: boolean;
    level: DifficultyLevel;
    location: WorkoutLocation;
    name: string;
    scienceReference?: string;
    targetMuscleGroups?: string[];
    type: TrainingPlanType;
    workoutDays: WorkoutDay[];
}

export type TrainingPlanType = "cardio" | "hybrid" | "strength";

export interface WorkoutDay {
    exerciseEntries: ExercisePlanEntry[];
    id: string;
    name: string;
    overallNotes?: string;
}

export type WorkoutLocation = "anywhere" | "gym" | "home";
