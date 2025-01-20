"use client";

import React, { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure client-side only

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      console.error("Canvas or context not available.");
      return;
    }

    let animationFrameId;
    const pixelRatio = window.devicePixelRatio || 1;

    // Resize canvas to cover the entire screen and avoid glitches
    const resizeCanvas = () => {
      const width = Math.floor(window.innerWidth * pixelRatio);
      const height = Math.floor(window.innerHeight * pixelRatio);
      canvas.width = width;
      canvas.height = height;
      ctx.scale(pixelRatio, pixelRatio);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Animation configuration
    const totalLines = 10;
    const lineSegments = 100;
    const amplitude = 50;
    const duration = 3; // Animation duration (seconds)
    const speed = 1 / (60 * duration);
    const frequency = 0.1; // Wiggle frequency
    const colours = ["#FF5733", "#FFC300", "#28B463", "#2874A6", "#AF7AC5", "#E74C3C", "#F39C12", "#1ABC9C"];
    let colourIndex = 0;
    let currentAnimationIndex = 0;

    const lines = Array.from({ length: totalLines }, (_, index) => generateRandomLine(index));

    // Generate a single line with randomised properties
    function generateRandomLine(index) {
      const segmentHeight = window.innerHeight / totalLines;
      const startY = segmentHeight * index + Math.random() * segmentHeight * 0.5;
      const angle = (Math.random() - 0.5) * Math.PI / 3;
      const distance = window.innerWidth + 200;

      const isLeft = index % 2 === 0;
      const startX = isLeft ? -20 : window.innerWidth + 20;
      const endX = startX + (isLeft ? 1 : -1) * distance * Math.cos(angle);
      const endY = startY + distance * Math.sin(angle);

      return {
        startX,
        startY,
        endX,
        endY,
        progress: 0,
        wiggleOffset: Math.random() * 100,
        colour: colours[colourIndex++ % colours.length],
      };
    }

    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

    // Draw a single line
    function drawLine(ctx, line) {
      ctx.strokeStyle = line.colour;
      ctx.lineWidth = 40;
      ctx.lineCap = "round";
      ctx.beginPath();

      for (let i = 0; i <= lineSegments * easeInOutSine(line.progress); i++) {
        const t = i / lineSegments;
        const x = line.startX + t * (line.endX - line.startX);
        const y =
          line.startY +
          t * (line.endY - line.startY) +
          Math.sin(i * frequency + line.wiggleOffset) * amplitude * (1 - Math.abs(t - 0.5));

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
    }

    // Animation loop
    function animate() {
      // Clear the entire canvas explicitly
      ctx.clearRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);

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
    }

    animate();

    // Cleanup
    return () => {
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
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default AnimatedBackground;