import type { Exercise } from "../types/exercise";

const homeStrengthExercises: readonly Exercise[] = [
    // Bodyweight strength exercises
    { exerciseId: "bodyweight-squats", muscleIds: ["legs", "core"], name: "Bodyweight Squats" },
    {
        exerciseId: "bodyweight-bulgarian-split-squats",
        muscleIds: ["legs", "core"],
        name: "Bodyweight Bulgarian Split Squats",
    },
    { exerciseId: "chair-dips", muscleIds: ["arms", "chest"], name: "Chair Dips" },
    { exerciseId: "chair-step-ups", muscleIds: ["legs"], name: "Chair Step-Ups" },
    { exerciseId: "superman", muscleIds: ["back", "core"], name: "Superman" },
    { exerciseId: "glute-bridges", muscleIds: ["legs", "core"], name: "Glute Bridges" },
    { exerciseId: "plank-shoulder-taps", muscleIds: ["core", "arms"], name: "Plank Shoulder Taps" },
    { exerciseId: "wall-sits", muscleIds: ["legs"], name: "Wall Sits" },
    { exerciseId: "wall-push-ups", muscleIds: ["chest", "arms"], name: "Wall Push-Ups" },
    {
        exerciseId: "prone-y-t-w-raises",
        muscleIds: ["back", "shoulders"],
        name: "Prone Y-T-W Raises",
    },

    // Resistance band strength exercises
    {
        exerciseId: "resistance-band-rows",
        muscleIds: ["back", "arms"],
        name: "Resistance Band Rows",
    },
    {
        exerciseId: "resistance-band-chest-press",
        muscleIds: ["chest", "arms"],
        name: "Resistance Band Chest Press",
    },
    {
        exerciseId: "resistance-band-lateral-raises",
        muscleIds: ["shoulders"],
        name: "Resistance Band Lateral Raises",
    },
    {
        exerciseId: "resistance-band-bicep-curls",
        muscleIds: ["arms"],
        name: "Resistance Band Bicep Curls",
    },
    {
        exerciseId: "resistance-band-tricep-extensions",
        muscleIds: ["arms"],
        name: "Resistance Band Tricep Extensions",
    },
    { exerciseId: "resistance-band-squats", muscleIds: ["legs"], name: "Resistance Band Squats" },
    {
        exerciseId: "resistance-band-full-body-circuit",
        muscleIds: ["chest", "back", "arms", "legs"],
        name: "Resistance Band Full-Body Circuit",
    },

    // Mobility/flexibility exercises
    { exerciseId: "cat-cow", muscleIds: ["back", "core"], name: "Cat-Cow Stretch" },
    {
        exerciseId: "world's-greatest-stretch",
        muscleIds: ["legs", "core", "back"],
        name: "World's Greatest Stretch",
    },
    {
        exerciseId: "thoracic-spine-rotations",
        muscleIds: ["back"],
        name: "Thoracic Spine Rotations",
    },
    { exerciseId: "hip-circles", muscleIds: ["legs", "core"], name: "Hip Circles" },
    { exerciseId: "standing-side-bends", muscleIds: ["core"], name: "Standing Side Bends" },
    { exerciseId: "wall-slides", muscleIds: ["shoulders", "back"], name: "Wall Slides" },
];

export const strengthExercises: readonly Exercise[] = [
    // Chest exercises
    { exerciseId: "bench-press", muscleIds: ["chest", "shoulders", "arms"], name: "Bench Press" },
    {
        exerciseId: "incline-bench-press",
        muscleIds: ["chest", "shoulders", "arms"],
        name: "Incline Bench Press",
    },
    {
        exerciseId: "dumbbell-press",
        muscleIds: ["chest", "shoulders", "arms"],
        name: "Dumbbell Press",
    },
    { exerciseId: "push-ups", muscleIds: ["chest", "arms", "core"], name: "Push-ups" },
    { exerciseId: "chest-flyes", muscleIds: ["chest"], name: "Chest Flyes" },
    { exerciseId: "cable-crossovers", muscleIds: ["chest"], name: "Cable Crossovers" },
    {
        exerciseId: "incline-dumbbell-bench-press",
        muscleIds: ["chest", "shoulders", "arms"],
        name: "Incline Dumbbell Bench Press",
    },
    {
        exerciseId: "decline-bench-press",
        muscleIds: ["chest", "shoulders", "arms"],
        name: "Decline Bench Press",
    },
    { exerciseId: "chest-dips", muscleIds: ["chest", "arms"], name: "Chest Dips" },

    // Leg exercises
    { exerciseId: "squat", muscleIds: ["legs", "core"], name: "Squat" },
    { exerciseId: "leg-press", muscleIds: ["legs"], name: "Leg Press" },
    { exerciseId: "deadlift", muscleIds: ["legs", "back", "core"], name: "Deadlift" },
    { exerciseId: "romanian-deadlift", muscleIds: ["legs", "core"], name: "Romanian Deadlift" },
    { exerciseId: "leg-extension", muscleIds: ["legs"], name: "Leg Extension" },
    { exerciseId: "leg-curl", muscleIds: ["legs"], name: "Leg Curl" },
    { exerciseId: "calf-raises", muscleIds: ["legs"], name: "Calf Raises" },
    { exerciseId: "lunges", muscleIds: ["legs", "core"], name: "Lunges" },
    { exerciseId: "kettlebell-swings", muscleIds: ["legs", "core"], name: "Kettlebell Swings" },
    { exerciseId: "mountain-climbers", muscleIds: ["core", "legs"], name: "Mountain Climbers" },
    { exerciseId: "hip-thrusts", muscleIds: ["legs", "core"], name: "Hip Thrusts" },
    {
        exerciseId: "incline-smith-machine-bench-press",
        muscleIds: ["chest", "shoulders", "arms"],
        name: "Incline Bar Bench Press (Smith Machine)",
    },
    {
        exerciseId: "bulgarian-split-squats",
        muscleIds: ["legs", "core"],
        name: "Bulgarian Split Squats",
    },

    // Back exercises
    { exerciseId: "pull-ups", muscleIds: ["back", "arms"], name: "Pull-ups" },
    { exerciseId: "lat-pulldown", muscleIds: ["back", "arms"], name: "Lat Pulldown" },
    { exerciseId: "bent-over-row", muscleIds: ["back", "arms"], name: "Bent Over Row" },
    { exerciseId: "seated-row", muscleIds: ["back", "arms"], name: "Seated Row" },
    { exerciseId: "hyperextensions", muscleIds: ["back", "core"], name: "Hyperextensions" },
    { exerciseId: "chin-ups", muscleIds: ["back", "arms"], name: "Chin-ups" },
    {
        exerciseId: "one-arm-dumbbell-row",
        muscleIds: ["back", "arms"],
        name: "One-Arm Dumbbell Row",
    },
    {
        exerciseId: "cable-face-pulls",
        muscleIds: ["shoulders", "back"],
        name: "Cable Face Pulls",
    },
    { exerciseId: "rope-pull-down", muscleIds: ["back", "arms"], name: "Rope Pull-Down" },

    // Shoulder exercises
    {
        exerciseId: "barbell-overhead-press",
        muscleIds: ["shoulders", "arms", "chest"],
        name: "Barbell Overhead Press",
    },
    {
        exerciseId: "dumbbell-shoulder-press",
        muscleIds: ["shoulders", "arms"],
        name: "Dumbbell Shoulder Press",
    },
    { exerciseId: "lateral-raises", muscleIds: ["shoulders"], name: "Lateral Raises" },
    { exerciseId: "cable-lateral-raises", muscleIds: ["shoulders"], name: "Cable Lateral Raises" },
    { exerciseId: "front-raises", muscleIds: ["shoulders"], name: "Front Raises" },
    { exerciseId: "shrugs", muscleIds: ["shoulders"], name: "Shrugs" },
    { exerciseId: "upright-row", muscleIds: ["shoulders", "arms"], name: "Upright Row" },
    { exerciseId: "arnold-press", muscleIds: ["shoulders", "arms", "chest"], name: "Arnold Press" },
    { exerciseId: "reverse-flyes", muscleIds: ["shoulders", "back"], name: "Reverse Flyes" },
    {
        exerciseId: "plate-loaded-seated-shoulder-press",
        muscleIds: ["shoulders", "arms"],
        name: "Plate-Loaded Seated Shoulder Press",
    },

    // Arm exercises
    { exerciseId: "bicep-curls", muscleIds: ["arms"], name: "Bicep Curls" },
    { exerciseId: "tricep-dips", muscleIds: ["arms"], name: "Tricep Dips" },
    { exerciseId: "tricep-pushdown", muscleIds: ["arms"], name: "Tricep Pushdown" },
    { exerciseId: "hammer-curls", muscleIds: ["arms"], name: "Hammer Curls" },
    { exerciseId: "cable-curls", muscleIds: ["arms"], name: "Cable Curls" },
    { exerciseId: "tricep-kickbacks", muscleIds: ["arms"], name: "Tricep Kickbacks" },
    {
        exerciseId: "biceps-curls-with-cables",
        muscleIds: ["arms"],
        name: "Biceps Curls with Cables",
    },
    {
        exerciseId: "skull-crushers",
        muscleIds: ["arms"],
        name: "Skull Crushers",
    },
    {
        exerciseId: "preacher-curls",
        muscleIds: ["arms"],
        name: "Preacher Curls",
    },
    { exerciseId: "biceps-hammer-curls", muscleIds: ["arms"], name: "Hammer Curls for Biceps" },

    // Core exercises
    { exerciseId: "abdominal-crunches", muscleIds: ["core"], name: "Abdominal Crunches" },
    { exerciseId: "plank", muscleIds: ["core"], name: "Plank" },
    { exerciseId: "russian-twist", muscleIds: ["core"], name: "Russian Twist" },
    { exerciseId: "leg-raises", muscleIds: ["core"], name: "Leg Raises" },

    ...homeStrengthExercises,
];
