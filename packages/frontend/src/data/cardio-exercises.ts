import type { Exercise } from "../types/exercise";

const homeCardioExercises: readonly Exercise[] = [
    {
        description: "A full-body cardio exercise performed at home with no equipment",
        id: "jumping-jacks",
        muscleIds: ["legs", "core"],
        name: "Jumping Jacks",
    },
    {
        description:
            "A cardio exercise that involves running in place while lifting the knees high",
        id: "high-knees",
        muscleIds: ["legs", "core"],
        name: "High Knees",
    },
    {
        description:
            "A cardio drill where you jog in place while kicking your heels to your glutes",
        id: "butt-kicks",
        muscleIds: ["legs"],
        name: "Butt Kicks",
    },
    {
        description: "An explosive bodyweight exercise combining squats with vertical jumps",
        id: "jump-squats",
        muscleIds: ["legs", "core"],
        name: "Jump Squats",
    },
    {
        description: "A full-body cardio movement combining a squat, push-up, and jump",
        id: "burpees",
        muscleIds: ["legs", "core", "chest", "arms"],
        name: "Burpees",
    },
    {
        description:
            "A core and cardio exercise performed in plank position with jumping jack leg movements",
        id: "plank-jacks",
        muscleIds: ["core", "legs"],
        name: "Plank Jacks",
    },
    {
        description: "A lateral jumping exercise that mimics the movement of a speed skater",
        id: "skater-jumps",
        muscleIds: ["legs"],
        name: "Skater Jumps",
    },
    {
        description: "A cardio exercise mimicking boxing movements without equipment",
        id: "shadow-boxing",
        muscleIds: ["arms", "core", "shoulders"],
        name: "Shadow Boxing",
    },
    {
        description: "A cardio exercise using a jump rope or mimicking the movement",
        id: "jumping-rope",
        muscleIds: ["legs", "core"],
        name: "Jumping Rope",
    },
    {
        description: "A side-to-side movement that works the lower body while elevating heart rate",
        id: "lateral-shuffles",
        muscleIds: ["legs"],
        name: "Lateral Shuffles",
    },
    {
        description: "A modified version of mountain climbers performed in standing position",
        id: "standing-mountain-climbers",
        muscleIds: ["core", "legs"],
        name: "Standing Mountain Climbers",
    },
    {
        description: "A side lunge movement that works the inner and outer thighs",
        id: "lateral-lunges",
        muscleIds: ["legs"],
        name: "Lateral Lunges",
    },
    {
        description: "A sequence of cardio exercises performed with minimal rest",
        id: "bodyweight-cardio-circuit",
        muscleIds: ["legs", "core"],
        name: "Bodyweight Cardio Circuit",
    },
];

export const cardioExercises: readonly Exercise[] = [
    {
        description: "Outdoor or treadmill running",
        id: "running",
        muscleIds: ["legs", "core"],
        name: "Running",
    },
    {
        description: "Stationary bike or road cycling",
        id: "cycling",
        muscleIds: ["legs"],
        name: "Cycling",
    },
    {
        description: "Treadmill walking at elevation",
        id: "incline-walk",
        muscleIds: ["legs", "core"],
        name: "Incline Walk",
    },
    {
        id: "rowing-machine",
        muscleIds: ["legs", "back", "arms"],
        name: "Rowing Machine",
    },
    {
        id: "stair-climber",
        muscleIds: ["legs", "core"],
        name: "Stair Climber",
    },

    ...homeCardioExercises,
];
