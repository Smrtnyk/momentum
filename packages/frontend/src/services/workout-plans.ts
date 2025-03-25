import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";

import type { TrainingPlan } from "../types/workout-plans";

import { firestore } from "../firebase";
import { logger } from "../logger/app-logger";

export async function deleteCustomWorkoutPlan(userId: string, planId: string): Promise<void> {
    if (!userId || !planId) {
        throw new Error("Both userId and planId are required");
    }

    await deleteDoc(doc(firestore, "users", userId, "workout-plans", planId));
    logger.info(`Custom workout plan deleted: ${planId}`, "workout-plan-service");
}

export async function getCustomWorkoutPlans(userId: string): Promise<TrainingPlan[]> {
    if (!userId) {
        return [];
    }

    const plansRef = collection(firestore, "users", userId, "workout-plans");
    const snapshot = await getDocs(plansRef);

    return snapshot.docs.map(function (docVal) {
        return { ...docVal.data(), id: docVal.id } as TrainingPlan;
    });
}

export async function saveCustomWorkoutPlan(userId: string, plan: TrainingPlan): Promise<string> {
    if (!userId) {
        throw new Error("User ID is required to save a custom workout plan");
    }

    const customPlan = {
        ...plan,
        isCustom: true,
    };

    const planRef = doc(firestore, "users", userId, "workout-plans", plan.id);
    await setDoc(planRef, customPlan);

    logger.info(`Custom workout plan saved: ${plan.id}`, "workout-plan-service");
    return plan.id;
}
