"use client";

import React, { useState } from "react";
import LoginSignUp from "./LoginSignUp/LoginSignUp";
import styles from "./LaunchUICompiled.module.css";
import { Button } from "@/components/ui/button";

const LaunchUICompiled = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(true); // Set the state to true when the button is clicked
  };

  return (
    <div className={`${styles.banner} ${isExpanded ? styles.expanded : ""}`}>
      <div className={`${styles.content} relative`}>
        {!isExpanded ? (
          <>
            {/* Landing Screen Content */}
            <div className={styles.title}>Aspect</div>
            <p className={styles.description}>
              Your house, your movies, no arguments. Aspect is the app that makes choosing tonight’s film as easy as hitting play. Plan it, vote on it, and settle in together.
            </p>
            {/* Conditionally render the button at bottom-right */}
            {!isExpanded && (
              <Button
                onClick={toggleExpand}
                variant="default"
                className="absolute bottom-0 right-0 mb-10 w-16 h-16 rounded-full p-0 flex items-center justify-center"
              >
                →
              </Button>
            )}
          </>
        ) : (
          <LoginSignUp />
        )}
      </div>
    </div>
  );
};

export default LaunchUICompiled;