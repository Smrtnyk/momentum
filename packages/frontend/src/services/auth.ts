import type { UserCredential } from "firebase/auth";

import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";

import { initializeFirebase } from "../firebase";

const { auth } = initializeFirebase();

export function loginUser(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
}

export function loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

export function logoutUser(): Promise<void> {
    return signOut(auth);
}

export function registerUser(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
}
