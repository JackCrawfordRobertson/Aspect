"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./HouseFork.module.css";

const HouseForkUi = ({
  viewMode,
  setViewMode,
  houseName,
  setHouseName,
  description,
  setDescription,
  inviteCode,
  setInviteCode,
  handleCreateSubmit,
  handleJoinSubmit,
  handleGoBack,
  loading,
  feedback,
}) => {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await handleJoinSubmit(e); // Pass the event to handleJoinSubmit
  
    if (result) {
      router.push("/landing"); // Redirect after success
    }
  };

  // Animation variants for transitions
  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Share invite code function using navigator.share API
  const handleShareInviteCode = async () => {
    if (!inviteCode) {
      alert("Invite code is not available yet.");
      return;
    }
  
    const message = `Join my house on our Aspect! It's called "${houseName}" and the invite code is: ${inviteCode}.`;
  
    // Check if navigator.share is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join My House",
          text: message,
          url: window.location.href, // Optional
        });
        console.log("Invite code shared successfully!");
      } catch (error) {
        console.error("Error sharing invite code:", error);
        alert("Something went wrong while sharing the invite code.");
      }
    } else {
      // Fallback: Copy to clipboard and alert the user
      try {
        await navigator.clipboard.writeText(`${message}`);
        alert("Sharing is not supported on this device. The invite code has been copied to your clipboard.");
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        alert("Sharing is not supported on this device, and we couldn’t copy the invite code. Please copy it manually.");
      }
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
        <div className={styles.title}>Your House, Your Rules.</div>
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
        <div className={styles.separator}>
          <span className={styles.line}></span>
          <span className={styles.orText}>Or</span>
          <span className={styles.line}></span>
        </div>
        <button
          className={styles.actionButton}
          onClick={() => setViewMode("joinHouse")}
        >
          Join a House
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
      {!inviteCode ? (
        <>
          <div className={styles.textGroup}>
            <div className={styles.title}>Create a House</div>
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button
              className={styles.actionButton}
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
            <button className={styles.backButton} onClick={handleGoBack}>
              Back
            </button>
            {feedback && <p className={styles.feedback}>{feedback}</p>}
          </form>
        </>
      ) : (
        // Post-house creation UI
          <div className={styles.textGroupF}>
            <div className={styles.titleJob}>House created. Job done.</div>
            <dix>
            <div className={styles.inviteCode}>{inviteCode}</div>
          <button
            className={styles.actionButton}
            onClick={handleShareInviteCode}
          >
            Share Invite Code
          </button>
          <button
            className={styles.backButton}
            style={{ marginTop: "1rem" }}
            onClick={() => router.push("/landing")}
          >
            Finish
          </button>
          </dix>
        </div>
      )}
    </motion.div>
  );

  const renderJoinHouseScreen = () => (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      key="joinHouse"
    >
      <div className={styles.textGroup}>
        <div className={styles.title}>Join a House</div>
        <p>Enter the invite code from your housemates to join their house.</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
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