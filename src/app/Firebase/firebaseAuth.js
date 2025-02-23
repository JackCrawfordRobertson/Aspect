import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user exists in Firestore
    const userDoc = doc(db, "users", user.uid);
    const docSnapshot = await getDoc(userDoc);

    // If the user exists, return as an existing user
    if (docSnapshot.exists()) {
      return { user, isNewUser: false }; // Existing user
    }

    // Generate a random avatar using DiceBear API
    const randomAvatarUrl = `https://api.dicebear.com/6.x/bottts/svg?seed=${user.displayName || user.email.split("@")[0]}`;

    // Update the user's Firebase profile to include the avatar
    await updateProfile(user, { photoURL: randomAvatarUrl });

    // Create a new user document in Firestore
    await setDoc(userDoc, {
      name: user.displayName,
      email: user.email,
      profilePicture: randomAvatarUrl, // Save the generated avatar URL
      createdAt: new Date().toISOString(),
      houses: [], // Initialize with no houses
      filmCategories: [], // Initialize with no favourite film categories
    });

    console.log("Google Sign-In New User Created with Avatar:", user);
    return { user, isNewUser: true }; // New user
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    throw error;
  }
};


// Create Account with Email/Password
export const createAccountWithEmail = async (email, password, name) => {
  try {
    // Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate a random avatar using DiceBear API
    const randomAvatarUrl = `https://api.dicebear.com/6.x/bottts/svg?seed=${name || email.split("@")[0]}`;

    // Update the user's Firebase profile to include their name and avatar
    await updateProfile(user, { displayName: name, photoURL: randomAvatarUrl });

    // Save the user's profile data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      profilePicture: randomAvatarUrl, // Save the generated avatar URL
      createdAt: new Date().toISOString(),
      houses: [], // Initialize with no houses
      filmCategories: [], // Initialize with no favourite film categories
    });

    console.log("Account created successfully with DiceBear avatar:", user);
    return user; // Return the user for further processing
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("This email is already in use. Please log in instead.");
    }
    console.error("Error creating account:", error.message);
    throw error;
  }
};

// Log In with Email/Password
export const logInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user details from Firestore (optional)
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User data from Firestore:", userData);
      return { ...user, ...userData }; // Combine Firestore data with the user object
    }

    console.log("Logged in successfully:", user);
    return user;
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password. Please try again.");
    } else if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email. Please sign up.");
    }
    console.error("Login Error:", error.message);
    throw error;
  }
};

// Log Out
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("Logged out successfully.");
  } catch (error) {
    console.error("Error logging out:", error.message);
    throw error;
  }
};

// Check if Email is Already Registered
export const checkEmailExists = async (email) => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.length > 0; // Returns true if email is already in use
  } catch (error) {
    console.error("Error checking email existence:", error.message);
    throw error;
  }
};

