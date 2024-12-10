"use client";
import React, { useState } from "react";
import styles from "./HouseFork.module.css"; // Update to new CSS module

const HouseFork = () => {
  const [viewMode, setViewMode] = useState("welcome");
  // viewMode can be: "welcome", "createHouse", "joinHouse"

  const handleCreateHouse = () => {
    setViewMode("createHouse");
  };

  const handleJoinHouse = () => {
    setViewMode("joinHouse");
  };

  const handleGoBack = () => {
    setViewMode("welcome");
  };

  const renderWelcomeScreen = () => (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Movie Picker!</h1>
      <p className={styles.description}>
        Join a house with your housemates or create one to get started.
      </p>
      <div className={styles.buttonGroup}>
        <button className={styles.actionButton} onClick={handleCreateHouse}>
          Create a sssss
        </button>
        <button className={styles.actionButton} onClick={handleJoinHouse}>
          Join a House
        </button>
      </div>
    </div>
  );

  const renderCreateHouseScreen = () => (
    <div className={styles.container}>
      <h1 className={styles.title}>Create a House</h1>
      <p className={styles.description}>Give your house a name and invite your housemates.</p>
      <form className={styles.form}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Enter house name"
        />
        <button className={styles.actionButton}>Create</button>
      </form>
      <button className={styles.backButton} onClick={handleGoBack}>
        Back
      </button>
    </div>
  );

  const renderJoinHouseScreen = () => (
    <div className={styles.container}>
      <h1 className={styles.title}>Join a House</h1>
      <p className={styles.description}>
        Enter the invite code from your housemates to join their house.
      </p>
      <form className={styles.form}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Enter invite code"
        />
        <button className={styles.actionButton}>Join</button>
      </form>
      <button className={styles.backButton} onClick={handleGoBack}>
        Back
      </button>
    </div>
  );

  return (
    <div className={styles.authWrapper}>
      {viewMode === "welcome" && renderWelcomeScreen()}
      {viewMode === "createHouse" && renderCreateHouseScreen()}
      {viewMode === "joinHouse" && renderJoinHouseScreen()}
    </div>
  );
};

export default HouseFork;