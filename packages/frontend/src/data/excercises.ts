export interface Exercise {
    description?: string;
    id: string;
    // IDs of muscles targeted by this exercise
    muscleIds: string[];
    name: string;
}

export interface Muscle {
    id: string;
    name: string;
}

export function getExercises(): Exercise[] {
    return [
        {
            id: "bench-press",
            muscleIds: ["chest", "shoulders", "arms"],
            name: "Bench Press",
        },
        {
            id: "incline-bench-press",
            muscleIds: ["chest", "shoulders", "arms"],
            name: "Incline Bench Press",
        },
        {
            id: "dumbbell-press",
            muscleIds: ["chest", "shoulders", "arms"],
            name: "Dumbbell Press",
        },
        { id: "push-ups", muscleIds: ["chest", "arms", "core"], name: "Push-ups" },
        { id: "chest-flyes", muscleIds: ["chest"], name: "Chest Flyes" },
        { id: "cable-crossovers", muscleIds: ["chest"], name: "Cable Crossovers" },

        { id: "squat", muscleIds: ["legs", "core"], name: "Squat" },
        { id: "leg-press", muscleIds: ["legs"], name: "Leg Press" },
        { id: "deadlift", muscleIds: ["legs", "back", "core"], name: "Deadlift" },
        {
            id: "romanian-deadlift",
            muscleIds: ["legs", "core"],
            name: "Romanian Deadlift",
        },
        { id: "leg-extension", muscleIds: ["legs"], name: "Leg Extension" },
        { id: "leg-curl", muscleIds: ["legs"], name: "Leg Curl" },
        { id: "calf-raises", muscleIds: ["legs"], name: "Calf Raises" },

        { id: "pull-ups", muscleIds: ["back", "arms"], name: "Pull-ups" },
        { id: "lat-pulldown", muscleIds: ["back", "arms"], name: "Lat Pulldown" },
        { id: "bent-over-row", muscleIds: ["back", "arms"], name: "Bent Over Row" },
        { id: "seated-row", muscleIds: ["back", "arms"], name: "Seated Row" },
        {
            id: "hyperextensions",
            muscleIds: ["back", "core"],
            name: "Hyperextensions",
        },

        {
            id: "overhead-press",
            muscleIds: ["shoulders", "arms", "chest"],
            name: "Overhead Press",
        },
        { id: "lateral-raises", muscleIds: ["shoulders"], name: "Lateral Raises" },
        { id: "front-raises", muscleIds: ["shoulders"], name: "Front Raises" },
        { id: "shrugs", muscleIds: ["shoulders"], name: "Shrugs" },
        {
            id: "upright-row",
            muscleIds: ["shoulders", "arms"],
            name: "Upright Row",
        },

        { id: "bicep-curls", muscleIds: ["arms"], name: "Bicep Curls" },
        { id: "tricep-dips", muscleIds: ["arms"], name: "Tricep Dips" },
        { id: "tricep-pushdown", muscleIds: ["arms"], name: "Tricep Pushdown" },
        { id: "hammer-curls", muscleIds: ["arms"], name: "Hammer Curls" },
        { id: "cable-curls", muscleIds: ["arms"], name: "Cable Curls" },

        {
            id: "abdominal-crunches",
            muscleIds: ["core"],
            name: "Abdominal Crunches",
        },
        { id: "plank", muscleIds: ["core"], name: "Plank" },
        { id: "russian-twist", muscleIds: ["core"], name: "Russian Twist" },
        { id: "leg-raises", muscleIds: ["core"], name: "Leg Raises" },

        { id: "lunges", muscleIds: ["legs", "core"], name: "Lunges" },
        { id: "chin-ups", muscleIds: ["back", "arms"], name: "Chin-ups" },
        {
            id: "arnold-press",
            muscleIds: ["shoulders", "arms", "chest"],
            name: "Arnold Press",
        },
        {
            id: "kettlebell-swings",
            muscleIds: ["legs", "core"],
            name: "Kettlebell Swings",
        },
        {
            id: "mountain-climbers",
            muscleIds: ["core", "legs"],
            name: "Mountain Climbers",
        },
        { id: "hip-thrusts", muscleIds: ["legs", "core"], name: "Hip Thrusts" },
        {
            id: "tricep-kickbacks",
            muscleIds: ["arms"],
            name: "Tricep Kickbacks",
        },
    ];
}

export function getMuscleGroups(): Muscle[] {
    return [
        { id: "chest", name: "Chest" },
        { id: "back", name: "Back" },
        { id: "legs", name: "Legs" },
        { id: "shoulders", name: "Shoulders" },
        { id: "arms", name: "Arms" },
        { id: "core", name: "Core" },
    ];
}
