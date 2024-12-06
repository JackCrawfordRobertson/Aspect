import React, { useState } from "react";
import styles from "./ExistingAccount.module.css";

const ExistingAccount = ({ onToggleMode }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();
        // Add your login logic here (e.g., Firebase auth)
        console.log("Logging in with:", email, password);
    };

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.title}>
                The final <br />
                word on what to watch.
            </h1>
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