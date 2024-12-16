"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../app/Firebase/firebaseConfig";
import { useAuth } from "../../../../app/Firebase/authContext"; // Use AuthContext
import { Avatar } from "@/components/ui/avatar"; // Shadcn UI component
import { useRouter } from "next/navigation"; // Next.js 13+ routing

const MyHome = () => {
  const { user, loading, error } = useAuth(); // Access the current user from AuthContext
  const [userProfile, setUserProfile] = useState(null);
  const [houseInfo, setHouseInfo] = useState(null);
  const [topFilmChoices, setTopFilmChoices] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait until authentication status is resolved

    if (!user) {
      router.push("/login"); // Redirect to login if not authenticated
    } else {
      // Fetch user and house data from Firestore
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Fetched user data:", userData); // Debug log
            setUserProfile(userData);
      
            // Set top film choices
            setTopFilmChoices(userData.filmCategories || []);
      
            // Fetch house info if available
            if (userData.houses && userData.houses.length > 0) {
              const houseDoc = await getDoc(doc(db, "houses", userData.houses[0]));
              if (houseDoc.exists()) {
                setHouseInfo(houseDoc.data());
              }
            }
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      };

      fetchUserData();
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="col-span-1">
          <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <div className="text-center">
            <Avatar>
    <img
      src={userProfile?.profilePicture || "/default-avatar.jpg"}
      alt="User Profile"
      className="w-full h-full object-cover rounded-full"
    />
  </Avatar>
              <h2 className="mt-4 text-xl font-semibold">
                {userProfile?.name || user?.displayName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{userProfile?.email || user?.email}</p>
            </div>
          </div>
        </div>

        {/* House Info & Top Film Choices */}
        <div className="col-span-2">
          {houseInfo && (
            <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-4">
              <h3 className="text-lg font-semibold">House Info</h3>
              <p>Name: {houseInfo.name}</p>
              <p>Description: {houseInfo.description}</p>
              <p>Members: {houseInfo.members.join(", ")}</p>
            </div>
          )}
          <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold">Top Film Choices</h3>
            <ul className="list-disc pl-5">
              {topFilmChoices.length > 0 ? (
                topFilmChoices.map((film, index) => (
                  <li key={index} className="mb-2">
                    {film}
                  </li>
                ))
              ) : (
                <li>No top films selected.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyHome;