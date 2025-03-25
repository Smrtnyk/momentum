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
                        exerciseId: "Push-ups",
                        exerciseNotes: "Modify on knees if needed",
                        reps: 10,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Bodyweight_Squat",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Back_Flyes_-_With_Bands",
                        exerciseNotes: "Anchor band to door or sturdy object",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Butt_Lift_Bridge",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Plank",
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
                        exerciseId: "Barbell_Lunge",
                        exerciseNotes: "Alternating legs",
                        reps: 10,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Bench_Press_-_With_Bands",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Superman",
                        reps: 12,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Band_Pull_Apart",
                        reps: 15,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Band_Skull_Crusher",
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
                        exerciseId: "Bench_Dips",
                        reps: 10,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Lunge",
                        exerciseNotes: "Each leg",
                        reps: 8,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Alternating_Deltoid_Raise",
                        reps: 12,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Mountain_Climbers",
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Russian_Twist",
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
        type: "hybrid",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "Front_Box_Jump",
                        reps: 15,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Pushups",
                        reps: 12,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Mountain_Climbers",
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Burpees",
                        reps: 10,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Plank",
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
                        exerciseId: "High_Knees",
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Back_Flyes_-_With_Bands",
                        reps: 15,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Lateral_Lunge",
                        exerciseNotes: "Alternating sides",
                        reps: 16,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Bench_Press_-_With_Bands",
                        reps: 15,
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Cross-Body_Crunch",
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
                        exerciseId: "Jumping_Jacks",
                        restTime: 15,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Step_Ups",
                        exerciseNotes: "Alternating legs",
                        reps: 20,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Jumping_Jacks",
                        restTime: 15,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Bodyweight_Squat",
                        reps: 25,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Jumping_Jacks",
                        restTime: 15,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Pushups",
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
                        exerciseId: "Band_Pull_Apart",
                        exerciseNotes:
                            "Complete 5 exerciseEntries with band: curls, overhead press, squats, rows, tricep extensions",
                        reps: 12,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 120,
                        exerciseId: "Bodyweight_Walking_Lunge",
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
                        exerciseId: "Jumping_Jacks",
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "High_Knees",
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "Butt-Ups",
                        restTime: 30,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "Jumping_Jacks",
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
                        exerciseId: "Front_Box_Jump",
                        reps: 15,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 45,
                        exerciseId: "Mountain_Climbers",
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Burpees",
                        exerciseNotes: "Modify by stepping back instead of jumping if needed",
                        reps: 10,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Plank_Jacks",
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Skater_Jump",
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
                        exerciseId: "Boxing",
                        exerciseNotes: "Alternate between punches, uppercuts and hooks",
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 120,
                        exerciseId: "Rope_Jumping",
                        exerciseNotes: "Simulate if you don't have a rope",
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "Lateral_Shuffle",
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "Mountain_Climbers",
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
                        exerciseId: "Cat_Stretch",
                        reps: 15,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Bird_Dog",
                        exerciseNotes: "Alternating sides with controlled movement",
                        reps: 12,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Butt_Lift_Bridge",
                        reps: 15,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Dead_Bug",
                        reps: 10,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 45,
                        exerciseId: "Plank",
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
                        exerciseId: "Worlds_Greatest_Stretch",
                        exerciseNotes: "Each side",
                        reps: 6,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Thoracic_Spine_Rotation",
                        exerciseNotes: "Each side",
                        reps: 10,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Hip_Circles_prone",
                        exerciseNotes: "Each direction",
                        reps: 10,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Side_Bend",
                        exerciseNotes: "Each side",
                        reps: 12,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Linear_Acceleration_Wall_Drill",
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
                        exerciseId: "Cross-Body_Crunch",
                        reps: 20,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Superman",
                        reps: 12,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Side_Bridge",
                        exerciseNotes: "Each side",
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Russian_Twist",
                        reps: 20,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Prone_lying_leg_raise",
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

const strengthPlans: readonly TrainingPlan[] = [
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
                        exerciseId: "Barbell_Squat",
                        exerciseNotes: "Focus on form and depth",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Bench_Press_-_Medium_Grip",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Seated_Cable_Rows",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Dumbbell_Shoulder_Press",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Plank",
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "fb-a",
                name: "Full Body A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Barbell_Deadlift",
                        exerciseNotes: "Focus on hip hinge movement",
                        reps: 8,
                        restTime: 120,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Pushups",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Full_Range-Of-Motion_Lat_Pulldown",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Lateral_Raise_-_With_Bands",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Cross-Body_Crunch",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "fb-b",
                name: "Full Body B",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Leg_Press",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Dumbbell_Bench_Press",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Bent_Over_Barbell_Row",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Curl",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Triceps_Pushdown",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
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
                    {
                        exerciseId: "Barbell_Bench_Press_-_Medium_Grip",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Bent_Over_Barbell_Row",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Dumbbell_Shoulder_Press",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Full_Range-Of-Motion_Lat_Pulldown",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Triceps_Pushdown",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Curl",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "upper-a",
                name: "Upper Body A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Barbell_Squat",
                        reps: 8,
                        restTime: 150,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Romanian_Deadlift",
                        reps: 8,
                        restTime: 150,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Leg_Extensions",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Lying_Leg_Curls",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Calf_Raises_-_With_Bands",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 45,
                        exerciseId: "Plank",
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "lower-a",
                name: "Lower Body A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Barbell_Incline_Bench_Press_-_Medium_Grip",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Pullups",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Lateral_Raise_-_With_Bands",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Seated_Cable_Rows",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "EZ-Bar_Skullcrusher",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Hammer_Curls",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "upper-b",
                name: "Upper Body B",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Barbell_Deadlift",
                        reps: 6,
                        restTime: 180,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Leg_Press",
                        reps: 10,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Barbell_Lunge",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Glute_Bridge",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Calf_Raises_-_With_Bands",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Russian_Twist",
                        reps: 20,
                        restTime: 60,
                        setsCount: 3,
                    },
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
                        exerciseId: "Barbell_Bench_Press_-_Medium_Grip",
                        exerciseNotes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Dumbbell_Shoulder_Press",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Incline_Dumbbell_Bench_With_Palms_Facing_In",
                        reps: 10,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Lateral_Raise_-_With_Bands",
                        reps: 12,
                        restTime: 90,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Triceps_Pushdown",
                        reps: 12,
                        restTime: 60,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "EZ-Bar_Skullcrusher",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "push-a",
                name: "Push Day A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Bent_Over_Barbell_Row",
                        exerciseNotes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Pullups",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Seated_Cable_Rows",
                        reps: 10,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Face_Pull",
                        reps: 15,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Curl",
                        reps: 12,
                        restTime: 60,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Hammer_Curls",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "pull-a",
                name: "Pull Day A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Barbell_Full_Squat",
                        exerciseNotes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Romanian_Deadlift",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Leg_Press",
                        reps: 10,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Leg_Extensions",
                        reps: 15,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Calf_Raises_-_With_Bands",
                        reps: 15,
                        restTime: 60,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Crunches",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "legs-a",
                name: "Legs Day A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Barbell_Shoulder_Press",
                        exerciseNotes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Barbell_Incline_Bench_Press_-_Medium_Grip",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Dumbbell_Bench_Press",
                        reps: 10,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Front_Dumbbell_Raise",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Bench_Dips",
                        reps: 10,
                        restTime: 60,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Tricep_Dumbbell_Kickback",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "push-b",
                name: "Push Day B",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Barbell_Deadlift",
                        exerciseNotes: "RPE 8-9",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Full_Range-Of-Motion_Lat_Pulldown",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "One-Arm_Dumbbell_Row",
                        reps: 10,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Reverse_Flyes",
                        reps: 15,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Preacher_Curl",
                        reps: 12,
                        restTime: 60,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Cable_Hammer_Curls_-_Rope_Attachment",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "pull-b",
                name: "Pull Day B",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Bulgarian_Split_Squat",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Leg_Press",
                        reps: 12,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Barbell_Hip_Thrust",
                        reps: 12,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Lying_Leg_Curls",
                        reps: 15,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Calf_Raises_-_With_Bands",
                        reps: 20,
                        restTime: 60,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "Plank",
                        restTime: 60,
                        setsCount: 3,
                    },
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
                        exerciseId: "Barbell_Hip_Thrust",
                        exerciseNotes: "Heavy load, focus on full contraction",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Romanian_Deadlift",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Bulgarian_Split_Squat",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Cable_Hip_Adduction",
                        exerciseNotes: "Slow eccentric",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Lateral_Band_Walk",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "glute-focus-a",
                name: "Glute Focus A",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Barbell_Full_Squat",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Barbell_Deadlift",
                        reps: 8,
                        restTime: 120,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Walking_Lunge",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Leg_Press",
                        exerciseNotes: "High foot placement",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Calf_Raises_-_With_Bands",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "compound-lower",
                name: "Compound Lower Body",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Butt_Lift_Bridge",
                        exerciseNotes: "With resistance band",
                        reps: 15,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Sumo_Deadlift",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Goblet_Squat",
                        exerciseNotes: "Deep squat for glute activation",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Step_Ups",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Frog_Sit-Ups",
                        reps: 20,
                        restTime: 60,
                        setsCount: 3,
                    },
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
                        exerciseId: "Plank",
                        exerciseNotes: "Focus on proper alignment",
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Side_Bridge",
                        exerciseNotes: "Each side",
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Pallof_Press",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Bird_Dog",
                        exerciseNotes: "Slow and controlled",
                        reps: 10,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Dead_Bug",
                        reps: 10,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "anti-rotation",
                name: "Anti-Rotation & Stability",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Hanging_Leg_Raise",
                        reps: 12,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Russian_Twist",
                        exerciseNotes: "With weight",
                        reps: 20,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 45,
                        exerciseId: "Mountain_Climbers",
                        exerciseNotes: "Fast pace",
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Cross-Body_Crunch",
                        reps: 20,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "V_Up",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "dynamic-core",
                name: "Dynamic Core Training",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Kettlebell_Turkish_Get-Up_Lunge_style",
                        exerciseNotes: "Each side",
                        reps: 5,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Standing_Cable_Wood_Chop",
                        exerciseNotes: "Each side",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Kettlebell_Windmill",
                        exerciseNotes: "Each side",
                        reps: 8,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Plank_Shoulder_Tap",
                        reps: 20,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Ab_Rollout",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                ],
                id: "functional-core",
                name: "Functional Core Integration",
            },
        ],
    },
];

const cardioPlans: readonly TrainingPlan[] = [
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
                        exerciseId: "Incline_Walk",
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
                        exerciseId: "Bicycling_Stationary",
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
                        exerciseId: "Rowing_Stationary",
                        exerciseNotes: "Steady pace (3-4 RPE)",
                        restTime: 0,
                        setsCount: 1,
                    },
                    {
                        durationSeconds: 600,
                        exerciseId: "Incline_Walk",
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
                        exerciseId: "Running_Treadmill",
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
                        exerciseId: "Running_Treadmill",
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
                        exerciseId: "Bicycling_Stationary",
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
                        exerciseId: "Rowing_Stationary",
                        exerciseNotes: "Moderate pace (5-6 RPE)",
                        restTime: 0,
                        setsCount: 1,
                    },
                    {
                        durationSeconds: 900,
                        exerciseId: "Stairmaster",
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
                        exerciseId: "Running_Treadmill",
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
                        exerciseId: "Bicycling_Stationary",
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
                        exerciseId: "Rowing_Stationary",
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
                        exerciseId: "Running_Treadmill",
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
                        exerciseId: "Stairmaster",
                        exerciseNotes: "High intensity (8 RPE)",
                        restTime: 60,
                        setsCount: 5,
                    },
                    {
                        durationSeconds: 180,
                        exerciseId: "Rowing_Stationary",
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

const hybridPlans: readonly TrainingPlan[] = [
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
        type: "hybrid",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "Barbell_Squat",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Barbell_Bench_Press_-_Medium_Grip",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Seated_Cable_Rows",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Plank",
                        restTime: 60,
                        setsCount: 2,
                    },
                ],
                id: "strength-a",
                name: "Full Body Strength A",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 1500,
                        exerciseId: "Incline_Walk",
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
                    {
                        exerciseId: "Barbell_Deadlift",
                        reps: 8,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Dumbbell_Shoulder_Press",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Full_Range-Of-Motion_Lat_Pulldown",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Russian_Twist",
                        reps: 15,
                        restTime: 60,
                        setsCount: 2,
                    },
                ],
                id: "strength-b",
                name: "Full Body Strength B",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 60,
                        exerciseId: "Bicycling_Stationary",
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
        type: "hybrid",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "Barbell_Bench_Press_-_Medium_Grip",
                        reps: 8,
                        restTime: 90,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Pullups",
                        reps: 8,
                        restTime: 90,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Dumbbell_Shoulder_Press",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Seated_Cable_Rows",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Triceps_Pushdown",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "upper-strength",
                name: "Upper Body Strength",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 60,
                        exerciseId: "Rowing_Stationary",
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
                    {
                        exerciseId: "Barbell_Full_Squat",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Romanian_Deadlift",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Barbell_Lunge",
                        reps: 10,
                        restTime: 90,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Leg_Extensions",
                        reps: 12,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Calf_Raises_-_With_Bands",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                ],
                id: "lower-strength",
                name: "Lower Body Strength",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 2400,
                        exerciseId: "Running_Treadmill",
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
                    {
                        exerciseId: "Kettlebell_Swing",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Pushups",
                        reps: 15,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Mountain_Climbers",
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "Rowing_Stationary",
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
        type: "hybrid",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "Burpees",
                        exerciseNotes: "As fast as possible with good form",
                        reps: 15,
                        restTime: 45,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Kettlebell_Swing",
                        reps: 20,
                        restTime: 45,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 40,
                        exerciseId: "Mountain_Climbers",
                        restTime: 45,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Front_Box_Jump",
                        reps: 15,
                        restTime: 45,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Battling_Ropes",
                        restTime: 45,
                        setsCount: 4,
                    },
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
                        exerciseId: "Running_Treadmill",
                        exerciseNotes: "All-out effort",
                        restTime: 90,
                        setsCount: 8,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "Rowing_Stationary",
                        exerciseNotes: "High intensity",
                        restTime: 60,
                        setsCount: 5,
                    },
                    {
                        durationSeconds: 40,
                        exerciseId: "Bicycling_Stationary",
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
                    {
                        exerciseId: "Barbell_Deadlift",
                        reps: 5,
                        restTime: 60,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Pushups",
                        reps: 15,
                        restTime: 60,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "One-Arm_Dumbbell_Row",
                        reps: 15,
                        restTime: 60,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Goblet_Squat",
                        reps: 15,
                        restTime: 60,
                        setsCount: 5,
                    },
                    {
                        durationSeconds: 45,
                        exerciseId: "Plank",
                        restTime: 60,
                        setsCount: 5,
                    },
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
        type: "hybrid",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "Shoulder_Circles",
                        exerciseNotes: "Each direction",
                        reps: 15,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Linear_Acceleration_Wall_Drill",
                        reps: 12,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Thoracic_Spine_Rotation",
                        exerciseNotes: "Each side",
                        reps: 10,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Cat_Stretch",
                        reps: 12,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Open_Book",
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
                        exerciseId: "Hip_Circles_prone",
                        exerciseNotes: "Each direction",
                        reps: 12,
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Cossack_Squat",
                        exerciseNotes: "Each side",
                        reps: 10,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 45,
                        exerciseId: "Lizard_Crawl",
                        exerciseNotes: "Each side",
                        restTime: 30,
                        setsCount: 3,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "Bodyweight_Squat",
                        exerciseNotes: "Hold",
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Ankle_Circles",
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
                        exerciseId: "Sun_Salutations",
                        exerciseNotes: "Full sequence",
                        reps: 5,
                        restTime: 60,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Worlds_Greatest_Stretch",
                        exerciseNotes: "Each side",
                        reps: 6,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Downward-Facing_Dog",
                        reps: 10,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Inchworm",
                        reps: 8,
                        restTime: 45,
                        setsCount: 3,
                    },
                    {
                        exerciseId: "Bird_Dog",
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
        type: "hybrid",
        workoutDays: [
            {
                exerciseEntries: [
                    {
                        exerciseId: "Hang_Clean",
                        exerciseNotes: "Focus on technique and explosiveness",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Front_Box_Jump",
                        reps: 8,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Medicine_Ball_Chest_Pass",
                        reps: 10,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Freehand_Jump_Squat",
                        reps: 10,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Plyo_Push-up",
                        reps: 8,
                        restTime: 120,
                        setsCount: 3,
                    },
                ],
                id: "power-development",
                name: "Power Development",
            },
            {
                exerciseEntries: [
                    {
                        exerciseId: "Barbell_Squat",
                        exerciseNotes: "80-85% 1RM",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Barbell_Bench_Press_-_Medium_Grip",
                        exerciseNotes: "80-85% 1RM",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Barbell_Deadlift",
                        exerciseNotes: "80-85% 1RM",
                        reps: 5,
                        restTime: 180,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Pullups",
                        exerciseNotes: "Weighted if possible",
                        reps: 6,
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Barbell_Shoulder_Press",
                        reps: 6,
                        restTime: 120,
                        setsCount: 4,
                    },
                ],
                id: "strength-day",
                name: "Maximal Strength",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 60,
                        exerciseId: "Ladder_Drill",
                        exerciseNotes: "Various patterns",
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "Single-Cone_Sprint_Drill",
                        restTime: 120,
                        setsCount: 4,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Shuttle_Run",
                        restTime: 120,
                        setsCount: 6,
                    },
                    {
                        exerciseId: "Standing_Long_Jump",
                        reps: 5,
                        restTime: 120,
                        setsCount: 5,
                    },
                    {
                        exerciseId: "Lateral_Bound",
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
                        exerciseId: "Running_Treadmill",
                        exerciseNotes: "Sprint intervals",
                        restTime: 60,
                        setsCount: 10,
                    },
                    {
                        durationSeconds: 60,
                        exerciseId: "Rowing_Stationary",
                        exerciseNotes: "High intensity",
                        restTime: 60,
                        setsCount: 5,
                    },
                    {
                        durationSeconds: 30,
                        exerciseId: "Battling_Ropes",
                        restTime: 60,
                        setsCount: 4,
                    },
                    {
                        exerciseId: "Kettlebell_Swing",
                        reps: 20,
                        restTime: 60,
                        setsCount: 4,
                    },
                ],
                id: "conditioning",
                name: "Sport Conditioning",
            },
            {
                exerciseEntries: [
                    {
                        durationSeconds: 600,
                        exerciseId: "Calves-SMR",
                        exerciseNotes: "Full body foam rolling session",
                        restTime: 0,
                        setsCount: 1,
                    },
                    {
                        durationSeconds: 300,
                        exerciseId: "Dynamic_Back_Stretch",
                        exerciseNotes: "Full body mobility flows",
                        restTime: 60,
                        setsCount: 2,
                    },
                    {
                        durationSeconds: 900,
                        exerciseId: "Yoga",
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
