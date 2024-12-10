"use client";
import React, { useState } from "react";
import { createAccountWithEmail } from "../../../../Firebase/firebaseAuth"; 
import styles from "../ExistingAccount/ExistingAccount.module.css"; 

const CreateAccount = ({ onToggleMode, onUserAuthenticated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const user = await createAccountWithEmail(email, password, name);
      setSuccessMessage("Account created successfully!");

      // User is now signed in, proceed to genre selection
      onUserAuthenticated();
    } catch (error) {
      if (error.message.includes("auth/email-already-in-use")) {
        setErrorMessage("Email already in use. Please log in instead.");
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className={styles.loginContainer}>

<div className={styles.topContent} style={{ textAlign: 'left', marginBottom:'2em' }}>
      <h1 style={{ margin: '0 auto' }}>Let's Get Started</h1>
    </div>
      <div className={styles.bottomContent}>
        <form className={styles.formContainer} onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Name"
            className={styles.inputField}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            className={styles.inputField}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          <button type="submit" className={styles.loginButton}>
            Create Account
          </button>
        </form>

        <div className={styles.separator}>
          <span className={styles.line}></span>
          <span className={styles.orText}>Or</span>
          <span className={styles.line}></span>
        </div>

        <p className={styles.existingAccount}>
          Already have an account?{" "}
          <button
            className={styles.toggleLink}
            onClick={onToggleMode}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;