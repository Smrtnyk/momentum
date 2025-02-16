import type { Timestamp } from "firebase/firestore";

import { addDoc, collection } from "firebase/firestore";

import { initializeFirebase } from "../firebase";

const { firestore } = initializeFirebase();

export interface Workout {
  date: Timestamp;
  exercise: string;
  notes: string;
  sets: WorkoutSet[];
  userId: string;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
}

export async function addWorkout(workout: Workout): Promise<void> {
  await addDoc(collection(firestore, "workouts"), workout);
}
