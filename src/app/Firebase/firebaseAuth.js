// firebaseAuth.js
import { auth } from "./firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google Sign-In Success:", user);
    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    throw error;
  }
};

// Create Account with Email/Password
export const createAccountWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Account created successfully:", user);
    return user;
  } catch (error) {
    console.error("Error creating account:", error.message);
    throw error;
  }
};

// Log In with Email/Password
export const logInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Logged in successfully:", user);
    return user;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};