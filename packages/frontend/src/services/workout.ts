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

import type { CardioWorkout, StrengthWorkout, Workout, WorkoutWithId } from "../types/workout";

import { firestore } from "../firebase";

export async function addWorkout(workout: Workout): Promise<string> {
    const userId = workout.userId;
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

export function getRecentWorkouts(userId: string, count = 5): Promise<WorkoutWithId[]> {
    return getWorkouts(userId, {
        limit: count,
        orderByDate: "desc",
    });
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
        workoutType?: string;
    } = {},
): Promise<WorkoutWithId[]> {
    if (!userId) {
        throw new Error("UserId is required");
    }

    const workoutsRef = collection(firestore, "users", userId, "workouts");
    let queryRef = query(workoutsRef);

    // Apply type filter if specified
    if (options.workoutType) {
        queryRef = query(queryRef, where("type", "==", options.workoutType));
    }

    // Apply ordering if specified
    if (options.orderByDate) {
        queryRef = query(queryRef, orderBy("date", options.orderByDate === "asc" ? "asc" : "desc"));
    }

    // Apply limit if specified
    if (options.limit && options.limit > 0) {
        queryRef = query(queryRef, limit(options.limit));
    }

    const snapshot = await getDocs(queryRef);

    return snapshot.docs.map(function (document) {
        return { id: document.id, ...document.data() } as WorkoutWithId;
    });
}

export async function getWorkoutsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
): Promise<WorkoutWithId[]> {
    if (!userId) {
        throw new Error("UserId is required");
    }

    const workoutsRef = collection(firestore, "users", userId, "workouts");
    const queryRef = query(
        workoutsRef,
        where("date", ">=", Timestamp.fromDate(startDate)),
        where("date", "<=", Timestamp.fromDate(endDate)),
        orderBy("date", "asc"),
    );

    const snapshot = await getDocs(queryRef);

    return snapshot.docs.map(function (document) {
        return { id: document.id, ...document.data() } as WorkoutWithId;
    });
}

export function isCardioWorkout(workout: Workout): workout is CardioWorkout {
    return workout.type === "cardio";
}

export function isStrengthWorkout(workout: Workout): workout is StrengthWorkout {
    return workout.type === "strength";
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
