"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection
import { useAuth } from "../../../app/Firebase/authContext"; // Use the custom hook
import HomePage from "./Films/HomePage";
import SearchPage from "./Search/SearchPage";
import MyHome from "./Home/MyHouse";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Film, Search, House } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MainNavigation = () => {
  const { user, loading } = useAuth(); // Access user and loading state
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>; // Optionally render a spinner while loading
  }

  if (!user) {
    router.push("/login"); // Redirect to login if not authenticated
    return null;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "search":
        return <SearchPage />;
      case "myHouse":
        return <MyHome />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col min-h-[100svh]">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
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

      {/* Bottom navigation */}
      <nav className="flex justify-around items-center p-4 border-t bg-white shadow dark:bg-gray-900 z-10">
        <Button
          variant={activeTab === "home" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("home")}
        >
          <Film className="mr-2 h-4 w-4" />
          Films
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
        <ModeToggle />
      </nav>
    </div>
  );
};

export default MainNavigation;