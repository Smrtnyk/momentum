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
import { dateToIsoString, formatISODate, getStartOfToday } from "../helpers/date-utils";

export interface BodyFatProgress {
    date: Date;
    method?: null | string;
    percentage: number;
}

export interface WaterProgress {
    current: number;
    percentage: number;
    target: number;
    waterIntakeLog?:
        | undefined
        | {
              amount: number;
              timestamp: Timestamp;
          }[];
}

export async function getLatestBodyFat(userId: string): Promise<BodyFatProgress | null> {
    const metricsRef = collection(firestore, "users", userId, "health_metrics");
    const queryVal = query(
        metricsRef,
        where("bodyFat.percentage", "!=", null),
        orderBy("dateString", "desc"),
        limit(1),
    );

    const querySnapshot = await getDocs(queryVal);
    if (querySnapshot.empty) {
        return null;
    }

    const data = querySnapshot.docs[0].data() as HealthMetrics;
    if (!data.bodyFat) return null;

    return {
        date: data.bodyFat.timestamp.toDate(),
        method: data.bodyFat.method ?? null,
        percentage: data.bodyFat.percentage,
    };
}

export async function getLatestSteps(
    userId: string,
): Promise<null | { date: Date; steps: number }> {
    const today = dateToIsoString(new Date());
    const metricsRef = doc(firestore, "users", userId, "health_metrics", today);

    const docSnap = await getDoc(metricsRef);
    const data = docSnap.data() as HealthMetrics;
    if (docSnap.exists() && data.steps) {
        return {
            date: data.stepsTimestamp?.toDate() ?? data.date.toDate(),
            steps: data.steps,
        };
    }

    return null;
}

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
    if (!data.weight) {
        return null;
    }

    return {
        date: data.date.toDate(),
        weight: data.weight,
    };
}

export async function getTodayWaterProgress(
    userId: string,
    targetIntake = 2500,
): Promise<WaterProgress> {
    const today = formatISODate(getStartOfToday());
    const metrics = await getDailyHealthMetrics(userId, today);

    const currentIntake = metrics?.waterIntake ?? 0;
    const percentage = Math.min(100, Math.round((currentIntake / targetIntake) * 100));

    return {
        current: currentIntake,
        percentage,
        target: targetIntake,
        waterIntakeLog: metrics?.waterIntakeLog,
    };
}

export async function logBodyFat(
    userId: string,
    percentage: number,
    method?: string,
    date: Date = new Date(),
): Promise<void> {
    const dateString = formatISODate(date);
    const timestamp = Timestamp.fromDate(date);

    const bodyFatData = {
        bodyFat: {
            percentage,
            timestamp,
            ...(method ? { method } : {}),
        },
    };

    await updateHealthMetrics(userId, dateString, bodyFatData);
}

export async function logSteps(
    userId: string,
    steps: number,
    date: Date = new Date(),
): Promise<void> {
    const dateString = formatISODate(date);
    const timestamp = Timestamp.fromDate(date);

    await updateHealthMetrics(userId, dateString, {
        steps,
        stepsTimestamp: timestamp,
    });
}

export async function logWaterIntake(
    userId: string,
    amount: number,
    date: Date = new Date(),
): Promise<void> {
    const dateString = formatISODate(date);
    const timestamp = Timestamp.fromDate(date);

    const metricsRef = doc(firestore, "users", userId, "health_metrics", dateString);
    const docSnap = await getDoc(metricsRef);

    if (docSnap.exists()) {
        await updateDoc(metricsRef, {
            waterIntake: increment(amount),
            waterIntakeLog: arrayUnion({
                amount,
                timestamp,
            }),
        });
    } else {
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

export async function logWeight(
    userId: string,
    weight: number,
    date: Date = new Date(),
): Promise<void> {
    const dateString = formatISODate(date);
    const timestamp = Timestamp.fromDate(date);

    await updateHealthMetrics(userId, dateString, {
        weight,
        weightTimestamp: timestamp,
    });
}

export async function removeWaterIntakeEntry(
    userId: string,
    entry: { amount: number; timestamp: Timestamp },
): Promise<void> {
    const today = formatISODate(getStartOfToday());
    const metricsRef = doc(firestore, "users", userId, "health_metrics", today);

    const docSnap = await getDoc(metricsRef);
    if (!docSnap.exists()) return;

    const data = docSnap.data() as HealthMetrics;

    const newLog = (data.waterIntakeLog ?? []).filter(
        (item) => item.timestamp.toMillis() !== entry.timestamp.toMillis(),
    );

    const newTotal = newLog.reduce((sum, item) => sum + item.amount, 0);

    await updateDoc(metricsRef, {
        waterIntake: newTotal,
        waterIntakeLog: newLog,
    });
}

export async function updateHealthMetrics(
    userId: string,
    dateString: string,
    data: Partial<HealthMetrics>,
): Promise<void> {
    const metricsRef = doc(firestore, "users", userId, "health_metrics", dateString);
    const docSnap = await getDoc(metricsRef);

    if (docSnap.exists()) {
        await updateDoc(metricsRef, data);
    } else {
        const dateObj = new Date(dateString);
        const timestamp = Timestamp.fromDate(dateObj);

        await setDoc(metricsRef, {
            date: timestamp,
            dateString,
            ...data,
        });
    }
}

async function getDailyHealthMetrics(
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
