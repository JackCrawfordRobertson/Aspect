"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { logInWithEmail } from "../../../../app/Firebase/firebaseAuth";
import styles from "./ExistingAccount.module.css";

const ExistingAccount = ({ onToggleMode, onUserAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter(); // Initialize router

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const user = await logInWithEmail(email, password);
      console.log("Logged in successfully:", user);
      setSuccessMessage(`Welcome back, ${user.displayName || "User"}!`);

      // Once user is authenticated, notify parent
      onUserAuthenticated();

      // Redirect to /landing
      router.push("/landing");
    } catch (error) {
      if (error.message.includes("auth/wrong-password")) {
        setErrorMessage("Incorrect password. Please try again.");
      } else if (error.message.includes("auth/user-not-found")) {
        setErrorMessage("No account found with this email. Please sign up.");
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>Let's get Logged in</h1>
      <div className={styles.bottomContent}>
        <form className={styles.formContainer} onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

        <div className={styles.separator}>
          <span className={styles.line}></span>
          <span className={styles.orText}>Or</span>
          <span className={styles.line}></span>
        </div>

        <p className={styles.forgotPasswordText}>
          Forgot your password? <a href="/reset-password">Click Here.</a>
        </p>

        <p className={styles.existingAccount}>
          Need an account?{" "}
          <button
            className={styles.toggleLink}
            onClick={onToggleMode}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default ExistingAccount;