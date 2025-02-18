import type { Timestamp } from "firebase/firestore";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import { initializeFirebase } from "../firebase";

const { firestore } = initializeFirebase();

export interface ExerciseEntry {
    exerciseId: string;
    exerciseNotes?: string;
    sets: ExerciseSet[];
}

export interface ExerciseSet {
    reps: number;
    weight: number;
}

export interface Workout {
    date: Timestamp;
    exerciseEntries: ExerciseEntry[];
    name: string;
    overallNotes: string;
    userId: string;
}

// Extend Workout to include a document id.
export interface WorkoutWithId extends Workout {
    id: string;
}

export async function addWorkout(workout: Workout): Promise<void> {
    await addDoc(collection(firestore, "workouts"), workout);
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
    return snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as WorkoutWithId;
    });
}
