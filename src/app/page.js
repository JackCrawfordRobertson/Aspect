// pages/index.js or app/page.js

"use client"; // Add this if you're using Next.js 13 App Router

import React from "react";
import styles from "./styles/page.module.css";

import AnimatedBackground from "./components/AnimatedBackground";
import DesktopNotification from "./components/Desktop/DesktopNotification";
import LaunchUICompiled from "./components/mobile/LaunchUI/LaunchUICompiled";
import useIsDesktop from "./hooks/useIsDesktop";


export default function Home() {
  const isDesktop = useIsDesktop();

  return (
      <div className={styles.page}>
          <main className={styles.main}>
              {isDesktop ? (
                  <DesktopNotification />
              ) : (
                  <LaunchUICompiled />
              )}

              <AnimatedBackground />
          </main>
          <footer className={styles.footer}>{/* Footer content */}</footer>
      </div>
  );
}