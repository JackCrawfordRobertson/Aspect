// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBNiCuSKw9K-8czjc0DSnbrT5QZy1E0xXk",
  authDomain: "aspect-c28e9.firebaseapp.com",
  projectId: "aspect-c28e9",
  storageBucket: "aspect-c28e9.firebasestorage.app",
  messagingSenderId: "313557132036",
  appId: "1:313557132036:web:8dd93398ac2a1c1260a651",
  measurementId: "G-H4EN2LQ8SE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Analytics (only in the browser)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  });
}

export { app, auth, analytics };