"use client";

import React, { useState } from "react";
import { createHouse, joinHouse } from "../../../../app/Firebase/firebaseHouses";
import { useAuth } from "../../../../app/Firebase/authContext";
import HouseForkUi from "./HouseForkUi";

const HouseForkLogic = () => {
  const [viewMode, setViewMode] = useState("welcome");
  const [houseName, setHouseName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { user } = useAuth();

  const handleGoBack = () => {
    setViewMode("welcome");
    setFeedback(null); // Reset feedback when going back
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!houseName.trim()) {
      setFeedback("Please enter a house name.");
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const { houseId, inviteCode } = await createHouse(
        houseName,
        description,
        user.uid
      );
      setInviteCode(inviteCode); // Update the invite code state
      setFeedback("House created successfully!");
    } catch (error) {
      setFeedback("Failed to create house. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubmit = async () => {
    if (!inviteCode.trim()) {
      setFeedback("Please enter an invite code.");
      return false; // Return false for failure
    }
  
    setLoading(true);
    setFeedback(null);
  
    try {
      await joinHouse(inviteCode, user.uid);
      setFeedback("Joined house successfully!");
      setInviteCode("");
      return true; // Return true for success
    } catch (error) {
      setFeedback("Failed to join house. Invalid invite code.");
      return false; // Return false for failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <HouseForkUi
      viewMode={viewMode}
      setViewMode={setViewMode}
      houseName={houseName}
      setHouseName={setHouseName}
      description={description}
      setDescription={setDescription}
      inviteCode={inviteCode} // Pass updated invite code
      setInviteCode={setInviteCode}
      handleCreateSubmit={handleCreateSubmit}
      handleJoinSubmit={handleJoinSubmit}
      handleGoBack={handleGoBack}
      loading={loading}
      feedback={feedback}
    />
  );
};

export default HouseForkLogic;