import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- Helper: Firebase Configuration ---
// These will be provided by the environment.
export const firebaseConfig = {
  apiKey: "your-api-key", 
  authDomain: "your-auth-domain", 
  projectId: "your-project-id"
};

export const appId = 'default-meal-tracker-react';

// --- Firebase Initialization ---
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();