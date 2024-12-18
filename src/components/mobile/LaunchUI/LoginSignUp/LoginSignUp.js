"use client";

import React, { useState } from "react";
import { signInWithGoogle } from "../../../../app/Firebase/firebaseAuth";
import styles from "./LoginSignUp.module.css";
import ExistingAccount from "../ExistingAccount/ExistingAccount";
import CreateAccount from "../CreateAccount/CreateAccount";
import GenreSelector from "../GenreSelector/GenreSelector";
import { Button } from "@/components/ui/button";

const LoginSignUp = () => {
  const [viewMode, setViewMode] = useState("signUp"); 
  const [disableGenreSelector, setDisableGenreSelector] = useState(false); 

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Google Sign-In Success:", user);
      handleUserAuthenticated();
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
    }
  };

  const handleToggleToLogin = () => {
    setViewMode("login");
    setDisableGenreSelector(true);
  };

  const handleToggleToSignUp = () => {
    setViewMode("signUp");
    setDisableGenreSelector(false);
  };

  const handleToggleToCreate = () => {
    setViewMode("createAccount");
    setDisableGenreSelector(false);
  };

  const handleUserAuthenticated = () => {
    if (!disableGenreSelector) {
      setViewMode("genreSelector");
    } else {
      console.log("GenreSelector is disabled for this flow.");
    }
  };

  const renderSignUpScreen = () => (
    <div className={styles.loginContainer}>
      <div className={styles.title}>
        The final <br />
        word on what to watch.
      </div>
      <div className={styles.bottomContent}>
        <Button
          variant="ghost"
          onClick={handleGoogleSignIn}
          className={`${styles.loginButton} ${styles.createAccountButton}`}
        >
          <img
            src="/images/flat-color-icons_google.svg"
            alt="Google Icon"
            className={styles.icon}
          />
          Continue with Google
        </Button>

        <div className={styles.separator}>
          <span className={styles.line}></span>
          <span className={styles.orText}>Or</span>
          <span className={styles.line}></span>
        </div>

        <Button
          variant="ghost"
          onClick={handleToggleToCreate}
          className={`${styles.loginButton} ${styles.createAccountButton}`}
        >
          Create an Account
        </Button>
        <p className={styles.terms}>
          By signing up, you agree to the <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>, including Cookie Use.
        </p>
        <p className={styles.existingAccount}>
          Already have an account?{" "}
          <span
            className={styles.toggleLink}
            onClick={handleToggleToLogin}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <div className={styles.authWrapper}>
      {/* Sign Up Screen */}
      <div className={`${styles.screenWrapper} ${viewMode === "signUp" ? styles.active : ""}`}>
        {renderSignUpScreen()}
      </div>

      {/* Existing Account (Login) Screen */}
      <div className={`${styles.screenWrapper} ${viewMode === "login" ? styles.active : ""}`}>
        <ExistingAccount 
          onToggleMode={handleToggleToSignUp} 
          onUserAuthenticated={handleUserAuthenticated} 
        />
      </div>

      {/* Create Account Screen */}
      <div className={`${styles.screenWrapper} ${viewMode === "createAccount" ? styles.active : ""}`}>
        <CreateAccount 
          onToggleMode={handleToggleToSignUp} 
          onUserAuthenticated={handleUserAuthenticated} 
        />
      </div>

      {/* Genre Selector Screen */}
      {!disableGenreSelector && (
        <div className={`${styles.screenWrapper} ${viewMode === "genreSelector" ? styles.active : ""}`}>
          <GenreSelector />
        </div>
      )}
    </div>
  );
};

export default LoginSignUp;