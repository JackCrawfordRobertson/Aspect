"use client";

import React, { useState } from "react";
import HomePage from "./Home/HomePage";
import SearchPage from "./Search/SearchPage";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Home, Search, House } from "lucide-react"; // Import icons
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion

const MainNavigation = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderActivePage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "search":
        return <SearchPage />;
      case "myHouse":
        return (
          <div className="p-6">
            <h1 className="text-lg font-bold">My House</h1>
            <p>Manage your house settings here.</p>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Render the active page */}
      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab} // Use the activeTab as the key to trigger transitions
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Glassy Overlay */}
      <div className="absolute inset-x-0 bottom-0 w-full h-30 bg-[#70707060] backdrop-blur-md rounded-t-lg z-10 pointer-events-none"></div>

      {/* Custom Shadcn Navbar */}
      <nav className="flex justify-around items-center p-4 border-t bg-white shadow dark:bg-gray-900 relative z-20">
        <Button
          variant={activeTab === "home" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("home")}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button
          variant={activeTab === "search" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("search")}
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button
          variant={activeTab === "myHouse" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("myHouse")}
        >
          <House className="mr-2 h-4 w-4" />
          My House
        </Button>
        {/* Add ModeToggle */}
        <ModeToggle />
      </nav>
    </div>
  );
};

export default MainNavigation;