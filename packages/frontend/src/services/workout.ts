import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

import type { CardioWorkout, StrengthWorkout, Workout, WorkoutWithId } from "../types/workout";

import { firestore } from "../firebase";

export async function addWorkout(workout: Workout): Promise<string> {
    const docRef = await addDoc(collection(firestore, "workouts"), workout);
    return docRef.id;
}

export async function deleteWorkout(id: string): Promise<void> {
    await deleteDoc(doc(firestore, "workouts", id));
}

/**
 * Retrieves a single workout by its document ID.
 * Throws an error if the workout is not found.
 */
export async function getWorkoutById(id: string): Promise<WorkoutWithId> {
    const docRef = doc(firestore, "workouts", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as WorkoutWithId;
    }
    throw new Error("Workout not found");
}

/**
 * Retrieves workouts from Firestore.
 * If a userId is provided, only workouts for that user are returned.
 */
export async function getWorkouts(userId?: string): Promise<WorkoutWithId[]> {
    const workoutsRef = collection(firestore, "workouts");
    let queryVal;
    if (userId) {
        queryVal = query(workoutsRef, where("userId", "==", userId));
    } else {
        queryVal = query(workoutsRef);
    }
    const snapshot = await getDocs(queryVal);
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

export async function updateWorkout(id: string, workout: Workout): Promise<void> {
    const workoutRef = doc(firestore, "workouts", id);
    await updateDoc(workoutRef, { ...workout });
}
