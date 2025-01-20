// pages/index.js or app/page.js

"use client";

import React from "react";
import dynamic from "next/dynamic"; // Import `dynamic` from Next.js
import styles from "./styles/page.module.css";
import DesktopNotification from "../components/Desktop/DesktopNotification";
import LaunchUICompiled from "../components/mobile/LaunchUI/LaunchUICompiled";
import useIsDesktop from "./hooks/useIsDesktop";
import MainNavigation from "../components/mobile/App/MainNavigation";

// Dynamically import AnimatedBackground
const AnimatedBackground = dynamic(() => import("../components/AnimatedBackground"), {
  ssr: false, // Ensure this component is only rendered on the client
});

export default function Home() {
  const isDesktop = useIsDesktop();

  return (
    // <div className={styles.pageTest}>
    //   <MainNavigation />
    // </div>

    <div className={styles.page}>
        <main className={styles.main}>
        {isDesktop ? (
          <DesktopNotification />
        ) : (
          <LaunchUICompiled />
        )}
        {/* Dynamically loaded AnimatedBackground */}
        <AnimatedBackground />
      </main>
      <footer className={styles.footer}>{/* Footer content */}</footer>
    </div>
  );
}