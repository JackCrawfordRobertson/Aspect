"use client";
import React, { useState } from "react";
import { signInWithGoogle } from "../../../../Firebase/firebaseAuth";
import styles from "./LoginSignUp.module.css";
import ExistingAccount from "../ExistingAccount/ExistingAccount";
import CreateAccount from "../CreateAccount/CreateAccount"; // Import the CreateAccount component

const LoginSignUp = () => {
    const [viewMode, setViewMode] = useState("signUp"); 
    // viewMode can be "signUp", "login", or "createAccount"

    const handleGoogleSignIn = async () => {
        try {
            const user = await signInWithGoogle();
            console.log("Google Sign-In Success:", user);
        } catch (error) {
            console.error("Error during Google Sign-In:", error.message);
        }
    };

    const handleToggleToLogin = () => {
        setViewMode("login");
    };

    const handleToggleToSignUp = () => {
        setViewMode("signUp");
    };

    const handleToggleToCreate = () => {
        setViewMode("createAccount");
    };

    const renderSignUpScreen = () => (
        <div className={styles.loginContainer}>
            <h1 className={styles.title}>
                The final <br />
                word on what to watch.
            </h1>
            <div className={styles.bottomContent}>
                <button
                    className={`${styles.loginButton} ${styles.googleButton}`}
                    onClick={handleGoogleSignIn}
                >
                    <img
                        src="/images/flat-color-icons_google.svg"
                        alt="Google Icon"
                        className={styles.icon}
                    />
                    Continue with Google
                </button>
                <div className={styles.separator}>
                    <span className={styles.line}></span>
                    <span className={styles.orText}>Or</span>
                    <span className={styles.line}></span>
                </div>
                <button
                    className={`${styles.loginButton} ${styles.createAccountButton}`}
                    onClick={handleToggleToCreate}
                >
                    Create an Account
                </button>
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
            <h1 className={styles.title}>
                The final <br />
                word on what to watch.
            </h1>

            {/* Sign Up Screen */}
            <div className={`${styles.screenWrapper} ${viewMode === "signUp" ? styles.active : ""}`}>
                {renderSignUpScreen()}
            </div>

            {/* Existing Account (Login) Screen */}
            <div className={`${styles.screenWrapper} ${viewMode === "login" ? styles.active : ""}`}>
                <ExistingAccount onToggleMode={handleToggleToSignUp} />
            </div>

            {/* Create Account Screen */}
            <div className={`${styles.screenWrapper} ${viewMode === "createAccount" ? styles.active : ""}`}>
                <CreateAccount onToggleMode={handleToggleToSignUp} />
            </div>
        </div>
    );
};

export default LoginSignUp;