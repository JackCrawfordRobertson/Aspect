"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { auth, db } from "../../../../app/Firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { LinearProgress } from "@mui/material";
import styles from "./GenreSelector.module.css";
import HouseFork from "../HouseFork/HouseForkLogic"; // Import HouseFork component

const GenreSelector = ({ onGenresSelected }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showHouseFork, setShowHouseFork] = useState(false); // State to toggle between components
  const router = useRouter();

  const getBaseRadius = (genre) => {
    const baseRadius = 40;
    const lengthFactor = Math.min(genre.length * 2, 80);
    return baseRadius + lengthFactor;
  };

  const genres = [
    "Film Noir",
    "Art House",
    "Dark Comedy",
    "Coming-of-Age",
    "Thriller",
  ];

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
    const container = containerRef.current;
    if (!container) return;

    const {width, height} = container.getBoundingClientRect();

    const update = () => {
      setBubbles((prevBubbles) => {
        const updated = [...prevBubbles];

        // Move bubbles
        for (let i = 0; i < updated.length; i++) {
          const radius = getBaseRadius(updated[i].genre);
          let {x, y, vx, vy} = updated[i];

          x += vx;
          y += vy;

          // Bounce off the container edges
          if (x - radius < 0) {
            x = radius;
            vx = Math.abs(vx); // ensure it moves inward
          }
          if (x + radius > width) {
            x = width - radius;
            vx = -Math.abs(vx); // ensure it moves inward
          }
          if (y - radius < 0) {
            y = radius;
            vy = Math.abs(vy);
          }
          if (y + radius > height) {
            y = height - radius;
            vy = -Math.abs(vy);
          }

          updated[i] = {...updated[i], x, y, vx, vy};
        }

        // Collision detection between bubbles
        for (let i = 0; i < updated.length; i++) {
          const rA = getBaseRadius(updated[i].genre);

          for (let j = i + 1; j < updated.length; j++) {
            const rB = getBaseRadius(updated[j].genre);

            const dx = updated[j].x - updated[i].x;
            const dy = updated[j].y - updated[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < rA + rB) {
              // Swap velocities
              const tempVx = updated[i].vx;
              const tempVy = updated[i].vy;
              updated[i].vx = updated[j].vx;
              updated[i].vy = updated[j].vy;
              updated[j].vx = tempVx;
              updated[j].vy = tempVy;

              // Push them apart
              const overlap = (rA + rB - dist) / 2;
              const nx = dx / dist;
              const ny = dy / dist;
              updated[i].x -= nx * overlap;
              updated[i].y -= ny * overlap;
              updated[j].x += nx * overlap;
              updated[j].y += ny * overlap;

              // After pushing apart, check boundaries again
              // Bubble i
              if (updated[i].x - rA < 0) {
                updated[i].x = rA;
                updated[i].vx = Math.abs(updated[i].vx);
              }
              if (updated[i].x + rA > width) {
                updated[i].x = width - rA;
                updated[i].vx = -Math.abs(updated[i].vx);
              }
              if (updated[i].y - rA < 0) {
                updated[i].y = rA;
                updated[i].vy = Math.abs(updated[i].vy);
              }
              if (updated[i].y + rA > height) {
                updated[i].y = height - rA;
                updated[i].vy = -Math.abs(updated[i].vy);
              }

              // Bubble j
              if (updated[j].x - rB < 0) {
                updated[j].x = rB;
                updated[j].vx = Math.abs(updated[j].vx);
              }
              if (updated[j].x + rB > width) {
                updated[j].x = width - rB;
                updated[j].vx = -Math.abs(updated[j].vx);
              }
              if (updated[j].y - rB < 0) {
                updated[j].y = rB;
                updated[j].vy = Math.abs(updated[j].vy);
              }
              if (updated[j].y + rB > height) {
                updated[j].y = height - rB;
                updated[j].vy = -Math.abs(updated[j].vy);
              }
            }
          }
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

  // Render HouseFork if state is toggled
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