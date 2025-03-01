import type { TrainingPlan } from "../types/workout-plans";

const homeWorkoutPlans: readonly TrainingPlan[] = [
    {
        author: "FitApp Science Team",
        category: "strength",
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
        workoutDays: [
            {
                exercises: [
                    {
                        exerciseId: "push-ups",
                        notes: "Modify on knees if needed",
                        reps: 10,
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        exerciseId: "bodyweight-squats",
                        reps: 15,
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        exerciseId: "resistance-band-rows",
                        notes: "Anchor band to door or sturdy object",
                        reps: 12,
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        exerciseId: "glute-bridges",
                        reps: 15,
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        duration: 30,
                        exerciseId: "plank",
                        restTime: 45,
                        sets: 3,
                    },
                ],
                id: "home-full-body-a",
                name: "Home Full Body A",
            },
            {
                exercises: [
                    {
                        exerciseId: "lunges",
                        notes: "Alternating legs",
                        reps: 10,
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        exerciseId: "resistance-band-chest-press",
                        reps: 12,
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        exerciseId: "superman",
                        reps: 12,
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        exerciseId: "resistance-band-bicep-curls",
                        reps: 15,
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        exerciseId: "resistance-band-tricep-extensions",
                        reps: 15,
                        restTime: 45,
                        sets: 3,
                    },
                ],
                id: "home-full-body-b",
                name: "Home Full Body B",
            },
            {
                exercises: [
                    {
                        exerciseId: "chair-dips",
                        reps: 10,
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        exerciseId: "bodyweight-bulgarian-split-squats",
                        notes: "Each leg",
                        reps: 8,
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        exerciseId: "resistance-band-lateral-raises",
                        reps: 12,
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        duration: 30,
                        exerciseId: "mountain-climbers",
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        exerciseId: "russian-twist",
                        reps: 20,
                        restTime: 45,
                        sets: 3,
                    },
                ],
                id: "home-full-body-c",
                name: "Home Full Body C",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        category: "hybrid",
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
        workoutDays: [
            {
                exercises: [
                    {
                        exerciseId: "jump-squats",
                        reps: 15,
                        restTime: 30,
                        sets: 4,
                    },
                    {
                        exerciseId: "push-ups",
                        reps: 12,
                        restTime: 30,
                        sets: 4,
                    },
                    {
                        duration: 30,
                        exerciseId: "mountain-climbers",
                        restTime: 30,
                        sets: 4,
                    },
                    {
                        exerciseId: "burpees",
                        reps: 10,
                        restTime: 30,
                        sets: 4,
                    },
                    {
                        exerciseId: "plank-shoulder-taps",
                        reps: 20,
                        restTime: 30,
                        sets: 4,
                    },
                ],
                id: "hiit-circuit-a",
                name: "HIIT Circuit A",
                notes: "Complete as a circuit with minimal rest between exercises, then rest 2 minutes between rounds",
            },
            {
                exercises: [
                    {
                        duration: 30,
                        exerciseId: "high-knees",
                        restTime: 30,
                        sets: 4,
                    },
                    {
                        exerciseId: "resistance-band-rows",
                        reps: 15,
                        restTime: 30,
                        sets: 4,
                    },
                    {
                        exerciseId: "lateral-lunges",
                        notes: "Alternating sides",
                        reps: 16,
                        restTime: 30,
                        sets: 4,
                    },
                    {
                        exerciseId: "resistance-band-chest-press",
                        reps: 15,
                        restTime: 30,
                        sets: 4,
                    },
                    {
                        exerciseId: "bicycle-crunches",
                        reps: 20,
                        restTime: 30,
                        sets: 4,
                    },
                ],
                id: "hiit-circuit-b",
                name: "HIIT Circuit B",
                notes: "Complete as a circuit with minimal rest between exercises, then rest 2 minutes between rounds",
            },
            {
                exercises: [
                    {
                        duration: 30,
                        exerciseId: "jumping-jacks",
                        restTime: 15,
                        sets: 3,
                    },
                    {
                        exerciseId: "chair-step-ups",
                        notes: "Alternating legs",
                        reps: 20,
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        duration: 30,
                        exerciseId: "jumping-jacks",
                        restTime: 15,
                        sets: 3,
                    },
                    {
                        exerciseId: "bodyweight-squats",
                        reps: 25,
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        duration: 30,
                        exerciseId: "jumping-jacks",
                        restTime: 15,
                        sets: 3,
                    },
                    {
                        exerciseId: "push-ups",
                        reps: 15,
                        restTime: 30,
                        sets: 3,
                    },
                ],
                id: "cardio-strength-intervals",
                name: "Cardio-Strength Intervals",
                notes: "Alternate between cardio (jumping jacks) and strength exercises",
            },
            {
                exercises: [
                    {
                        exerciseId: "resistance-band-full-body-circuit",
                        notes: "Complete 5 exercises with band: curls, overhead press, squats, rows, tricep extensions",
                        reps: 12,
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        duration: 120,
                        exerciseId: "bodyweight-cardio-circuit",
                        notes: "Complete 4 exercises: jumping jacks, mountain climbers, high knees, butt kicks",
                        restTime: 60,
                        sets: 3,
                    },
                ],
                id: "super-circuit",
                name: "Super Circuit Day",
                notes: "Alternate between resistance band circuit and bodyweight cardio circuit",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        category: "cardio",
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
        workoutDays: [
            {
                exercises: [
                    {
                        duration: 60,
                        exerciseId: "jumping-jacks",
                        restTime: 30,
                        sets: 4,
                    },
                    {
                        duration: 60,
                        exerciseId: "high-knees",
                        restTime: 30,
                        sets: 4,
                    },
                    {
                        duration: 60,
                        exerciseId: "butt-kicks",
                        restTime: 30,
                        sets: 4,
                    },
                    {
                        duration: 60,
                        exerciseId: "jumping-jacks",
                        restTime: 30,
                        sets: 4,
                    },
                ],
                id: "basic-cardio",
                name: "Basic Cardio Circuit",
                notes: "Focus on maintaining good form throughout the exercises",
            },
            {
                exercises: [
                    {
                        exerciseId: "jump-squats",
                        reps: 15,
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        duration: 45,
                        exerciseId: "mountain-climbers",
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        exerciseId: "burpees",
                        notes: "Modify by stepping back instead of jumping if needed",
                        reps: 10,
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        duration: 30,
                        exerciseId: "plank-jacks",
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        exerciseId: "skater-jumps",
                        reps: 20,
                        restTime: 30,
                        sets: 3,
                    },
                ],
                id: "hiit-cardio",
                name: "HIIT Cardio Blast",
                notes: "Complete as a circuit with minimal rest between exercises",
            },
            {
                exercises: [
                    {
                        duration: 120,
                        exerciseId: "shadow-boxing",
                        notes: "Alternate between punches, uppercuts and hooks",
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        duration: 120,
                        exerciseId: "jumping-rope",
                        notes: "Simulate if you don't have a rope",
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        duration: 60,
                        exerciseId: "lateral-shuffles",
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        duration: 60,
                        exerciseId: "standing-mountain-climbers",
                        restTime: 30,
                        sets: 3,
                    },
                ],
                id: "cardio-variety",
                name: "Cardio Variety Session",
                notes: "Focus on keeping your heart rate elevated throughout the workout",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        category: "strength",
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
        workoutDays: [
            {
                exercises: [
                    {
                        exerciseId: "cat-cow",
                        reps: 15,
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        exerciseId: "bird-dog",
                        notes: "Alternating sides with controlled movement",
                        reps: 12,
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        exerciseId: "glute-bridges",
                        reps: 15,
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        exerciseId: "dead-bug",
                        reps: 10,
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        duration: 45,
                        exerciseId: "plank",
                        restTime: 60,
                        sets: 3,
                    },
                ],
                id: "core-foundation",
                name: "Core Foundation",
                notes: "Focus on breathing and maintaining proper form",
            },
            {
                exercises: [
                    {
                        exerciseId: "world's-greatest-stretch",
                        notes: "Each side",
                        reps: 6,
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        exerciseId: "thoracic-spine-rotations",
                        notes: "Each side",
                        reps: 10,
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        exerciseId: "hip-circles",
                        notes: "Each direction",
                        reps: 10,
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        exerciseId: "standing-side-bends",
                        notes: "Each side",
                        reps: 12,
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        exerciseId: "wall-slides",
                        reps: 12,
                        restTime: 30,
                        sets: 3,
                    },
                ],
                id: "mobility-flow",
                name: "Mobility Flow",
                notes: "Move slowly and with control, focusing on full range of motion",
            },
            {
                exercises: [
                    {
                        exerciseId: "bicycle-crunches",
                        reps: 20,
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        exerciseId: "superman",
                        reps: 12,
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        duration: 30,
                        exerciseId: "side-plank",
                        notes: "Each side",
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        exerciseId: "russian-twist",
                        reps: 20,
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        exerciseId: "prone-y-t-w-raises",
                        notes: "Hold each position briefly",
                        reps: 15,
                        restTime: 45,
                        sets: 3,
                    },
                ],
                id: "core-challenge",
                name: "Core Challenge",
                notes: "Maintain engagement through all exercises",
            },
        ],
    },
];

export const strengthPlans: readonly TrainingPlan[] = [
    {
        author: "FitApp Science Team",
        category: "strength",
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
        workoutDays: [
            {
                exercises: [
                    {
                        exerciseId: "squat",
                        notes: "Focus on form and depth",
                        reps: 10,
                        restTime: 90,
                        sets: 3,
                    },
                    { exerciseId: "bench-press", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "seated-row", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "dumbbell-shoulder-press", reps: 10, restTime: 90, sets: 3 },
                    { duration: 30, exerciseId: "plank", restTime: 60, sets: 3 },
                ],
                id: "fb-a",
                name: "Full Body A",
            },
            {
                exercises: [
                    {
                        exerciseId: "deadlift",
                        notes: "Focus on hip hinge movement",
                        reps: 8,
                        restTime: 120,
                        sets: 3,
                    },
                    { exerciseId: "push-ups", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "lat-pulldown", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "lateral-raises", reps: 12, restTime: 60, sets: 3 },
                    { exerciseId: "bicycle-crunches", reps: 15, restTime: 60, sets: 3 },
                ],
                id: "fb-b",
                name: "Full Body B",
            },
            {
                exercises: [
                    { exerciseId: "leg-press", reps: 12, restTime: 90, sets: 3 },
                    { exerciseId: "dumbbell-press", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "bent-over-row", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "bicep-curls", reps: 12, restTime: 60, sets: 3 },
                    { exerciseId: "tricep-pushdown", reps: 12, restTime: 60, sets: 3 },
                ],
                id: "fb-c",
                name: "Full Body C",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        category: "strength",
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
        workoutDays: [
            {
                exercises: [
                    { exerciseId: "bench-press", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "bent-over-row", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "dumbbell-shoulder-press", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "lat-pulldown", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "tricep-pushdown", reps: 12, restTime: 60, sets: 3 },
                    { exerciseId: "bicep-curls", reps: 12, restTime: 60, sets: 3 },
                ],
                id: "upper-a",
                name: "Upper Body A",
            },
            {
                exercises: [
                    { exerciseId: "squat", reps: 8, restTime: 150, sets: 4 },
                    { exerciseId: "romanian-deadlift", reps: 8, restTime: 150, sets: 4 },
                    { exerciseId: "leg-extension", reps: 12, restTime: 90, sets: 3 },
                    { exerciseId: "leg-curl", reps: 12, restTime: 90, sets: 3 },
                    { exerciseId: "calf-raises", reps: 15, restTime: 60, sets: 3 },
                    { duration: 45, exerciseId: "plank", restTime: 60, sets: 3 },
                ],
                id: "lower-a",
                name: "Lower Body A",
            },
            {
                exercises: [
                    { exerciseId: "incline-bench-press", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "pull-ups", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "lateral-raises", reps: 12, restTime: 90, sets: 3 },
                    { exerciseId: "seated-row", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "skull-crushers", reps: 12, restTime: 60, sets: 3 },
                    { exerciseId: "hammer-curls", reps: 12, restTime: 60, sets: 3 },
                ],
                id: "upper-b",
                name: "Upper Body B",
            },
            {
                exercises: [
                    { exerciseId: "deadlift", reps: 6, restTime: 180, sets: 4 },
                    { exerciseId: "leg-press", reps: 10, restTime: 120, sets: 4 },
                    { exerciseId: "lunges", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "hip-thrusts", reps: 12, restTime: 90, sets: 3 },
                    { exerciseId: "calf-raises", reps: 15, restTime: 60, sets: 3 },
                    { exerciseId: "russian-twist", reps: 20, restTime: 60, sets: 3 },
                ],
                id: "lower-b",
                name: "Lower Body B",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        category: "strength",
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
        workoutDays: [
            {
                exercises: [
                    {
                        exerciseId: "bench-press",
                        notes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        sets: 5,
                    },
                    { exerciseId: "dumbbell-shoulder-press", reps: 8, restTime: 120, sets: 4 },
                    {
                        exerciseId: "incline-dumbbell-bench-press",
                        reps: 10,
                        restTime: 120,
                        sets: 4,
                    },
                    { exerciseId: "lateral-raises", reps: 12, restTime: 90, sets: 4 },
                    { exerciseId: "tricep-pushdown", reps: 12, restTime: 60, sets: 4 },
                    { exerciseId: "skull-crushers", reps: 12, restTime: 60, sets: 3 },
                ],
                id: "push-a",
                name: "Push Day A",
            },
            {
                exercises: [
                    {
                        exerciseId: "bent-over-row",
                        notes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        sets: 5,
                    },
                    { exerciseId: "pull-ups", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "seated-row", reps: 10, restTime: 120, sets: 4 },
                    { exerciseId: "cable-face-pulls", reps: 15, restTime: 90, sets: 3 },
                    { exerciseId: "bicep-curls", reps: 12, restTime: 60, sets: 4 },
                    { exerciseId: "hammer-curls", reps: 12, restTime: 60, sets: 3 },
                ],
                id: "pull-a",
                name: "Pull Day A",
            },
            {
                exercises: [
                    { exerciseId: "squat", notes: "RPE 8-9", reps: 5, restTime: 180, sets: 5 },
                    { exerciseId: "romanian-deadlift", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "leg-press", reps: 10, restTime: 120, sets: 4 },
                    { exerciseId: "leg-extension", reps: 15, restTime: 90, sets: 3 },
                    { exerciseId: "calf-raises", reps: 15, restTime: 60, sets: 4 },
                    { exerciseId: "abdominal-crunches", reps: 15, restTime: 60, sets: 3 },
                ],
                id: "legs-a",
                name: "Legs Day A",
            },
            {
                exercises: [
                    {
                        exerciseId: "barbell-overhead-press",
                        notes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        sets: 5,
                    },
                    { exerciseId: "incline-bench-press", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "dumbbell-press", reps: 10, restTime: 120, sets: 4 },
                    { exerciseId: "front-raises", reps: 12, restTime: 90, sets: 3 },
                    { exerciseId: "tricep-dips", reps: 10, restTime: 60, sets: 4 },
                    { exerciseId: "tricep-kickbacks", reps: 12, restTime: 60, sets: 3 },
                ],
                id: "push-b",
                name: "Push Day B",
            },
            {
                exercises: [
                    { exerciseId: "deadlift", notes: "RPE 8-9", reps: 5, restTime: 180, sets: 5 },
                    { exerciseId: "lat-pulldown", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "one-arm-dumbbell-row", reps: 10, restTime: 120, sets: 4 },
                    { exerciseId: "reverse-flyes", reps: 15, restTime: 90, sets: 3 },
                    { exerciseId: "preacher-curls", reps: 12, restTime: 60, sets: 4 },
                    { exerciseId: "cable-curls", reps: 12, restTime: 60, sets: 3 },
                ],
                id: "pull-b",
                name: "Pull Day B",
            },
            {
                exercises: [
                    { exerciseId: "bulgarian-split-squats", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "leg-press", reps: 12, restTime: 120, sets: 4 },
                    { exerciseId: "hip-thrusts", reps: 12, restTime: 120, sets: 4 },
                    { exerciseId: "leg-curl", reps: 15, restTime: 90, sets: 3 },
                    { exerciseId: "calf-raises", reps: 20, restTime: 60, sets: 4 },
                    { duration: 60, exerciseId: "plank", restTime: 60, sets: 3 },
                ],
                id: "legs-b",
                name: "Legs Day B",
            },
        ],
    },

    {
        author: "FitApp Science Team",
        category: "strength",
        description:
            "A science-based progressive program focused on optimal glute development through varied stimulation patterns and evidence-based exercises.",
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
        workoutDays: [
            {
                exercises: [
                    {
                        exerciseId: "hip-thrusts",
                        notes: "Heavy load, focus on full contraction",
                        reps: 8,
                        restTime: 120,
                        sets: 4,
                    },
                    { exerciseId: "romanian-deadlift", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "bulgarian-split-squats", reps: 12, restTime: 90, sets: 3 },
                    {
                        exerciseId: "cable-kickbacks",
                        notes: "Slow eccentric",
                        reps: 15,
                        restTime: 60,
                        sets: 3,
                    },
                    { exerciseId: "lateral-band-walks", reps: 15, restTime: 60, sets: 3 },
                ],
                id: "glute-focus-a",
                name: "Glute Focus A",
            },
            {
                exercises: [
                    { exerciseId: "squat", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "deadlift", reps: 8, restTime: 120, sets: 3 },
                    { exerciseId: "walking-lunges", reps: 12, restTime: 90, sets: 3 },
                    {
                        exerciseId: "leg-press",
                        notes: "High foot placement",
                        reps: 12,
                        restTime: 90,
                        sets: 3,
                    },
                    { exerciseId: "calf-raises", reps: 15, restTime: 60, sets: 3 },
                ],
                id: "compound-lower",
                name: "Compound Lower Body",
            },
            {
                exercises: [
                    {
                        exerciseId: "glute-bridges",
                        notes: "With resistance band",
                        reps: 15,
                        restTime: 90,
                        sets: 3,
                    },
                    { exerciseId: "sumo-deadlift", reps: 8, restTime: 120, sets: 4 },
                    {
                        exerciseId: "goblet-squats",
                        notes: "Deep squat for glute activation",
                        reps: 12,
                        restTime: 90,
                        sets: 3,
                    },
                    { exerciseId: "step-ups", reps: 12, restTime: 90, sets: 3 },
                    { exerciseId: "frog-pumps", reps: 20, restTime: 60, sets: 3 },
                ],
                id: "glute-focus-b",
                name: "Glute Focus B",
            },
        ],
    },

    {
        author: "FitApp Science Team",
        category: "strength",
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
        workoutDays: [
            {
                exercises: [
                    {
                        duration: 45,
                        exerciseId: "plank",
                        notes: "Focus on proper alignment",
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        duration: 30,
                        exerciseId: "side-plank",
                        notes: "Both sides",
                        restTime: 60,
                        sets: 3,
                    },
                    { exerciseId: "pallof-press", reps: 12, restTime: 60, sets: 3 },
                    {
                        exerciseId: "bird-dog",
                        notes: "Slow and controlled",
                        reps: 10,
                        restTime: 60,
                        sets: 3,
                    },
                    { exerciseId: "dead-bug", reps: 10, restTime: 60, sets: 3 },
                ],
                id: "anti-rotation",
                name: "Anti-Rotation & Stability",
            },
            {
                exercises: [
                    { exerciseId: "hanging-leg-raises", reps: 12, restTime: 90, sets: 3 },
                    {
                        exerciseId: "russian-twist",
                        notes: "With weight",
                        reps: 20,
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        duration: 45,
                        exerciseId: "mountain-climbers",
                        notes: "Fast pace",
                        restTime: 60,
                        sets: 3,
                    },
                    { exerciseId: "bicycle-crunches", reps: 20, restTime: 60, sets: 3 },
                    { exerciseId: "v-ups", reps: 15, restTime: 60, sets: 3 },
                ],
                id: "dynamic-core",
                name: "Dynamic Core Training",
            },
            {
                exercises: [
                    {
                        exerciseId: "turkish-get-up",
                        notes: "Each side",
                        reps: 5,
                        restTime: 90,
                        sets: 3,
                    },
                    {
                        exerciseId: "woodchoppers",
                        notes: "Each side",
                        reps: 12,
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        exerciseId: "kettlebell-windmill",
                        notes: "Each side",
                        reps: 8,
                        restTime: 60,
                        sets: 3,
                    },
                    { exerciseId: "plank-shoulder-taps", reps: 20, restTime: 60, sets: 3 },
                    { exerciseId: "ab-rollouts", reps: 10, restTime: 90, sets: 3 },
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
        category: "cardio",
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
        workoutDays: [
            {
                exercises: [
                    {
                        duration: 1200,
                        exerciseId: "incline-walk",
                        notes: "Moderate pace, 3-4 RPE",
                        restTime: 0,
                        sets: 1,
                    },
                ],
                id: "steady-state",
                name: "Steady State Cardio",
            },
            {
                exercises: [
                    {
                        duration: 120,
                        exerciseId: "cycling",
                        notes: "Alternate between moderate (4-5 RPE) and light (2-3 RPE) intensities",
                        restTime: 90,
                        sets: 5,
                    },
                ],
                id: "light-intervals",
                name: "Light Interval Training",
            },
            {
                exercises: [
                    {
                        duration: 600,
                        exerciseId: "rowing-machine",
                        notes: "Steady pace (3-4 RPE)",
                        restTime: 0,
                        sets: 1,
                    },
                    {
                        duration: 600,
                        exerciseId: "incline-walk",
                        notes: "Moderate pace (3-4 RPE)",
                        restTime: 0,
                        sets: 1,
                    },
                ],
                id: "mixed-cardio",
                name: "Mixed Cardio Session",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        category: "cardio",
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
        workoutDays: [
            {
                exercises: [
                    {
                        duration: 60,
                        exerciseId: "running",
                        notes: "High intensity (7-8 RPE) sprints with full recovery",
                        restTime: 120,
                        sets: 8,
                    },
                ],
                id: "hiit-session",
                name: "HIIT Session",
            },
            {
                exercises: [
                    {
                        duration: 1800,
                        exerciseId: "running",
                        notes: "Sustained effort at 6-7 RPE",
                        restTime: 0,
                        sets: 1,
                    },
                ],
                id: "tempo-run",
                name: "Tempo Run",
            },
            {
                exercises: [
                    {
                        duration: 180,
                        exerciseId: "cycling",
                        notes: "1 min, 2 min, 3 min, 2 min, 1 min at high intensity (7-8 RPE)",
                        restTime: 120,
                        sets: 5,
                    },
                ],
                id: "pyramid-intervals",
                name: "Pyramid Intervals",
            },
            {
                exercises: [
                    {
                        duration: 900,
                        exerciseId: "rowing-machine",
                        notes: "Moderate pace (5-6 RPE)",
                        restTime: 0,
                        sets: 1,
                    },
                    {
                        duration: 900,
                        exerciseId: "stair-climber",
                        notes: "Moderate pace (5-6 RPE)",
                        restTime: 0,
                        sets: 1,
                    },
                ],
                id: "cross-training",
                name: "Cross Training",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        category: "cardio",
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
        workoutDays: [
            {
                exercises: [
                    {
                        duration: 60,
                        exerciseId: "running",
                        notes: "Near max effort (8-9 RPE) with incomplete recovery",
                        restTime: 60,
                        sets: 12,
                    },
                ],
                id: "intensive-intervals",
                name: "Intensive Intervals",
            },
            {
                exercises: [
                    {
                        duration: 600,
                        exerciseId: "cycling",
                        notes: "Sustained effort at threshold (7 RPE)",
                        restTime: 180,
                        sets: 3,
                    },
                ],
                id: "threshold-session",
                name: "Threshold Session",
            },
            {
                exercises: [
                    {
                        duration: 20,
                        exerciseId: "rowing-machine",
                        notes: "Maximum effort (9-10 RPE) with minimal rest",
                        restTime: 10,
                        sets: 8,
                    },
                ],
                id: "tabata-protocol",
                name: "Tabata Protocol",
            },
            {
                exercises: [
                    {
                        duration: 3600,
                        exerciseId: "running",
                        notes: "Moderate sustainable pace (5-6 RPE)",
                        restTime: 0,
                        sets: 1,
                    },
                ],
                id: "endurance-builder",
                name: "Endurance Builder",
            },
            {
                exercises: [
                    {
                        duration: 180,
                        exerciseId: "stair-climber",
                        notes: "High intensity (8 RPE)",
                        restTime: 60,
                        sets: 5,
                    },
                    {
                        duration: 180,
                        exerciseId: "rowing-machine",
                        notes: "High intensity (8 RPE)",
                        restTime: 60,
                        sets: 5,
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
        category: "hybrid",
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
        workoutDays: [
            {
                exercises: [
                    { exerciseId: "squat", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "bench-press", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "seated-row", reps: 10, restTime: 90, sets: 3 },
                    { duration: 30, exerciseId: "plank", restTime: 60, sets: 2 },
                ],
                id: "strength-a",
                name: "Full Body Strength A",
            },
            {
                exercises: [
                    {
                        duration: 1500,
                        exerciseId: "incline-walk",
                        notes: "Moderate pace (3-4 RPE)",
                        restTime: 0,
                        sets: 1,
                    },
                ],
                id: "cardio-a",
                name: "Steady State Cardio",
            },
            {
                exercises: [
                    { exerciseId: "deadlift", reps: 8, restTime: 90, sets: 3 },
                    { exerciseId: "dumbbell-shoulder-press", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "lat-pulldown", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "russian-twist", reps: 15, restTime: 60, sets: 2 },
                ],
                id: "strength-b",
                name: "Full Body Strength B",
            },
            {
                exercises: [
                    {
                        duration: 60,
                        exerciseId: "cycling",
                        notes: "Alternating between moderate (4-5 RPE) and light (2-3 RPE)",
                        restTime: 120,
                        sets: 6,
                    },
                ],
                id: "cardio-b",
                name: "Light Intervals",
            },
        ],
    },
    {
        author: "FitApp Science Team",
        category: "hybrid",
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
        workoutDays: [
            {
                exercises: [
                    { exerciseId: "bench-press", reps: 8, restTime: 90, sets: 4 },
                    { exerciseId: "pull-ups", reps: 8, restTime: 90, sets: 4 },
                    { exerciseId: "dumbbell-shoulder-press", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "seated-row", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "tricep-pushdown", reps: 12, restTime: 60, sets: 3 },
                ],
                id: "upper-strength",
                name: "Upper Body Strength",
            },
            {
                exercises: [
                    {
                        duration: 60,
                        exerciseId: "rowing-machine",
                        notes: "High intensity (7-8 RPE) with active recovery",
                        restTime: 90,
                        sets: 8,
                    },
                ],
                id: "interval-training",
                name: "High Intensity Intervals",
            },
            {
                exercises: [
                    { exerciseId: "squat", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "romanian-deadlift", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "lunges", reps: 10, restTime: 90, sets: 3 },
                    { exerciseId: "leg-extension", reps: 12, restTime: 60, sets: 3 },
                    { exerciseId: "calf-raises", reps: 15, restTime: 60, sets: 3 },
                ],
                id: "lower-strength",
                name: "Lower Body Strength",
            },
            {
                exercises: [
                    {
                        duration: 2400,
                        exerciseId: "running",
                        notes: "Moderate pace (5-6 RPE)",
                        restTime: 0,
                        sets: 1,
                    },
                ],
                id: "endurance-day",
                name: "Endurance Session",
            },
            {
                exercises: [
                    { exerciseId: "kettlebell-swings", reps: 15, restTime: 60, sets: 3 },
                    { exerciseId: "push-ups", reps: 15, restTime: 60, sets: 3 },
                    { duration: 30, exerciseId: "mountain-climbers", restTime: 60, sets: 3 },
                    { duration: 60, exerciseId: "rowing-machine", restTime: 60, sets: 3 },
                ],
                id: "functional-circuit",
                name: "Functional Circuit",
                notes: "Complete as a circuit with minimal rest between exercises",
            },
        ],
    },

    {
        author: "FitApp Science Team",
        category: "hybrid",
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
        workoutDays: [
            {
                exercises: [
                    {
                        exerciseId: "burpees",
                        notes: "As fast as possible with good form",
                        reps: 15,
                        restTime: 45,
                        sets: 4,
                    },
                    { exerciseId: "kettlebell-swings", reps: 20, restTime: 45, sets: 4 },
                    { duration: 40, exerciseId: "mountain-climbers", restTime: 45, sets: 4 },
                    { exerciseId: "jump-squats", reps: 15, restTime: 45, sets: 4 },
                    { duration: 30, exerciseId: "battle-ropes", restTime: 45, sets: 4 },
                ],
                id: "total-body-hiit",
                name: "Total Body HIIT",
                notes: "Complete as circuit with minimal rest between exercises, then rest 2 minutes between rounds",
            },
            {
                exercises: [
                    {
                        duration: 30,
                        exerciseId: "sprint-intervals",
                        notes: "All-out effort",
                        restTime: 90,
                        sets: 8,
                    },
                    {
                        duration: 60,
                        exerciseId: "rowing-machine",
                        notes: "High intensity",
                        restTime: 60,
                        sets: 5,
                    },
                    {
                        duration: 40,
                        exerciseId: "cycling",
                        notes: "Tabata protocol",
                        restTime: 40,
                        sets: 6,
                    },
                ],
                id: "cardio-hiit",
                name: "Cardio HIIT",
            },
            {
                exercises: [
                    { exerciseId: "deadlift", reps: 5, restTime: 60, sets: 5 },
                    { exerciseId: "push-ups", reps: 15, restTime: 60, sets: 5 },
                    { exerciseId: "dumbbell-row", reps: 15, restTime: 60, sets: 5 },
                    { exerciseId: "goblet-squats", reps: 15, restTime: 60, sets: 5 },
                    { duration: 45, exerciseId: "plank", restTime: 60, sets: 5 },
                ],
                id: "strength-hiit",
                name: "Strength HIIT",
                notes: "Complete as circuit with minimal rest, then rest 2 minutes between rounds",
            },
        ],
    },
    // Mobility & Flexibility Program
    {
        author: "FitApp Science Team",
        category: "hybrid",
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
        workoutDays: [
            {
                exercises: [
                    {
                        exerciseId: "shoulder-circles",
                        notes: "Each direction",
                        reps: 15,
                        restTime: 30,
                        sets: 3,
                    },
                    { exerciseId: "wall-slides", reps: 12, restTime: 30, sets: 3 },
                    {
                        exerciseId: "thoracic-spine-rotations",
                        notes: "Each side",
                        reps: 10,
                        restTime: 30,
                        sets: 3,
                    },
                    { exerciseId: "cat-cow", reps: 12, restTime: 30, sets: 3 },
                    {
                        exerciseId: "open-book",
                        notes: "Each side",
                        reps: 10,
                        restTime: 30,
                        sets: 3,
                    },
                ],
                id: "upper-mobility",
                name: "Upper Body Mobility",
            },
            {
                exercises: [
                    {
                        exerciseId: "hip-circles",
                        notes: "Each direction",
                        reps: 12,
                        restTime: 30,
                        sets: 3,
                    },
                    {
                        exerciseId: "cossack-squats",
                        notes: "Each side",
                        reps: 10,
                        restTime: 45,
                        sets: 3,
                    },
                    {
                        duration: 45,
                        exerciseId: "lizard-pose",
                        notes: "Each side",
                        restTime: 30,
                        sets: 3,
                    },
                    { duration: 60, exerciseId: "squat-hold", restTime: 45, sets: 3 },
                    {
                        exerciseId: "ankle-mobility",
                        notes: "Each ankle",
                        reps: 15,
                        restTime: 30,
                        sets: 3,
                    },
                ],
                id: "lower-mobility",
                name: "Lower Body Mobility",
            },
            {
                exercises: [
                    {
                        exerciseId: "sun-salutation",
                        notes: "Full sequence",
                        reps: 5,
                        restTime: 60,
                        sets: 3,
                    },
                    {
                        exerciseId: "world's-greatest-stretch",
                        notes: "Each side",
                        reps: 6,
                        restTime: 45,
                        sets: 3,
                    },
                    { exerciseId: "downward-upward-dog", reps: 10, restTime: 45, sets: 3 },
                    { exerciseId: "inchworm", reps: 8, restTime: 45, sets: 3 },
                    {
                        exerciseId: "bird-dog",
                        notes: "Alternating",
                        reps: 12,
                        restTime: 45,
                        sets: 3,
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
        category: "hybrid",
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
        workoutDays: [
            {
                exercises: [
                    {
                        exerciseId: "hang-clean",
                        notes: "Focus on technique and explosiveness",
                        reps: 5,
                        restTime: 180,
                        sets: 5,
                    },
                    { exerciseId: "box-jumps", reps: 8, restTime: 120, sets: 4 },
                    { exerciseId: "medicine-ball-throws", reps: 10, restTime: 120, sets: 4 },
                    { exerciseId: "jump-squats", reps: 10, restTime: 120, sets: 4 },
                    { exerciseId: "plyo-push-ups", reps: 8, restTime: 120, sets: 3 },
                ],
                id: "power-development",
                name: "Power Development",
            },
            {
                exercises: [
                    { exerciseId: "squat", notes: "80-85% 1RM", reps: 5, restTime: 180, sets: 5 },
                    {
                        exerciseId: "bench-press",
                        notes: "80-85% 1RM",
                        reps: 5,
                        restTime: 180,
                        sets: 5,
                    },
                    {
                        exerciseId: "deadlift",
                        notes: "80-85% 1RM",
                        reps: 5,
                        restTime: 180,
                        sets: 5,
                    },
                    {
                        exerciseId: "pull-ups",
                        notes: "Weighted if possible",
                        reps: 6,
                        restTime: 120,
                        sets: 4,
                    },
                    { exerciseId: "barbell-overhead-press", reps: 6, restTime: 120, sets: 4 },
                ],
                id: "strength-day",
                name: "Maximal Strength",
            },
            {
                exercises: [
                    {
                        duration: 60,
                        exerciseId: "ladder-drills",
                        notes: "Various patterns",
                        restTime: 120,
                        sets: 4,
                    },
                    { duration: 60, exerciseId: "cone-drills", restTime: 120, sets: 4 },
                    { duration: 30, exerciseId: "shuttle-runs", restTime: 120, sets: 6 },
                    { exerciseId: "broad-jumps", reps: 5, restTime: 120, sets: 5 },
                    {
                        exerciseId: "lateral-bounds",
                        notes: "Each side",
                        reps: 8,
                        restTime: 120,
                        sets: 4,
                    },
                ],
                id: "speed-agility",
                name: "Speed & Agility",
            },
            {
                exercises: [
                    {
                        duration: 30,
                        exerciseId: "running",
                        notes: "Sprint intervals",
                        restTime: 60,
                        sets: 10,
                    },
                    {
                        duration: 60,
                        exerciseId: "rowing-machine",
                        notes: "High intensity",
                        restTime: 60,
                        sets: 5,
                    },
                    { duration: 30, exerciseId: "battle-ropes", restTime: 60, sets: 4 },
                    { exerciseId: "kettlebell-swings", reps: 20, restTime: 60, sets: 4 },
                ],
                id: "conditioning",
                name: "Sport Conditioning",
            },
            {
                exercises: [
                    {
                        duration: 600,
                        exerciseId: "foam-rolling",
                        notes: "Full body foam rolling session",
                        restTime: 0,
                        sets: 1,
                    },
                    {
                        duration: 300,
                        exerciseId: "dynamic-stretching",
                        notes: "Full body mobility flows",
                        restTime: 60,
                        sets: 2,
                    },
                    {
                        duration: 900,
                        exerciseId: "yoga-flow",
                        notes: "Restorative practice",
                        restTime: 0,
                        sets: 1,
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
