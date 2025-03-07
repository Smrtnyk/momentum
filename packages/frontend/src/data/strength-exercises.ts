import type { Exercise } from "../types/exercise";

interface Muscle {
    id: string;
    name: string;
}

export function getExerciseById(id: string): Exercise {
    return (
        strengthExercises.find((exercise) => exercise.id === id) ||
        ({ id, muscleIds: [], name: id } as Exercise)
    );
}

export function getMuscleById(id: string): Muscle {
    return getMuscleGroups().find((muscle) => muscle.id === id) ?? { id, name: id };
}

const homeStrengthExercises: readonly Exercise[] = [
    // Bodyweight strength exercises
    { id: "bodyweight-squats", muscleIds: ["legs", "core"], name: "Bodyweight Squats" },
    {
        id: "bodyweight-bulgarian-split-squats",
        muscleIds: ["legs", "core"],
        name: "Bodyweight Bulgarian Split Squats",
    },
    { id: "chair-dips", muscleIds: ["arms", "chest"], name: "Chair Dips" },
    { id: "chair-step-ups", muscleIds: ["legs"], name: "Chair Step-Ups" },
    { id: "superman", muscleIds: ["back", "core"], name: "Superman" },
    { id: "glute-bridges", muscleIds: ["legs", "core"], name: "Glute Bridges" },
    { id: "plank-shoulder-taps", muscleIds: ["core", "arms"], name: "Plank Shoulder Taps" },
    { id: "wall-sits", muscleIds: ["legs"], name: "Wall Sits" },
    { id: "wall-push-ups", muscleIds: ["chest", "arms"], name: "Wall Push-Ups" },
    { id: "prone-y-t-w-raises", muscleIds: ["back", "shoulders"], name: "Prone Y-T-W Raises" },

    // Resistance band strength exercises
    { id: "resistance-band-rows", muscleIds: ["back", "arms"], name: "Resistance Band Rows" },
    {
        id: "resistance-band-chest-press",
        muscleIds: ["chest", "arms"],
        name: "Resistance Band Chest Press",
    },
    {
        id: "resistance-band-lateral-raises",
        muscleIds: ["shoulders"],
        name: "Resistance Band Lateral Raises",
    },
    { id: "resistance-band-bicep-curls", muscleIds: ["arms"], name: "Resistance Band Bicep Curls" },
    {
        id: "resistance-band-tricep-extensions",
        muscleIds: ["arms"],
        name: "Resistance Band Tricep Extensions",
    },
    { id: "resistance-band-squats", muscleIds: ["legs"], name: "Resistance Band Squats" },
    {
        id: "resistance-band-full-body-circuit",
        muscleIds: ["chest", "back", "arms", "legs"],
        name: "Resistance Band Full-Body Circuit",
    },

    // Mobility/flexibility exercises
    { id: "cat-cow", muscleIds: ["back", "core"], name: "Cat-Cow Stretch" },
    {
        id: "world's-greatest-stretch",
        muscleIds: ["legs", "core", "back"],
        name: "World's Greatest Stretch",
    },
    { id: "thoracic-spine-rotations", muscleIds: ["back"], name: "Thoracic Spine Rotations" },
    { id: "hip-circles", muscleIds: ["legs", "core"], name: "Hip Circles" },
    { id: "standing-side-bends", muscleIds: ["core"], name: "Standing Side Bends" },
    { id: "wall-slides", muscleIds: ["shoulders", "back"], name: "Wall Slides" },
];

export const strengthExercises: readonly Exercise[] = [
    // Chest exercises
    { id: "bench-press", muscleIds: ["chest", "shoulders", "arms"], name: "Bench Press" },
    {
        id: "incline-bench-press",
        muscleIds: ["chest", "shoulders", "arms"],
        name: "Incline Bench Press",
    },
    { id: "dumbbell-press", muscleIds: ["chest", "shoulders", "arms"], name: "Dumbbell Press" },
    { id: "push-ups", muscleIds: ["chest", "arms", "core"], name: "Push-ups" },
    { id: "chest-flyes", muscleIds: ["chest"], name: "Chest Flyes" },
    { id: "cable-crossovers", muscleIds: ["chest"], name: "Cable Crossovers" },
    {
        id: "incline-dumbbell-bench-press",
        muscleIds: ["chest", "shoulders", "arms"],
        name: "Incline Dumbbell Bench Press",
    },
    {
        id: "decline-bench-press",
        muscleIds: ["chest", "shoulders", "arms"],
        name: "Decline Bench Press",
    },
    { id: "chest-dips", muscleIds: ["chest", "arms"], name: "Chest Dips" },

    // Leg exercises
    { id: "squat", muscleIds: ["legs", "core"], name: "Squat" },
    { id: "leg-press", muscleIds: ["legs"], name: "Leg Press" },
    { id: "deadlift", muscleIds: ["legs", "back", "core"], name: "Deadlift" },
    { id: "romanian-deadlift", muscleIds: ["legs", "core"], name: "Romanian Deadlift" },
    { id: "leg-extension", muscleIds: ["legs"], name: "Leg Extension" },
    { id: "leg-curl", muscleIds: ["legs"], name: "Leg Curl" },
    { id: "calf-raises", muscleIds: ["legs"], name: "Calf Raises" },
    { id: "lunges", muscleIds: ["legs", "core"], name: "Lunges" },
    { id: "kettlebell-swings", muscleIds: ["legs", "core"], name: "Kettlebell Swings" },
    { id: "mountain-climbers", muscleIds: ["core", "legs"], name: "Mountain Climbers" },
    { id: "hip-thrusts", muscleIds: ["legs", "core"], name: "Hip Thrusts" },
    {
        id: "incline-smith-machine-bench-press",
        muscleIds: ["chest", "shoulders", "arms"],
        name: "Incline Bar Bench Press (Smith Machine)",
    },
    {
        id: "bulgarian-split-squats",
        muscleIds: ["legs", "core"],
        name: "Bulgarian Split Squats",
    },

    // Back exercises
    { id: "pull-ups", muscleIds: ["back", "arms"], name: "Pull-ups" },
    { id: "lat-pulldown", muscleIds: ["back", "arms"], name: "Lat Pulldown" },
    { id: "bent-over-row", muscleIds: ["back", "arms"], name: "Bent Over Row" },
    { id: "seated-row", muscleIds: ["back", "arms"], name: "Seated Row" },
    { id: "hyperextensions", muscleIds: ["back", "core"], name: "Hyperextensions" },
    { id: "chin-ups", muscleIds: ["back", "arms"], name: "Chin-ups" },
    {
        id: "one-arm-dumbbell-row",
        muscleIds: ["back", "arms"],
        name: "One-Arm Dumbbell Row",
    },
    {
        id: "cable-face-pulls",
        muscleIds: ["shoulders", "back"],
        name: "Cable Face Pulls",
    },
    { id: "rope-pull-down", muscleIds: ["back", "arms"], name: "Rope Pull-Down" },

    // Shoulder exercises
    {
        id: "barbell-overhead-press",
        muscleIds: ["shoulders", "arms", "chest"],
        name: "Barbell Overhead Press",
    },
    {
        id: "dumbbell-shoulder-press",
        muscleIds: ["shoulders", "arms"],
        name: "Dumbbell Shoulder Press",
    },
    { id: "lateral-raises", muscleIds: ["shoulders"], name: "Lateral Raises" },
    { id: "cable-lateral-raises", muscleIds: ["shoulders"], name: "Cable Lateral Raises" },
    { id: "front-raises", muscleIds: ["shoulders"], name: "Front Raises" },
    { id: "shrugs", muscleIds: ["shoulders"], name: "Shrugs" },
    { id: "upright-row", muscleIds: ["shoulders", "arms"], name: "Upright Row" },
    { id: "arnold-press", muscleIds: ["shoulders", "arms", "chest"], name: "Arnold Press" },
    { id: "reverse-flyes", muscleIds: ["shoulders", "back"], name: "Reverse Flyes" },
    {
        id: "plate-loaded-seated-shoulder-press",
        muscleIds: ["shoulders", "arms"],
        name: "Plate-Loaded Seated Shoulder Press",
    },

    // Arm exercises
    { id: "bicep-curls", muscleIds: ["arms"], name: "Bicep Curls" },
    { id: "tricep-dips", muscleIds: ["arms"], name: "Tricep Dips" },
    { id: "tricep-pushdown", muscleIds: ["arms"], name: "Tricep Pushdown" },
    { id: "hammer-curls", muscleIds: ["arms"], name: "Hammer Curls" },
    { id: "cable-curls", muscleIds: ["arms"], name: "Cable Curls" },
    { id: "tricep-kickbacks", muscleIds: ["arms"], name: "Tricep Kickbacks" },
    {
        id: "biceps-curls-with-cables",
        muscleIds: ["arms"],
        name: "Biceps Curls with Cables",
    },
    {
        id: "skull-crushers",
        muscleIds: ["arms"],
        name: "Skull Crushers",
    },
    {
        id: "preacher-curls",
        muscleIds: ["arms"],
        name: "Preacher Curls",
    },
    { id: "biceps-hammer-curls", muscleIds: ["arms"], name: "Hammer Curls for Biceps" },

    // Core exercises
    { id: "abdominal-crunches", muscleIds: ["core"], name: "Abdominal Crunches" },
    { id: "plank", muscleIds: ["core"], name: "Plank" },
    { id: "russian-twist", muscleIds: ["core"], name: "Russian Twist" },
    { id: "leg-raises", muscleIds: ["core"], name: "Leg Raises" },

    ...homeStrengthExercises,
];

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
