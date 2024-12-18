// Import the necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore Database
const db = getFirestore(app);

// Analytics Initialisation (in a browser-safe manner)
let analytics;

export const initializeAnalytics = () => {
  if (typeof window !== "undefined") {
    isSupported()
      .then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
          console.log("Firebase Analytics initialized.");
        } else {
          console.warn("Firebase Analytics is not supported in this environment.");
        }
      })
      .catch((error) => {
        console.error("Error checking Analytics support:", error);
      });
  }
};

// Exports
export { app, auth, db, analytics };