"use client";

import { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Ensure this code only runs on the client
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context for canvas.");
      return;
    }

    let animationFrameId;
    const pixelRatio = window.devicePixelRatio || 1;

    // Resize canvas to fill the screen and scale for HiDPI displays
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
    };

    // Add resize listener and call resizeCanvas initially
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Line properties
    const lines = [];
    const totalLines = 10; // Number of lines
    const lineSegments = 100; // Number of segments per line (increase for smoothness)
    const amplitude = 50; // Wiggle amplitude
    const duration = 1.5; // Duration of line animation in seconds
    const speed = 1 / (60 * duration); // Progress increment per frame
    const frequency = 0.1; // Lower value for more spaced-out wiggles
    const colours = [
      "#FF5733",
      "#FFC300",
      "#28B463",
      "#2874A6",
      "#AF7AC5",
      "#E74C3C",
      "#F39C12",
      "#1ABC9C",
    ];
    let colourIndex = 0;
    let currentAnimationIndex = 0;

    // Easing function (Sine ease-in-out)
    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

    // Get the next colour in the cycle
    const getNextColour = () => {
      const colour = colours[colourIndex];
      colourIndex = (colourIndex + 1) % colours.length;
      return colour;
    };

    // Generate a random line with dynamic angles
    const generateRandomLine = (index) => {
      const side = index % 2 === 0 ? "left" : "right";
      const segmentHeight = window.innerHeight / totalLines;
      let startX, startY, endX, endY;

      startY = segmentHeight * index + Math.random() * segmentHeight * 0.5;
      const angle = (Math.random() - 0.5) * (Math.PI / 3);
      const distance = window.innerWidth + 200;

      if (side === "left") {
        startX = -20;
        endX = startX + distance * Math.cos(angle);
        endY = startY + distance * Math.sin(angle);
      } else {
        startX = window.innerWidth + 20;
        endX = startX - distance * Math.cos(angle);
        endY = startY - distance * Math.sin(angle);
      }

      return {
        startX,
        startY,
        endX,
        endY,
        progress: 0,
        wiggleOffset: Math.random() * 100,
        colour: getNextColour(),
      };
    };

    // Populate initial lines
    for (let i = 0; i < totalLines; i++) {
      lines.push(generateRandomLine(i));
    }

    // Shuffle the lines array for random animation order
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }

    // Draw and animate lines
    const drawLine = (ctx, line) => {
      ctx.strokeStyle = line.colour;
      ctx.lineWidth = 40;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(line.startX, line.startY);

      for (let i = 1; i <= lineSegments * easeInOutSine(line.progress); i++) {
        const t = i / lineSegments;
        const x = line.startX + t * (line.endX - line.startX);
        const y =
          line.startY +
          t * (line.endY - line.startY) +
          Math.sin(i * frequency + line.wiggleOffset) *
            amplitude *
            (1 - Math.abs(t - 0.5));

        ctx.lineTo(x, y);
      }

      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line, index) => {
        line.wiggleOffset += 0.02;
        drawLine(ctx, line);

        if (index === currentAnimationIndex && line.progress < 1) {
          line.progress += speed;
        }
      });

      if (
        currentAnimationIndex < lines.length - 1 &&
        lines[currentAnimationIndex].progress >= 1
      ) {
        currentAnimationIndex++;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // Cleanup on component unmount
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
      }}
      width={1920} // Fallback width for server-side rendering
      height={1080} // Fallback height for server-side rendering
    />
  );
};

export default AnimatedBackground;