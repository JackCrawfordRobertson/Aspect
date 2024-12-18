"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../app/Firebase/authContext";
import Films from "./Films/Films";
import SearchPage from "./Search/SearchPage";
import MyHouse from "./MyHouse/MyHouse";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Film, Search, House } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MainNavigation = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "home");

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const navigateToTab = (tab) => {
    setActiveTab(tab);
    const currentQuery = searchParams.get("query") || "";
    router.push(`/landing?tab=${tab}${currentQuery ? `&query=${encodeURIComponent(currentQuery)}` : ""}`);
  };

// In MainNavigation.js

const renderActivePage = () => {
  switch (activeTab) {
    case "home":
      return <Films onMovieClick={(id) => router.push(`/movie/${id}?tab=${activeTab}`)} />;
   // In MainNavigation (already done)
case "search":
  const query = searchParams.get("query") || "";
  return (
    <SearchPage
      query={query}
      onMovieClick={(id) =>
        router.push(`/movie/${id}?tab=${activeTab}&query=${encodeURIComponent(query)}`)
      }
    />
  );
    case "myHouse":
      return <MyHouse onMovieClick={(id) => router.push(`/movie/${id}?tab=${activeTab}`)} />;
    default:
      return <Films onMovieClick={(id) => router.push(`/movie/${id}?tab=${activeTab}`)} />;
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
      <nav className="flex justify-around items-center p-4 border-t bg-white shadow dark:bg-zinc-900 z-10">
        <Button
          variant={activeTab === "home" ? "default" : "ghost"}
          size="sm"
          onClick={() => navigateToTab("home")}
        >
          <Film className="mr-2 h-4 w-4" />
          Films
        </Button>
        <Button
          variant={activeTab === "search" ? "default" : "ghost"}
          size="sm"
          onClick={() => navigateToTab("search")}
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button
          variant={activeTab === "myHouse" ? "default" : "ghost"}
          size="sm"
          onClick={() => navigateToTab("myHouse")}
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