import type { TrainingPlan } from "../types/workout-plans";

const homeWorkoutPlans: readonly TrainingPlan[] = [
    {
        author: "FitApp Science Team",
        description:
            "A full-body strength program designed for home training with minimal equipment requirements.",
        durationWeeks: 8,
        equipment: ["resistance bands", "dumbbells (optional)"],
        frequency: 3,
        goals: [
            "Build strength at home",
            "Develop muscle using minimal equipment",
            "Create a consistent home workout routine",
        ],
        id: "home-strength-essentials",
        image: "home-strength.jpg",
        level: "beginner",
        location: "home",
        name: "Home Strength Essentials",
        scienceReference:
            "Based on bodyweight and resistance training principles for strength development",
        type: "strength",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "push-ups",
                        exerciseNotes: "Modify on knees if needed",
                        reps: 10,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "bodyweight-squats",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "resistance-band-rows",
                        exerciseNotes: "Anchor band to door or sturdy object",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "glute-bridges",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "plank",
                        restTime: 45,
                        setsCount: 3,
                    },
                ],
                id: "home-full-body-a",
                name: "Home Full Body A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "lunges",
                        exerciseNotes: "Alternating legs",
                        reps: 10,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "resistance-band-chest-press",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "superman",
                        reps: 12,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "resistance-band-bicep-curls",
                        reps: 15,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "resistance-band-tricep-extensions",
                        reps: 15,
                        restTime: 45,
                        setsCount: 3,
                    },
                ],
                id: "home-full-body-b",
                name: "Home Full Body B",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "chair-dips",
                        reps: 10,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "bodyweight-bulgarian-split-squats",
                        exerciseNotes: "Each leg",
                        reps: 8,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "resistance-band-lateral-raises",
                        reps: 12,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "mountain-climbers",
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "russian-twist",
                        reps: 20,
                        restTime: 45,
                        setsCount: 3,
                    },
                ],
                id: "home-full-body-c",
                name: "Home Full Body C",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        description:
            "An effective high-intensity home workout program combining strength and cardio elements for maximum calorie burn and fitness improvement.",
        durationWeeks: 6,
        equipment: ["resistance bands", "mat", "chair", "water bottle weights (optional)"],
        frequency: 4,
        goals: [
            "Burn calories efficiently",
            "Improve overall fitness",
            "Build strength without gym equipment",
            "Increase cardiovascular endurance",
        ],
        id: "home-hiit-fusion",
        image: "home-hiit.jpg",
        level: "intermediate",
        location: "home",
        name: "Home HIIT Fusion",
        scienceReference:
            "Based on metabolic conditioning research and time-efficient exercise protocols",
        type: "circuit",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "jump-squats",
                        reps: 15,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "push-ups",
                        reps: 12,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "mountain-climbers",
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "burpees",
                        reps: 10,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "plank-shoulder-taps",
                        reps: 20,
                        restTime: 30,
                        setsCount: 4,
                    },
                ],
                id: "hiit-circuit-a",
                name: "HIIT Circuit A",
                overallNotes:
                    "Complete as a circuit with minimal rest between exerciseEntries, then rest 2 minutes between rounds",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 30,
                        exerciseId: "high-knees",
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "resistance-band-rows",
                        reps: 15,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "lateral-lunges",
                        exerciseNotes: "Alternating sides",
                        reps: 16,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "resistance-band-chest-press",
                        reps: 15,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "bicycle-crunches",
                        reps: 20,
                        restTime: 30,
                        setsCount: 4,
                    },
                ],
                id: "hiit-circuit-b",
                name: "HIIT Circuit B",
                overallNotes:
                    "Complete as a circuit with minimal rest between exerciseEntries, then rest 2 minutes between rounds",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 30,
                        exerciseId: "jumping-jacks",
                        restTime: 15,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "chair-step-ups",
                        exerciseNotes: "Alternating legs",
                        reps: 20,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "jumping-jacks",
                        restTime: 15,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "bodyweight-squats",
                        reps: 25,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "jumping-jacks",
                        restTime: 15,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "push-ups",
                        reps: 15,
                        restTime: 30,
                        setsCount: 3,
                    },
                ],
                id: "cardio-strength-intervals",
                name: "Cardio-Strength Intervals",
                overallNotes:
                    "Alternate between cardio (jumping jacks) and strength exerciseEntries",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "resistance-band-full-body-circuit",
                        exerciseNotes:
                            "Complete 5 exerciseEntries with band: curls, overhead press, squats, rows, tricep extensions",
                        reps: 12,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 120,
                        exerciseId: "bodyweight-cardio-circuit",
                        exerciseNotes:
                            "Complete 4 exerciseEntries: jumping jacks, mountain climbers, high knees, butt kicks",
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "super-circuit",
                name: "Super Circuit Day",
                overallNotes:
                    "Alternate between resistance band circuit and bodyweight cardio circuit",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        description:
            "A home-based cardio program that requires minimal space and no equipment, perfect for improving cardiovascular fitness anywhere.",
        durationWeeks: 8,
        equipment: ["none required", "mat (optional)"],
        frequency: 3,
        goals: [
            "Improve cardiovascular fitness",
            "Increase stamina and endurance",
            "Burn calories effectively",
            "Build a consistent cardio routine at home",
        ],
        id: "home-cardio-challenge",
        image: "home-cardio.jpg",
        level: "beginner",
        location: "home",
        name: "Home Cardio Challenge",
        scienceReference:
            "Based on interval training research and bodyweight cardio exercise effectiveness",
        type: "cardio",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        durationSeconds: 60,
                        exerciseId: "jumping-jacks",
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "high-knees",
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "butt-kicks",
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "jumping-jacks",
                        restTime: 30,
                        setsCount: 4,
                    },
                ],
                id: "basic-cardio",
                name: "Basic Cardio Circuit",
                overallNotes: "Focus on maintaining good form throughout the exerciseEntries",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "jump-squats",
                        reps: 15,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 45,
                        exerciseId: "mountain-climbers",
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "burpees",
                        exerciseNotes: "Modify by stepping back instead of jumping if needed",
                        reps: 10,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "plank-jacks",
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "skater-jumps",
                        reps: 20,
                        restTime: 30,
                        setsCount: 3,
                    },
                ],
                id: "hiit-cardio",
                name: "HIIT Cardio Blast",
                overallNotes: "Complete as a circuit with minimal rest between exerciseEntries",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 120,
                        exerciseId: "shadow-boxing",
                        exerciseNotes: "Alternate between punches, uppercuts and hooks",
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 120,
                        exerciseId: "jumping-rope",
                        exerciseNotes: "Simulate if you don't have a rope",
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "lateral-shuffles",
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "standing-mountain-climbers",
                        restTime: 30,
                        setsCount: 3,
                    },
                ],
                id: "cardio-variety",
                name: "Cardio Variety Session",
                overallNotes: "Focus on keeping your heart rate elevated throughout the workout",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        description:
            "A comprehensive core and mobility program designed for home practice to improve functional movement, posture, and core strength.",
        durationWeeks: 6,
        equipment: ["mat", "resistance band (optional)"],
        frequency: 3,
        goals: [
            "Strengthen core muscles",
            "Improve posture and spinal alignment",
            "Enhance overall mobility and flexibility",
            "Reduce risk of lower back pain",
        ],
        id: "home-core-mobility",
        image: "home-core-mobility.jpg",
        level: "beginner",
        location: "home",
        name: "Home Core & Mobility",
        scienceReference:
            "Based on spine stabilization research and functional movement principles",
        type: "strength",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "cat-cow",
                        reps: 15,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "bird-dog",
                        exerciseNotes: "Alternating sides with controlled movement",
                        reps: 12,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "glute-bridges",
                        reps: 15,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "dead-bug",
                        reps: 10,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 45,
                        exerciseId: "plank",
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "core-foundation",
                name: "Core Foundation",
                overallNotes: "Focus on breathing and maintaining proper form",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "world's-greatest-stretch",
                        exerciseNotes: "Each side",
                        reps: 6,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "thoracic-spine-rotations",
                        exerciseNotes: "Each side",
                        reps: 10,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "hip-circles",
                        exerciseNotes: "Each direction",
                        reps: 10,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "standing-side-bends",
                        exerciseNotes: "Each side",
                        reps: 12,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "wall-slides",
                        reps: 12,
                        restTime: 30,
                        setsCount: 3,
                    },
                ],
                id: "mobility-flow",
                name: "Mobility Flow",
                overallNotes: "Move slowly and with control, focusing on full range of motion",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "bicycle-crunches",
                        reps: 20,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "superman",
                        reps: 12,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "side-plank",
                        exerciseNotes: "Each side",
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "russian-twist",
                        reps: 20,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "prone-y-t-w-raises",
                        exerciseNotes: "Hold each position briefly",
                        reps: 15,
                        restTime: 45,
                        setsCount: 3,
                    },
                ],
                id: "core-challenge",
                name: "Core Challenge",
                overallNotes: "Maintain engagement through all exerciseEntries",
            },
        ],
    },
];

export const strengthPlans: readonly TrainingPlan[] = [
    {
        author: "FitApp Science Team",
        description:
            "A science-based full-body program designed for beginners to build a strong foundation in resistance training with focus on proper form and progressive overload.",
        durationWeeks: 8,
        frequency: 3,
        goals: [
            "Build foundational strength",
            "Learn proper exercise technique",
            "Develop consistent workout habits",
        ],
        id: "foundation-strength",
        image: "foundation-strength.jpg",
        level: "beginner",
        location: "gym",
        name: "Foundation Strength",
        scienceReference: "Based on ACSM and NSCA guidelines for novice resistance training",
        type: "strength",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "squat",
                        exerciseNotes: "Focus on form and depth",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    { exerciseId: "bench-press", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "seated-row", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "dumbbell-shoulder-press", reps: 10, restTime: 90, setsCount: 3 },
                    { durationSeconds: 30, exerciseId: "plank", restTime: 60, setsCount: 3 },
                ],
                id: "fb-a",
                name: "Full Body A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "deadlift",
                        exerciseNotes: "Focus on hip hinge movement",
                        reps: 8,
                        restTime: 120,
                        setsCount: 3,
                    },
                    { exerciseId: "push-ups", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "lat-pulldown", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "lateral-raises", reps: 12, restTime: 60, setsCount: 3 },
                    { exerciseId: "bicycle-crunches", reps: 15, restTime: 60, setsCount: 3 },
                ],
                id: "fb-b",
                name: "Full Body B",
            },
            {
                exerciseEntries: [
                    { exerciseId: "leg-press", reps: 12, restTime: 90, setsCount: 3 },
                    { exerciseId: "dumbbell-press", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "bent-over-row", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "bicep-curls", reps: 12, restTime: 60, setsCount: 3 },
                    { exerciseId: "tricep-pushdown", reps: 12, restTime: 60, setsCount: 3 },
                ],
                id: "fb-c",
                name: "Full Body C",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        description:
            "An intermediate program using a 4-day upper/lower split for continued strength gains and muscle development through periodization.",
        durationWeeks: 12,
        frequency: 4,
        goals: [
            "Increase strength in major lifts",
            "Develop muscle hypertrophy",
            "Improve muscular endurance",
        ],
        id: "split-progression",
        image: "split-progression.jpg",
        level: "intermediate",
        location: "gym",
        name: "Split Progression System",
        scienceReference:
            "Based on Schoenfeld's hypertrophy research and ACSM progression guidelines",
        type: "strength",
        workoutDays: [
            {
                exerciseEntries: [
                    { exerciseId: "bench-press", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "bent-over-row", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "dumbbell-shoulder-press", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "lat-pulldown", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "tricep-pushdown", reps: 12, restTime: 60, setsCount: 3 },
                    { exerciseId: "bicep-curls", reps: 12, restTime: 60, setsCount: 3 },
                ],
                id: "upper-a",
                name: "Upper Body A",
            },
            {
                exerciseEntries: [
                    { exerciseId: "squat", reps: 8, restTime: 150, setsCount: 4 },
                    { exerciseId: "romanian-deadlift", reps: 8, restTime: 150, setsCount: 4 },
                    { exerciseId: "leg-extension", reps: 12, restTime: 90, setsCount: 3 },
                    { exerciseId: "leg-curl", reps: 12, restTime: 90, setsCount: 3 },
                    { exerciseId: "calf-raises", reps: 15, restTime: 60, setsCount: 3 },
                    { durationSeconds: 45, exerciseId: "plank", restTime: 60, setsCount: 3 },
                ],
                id: "lower-a",
                name: "Lower Body A",
            },
            {
                exerciseEntries: [
                    { exerciseId: "incline-bench-press", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "pull-ups", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "lateral-raises", reps: 12, restTime: 90, setsCount: 3 },
                    { exerciseId: "seated-row", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "skull-crushers", reps: 12, restTime: 60, setsCount: 3 },
                    { exerciseId: "hammer-curls", reps: 12, restTime: 60, setsCount: 3 },
                ],
                id: "upper-b",
                name: "Upper Body B",
            },
            {
                exerciseEntries: [
                    { exerciseId: "deadlift", reps: 6, restTime: 180, setsCount: 4 },
                    { exerciseId: "leg-press", reps: 10, restTime: 120, setsCount: 4 },
                    { exerciseId: "lunges", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "hip-thrusts", reps: 12, restTime: 90, setsCount: 3 },
                    { exerciseId: "calf-raises", reps: 15, restTime: 60, setsCount: 3 },
                    { exerciseId: "russian-twist", reps: 20, restTime: 60, setsCount: 3 },
                ],
                id: "lower-b",
                name: "Lower Body B",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        description:
            "Advanced 6-day split using the Push-Pull-Legs methodology for maximum muscle hypertrophy and strength development with scientific loading patterns.",
        durationWeeks: 12,
        frequency: 6,
        goals: [
            "Maximize muscle hypertrophy",
            "Achieve advanced strength levels",
            "Target specific muscle groups with high frequency",
        ],
        id: "progressive-ppl",
        image: "progressive-ppl.jpg",
        level: "advanced",
        location: "gym",
        name: "Progressive Push-Pull-Legs",
        scienceReference: "Based on Helms, Israetel and Schoenfeld volume landmarks research",
        type: "strength",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "bench-press",
                        exerciseNotes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    { exerciseId: "dumbbell-shoulder-press", reps: 8, restTime: 120, setsCount: 4 },
                    {
                        exerciseId: "incline-dumbbell-bench-press",
                        reps: 10,
                        restTime: 120,
                        setsCount: 4,
                    },
                    { exerciseId: "lateral-raises", reps: 12, restTime: 90, setsCount: 4 },
                    { exerciseId: "tricep-pushdown", reps: 12, restTime: 60, setsCount: 4 },
                    { exerciseId: "skull-crushers", reps: 12, restTime: 60, setsCount: 3 },
                ],
                id: "push-a",
                name: "Push Day A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "bent-over-row",
                        exerciseNotes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    { exerciseId: "pull-ups", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "seated-row", reps: 10, restTime: 120, setsCount: 4 },
                    { exerciseId: "cable-face-pulls", reps: 15, restTime: 90, setsCount: 3 },
                    { exerciseId: "bicep-curls", reps: 12, restTime: 60, setsCount: 4 },
                    { exerciseId: "hammer-curls", reps: 12, restTime: 60, setsCount: 3 },
                ],
                id: "pull-a",
                name: "Pull Day A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "squat",
                        exerciseNotes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    { exerciseId: "romanian-deadlift", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "leg-press", reps: 10, restTime: 120, setsCount: 4 },
                    { exerciseId: "leg-extension", reps: 15, restTime: 90, setsCount: 3 },
                    { exerciseId: "calf-raises", reps: 15, restTime: 60, setsCount: 4 },
                    { exerciseId: "abdominal-crunches", reps: 15, restTime: 60, setsCount: 3 },
                ],
                id: "legs-a",
                name: "Legs Day A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "barbell-overhead-press",
                        exerciseNotes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    { exerciseId: "incline-bench-press", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "dumbbell-press", reps: 10, restTime: 120, setsCount: 4 },
                    { exerciseId: "front-raises", reps: 12, restTime: 90, setsCount: 3 },
                    { exerciseId: "tricep-dips", reps: 10, restTime: 60, setsCount: 4 },
                    { exerciseId: "tricep-kickbacks", reps: 12, restTime: 60, setsCount: 3 },
                ],
                id: "push-b",
                name: "Push Day B",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "deadlift",
                        exerciseNotes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    { exerciseId: "lat-pulldown", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "one-arm-dumbbell-row", reps: 10, restTime: 120, setsCount: 4 },
                    { exerciseId: "reverse-flyes", reps: 15, restTime: 90, setsCount: 3 },
                    { exerciseId: "preacher-curls", reps: 12, restTime: 60, setsCount: 4 },
                    { exerciseId: "cable-curls", reps: 12, restTime: 60, setsCount: 3 },
                ],
                id: "pull-b",
                name: "Pull Day B",
            },
            {
                exerciseEntries: [
                    { exerciseId: "bulgarian-split-squats", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "leg-press", reps: 12, restTime: 120, setsCount: 4 },
                    { exerciseId: "hip-thrusts", reps: 12, restTime: 120, setsCount: 4 },
                    { exerciseId: "leg-curl", reps: 15, restTime: 90, setsCount: 3 },
                    { exerciseId: "calf-raises", reps: 20, restTime: 60, setsCount: 4 },
                    { durationSeconds: 60, exerciseId: "plank", restTime: 60, setsCount: 3 },
                ],
                id: "legs-b",
                name: "Legs Day B",
            },
        ],
    },

    {
        author: "FitApp Science Team",
        description:
            "A science-based progressive program focused on optimal glute development through varied stimulation patterns and evidence-based exerciseEntries.",
        durationWeeks: 8,
        frequency: 3,
        goals: [
            "Maximize glute muscle development",
            "Improve lower body strength",
            "Enhance lower body aesthetics",
            "Address muscle imbalances",
        ],
        id: "glute-builder",
        image: "glute-builder.jpg",
        level: "intermediate",
        location: "gym",
        name: "Glute Builder Program",
        scienceReference:
            "Based on Contreras' glute activation research and progressive overload principles",
        type: "strength",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "hip-thrusts",
                        exerciseNotes: "Heavy load, focus on full contraction",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    { exerciseId: "romanian-deadlift", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "bulgarian-split-squats", reps: 12, restTime: 90, setsCount: 3 },
                    {
                        exerciseId: "cable-kickbacks",
                        exerciseNotes: "Slow eccentric",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                    { exerciseId: "lateral-band-walks", reps: 15, restTime: 60, setsCount: 3 },
                ],
                id: "glute-focus-a",
                name: "Glute Focus A",
            },
            {
                exerciseEntries: [
                    { exerciseId: "squat", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "deadlift", reps: 8, restTime: 120, setsCount: 3 },
                    { exerciseId: "walking-lunges", reps: 12, restTime: 90, setsCount: 3 },
                    {
                        exerciseId: "leg-press",
                        exerciseNotes: "High foot placement",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    { exerciseId: "calf-raises", reps: 15, restTime: 60, setsCount: 3 },
                ],
                id: "compound-lower",
                name: "Compound Lower Body",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "glute-bridges",
                        exerciseNotes: "With resistance band",
                        reps: 15,
                        restTime: 90,
                        setsCount: 3,
                    },
                    { exerciseId: "sumo-deadlift", reps: 8, restTime: 120, setsCount: 4 },
                    {
                        exerciseId: "goblet-squats",
                        exerciseNotes: "Deep squat for glute activation",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    { exerciseId: "step-ups", reps: 12, restTime: 90, setsCount: 3 },
                    { exerciseId: "frog-pumps", reps: 20, restTime: 60, setsCount: 3 },
                ],
                id: "glute-focus-b",
                name: "Glute Focus B",
            },
        ],
    },

    {
        author: "FitApp Science Team",
        description:
            "A comprehensive program targeting all aspects of core function: stabilization, anti-rotation, flexion, and extension for improved posture and performance.",
        durationWeeks: 6,
        frequency: 3,
        goals: [
            "Build functional core strength",
            "Improve spinal stability",
            "Enhance athletic performance",
            "Develop balanced core musculature",
        ],
        id: "core-stability",
        image: "core-stability.jpg",
        level: "intermediate",
        location: "gym",
        name: "Core Strength & Stability",
        scienceReference:
            "Based on McGill's spine stability research and modern core training principles",
        type: "strength",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        durationSeconds: 45,
                        exerciseId: "plank",
                        exerciseNotes: "Focus on proper alignment",
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "side-plank",
                        exerciseNotes: "Both sides",
                        restTime: 60,
                        setsCount: 3,
                    },
                    { exerciseId: "pallof-press", reps: 12, restTime: 60, setsCount: 3 },
                    {
                        exerciseId: "bird-dog",
                        exerciseNotes: "Slow and controlled",
                        reps: 10,
                        restTime: 60,
                        setsCount: 3,
                    },
                    { exerciseId: "dead-bug", reps: 10, restTime: 60, setsCount: 3 },
                ],
                id: "anti-rotation",
                name: "Anti-Rotation & Stability",
            },
            {
                exerciseEntries: [
                    { exerciseId: "hanging-leg-raises", reps: 12, restTime: 90, setsCount: 3 },
                    {
                        exerciseId: "russian-twist",
                        exerciseNotes: "With weight",
                        reps: 20,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 45,
                        exerciseId: "mountain-climbers",
                        exerciseNotes: "Fast pace",
                        restTime: 60,
                        setsCount: 3,
                    },
                    { exerciseId: "bicycle-crunches", reps: 20, restTime: 60, setsCount: 3 },
                    { exerciseId: "v-ups", reps: 15, restTime: 60, setsCount: 3 },
                ],
                id: "dynamic-core",
                name: "Dynamic Core Training",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "turkish-get-up",
                        exerciseNotes: "Each side",
                        reps: 5,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "woodchoppers",
                        exerciseNotes: "Each side",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "kettlebell-windmill",
                        exerciseNotes: "Each side",
                        reps: 8,
                        restTime: 60,
                        setsCount: 3,
                    },
                    { exerciseId: "plank-shoulder-taps", reps: 20, restTime: 60, setsCount: 3 },
                    { exerciseId: "ab-rollouts", reps: 10, restTime: 90, setsCount: 3 },
                ],
                id: "functional-core",
                name: "Functional Core Integration",
            },
        ],
    },
];

export const cardioPlans: readonly TrainingPlan[] = [
    {
        author: "FitApp Science Team",
        description:
            "A beginner-friendly cardio program that gradually builds endurance through a mix of steady-state and light interval training.",
        durationWeeks: 8,
        frequency: 3,
        goals: [
            "Build basic cardiovascular endurance",
            "Create consistent cardio habits",
            "Improve heart health",
        ],
        id: "cardio-kickstart",
        image: "cardio-kickstart.jpg",
        level: "beginner",
        location: "gym",
        name: "Cardio Kickstart",
        scienceReference: "Based on ACSM cardiorespiratory fitness guidelines for beginners",
        type: "cardio",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        durationSeconds: 1200,
                        exerciseId: "incline-walk",
                        exerciseNotes: "Moderate pace, 3-4 RPE",
                        restTime: 0,
                        setsCount: 1,
                    },
                ],
                id: "steady-state",
                name: "Steady State Cardio",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 120,
                        exerciseId: "cycling",
                        exerciseNotes:
                            "Alternate between moderate (4-5 RPE) and light (2-3 RPE) intensities",
                        restTime: 90,
                        setsCount: 5,
                    },
                ],
                id: "light-intervals",
                name: "Light Interval Training",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 600,
                        exerciseId: "rowing-machine",
                        exerciseNotes: "Steady pace (3-4 RPE)",
                        restTime: 0,
                        setsCount: 1,
                    },
                    {
                        durationSeconds: 600,
                        exerciseId: "incline-walk",
                        exerciseNotes: "Moderate pace (3-4 RPE)",
                        restTime: 0,
                        setsCount: 1,
                    },
                ],
                id: "mixed-cardio",
                name: "Mixed Cardio Session",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        description:
            "An intermediate cardio program focused on improving cardiovascular conditioning through structured interval training and endurance work.",
        durationWeeks: 10,
        frequency: 4,
        goals: [
            "Improve cardiovascular efficiency",
            "Build stamina and endurance",
            "Increase calorie expenditure",
        ],
        id: "cardio-conditioning",
        image: "cardio-conditioning.jpg",
        level: "intermediate",
        location: "gym",
        name: "Cardio Conditioning Protocol",
        scienceReference: "Based on VO2max improvement research and interval training studies",
        type: "cardio",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        durationSeconds: 60,
                        exerciseId: "running",
                        exerciseNotes: "High intensity (7-8 RPE) sprints with full recovery",
                        restTime: 120,
                        setsCount: 8,
                    },
                ],
                id: "hiit-session",
                name: "HIIT Session",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 1800,
                        exerciseId: "running",
                        exerciseNotes: "Sustained effort at 6-7 RPE",
                        restTime: 0,
                        setsCount: 1,
                    },
                ],
                id: "tempo-run",
                name: "Tempo Run",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 180,
                        exerciseId: "cycling",
                        exerciseNotes:
                            "1 min, 2 min, 3 min, 2 min, 1 min at high intensity (7-8 RPE)",
                        restTime: 120,
                        setsCount: 5,
                    },
                ],
                id: "pyramid-intervals",
                name: "Pyramid Intervals",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 900,
                        exerciseId: "rowing-machine",
                        exerciseNotes: "Moderate pace (5-6 RPE)",
                        restTime: 0,
                        setsCount: 1,
                    },
                    {
                        durationSeconds: 900,
                        exerciseId: "stair-climber",
                        exerciseNotes: "Moderate pace (5-6 RPE)",
                        restTime: 0,
                        setsCount: 1,
                    },
                ],
                id: "cross-training",
                name: "Cross Training",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        description:
            "An advanced cardio program designed to maximize cardiovascular performance and efficiency using science-based protocols.",
        durationWeeks: 12,
        frequency: 5,
        goals: [
            "Maximize cardiovascular efficiency",
            "Improve lactate threshold",
            "Enhance recovery capacity",
            "Optimize energy systems",
        ],
        id: "cardio-performance",
        image: "cardio-performance.jpg",
        level: "advanced",
        location: "gym",
        name: "Cardio Performance System",
        scienceReference:
            "Based on elite endurance training principles and metabolic conditioning research",
        type: "cardio",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        durationSeconds: 60,
                        exerciseId: "running",
                        exerciseNotes: "Near max effort (8-9 RPE) with incomplete recovery",
                        restTime: 60,
                        setsCount: 12,
                    },
                ],
                id: "intensive-intervals",
                name: "Intensive Intervals",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 600,
                        exerciseId: "cycling",
                        exerciseNotes: "Sustained effort at threshold (7 RPE)",
                        restTime: 180,
                        setsCount: 3,
                    },
                ],
                id: "threshold-session",
                name: "Threshold Session",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 20,
                        exerciseId: "rowing-machine",
                        exerciseNotes: "Maximum effort (9-10 RPE) with minimal rest",
                        restTime: 10,
                        setsCount: 8,
                    },
                ],
                id: "tabata-protocol",
                name: "Tabata Protocol",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 3600,
                        exerciseId: "running",
                        exerciseNotes: "Moderate sustainable pace (5-6 RPE)",
                        restTime: 0,
                        setsCount: 1,
                    },
                ],
                id: "endurance-builder",
                name: "Endurance Builder",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 180,
                        exerciseId: "stair-climber",
                        exerciseNotes: "High intensity (8 RPE)",
                        restTime: 60,
                        setsCount: 5,
                    },
                    {
                        durationSeconds: 180,
                        exerciseId: "rowing-machine",
                        exerciseNotes: "High intensity (8 RPE)",
                        restTime: 60,
                        setsCount: 5,
                    },
                ],
                id: "metabolic-conditioning",
                name: "Metabolic Conditioning",
            },
        ],
    },
];

export const hybridPlans: readonly TrainingPlan[] = [
    {
        author: "FitApp Science Team",
        description:
            "A beginner-friendly program combining strength and cardio training to build overall fitness and establish healthy exercise habits.",
        durationWeeks: 8,
        frequency: 4,
        goals: [
            "Build base level strength",
            "Develop cardiovascular fitness",
            "Create exercise consistency",
        ],
        id: "balanced-fitness",
        image: "balanced-fitness.jpg",
        level: "beginner",
        location: "gym",
        name: "Balanced Fitness Foundation",
        scienceReference: "Based on ACSM guidelines for concurrent training for general fitness",
        type: "circuit",
        workoutDays: [
            {
                exerciseEntries: [
                    { exerciseId: "squat", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "bench-press", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "seated-row", reps: 10, restTime: 90, setsCount: 3 },
                    { durationSeconds: 30, exerciseId: "plank", restTime: 60, setsCount: 2 },
                ],
                id: "strength-a",
                name: "Full Body Strength A",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 1500,
                        exerciseId: "incline-walk",
                        exerciseNotes: "Moderate pace (3-4 RPE)",
                        restTime: 0,
                        setsCount: 1,
                    },
                ],
                id: "cardio-a",
                name: "Steady State Cardio",
            },
            {
                exerciseEntries: [
                    { exerciseId: "deadlift", reps: 8, restTime: 90, setsCount: 3 },
                    { exerciseId: "dumbbell-shoulder-press", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "lat-pulldown", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "russian-twist", reps: 15, restTime: 60, setsCount: 2 },
                ],
                id: "strength-b",
                name: "Full Body Strength B",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 60,
                        exerciseId: "cycling",
                        exerciseNotes: "Alternating between moderate (4-5 RPE) and light (2-3 RPE)",
                        restTime: 120,
                        setsCount: 6,
                    },
                ],
                id: "cardio-b",
                name: "Light Intervals",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        description:
            "An intermediate program combining strength training with cardio conditioning to develop athletic performance and functional fitness.",
        durationWeeks: 12,
        frequency: 5,
        goals: [
            "Increase functional strength",
            "Improve cardiovascular conditioning",
            "Enhance athletic performance",
        ],
        id: "functional-athlete",
        image: "functional-athlete.jpg",
        level: "intermediate",
        location: "gym",
        name: "Functional Athlete Program",
        scienceReference: "Based on studies of concurrent training for athletic performance",
        type: "circuit",
        workoutDays: [
            {
                exerciseEntries: [
                    { exerciseId: "bench-press", reps: 8, restTime: 90, setsCount: 4 },
                    { exerciseId: "pull-ups", reps: 8, restTime: 90, setsCount: 4 },
                    { exerciseId: "dumbbell-shoulder-press", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "seated-row", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "tricep-pushdown", reps: 12, restTime: 60, setsCount: 3 },
                ],
                id: "upper-strength",
                name: "Upper Body Strength",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 60,
                        exerciseId: "rowing-machine",
                        exerciseNotes: "High intensity (7-8 RPE) with active recovery",
                        restTime: 90,
                        setsCount: 8,
                    },
                ],
                id: "interval-training",
                name: "High Intensity Intervals",
            },
            {
                exerciseEntries: [
                    { exerciseId: "squat", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "romanian-deadlift", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "lunges", reps: 10, restTime: 90, setsCount: 3 },
                    { exerciseId: "leg-extension", reps: 12, restTime: 60, setsCount: 3 },
                    { exerciseId: "calf-raises", reps: 15, restTime: 60, setsCount: 3 },
                ],
                id: "lower-strength",
                name: "Lower Body Strength",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 2400,
                        exerciseId: "running",
                        exerciseNotes: "Moderate pace (5-6 RPE)",
                        restTime: 0,
                        setsCount: 1,
                    },
                ],
                id: "endurance-day",
                name: "Endurance Session",
            },
            {
                exerciseEntries: [
                    { exerciseId: "kettlebell-swings", reps: 15, restTime: 60, setsCount: 3 },
                    { exerciseId: "push-ups", reps: 15, restTime: 60, setsCount: 3 },
                    {
                        durationSeconds: 30,
                        exerciseId: "mountain-climbers",
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "rowing-machine",
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "functional-circuit",
                name: "Functional Circuit",
                overallNotes: "Complete as a circuit with minimal rest between exerciseEntries",
            },
        ],
    },

    {
        author: "FitApp Science Team",
        description:
            "A science-based high-intensity interval training program designed to maximize calorie burn, improve cardiovascular fitness, and boost metabolic rate.",
        durationWeeks: 6,
        frequency: 3,
        goals: [
            "Maximize calorie burn",
            "Improve cardiovascular conditioning",
            "Increase metabolic rate",
            "Preserve muscle mass while burning fat",
        ],
        id: "hiit-metabolic",
        image: "hiit-metabolic.jpg",
        level: "intermediate",
        location: "gym",
        name: "HIIT Metabolic Conditioning",
        scienceReference:
            "Based on EPOC (Excess Post-exercise Oxygen Consumption) research and HIIT effectiveness studies",
        type: "circuit",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "burpees",
                        exerciseNotes: "As fast as possible with good form",
                        reps: 15,
                        restTime: 45,
                        setsCount: 4,
                    },
                    { exerciseId: "kettlebell-swings", reps: 20, restTime: 45, setsCount: 4 },
                    {
                        durationSeconds: 40,
                        exerciseId: "mountain-climbers",
                        restTime: 45,
                        setsCount: 4,
                    },
                    { exerciseId: "jump-squats", reps: 15, restTime: 45, setsCount: 4 },
                    { durationSeconds: 30, exerciseId: "battle-ropes", restTime: 45, setsCount: 4 },
                ],
                id: "total-body-hiit",
                name: "Total Body HIIT",
                overallNotes:
                    "Complete as circuit with minimal rest between exerciseEntries, then rest 2 minutes between rounds",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 30,
                        exerciseId: "sprint-intervals",
                        exerciseNotes: "All-out effort",
                        restTime: 90,
                        setsCount: 8,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "rowing-machine",
                        exerciseNotes: "High intensity",
                        restTime: 60,
                        setsCount: 5,
                    },
                    {
                        durationSeconds: 40,
                        exerciseId: "cycling",
                        exerciseNotes: "Tabata protocol",
                        restTime: 40,
                        setsCount: 6,
                    },
                ],
                id: "cardio-hiit",
                name: "Cardio HIIT",
            },
            {
                exerciseEntries: [
                    { exerciseId: "deadlift", reps: 5, restTime: 60, setsCount: 5 },
                    { exerciseId: "push-ups", reps: 15, restTime: 60, setsCount: 5 },
                    { exerciseId: "dumbbell-row", reps: 15, restTime: 60, setsCount: 5 },
                    { exerciseId: "goblet-squats", reps: 15, restTime: 60, setsCount: 5 },
                    { durationSeconds: 45, exerciseId: "plank", restTime: 60, setsCount: 5 },
                ],
                id: "strength-hiit",
                name: "Strength HIIT",
                overallNotes:
                    "Complete as circuit with minimal rest, then rest 2 minutes between rounds",
            },
        ],
    },
    // Mobility & Flexibility Program
    {
        author: "FitApp Science Team",
        description:
            "A science-backed program to improve range of motion, joint health, and movement quality for better performance and reduced injury risk.",
        durationWeeks: 6,
        frequency: 3,
        goals: [
            "Improve overall mobility and flexibility",
            "Enhance movement patterns",
            "Reduce injury risk",
            "Optimize recovery between workouts",
        ],
        id: "mobility-flexibility",
        image: "mobility-flexibility.jpg",
        level: "beginner",
        location: "gym",
        name: "Functional Mobility & Flexibility",
        scienceReference:
            "Based on FMS (Functional Movement Screen) principles and dynamic mobility research",
        type: "circuit",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "shoulder-circles",
                        exerciseNotes: "Each direction",
                        reps: 15,
                        restTime: 30,
                        setsCount: 3,
                    },
                    { exerciseId: "wall-slides", reps: 12, restTime: 30, setsCount: 3 },
                    {
                        exerciseId: "thoracic-spine-rotations",
                        exerciseNotes: "Each side",
                        reps: 10,
                        restTime: 30,
                        setsCount: 3,
                    },
                    { exerciseId: "cat-cow", reps: 12, restTime: 30, setsCount: 3 },
                    {
                        exerciseId: "open-book",
                        exerciseNotes: "Each side",
                        reps: 10,
                        restTime: 30,
                        setsCount: 3,
                    },
                ],
                id: "upper-mobility",
                name: "Upper Body Mobility",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "hip-circles",
                        exerciseNotes: "Each direction",
                        reps: 12,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "cossack-squats",
                        exerciseNotes: "Each side",
                        reps: 10,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 45,
                        exerciseId: "lizard-pose",
                        exerciseNotes: "Each side",
                        restTime: 30,
                        setsCount: 3,
                    },
                    { durationSeconds: 60, exerciseId: "squat-hold", restTime: 45, setsCount: 3 },
                    {
                        exerciseId: "ankle-mobility",
                        exerciseNotes: "Each ankle",
                        reps: 15,
                        restTime: 30,
                        setsCount: 3,
                    },
                ],
                id: "lower-mobility",
                name: "Lower Body Mobility",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "sun-salutation",
                        exerciseNotes: "Full sequence",
                        reps: 5,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "world's-greatest-stretch",
                        exerciseNotes: "Each side",
                        reps: 6,
                        restTime: 45,
                        setsCount: 3,
                    },
                    { exerciseId: "downward-upward-dog", reps: 10, restTime: 45, setsCount: 3 },
                    { exerciseId: "inchworm", reps: 8, restTime: 45, setsCount: 3 },
                    {
                        exerciseId: "bird-dog",
                        exerciseNotes: "Alternating",
                        reps: 12,
                        restTime: 45,
                        setsCount: 3,
                    },
                ],
                id: "full-mobility",
                name: "Full Body Flow",
            },
        ],
    },
    // Athletic Performance Program
    {
        author: "FitApp Science Team",
        description:
            "An advanced multi-faceted training program designed to optimize athletic performance through power, strength, speed, and conditioning work.",
        durationWeeks: 12,
        frequency: 5,
        goals: [
            "Improve power output",
            "Enhance speed and agility",
            "Increase explosiveness",
            "Optimize sport-specific conditioning",
        ],
        id: "athletic-performance",
        image: "athletic-performance.jpg",
        level: "advanced",
        location: "gym",
        name: "Athletic Performance Elite",
        scienceReference:
            "Based on NSCA sport performance principles and periodized training models",
        type: "circuit",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "hang-clean",
                        exerciseNotes: "Focus on technique and explosiveness",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    { exerciseId: "box-jumps", reps: 8, restTime: 120, setsCount: 4 },
                    { exerciseId: "medicine-ball-throws", reps: 10, restTime: 120, setsCount: 4 },
                    { exerciseId: "jump-squats", reps: 10, restTime: 120, setsCount: 4 },
                    { exerciseId: "plyo-push-ups", reps: 8, restTime: 120, setsCount: 3 },
                ],
                id: "power-development",
                name: "Power Development",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "squat",
                        exerciseNotes: "80-85% 1RM",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "bench-press",
                        exerciseNotes: "80-85% 1RM",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "deadlift",
                        exerciseNotes: "80-85% 1RM",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "pull-ups",
                        exerciseNotes: "Weighted if possible",
                        reps: 6,
                        restTime: 120,
                        setsCount: 4,
                    },
                    { exerciseId: "barbell-overhead-press", reps: 6, restTime: 120, setsCount: 4 },
                ],
                id: "strength-day",
                name: "Maximal Strength",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 60,
                        exerciseId: "ladder-drills",
                        exerciseNotes: "Various patterns",
                        restTime: 120,
                        setsCount: 4,
                    },
                    { durationSeconds: 60, exerciseId: "cone-drills", restTime: 120, setsCount: 4 },
                    {
                        durationSeconds: 30,
                        exerciseId: "shuttle-runs",
                        restTime: 120,
                        setsCount: 6,
                    },
                    { exerciseId: "broad-jumps", reps: 5, restTime: 120, setsCount: 5 },
                    {
                        exerciseId: "lateral-bounds",
                        exerciseNotes: "Each side",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                ],
                id: "speed-agility",
                name: "Speed & Agility",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 30,
                        exerciseId: "running",
                        exerciseNotes: "Sprint intervals",
                        restTime: 60,
                        setsCount: 10,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "rowing-machine",
                        exerciseNotes: "High intensity",
                        restTime: 60,
                        setsCount: 5,
                    },
                    { durationSeconds: 30, exerciseId: "battle-ropes", restTime: 60, setsCount: 4 },
                    { exerciseId: "kettlebell-swings", reps: 20, restTime: 60, setsCount: 4 },
                ],
                id: "conditioning",
                name: "Sport Conditioning",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 600,
                        exerciseId: "foam-rolling",
                        exerciseNotes: "Full body foam rolling session",
                        restTime: 0,
                        setsCount: 1,
                    },
                    {
                        durationSeconds: 300,
                        exerciseId: "dynamic-stretching",
                        exerciseNotes: "Full body mobility flows",
                        restTime: 60,
                        setsCount: 2,
                    },
                    {
                        durationSeconds: 900,
                        exerciseId: "yoga-flow",
                        exerciseNotes: "Restorative practice",
                        restTime: 0,
                        setsCount: 1,
                    },
                ],
                id: "recovery-mobility",
                name: "Recovery & Mobility",
            },
        ],
    },
];

export const allTrainingPlans: readonly TrainingPlan[] = [
    ...strengthPlans,
    ...cardioPlans,
    ...hybridPlans,
    ...homeWorkoutPlans,
];
