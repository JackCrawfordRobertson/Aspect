"use client";

import React, { useState } from "react";
import { createHouse, joinHouse } from "../../../../app/Firebase/firebaseHouses";
import { useAuth } from "../../../../app/Firebase/authContext";
import HouseForkUi from "./HouseForkUi";

const HouseForkLogic = () => {
  const [viewMode, setViewMode] = useState("welcome");
  const [houseName, setHouseName] = useState("");
  const [description, setDescription] = useState(""); // New field for house description
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { user } = useAuth(); // Get logged-in user info

  const handleGoBack = () => {
    setViewMode("welcome");
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
      const { houseId, inviteCode } = await createHouse(houseName, description, user.uid);
      setFeedback(`House created successfully! Invite code: ${inviteCode}`);
      setHouseName("");
      setDescription(""); // Clear description after submission
    } catch (error) {
      setFeedback("Failed to create house. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setFeedback("Please enter an invite code.");
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const houseId = await joinHouse(inviteCode, user.uid);
      setFeedback("Joined house successfully!");
      setInviteCode("");
    } catch (error) {
      setFeedback("Failed to join house. Invalid invite code.");
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
      description={description} // Pass description
      setDescription={setDescription} // Add setter for description
      inviteCode={inviteCode}
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