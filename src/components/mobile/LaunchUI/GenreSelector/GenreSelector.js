"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../app/Firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { LinearProgress } from "@mui/material";
import dynamic from "next/dynamic";
import styles from "./GenreSelector.module.css";

// Dynamically import HouseFork to prevent unnecessary SSR
const HouseFork = dynamic(() => import("../HouseFork/HouseForkLogic"), {
  ssr: false,
});

const GenreSelector = ({ onGenresSelected }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showHouseFork, setShowHouseFork] = useState(false);
  const router = useRouter();

  const genres = [
    "Film Noir",
    "Art House",
    "Dark Comedy",
    "Coming-of-Age",
    "Thriller",
  ];

  const getBaseRadius = (genre) => {
    const baseRadius = 40;
    const lengthFactor = Math.min(genre.length * 2, 80);
    return baseRadius + lengthFactor;
  };

  const [bubbles, setBubbles] = useState(() =>
    genres.map((genre) => ({
      genre,
      x: Math.random() * 200,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }))
  );

  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure the code only runs on the client

    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    const update = () => {
      setBubbles((prevBubbles) => {
        const updated = [...prevBubbles];

        for (let i = 0; i < updated.length; i++) {
          const radius = getBaseRadius(updated[i].genre);
          let { x, y, vx, vy } = updated[i];

          x += vx;
          y += vy;

          // Bounce off the container edges
          if (x - radius < 0) {
            x = radius;
            vx = Math.abs(vx);
          }
          if (x + radius > width) {
            x = width - radius;
            vx = -Math.abs(vx);
          }
          if (y - radius < 0) {
            y = radius;
            vy = Math.abs(vy);
          }
          if (y + radius > height) {
            y = height - radius;
            vy = -Math.abs(vy);
          }

          updated[i] = { ...updated[i], x, y, vx, vy };
        }

        return updated;
      });

      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleBubbleClick = (genre) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      } else if (prev.length < 3) {
        return [...prev, genre];
      } else {
        return prev;
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("No user is logged in.");

      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { selectedGenres }, { merge: true });
      console.log("Genres saved successfully!");

      // Show HouseFork component after saving data
      setShowHouseFork(true);
    } catch (error) {
      console.error("Error saving genres:", error.message);
    }
  };

  const progressValue = (selectedGenres.length / 3) * 100;

  if (showHouseFork) {
    return <HouseFork />;
  }

  return (
    <div
      className={styles.container}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <h1 className={styles.title}>Pick Your Movie Vibes.</h1>
      <p>
        Click on the genres that match your mood. Love a romcom? Crave a thriller? Let’s set the tone for your
        perfect movie night.
      </p>
      <p style={{ marginBottom: "10px", marginTop: "10px" }}>
        <span
          style={{
            fontWeight: "bold",
            fontSize: "larger",
            color: selectedGenres.length === 3 ? "#f6f6f6" : "#f6f6f6",
          }}
        >
          {selectedGenres.length}
        </span>{" "}
        <span style={{ color: "inherit", fontWeight: "600" }}>Picked of 3</span>
      </p>
      <LinearProgress
        variant="determinate"
        value={progressValue}
        sx={{
          width: "100%",
          height: "7px",
          backgroundColor: "#F6F6F6",
          borderRadius: "5px",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#D8612F",
            borderRadius: "5px",
          },
        }}
        style={{ marginBottom: "20px" }}
      />
      <div
        ref={containerRef}
        style={{
          width: "100%",
          flex: 1,
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {bubbles.map((bubble) => {
          const isSelected = selectedGenres.includes(bubble.genre);
          const radius = getBaseRadius(bubble.genre);
          const scale = isSelected ? 1.2 : 1;

          return (
            <motion.div
              key={bubble.genre}
              onClick={() => handleBubbleClick(bubble.genre)}
              style={{
                position: "absolute",
                borderRadius: "50%",
                background: isSelected ? "#fff" : "#D8612F",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isSelected ? "#D8612F" : "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                width: radius * 1.8,
                height: radius * 1.8,
                whiteSpace: "nowrap",
                padding: "0 10px",
                textAlign: "center",
                outline: "none",
              }}
              animate={{
                x: bubble.x - radius,
                y: bubble.y - radius,
                scale: scale,
              }}
              transition={{ type: "spring", stiffness: 50, damping: 10 }}
              whileHover={{ scale: scale * 1.05 }}
            >
              {bubble.genre}
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedGenres.length !== 3}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          border: "none",
          borderRadius: "10px",
          background: selectedGenres.length === 3 ? "#D8612F" : "#F6F6F6",
          color: selectedGenres.length === 3 ? "#F6F6F6" : "#CCCCCC",
          cursor: selectedGenres.length === 3 ? "pointer" : "not-allowed",
          outline: "none",
        }}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default GenreSelector;