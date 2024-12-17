import React, { useState } from "react";
import LoginSignUp from "./LoginSignUp/LoginSignUp";
import styles from "./LaunchUICompiled.module.css";

const LaunchUICompiled = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(true); // Set the state to true when the button is clicked
  };

  return (
    <div className={`${styles.banner} ${isExpanded ? styles.expanded : ""}`}>
      <div className={styles.content}>
        {!isExpanded ? (
          <>
            {/* Landing Screen Content */}
            <div className={styles.title}>Aspect</div>
            <p className={styles.description}>
              Your house, your movies, no arguments. Aspect is the app that makes choosing tonight’s film as easy as hitting play. Plan it, vote on it, and settle in together.
            </p>
          </>
        ) : (
          <LoginSignUp />
        )}
      </div>
      {/* Conditionally render the button */}
      {!isExpanded && (
        <button className={styles.circleButton} onClick={toggleExpand}>
          →
        </button>
      )}
    </div>
  );
};

export default LaunchUICompiled;