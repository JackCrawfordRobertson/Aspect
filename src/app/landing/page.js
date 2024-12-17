"use client";

import React from "react";
import MainNavigation from "@/components/mobile/App/MainNavigation"; // Adjust the import path as per your folder structure

const LandingPage = () => {
  return (
    <div className="h-screen bg-gray-100 dark:bg-zinc-900">
      <MainNavigation />
    </div>
  );
};

export default LandingPage;