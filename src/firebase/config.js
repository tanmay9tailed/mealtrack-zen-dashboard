import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- Helper: Firebase Configuration ---
// These will be provided by the environment.
export const firebaseConfig = typeof __firebase_config !== 'undefined' 
    ? JSON.parse(__firebase_config) 
    : { apiKey: "your-api-key", authDomain: "your-auth-domain", projectId: "your-project-id" };

export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-meal-tracker-react';

// --- Firebase Initialization ---
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();