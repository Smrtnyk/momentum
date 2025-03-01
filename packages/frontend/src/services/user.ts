import { doc, getDoc, setDoc } from "firebase/firestore";

import { firestore } from "../firebase";

export interface UserProfile {
    birthDate: string;
    defaultCalorieGoal: number;
    gender: "Female" | "Male";
    height: number;
    id: string;
    name: string;
    profilePictureUrl?: string;
}

export async function getUserProfile(uid: string): Promise<UserProfile> {
    const docRef = doc(firestore, "users", uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as UserProfile;
    }
    throw new Error("User not found");
}

export async function setDefaultCalorieGoal(
    userId: string,
    defaultCalorieGoal: number,
): Promise<void> {
    const docRef = doc(firestore, "users", userId);
    await setDoc(docRef, { defaultCalorieGoal }, { merge: true });
}

export async function updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    const docRef = doc(firestore, "users", uid);
    await setDoc(docRef, profile, { merge: true });
}
