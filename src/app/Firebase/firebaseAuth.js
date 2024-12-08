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

    // Create user document if not existing
    if (!docSnapshot.exists()) {
      await setDoc(userDoc, {
        name: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString(),
        approved: false, // Pending approval
      });
    } else {
      const userData = docSnapshot.data();
      if (!userData.approved) {
        throw new Error("Your account is pending approval. Please contact support.");
      }
    }

    console.log("Google Sign-In Success:", user);
    return user; // Return user object for further processing in the component
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    throw error;
  }
};

// Create Account with Email/Password
export const createAccountWithEmail = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user's profile to include the name
    await updateProfile(user, { displayName: name });

    // Save user profile to Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
      approved: false, // Pending approval
    });

    console.log("Account created successfully with name:", user);
    return user; // Return user for further processing
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

    // Fetch user details from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (!userData.approved) {
        throw new Error("Your account is pending approval. Please contact support.");
      }
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

// Admin: Approve User
export const approveUser = async (userId) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      approved: true,
    });
    console.log("User approved successfully.");
  } catch (error) {
    console.error("Error approving user:", error.message);
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