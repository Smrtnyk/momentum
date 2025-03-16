export type DifficultyLevel = "advanced" | "beginner" | "intermediate";
export interface TrainingPlan {
    author: string;
    description: string;
    durationWeeks: number;
    equipment?: string[];
    frequency: number;
    goals: string[];

    id: string;
    image?: string;
    level: DifficultyLevel;
    location: WorkoutLocation;
    name: string;
    scienceReference?: string;
    targetMuscleGroups?: string[];
    type: "cardio" | "circuit" | "strength";
    workoutDays: WorkoutDay[];
}

export interface WorkoutDay {
    exerciseEntries: ExercisePlanEntry[];
    id: string;
    name: string;
    overallNotes?: string;
}

interface ExercisePlanEntry {
    distanceKm?: number | undefined;
    durationSeconds?: number | undefined;
    exerciseId: string;
    exerciseNotes?: string;
    reps?: number;
    restTime: number;
    setsCount: number;
}

type WorkoutLocation = "anywhere" | "gym" | "home";
