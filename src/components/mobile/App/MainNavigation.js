"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../app/Firebase/authContext";
import Films from "./Films/Films";
import SearchPage from "./Search/SearchPage";
import MyHouse from "./MyHouse/MyHouse";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Film, Search, House, LogOut, MoreHorizontal, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const MainNavigation = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "home");

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); // Redirect to login page if no user
    }
  }, [loading, user, router]);

  const navigateToTab = useCallback(
    (tab) => {
      setActiveTab(tab);
      const currentQuery = searchParams.get("query") || "";
      router.push(
        `/landing?tab=${tab}${currentQuery ? `&query=${encodeURIComponent(currentQuery)}` : ""}`
      );
    },
    [searchParams, router]
  );

  const handleLogOut = useCallback(() => {
    router.push("/"); // Redirect to login/home page
  }, [router]);

  const renderActivePage = () => {
    switch (activeTab) {
      case "home":
        return <Films onMovieClick={(id) => router.push(`/movie/${id}?tab=${activeTab}`)} />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

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

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={handleLogOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              Light Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              Dark Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <MoreHorizontal className="mr-2 h-4 w-4" />
              System Mode
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
};

export default MainNavigation;