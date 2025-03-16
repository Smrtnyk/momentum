import type { UserCredential } from "firebase/auth";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

import { auth } from "../firebase";

export function loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

export function logoutUser(): Promise<void> {
    return signOut(auth);
}
