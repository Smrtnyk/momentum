import type { Timestamp } from "firebase/firestore";

import { addDoc, collection } from "firebase/firestore";

import { db } from "../firebase";

export interface Workout {
  date: Timestamp;
  exercise: string;
  notes?: string;
  reps: number;
  sets: number;
  userId: string;
}

export async function addWorkout(workout: Workout): Promise<void> {
  await addDoc(collection(db, "workouts"), workout);
}
