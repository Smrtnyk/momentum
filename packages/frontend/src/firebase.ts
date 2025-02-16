import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Functions } from "firebase/functions";
import type { FirebaseStorage } from "firebase/storage";

import { memoize } from "es-toolkit";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const ipAddressPattern =
  /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

function initEmulators(
  firestore: Firestore,
  auth: Auth,
  functions: Functions,
  storage: FirebaseStorage,
): void {
  connectAuthEmulator(auth, `http://${location.hostname}:9099/`, {
    disableWarnings: true,
  });
  connectFirestoreEmulator(firestore, location.hostname, 8080);
  connectFunctionsEmulator(functions, location.hostname, 5001);
  connectStorageEmulator(storage, location.hostname, 9199);
}

export const initializeFirebase = memoize(() => {
  const firebaseApp = initializeApp(firebaseConfig);
  const firestore = getFirestore(firebaseApp);
  const functions = getFunctions(firebaseApp, "europe-west3");
  const auth = getAuth(firebaseApp);
  const storage = getStorage(firebaseApp);
  if (
    location.hostname === "localhost" ||
    ipAddressPattern.test(location.hostname)
  ) {
    initEmulators(firestore, auth, functions, storage);
  }
  return { auth, firebaseApp, firestore, functions, storage };
});

export const { auth } = initializeFirebase();
