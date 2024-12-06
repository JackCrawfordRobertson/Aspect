import React, { useState } from "react";
import styles from "../ExistingAccount/ExistingAccount.module.css"; // Reuse the same styling or create a new one

const CreateAccount = ({ onToggleMode }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = (event) => {
        event.preventDefault();
        // Add your sign-up logic here (e.g., Firebase auth creation)
        if (password !== confirmPassword) {
            console.error("Passwords do not match.");
            return;
        }

        console.log("Creating account with:", {
            name,
            email,
            password
        });
        // Proceed with account creation logic
    };

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.title}>
                The final <br />
                word on what to watch.
            </h1>
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