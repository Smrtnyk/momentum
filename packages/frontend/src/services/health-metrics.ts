import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import type { HealthMetrics } from "../types/health-metrics";

import { firestore } from "../firebase";

/**
 * Gets health metrics for a specific day
 * @param userId User ID
 * @param dateString Date string in YYYY-MM-DD format
 */
export async function getDailyHealthMetrics(
    userId: string,
    dateString: string,
): Promise<HealthMetrics | null> {
    const metricsRef = doc(firestore, "users", userId, "health_metrics", dateString);
    const docSnap = await getDoc(metricsRef);

    if (docSnap.exists()) {
        return docSnap.data() as HealthMetrics;
    }

    return null;
}

/**
 * Gets health metrics for a date range
 * @param userId User ID
 * @param startDate Start date
 * @param endDate End date
 */
export async function getHealthMetricsRange(
    userId: string,
    startDate: Date,
    endDate: Date,
): Promise<HealthMetrics[]> {
    // Format dates as YYYY-MM-DD
    const startDateString = startDate.toISOString().split("T")[0];
    const endDateString = endDate.toISOString().split("T")[0];

    const metricsRef = collection(firestore, "users", userId, "health_metrics");
    const queryVal = query(
        metricsRef,
        where("dateString", ">=", startDateString),
        where("dateString", "<=", endDateString),
        orderBy("dateString", "asc"),
    );

    const querySnapshot = await getDocs(queryVal);
    return querySnapshot.docs.map((document) => document.data() as HealthMetrics);
}

/**
 * Gets the most recent weight entry
 * @param userId User ID
 */
export async function getLatestWeight(
    userId: string,
): Promise<null | { date: Date; weight: number }> {
    const metricsRef = collection(firestore, "users", userId, "health_metrics");
    const queryVal = query(
        metricsRef,
        where("weight", "!=", null),
        orderBy("weight"),
        orderBy("dateString", "desc"),
        limit(1),
    );

    const querySnapshot = await getDocs(queryVal);
    if (querySnapshot.empty) {
        return null;
    }

    const data = querySnapshot.docs[0].data() as HealthMetrics;
    return {
        date: data.date.toDate(),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        weight: data.weight!,
    };
}

/**
 * Gets the water intake progress for today
 * @param userId User ID
 * @param targetIntake Target water intake in ml (default: 2500ml)
 */
export async function getTodayWaterProgress(
    userId: string,
    targetIntake = 2500,
): Promise<{ current: number; percentage: number; target: number }> {
    const today = new Date().toISOString().split("T")[0];
    const metrics = await getDailyHealthMetrics(userId, today);

    const currentIntake = metrics?.waterIntake || 0;
    const percentage = Math.min(100, Math.round((currentIntake / targetIntake) * 100));

    return {
        current: currentIntake,
        percentage,
        target: targetIntake,
    };
}

/**
 * Logs water intake for a user on a specific day
 * @param userId User ID
 * @param amount Amount of water in ml
 * @param date Optional date (defaults to today)
 */
export async function logWaterIntake(
    userId: string,
    amount: number,
    date: Date = new Date(),
): Promise<void> {
    // Format date as YYYY-MM-DD
    const dateString = date.toISOString().split("T")[0];
    const timestamp = Timestamp.fromDate(date);

    const metricsRef = doc(firestore, "users", userId, "health_metrics", dateString);
    const docSnap = await getDoc(metricsRef);

    if (docSnap.exists()) {
        // Update existing document
        await updateDoc(metricsRef, {
            waterIntake: increment(amount),
            waterIntakeLog: arrayUnion({
                amount,
                timestamp,
            }),
        });
    } else {
        // Create new document
        const midnight = new Date(date);
        midnight.setHours(0, 0, 0, 0);

        await setDoc(metricsRef, {
            date: Timestamp.fromDate(midnight),
            dateString,
            waterIntake: amount,
            waterIntakeLog: [
                {
                    amount,
                    timestamp,
                },
            ],
        });
    }
}

/**
 * Logs weight for a user on a specific day
 * @param userId User ID
 * @param weight Weight in kg
 * @param date Optional date (defaults to today)
 */
export async function logWeight(
    userId: string,
    weight: number,
    date: Date = new Date(),
): Promise<void> {
    // Format date as YYYY-MM-DD
    const dateString = date.toISOString().split("T")[0];
    const timestamp = Timestamp.fromDate(date);

    // Update or create the daily metrics document
    await updateHealthMetrics(userId, dateString, {
        weight,
        weightTimestamp: timestamp,
    });
}

/**
 * Creates or updates the health metrics for a specific day
 * @param userId User ID
 * @param dateString Date string in YYYY-MM-DD format
 * @param data Partial health metrics data to update
 */
export async function updateHealthMetrics(
    userId: string,
    dateString: string,
    data: Partial<HealthMetrics>,
): Promise<void> {
    const metricsRef = doc(firestore, "users", userId, "health_metrics", dateString);
    const docSnap = await getDoc(metricsRef);

    if (docSnap.exists()) {
        // Document exists, update it
        await updateDoc(metricsRef, data);
    } else {
        // Document doesn't exist, create it with initial data
        const dateObj = new Date(dateString);
        const timestamp = Timestamp.fromDate(dateObj);

        await setDoc(metricsRef, {
            date: timestamp,
            dateString,
            ...data,
        });
    }
}
