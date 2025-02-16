import type { Timestamp } from "firebase/firestore";

import { addDoc, collection } from "firebase/firestore";

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

export async function addWorkout(workout: Workout): Promise<void> {
  await addDoc(collection(firestore, "workouts"), workout);
}
