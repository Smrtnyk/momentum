import type { Exercise } from "../types/exercise";

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
];
