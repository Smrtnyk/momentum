export type DifficultyLevel = "advanced" | "beginner" | "intermediate";
export interface ExerciseSet {
    distance?: number;
    duration?: number;
    exerciseId: string;
    notes?: string;
    reps?: number;
    restTime: number;
    sets: number;
}

export type PlanCategory = "cardio" | "hybrid" | "strength";
export interface TrainingPlan {
    author: string;
    category: PlanCategory;
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
    workoutDays: WorkoutDay[];
}
export interface WorkoutDay {
    exercises: ExerciseSet[];
    id: string;
    name: string;
    notes?: string;
}

type WorkoutLocation = "anywhere" | "gym" | "home";
