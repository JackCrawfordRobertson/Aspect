"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./HouseFork.module.css";

const HouseForkUi = ({
  viewMode,
  setViewMode,
  houseName,
  setHouseName,
  inviteCode,
  setInviteCode,
  handleCreateSubmit,
  handleJoinSubmit,
  handleGoBack,
  loading,
  feedback,
}) => {
  const [houseDescription, setHouseDescription] = useState("");

  // Animation variants for screen transitions
  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const handleShareInviteCode = () => {
    if (!inviteCode) {
      alert("Invite code is not available yet.");
      return;
    }

    const message = `Join my house on our app! It's called "${houseName}" and the invite code is: ${inviteCode}. Download the app to join us now!`;

    console.log("Attempting to share with:", message);

    if (navigator.share) {
      navigator
        .share({
          title: "Join My House",
          text: message,
          url: window.location.href, // Optional
        })
        .then(() => console.log("Invite code shared successfully!"))
        .catch((error) => console.error("Error sharing invite code:", error));
    } else {
      alert("Sharing is not supported on this device.");
      console.warn("navigator.share is not available.");
    }
  };

  const renderWelcomeScreen = () => (
    <motion.div
      className={styles.container}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      key="welcome"
    >
      <div className={styles.textGroup}>
        <h1 className={styles.title}>Your House, Your Rules.</h1>
        <p>
          Whether you’re joining in or taking charge, it’s time to create your
          digital household and finally settle movie night, once and for all.
        </p>
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={styles.actionButton}
          onClick={() => setViewMode("createHouse")}
        >
          Create a House
        </button>
        <button
          className={styles.actionButton}
          onClick={() => setViewMode("joinHouse")}
        >
          Join a House
        </button>
        <div className={styles.separator}>
          <span className={styles.line}></span>
          <span className={styles.orText}>Or</span>
          <span className={styles.line}></span>
        </div>
        <button className={styles.backButton}>
          I’ll Decide Later
        </button>
      </div>
    </motion.div>
  );

  const renderCreateHouseScreen = () => (
    <motion.div
      className={styles.containerCreateHouse}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      key="createHouse"
    >
      <div className={styles.textGroup}>
        <h1 className={styles.title}>Create a House</h1>
        <p>Give your house a name and a short description for your housemates.</p>
      </div>
      <form className={styles.form} onSubmit={handleCreateSubmit}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Enter house name"
          value={houseName}
          onChange={(e) => setHouseName(e.target.value)}
        />
        <textarea
          className={styles.inputField}
          placeholder="Enter a description (optional)"
          value={houseDescription}
          onChange={(e) => setHouseDescription(e.target.value)}
        ></textarea>
        <button className={styles.actionButton} type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
        <button className={styles.backButton} onClick={handleGoBack}>
          Back
        </button>
        {feedback && <p className={styles.feedback}>{feedback}</p>}
      </form>
      {/* Show the share button only if inviteCode is available */}
      {inviteCode && !loading && (
        <div className={styles.shareSection}>
          <p>Your house has been created!</p>
          <button className={styles.actionButton} onClick={handleShareInviteCode}>
            Share Your Invite Code
          </button>
        </div>
      )}
    </motion.div>
  );

  const renderJoinHouseScreen = () => (
    <motion.div
      className={styles.container}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      key="joinHouse"
    >
      <div className={styles.textGroup}>
        <h1 className={styles.title}>Join a House</h1>
        <p>Enter the invite code from your housemates to join their house.</p>
      </div>
      <form className={styles.form} onSubmit={handleJoinSubmit}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Enter invite code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <button className={styles.actionButton} type="submit" disabled={loading}>
          {loading ? "Joining..." : "Join"}
        </button>
        <button className={styles.backButton} onClick={handleGoBack}>
          Back
        </button>
        {feedback && <p className={styles.feedback}>{feedback}</p>}
      </form>
    </motion.div>
  );

  return (
    <div className={styles.authWrapper}>
      <AnimatePresence mode="wait">
        {viewMode === "welcome" && renderWelcomeScreen()}
        {viewMode === "createHouse" && renderCreateHouseScreen()}
        {viewMode === "joinHouse" && renderJoinHouseScreen()}
      </AnimatePresence>
    </div>
  );
};

export default HouseForkUi;