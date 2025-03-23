import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import type { Exercise } from "../types/exercise";
import type {
    ActiveExercise,
    ActiveWorkout,
    CardioExerciseEntry,
    ExerciseEntry,
    StrengthExerciseEntry,
    Workout,
    WorkoutBase,
    WorkoutWithId,
} from "../types/workout";

import { firestore } from "../firebase";

export async function addWorkout(
    workout: Omit<WorkoutBase, "id">,
    userId: string,
): Promise<string> {
    if (!userId) {
        throw new Error("Cannot add workout: User ID is required");
    }

    const workoutsRef = collection(firestore, "users", userId, "workouts");
    const docRef = await addDoc(workoutsRef, workout);
    return docRef.id;
}

export async function deleteWorkout(userId: string, workoutId: string): Promise<void> {
    if (!userId || !workoutId) {
        throw new Error("Both userId and workoutId are required");
    }

    await deleteDoc(doc(firestore, "users", userId, "workouts", workoutId));
}

export async function getWorkoutById(userId: string, workoutId: string): Promise<WorkoutWithId> {
    if (!userId || !workoutId) {
        throw new Error("Both userId and workoutId are required");
    }

    const docRef = doc(firestore, "users", userId, "workouts", workoutId);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as WorkoutWithId;
    }

    throw new Error("Workout not found");
}

export async function getWorkouts(
    userId: string,
    options: {
        limit?: number;
        orderByDate?: "asc" | "desc";
    } = {},
): Promise<WorkoutWithId[]> {
    if (!userId) {
        throw new Error("UserId is required");
    }

    const workoutsRef = collection(firestore, "users", userId, "workouts");
    let queryRef = query(workoutsRef);

    if (options.orderByDate) {
        queryRef = query(queryRef, orderBy("date", options.orderByDate === "asc" ? "asc" : "desc"));
    }

    if (options.limit && options.limit > 0) {
        queryRef = query(queryRef, limit(options.limit));
    }

    const snapshot = await getDocs(queryRef);

    return snapshot.docs.map(function (document) {
        return { id: document.id, ...document.data() } as WorkoutWithId;
    });
}

export async function getWorkoutsInDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    options: {
        orderByDate?: "asc" | "desc";
    } = {},
): Promise<WorkoutWithId[]> {
    if (!userId) {
        throw new Error("UserId is required");
    }

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const workoutsRef = collection(firestore, "users", userId, "workouts");

    let queryRef = query(
        workoutsRef,
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp),
    );

    if (options.orderByDate) {
        queryRef = query(queryRef, orderBy("date", options.orderByDate === "asc" ? "asc" : "desc"));
    }

    const snapshot = await getDocs(queryRef);

    return snapshot.docs.map(function (document) {
        return { id: document.id, ...document.data() } as WorkoutWithId;
    });
}

export function isActiveExercise(
    exercise: ActiveExercise | ExerciseEntry,
): exercise is ActiveExercise {
    return "completed" in exercise;
}

export function isActiveWorkout(workout: ActiveWorkout | Workout): workout is ActiveWorkout {
    return "planId" in workout;
}

export function isCardioExercise(
    exercise: ActiveExercise | Exercise | ExerciseEntry,
): exercise is CardioExerciseEntry {
    return exercise.category === "cardio";
}

export function isStrengthExercise(
    exercise: ActiveExercise | Exercise | ExerciseEntry,
): exercise is StrengthExerciseEntry {
    return exercise.category === "strength";
}

export async function updateWorkout(
    userId: string,
    workoutId: string,
    workout: Workout,
): Promise<void> {
    if (!userId || !workoutId) {
        throw new Error("Both userId and workoutId are required");
    }

    const workoutRef = doc(firestore, "users", userId, "workouts", workoutId);
    await updateDoc(workoutRef, { ...workout });
}
