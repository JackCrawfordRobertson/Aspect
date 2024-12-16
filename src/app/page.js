// pages/index.js or app/page.js

"use client"; 

import React from "react";
import styles from "./styles/page.module.css";

import AnimatedBackground from "../components/AnimatedBackground";
import DesktopNotification from "../components/Desktop/DesktopNotification";
import LaunchUICompiled from "../components/mobile/LaunchUI/LaunchUICompiled";
import useIsDesktop from "./hooks/useIsDesktop";
import MainNavigation from "../components/mobile/App/MainNavigation";

export default function Home() {
  // const isDesktop = useIsDesktop();

  return (
    <div className={styles.pageTest}>
      <MainNavigation />
    </div>

    // <div className={styles.page}>
    //     <main className={styles.main}>
    //         {isDesktop ? (
    //             <DesktopNotification />
    //         ) : (
    //             <LaunchUICompiled />
    //         )}
    //         <AnimatedBackground />
    //     </main>
    //     <footer className={styles.footer}>{/* Footer content */}</footer>
    // </div>
  );
}