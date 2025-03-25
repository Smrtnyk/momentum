import type { Exercise } from "@frontend-types/exercise.js";
import type { CustomFood, FoodItem } from "@frontend-types/food.js";
import type { HealthMetrics, Meal, WaterLogEntry } from "@frontend-types/health-metrics.js";
import type { UserProfile } from "@frontend-types/user-profile.js";
import type { TrainingPlan } from "@frontend-types/workout-plans.js";
import type { ExerciseEntry, ExerciseSet, Workout } from "@frontend-types/workout.js";
import type { UserRecord } from "firebase-admin/auth";

import { faker } from "@faker-js/faker";
import { Timestamp } from "firebase-admin/firestore";

import exercises from "../../frontend/public/exercises/exercises.json";
import { allTrainingPlans } from "../../frontend/src/data/training-plans.js";
import { auth, db } from "./init.js";

const DAYS_TO_SEED = 60;
const MEALS_PER_DAY_MIN = 2;
const MEALS_PER_DAY_MAX = 5;
const MEAL_TYPES: Meal["mealType"][] = ["breakfast", "lunch", "dinner", "snack"];
const WORKOUT_DAYS_PER_WEEK = 4;
const WORKOUT_PLAN_COUNT = 3;
const CUSTOM_FOODS_COUNT = 10;

async function checkIfDateHasData(userId: string, date: Date): Promise<boolean> {
    const dateString = formatISODate(date);
    const metricsRef = db
        .collection("users")
        .doc(userId)
        .collection("health_metrics")
        .doc(dateString);
    const snapshot = await metricsRef.get();
    return snapshot.exists;
}

function formatISODate(date: Date): string {
    return date.toISOString().split("T")[0];
}

function generateCustomFood(userId: string): Omit<CustomFood, "id"> {
    const now: any = Timestamp.now();

    return {
        barcode: Math.random() > 0.7 ? faker.string.numeric(13) : null,
        brand: Math.random() > 0.3 ? faker.company.name() : null,
        calories: faker.number.int({ max: 800, min: 50 }),
        carbs: faker.number.float({ max: 80, min: 0 }),
        createdAt: now,
        fat: faker.number.float({ max: 40, min: 0 }),
        imageUrl: Math.random() > 0.5 ? faker.image.url() : null,
        isCustom: true,
        name: faker.commerce.productName(),
        protein: faker.number.float({ max: 50, min: 0 }),
        servingSize: faker.number.int({ max: 500, min: 1 }),
        servingUnit: faker.helpers.arrayElement(["g", "ml", "oz", "cup", "tbsp"]),
        sugars: faker.number.float({ max: 30, min: 0 }),
        updatedAt: now,
        userId,
    };
}

function generateDateRange(daysToSeed: number): Date[] {
    const dates: Date[] = [];
    const today = new Date();

    for (let i = 0; i < daysToSeed; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
    }

    return dates;
}

function generateExerciseEntry(exercise: Exercise): ExerciseEntry {
    const isCardio = exercise.category === "cardio";

    const baseEntry: ExerciseEntry = {
        category: exercise.category,
        durationSeconds: isCardio
            ? faker.number.int({ max: 2400, min: 600 })
            : faker.number.int({ max: 300, min: 60 }),
        exerciseId: exercise.id,
        exerciseNotes:
            Math.random() > 0.7
                ? faker.helpers.arrayElement([
                      "Focus on form",
                      "Increase weight from last time",
                      "Slow on the eccentric phase",
                      "Work on full range of motion",
                      "Keep core engaged throughout",
                      "Don't lock out joints",
                      "Breathe properly",
                  ])
                : "",
    };

    if (isCardio) {
        baseEntry.intensity = faker.helpers.arrayElement(["low", "medium", "high"]);
        baseEntry.distanceKm = faker.number.float({ max: 10, min: 1 });
        baseEntry.calories = faker.number.int({ max: 500, min: 100 });
    } else {
        const setsCount = faker.number.int({ max: 5, min: 3 });
        baseEntry.sets = Array.from({ length: setsCount }, () => generateExerciseSet());
    }

    return baseEntry;
}

function generateExerciseSet(): ExerciseSet {
    return {
        reps: faker.number.int({ max: 15, min: 6 }),
        weight: faker.number.float({ max: 100, min: 10 }),
    };
}

function generateFoodItem(): FoodItem {
    return {
        barcode: Math.random() > 0.7 ? faker.string.numeric(13) : null,
        brand: Math.random() > 0.3 ? faker.company.name() : null,
        calories: faker.number.int({ max: 800, min: 50 }),
        carbs: faker.number.float({ max: 80, min: 0 }),
        fat: faker.number.float({ max: 40, min: 0 }),
        id: faker.string.uuid(),
        imageUrl: Math.random() > 0.5 ? faker.image.url() : null,
        name: faker.commerce.productName(),
        protein: faker.number.float({ max: 50, min: 0 }),
        servingSize: faker.number.int({ max: 500, min: 1 }),
        servingUnit: faker.helpers.arrayElement(["g", "ml", "oz", "cup", "tbsp"]),
        sugars: faker.number.float({ max: 30, min: 0 }),
    };
}

function generateHealthMetrics(date: Date): Omit<HealthMetrics, "calories"> {
    const dateString = formatISODate(date);
    const waterIntakeLog = generateWaterLogEntries(date);
    const waterIntake = waterIntakeLog.reduce((total, entry) => total + entry.amount, 0);

    const metrics: Omit<HealthMetrics, "calories"> = {
        date: Timestamp.fromDate(date) as any,
        dateString,
        waterIntake,
        waterIntakeLog,
    };

    if (Math.random() > 0.3) {
        const weightDate = new Date(date);
        weightDate.setHours(7, 30, 0, 0);

        metrics.weight = faker.number.float({ max: 95, min: 60 });
        metrics.weightTimestamp = Timestamp.fromDate(weightDate) as any;
    }

    if (Math.random() > 0.7) {
        const bodyFatDate = new Date(date);
        bodyFatDate.setHours(7, 35, 0, 0);

        metrics.bodyFat = {
            method: faker.helpers.arrayElement(["Calipers", "BIA Scale", "DEXA", null]),
            percentage: faker.number.float({ max: 30, min: 10 }),
            timestamp: Timestamp.fromDate(bodyFatDate) as any,
        };
    }

    if (Math.random() > 0.2) {
        const stepsDate = new Date(date);
        stepsDate.setHours(22, 0, 0, 0);

        metrics.steps = faker.number.int({ max: 15_000, min: 2000 });
        metrics.stepsTimestamp = Timestamp.fromDate(stepsDate) as any;
    }

    return metrics;
}

function generateMeal(
    dateString: string,
    mealType: "breakfast" | "dinner" | "lunch" | "snack",
): Omit<Meal, "id"> {
    const foodCount = faker.number.int({ max: 4, min: 1 });
    const foods: FoodItem[] = [];

    for (let i = 0; i < foodCount; i++) {
        foods.push(generateFoodItem());
    }

    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
    const protein = foods.reduce((sum, food) => sum + food.protein, 0);
    const carbs = foods.reduce((sum, food) => sum + food.carbs, 0);
    const fat = foods.reduce((sum, food) => sum + food.fat, 0);

    const date = new Date(dateString);

    switch (mealType) {
        case "breakfast":
            date.setHours(7, 0, 0, 0);
            break;
        case "dinner":
            date.setHours(18, 0, 0, 0);
            break;
        case "lunch":
            date.setHours(12, 0, 0, 0);
            break;
        case "snack":
            date.setHours(15, 0, 0, 0);
            break;
    }

    return {
        dateString,
        foods,
        macros: { carbs, fat, protein },
        mealType,
        timestamp: Timestamp.fromDate(date) as any,
        totalCalories,
    };
}

function generateUserProfile(userId: string): UserProfile {
    const gender = Math.random() > 0.5 ? "Male" : "Female";

    return {
        birthDate: faker.date
            .birthdate({ max: 65, min: 18, mode: "age" })
            .toISOString()
            .split("T")[0],
        defaultCalorieGoal: faker.number.int({ max: 2800, min: 1800 }),
        gender,
        height:
            gender === "Male"
                ? faker.number.int({ max: 195, min: 165 })
                : faker.number.int({ max: 180, min: 155 }),
        id: userId,
        name: faker.person.fullName(),
        profilePictureUrl: faker.image.avatar(),
    };
}

function generateWaterLogEntries(date: Date): WaterLogEntry[] {
    const entries: WaterLogEntry[] = [];
    const entriesCount = faker.number.int({ max: 8, min: 3 });

    for (let i = 0; i < entriesCount; i++) {
        const entryDate = new Date(date);
        entryDate.setHours(
            faker.number.int({ max: 22, min: 7 }),
            faker.number.int({ max: 59, min: 0 }),
            0,
            0,
        );

        entries.push({
            amount: faker.number.int({ max: 500, min: 150 }),
            timestamp: Timestamp.fromDate(entryDate) as any,
        });
    }

    return entries;
}

function generateWorkout(date: Date, trainingPlans: readonly TrainingPlan[]): Omit<Workout, "id"> {
    const useTrainingPlan = Math.random() > 0.5 && trainingPlans.length > 0;

    const workoutStart = new Date(date);
    workoutStart.setHours(faker.number.int({ max: 20, min: 6 }), 0, 0, 0);

    let exerciseEntries: ExerciseEntry[] = [];
    let workoutName = "";

    if (useTrainingPlan) {
        const randomPlan = faker.helpers.arrayElement(trainingPlans);
        const randomDay = faker.helpers.arrayElement(randomPlan.workoutDays);

        workoutName = `${randomPlan.name}: ${randomDay.name}`;

        exerciseEntries = randomDay.exerciseEntries.map((planEntry) => {
            const exercise = exercises.find((ex) => ex.id === planEntry.exerciseId) ?? exercises[0];

            const entry: ExerciseEntry = {
                category: exercise.category,
                durationSeconds:
                    planEntry.durationSeconds ?? faker.number.int({ max: 300, min: 60 }),
                exerciseId: exercise.id,
                exerciseNotes: planEntry.exerciseNotes ?? "",
            };

            if (exercise.category === "cardio") {
                entry.intensity = faker.helpers.arrayElement(["low", "medium", "high"]);
                entry.distanceKm = planEntry.distanceKm ?? faker.number.float({ max: 10, min: 1 });
                entry.calories = faker.number.int({ max: 500, min: 100 });
            } else {
                entry.sets = Array.from({ length: planEntry.setsCount }, () => ({
                    reps: planEntry.reps ?? faker.number.int({ max: 15, min: 8 }),
                    weight: faker.number.float({ max: 100, min: 10 }),
                }));
            }

            return entry;
        });
    } else {
        workoutName = faker.helpers.arrayElement([
            "Morning Workout",
            "Full Body",
            "Upper Body",
            "Lower Body",
            "Push Day",
            "Pull Day",
            "Leg Day",
            "Cardio Session",
            "HIIT Training",
            "Strength Training",
        ]);

        let filteredExercises: Exercise[];

        if (workoutName.includes("Upper")) {
            filteredExercises = exercises.filter((ex) =>
                ex.primaryMuscles.some((muscle) =>
                    ["back", "biceps", "chest", "shoulders", "triceps"].includes(muscle),
                ),
            );
        } else if (workoutName.includes("Lower")) {
            filteredExercises = exercises.filter((ex) =>
                ex.primaryMuscles.some((muscle) =>
                    ["calves", "glutes", "hamstrings", "quadriceps"].includes(muscle),
                ),
            );
        } else if (workoutName.includes("Push")) {
            filteredExercises = exercises.filter((ex) => ex.force === "push");
        } else if (workoutName.includes("Pull")) {
            filteredExercises = exercises.filter((ex) => ex.force === "pull");
        } else if (workoutName.includes("Cardio")) {
            filteredExercises = exercises.filter((ex) => ex.category === "cardio");
        } else {
            filteredExercises = exercises;
        }

        if (filteredExercises.length < 5) {
            filteredExercises = exercises;
        }

        const exercisesCount = faker.number.int({ max: 8, min: 3 });
        const selectedExercises = faker.helpers.arrayElements(filteredExercises, exercisesCount);

        exerciseEntries = selectedExercises.map((exercise) => generateExerciseEntry(exercise));
    }

    const workoutDurationMinutes = faker.number.int({ max: 90, min: 30 });

    return {
        date: Timestamp.fromDate(workoutStart) as any,
        exerciseEntries,
        exercisesExecuted: exerciseEntries.map((entry) => entry.exerciseId),
        name: workoutName,
        overallNotes: Math.random() > 0.7 ? faker.lorem.paragraph() : "",
        workoutDurationMinutes,
    };
}

async function getAuthenticatedUser(): Promise<UserRecord> {
    const listUsersResult = await auth.listUsers();

    if (listUsersResult.users.length === 0) {
        throw new Error("No users found in the Auth emulator");
    }

    return listUsersResult.users[0];
}

async function main(): Promise<void> {
    try {
        console.log("Starting Firebase emulator seeding...");
        const user = await getAuthenticatedUser();
        console.log(`Seeding data for user: ${user.uid}`);
        //  Seed user profile
        console.log("Seeding user profile...");
        const userProfile = await seedUserProfile(user.uid);
        //  Seed custom foods
        console.log("Seeding custom foods...");
        await seedCustomFoods(user.uid);
        //  Seed training plans
        console.log("Seeding training plans...");
        await seedTrainingPlans(user.uid, allTrainingPlans);
        // Generate and seed health metrics, meals, and workouts for past 60 days
        const dates = generateDateRange(DAYS_TO_SEED);
        console.log(`Seeding data for ${dates.length} days`);

        for (const date of dates) {
            const hasData = await checkIfDateHasData(user.uid, date);

            if (hasData) {
                console.log(`Data already exists for ${formatISODate(date)}, skipping`);
            } else {
                await seedDayData(user.uid, date, allTrainingPlans, userProfile);
                console.log(`Seeded data for ${formatISODate(date)}`);
            }
        }

        console.log("Firebase emulator seeding completed successfully!");
    } catch (error) {
        console.error("Error seeding Firebase emulator:", error);
        process.exit(1);
    }
}

async function seedCustomFoods(userId: string): Promise<void> {
    const customFoodsRef = db.collection("users").doc(userId).collection("custom_foods");

    for (let i = 0; i < CUSTOM_FOODS_COUNT; i++) {
        const customFood = generateCustomFood(userId);
        await customFoodsRef.add(customFood);
    }
}

async function seedDayData(
    userId: string,
    date: Date,
    trainingPlans: readonly TrainingPlan[],
    userProfile: UserProfile,
): Promise<void> {
    const dateString = formatISODate(date);

    // Seed health metrics
    const baseMetrics = generateHealthMetrics(date);
    const metricsRef = db
        .collection("users")
        .doc(userId)
        .collection("health_metrics")
        .doc(dateString);
    await metricsRef.set(baseMetrics);

    //  Seed meals
    const mealsRef = db.collection("users").doc(userId).collection("meals");
    const mealsCount = faker.number.int({ max: MEALS_PER_DAY_MAX, min: MEALS_PER_DAY_MIN });
    const mealsToAdd = faker.helpers.arrayElements(MEAL_TYPES, mealsCount);

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    const mealTypeTotals = {
        breakfast: 0,
        dinner: 0,
        lunch: 0,
        snack: 0,
    };

    for (const mealType of mealsToAdd) {
        const meal = generateMeal(dateString, mealType);
        await mealsRef.add(meal);

        totalCalories += meal.totalCalories;
        totalProtein += meal.macros.protein;
        totalCarbs += meal.macros.carbs;
        totalFat += meal.macros.fat;
        mealTypeTotals[mealType] += meal.totalCalories;
    }

    // Update health metrics with calories
    const calorieGoal = userProfile.defaultCalorieGoal;
    await metricsRef.update({
        calories: {
            byMeal: mealTypeTotals,
            carbs: totalCarbs,
            fat: totalFat,
            goal: calorieGoal,
            protein: totalProtein,
            remaining: calorieGoal - totalCalories,
            total: totalCalories,
        },
    });

    // Add workout (on some days)
    // Weekdays (1-5) are more likely to have workouts than weekends
    // 0 = Sunday, 6 = Saturday
    const dayOfWeek = date.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    let workoutProbability = WORKOUT_DAYS_PER_WEEK / 7;
    if (isWeekday) {
        workoutProbability *= 1.2;
    } else {
        workoutProbability *= 0.8;
    }

    if (Math.random() < workoutProbability) {
        const workout = generateWorkout(date, trainingPlans);
        await db.collection("users").doc(userId).collection("workouts").add(workout);
    }
}

async function seedTrainingPlans(
    userId: string,
    trainingsPlans: readonly TrainingPlan[],
): Promise<void> {
    const plansRef = db.collection("users").doc(userId).collection("workout-plans");
    const plansToSeed = faker.helpers.arrayElements(trainingsPlans, WORKOUT_PLAN_COUNT);

    for (const plan of plansToSeed) {
        const customPlanId = faker.string.uuid();
        await plansRef.doc(customPlanId).set({
            ...plan,
            description: `Custom version of ${plan.name}: ${plan.description}`,
            id: customPlanId,
            isCustom: true,
            name: `My ${plan.name}`,
        });
    }
}

async function seedUserProfile(userId: string): Promise<UserProfile> {
    const userProfile = generateUserProfile(userId);
    await db.collection("users").doc(userId).set(userProfile);
    return userProfile;
}

await main();
