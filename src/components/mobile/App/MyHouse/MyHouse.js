"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../app/Firebase/firebaseConfig";
import { useAuth } from "../../../../app/Firebase/authContext"; // Auth Context
import { Avatar } from "@/components/ui/avatar"; // Shadcn UI component
import { useRouter } from "next/navigation"; // Next.js 13+ routing

const fetchHouseMembers = async (memberIds) => {
  try {
    const memberDetails = await Promise.all(
      memberIds.map(async (userId) => {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists()
          ? { id: userId, ...userSnap.data() }
          : { id: userId, name: "Unknown User", profilePicture: "/default-avatar.jpg" };
      })
    );
    return memberDetails;
  } catch (error) {
    console.error("Error fetching house members:", error);
    return [];
  }
};

const MyHome = () => {
  const { user, loading, error } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [houseInfo, setHouseInfo] = useState(null);
  const [topFilmChoices, setTopFilmChoices] = useState([]);
  const [members, setMembers] = useState([]);
  const [movies, setMovies] = useState([]); // For house movies
  const [inviteCode, setInviteCode] = useState("");

  const router = useRouter();

  const handleShareInviteCode = async () => {
    if (!inviteCode) {
      alert("Invite code is not available yet.");
      return;
    }

    const message = `Join my house on Aspect! It's called "${houseInfo.name}" and the invite code is: ${inviteCode}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join My House",
          text: message,
          url: window.location.href,
        });
        console.log("Invite code shared successfully!");
      } catch (error) {
        console.error("Error sharing invite code:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(message);
        alert("Sharing not supported. Invite code copied to clipboard.");
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        alert("Unable to copy invite code. Please copy manually.");
      }
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile(userData);
          setTopFilmChoices(userData.filmCategories || []);

          if (userData.houses?.length > 0) {
            const houseDoc = await getDoc(doc(db, "houses", userData.houses[0]));
            if (houseDoc.exists()) {
              const houseData = houseDoc.data();
              setHouseInfo(houseData);
              setInviteCode(houseData.inviteCode);

              const membersData = await fetchHouseMembers(houseData.members);
              setMembers(membersData);

              // Fetch additional details (popularity) for each movie
              const moviesWithDetails = await Promise.all(
                houseData.movies.map(async (movie) => {
                  const movieRes = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
                  );
                  const movieData = await movieRes.json();
                  return { ...movie, popularity: movieData.popularity || "N/A" };
                })
              );

              setMovies(moviesWithDetails);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user or house data:", err);
      }
    };

    fetchUserData();
  }, [user, loading, router]); // Ensure dependencies are included

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6 bg-background mx-auto">
      {/* Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="p-0 mb-1 flex items-center">
            <div className="w-24 h-24 flex-shrink-0">
              <Avatar className="w-full h-full">
                <img
                  src={userProfile?.profilePicture || "/default-avatar.jpg"}
                  alt="User Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </Avatar>
            </div>
            <div className="ml-6 flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {userProfile?.name || user?.displayName}
              </h2>
              <div className="mt-2">
                {userProfile?.selectedGenres?.[0] ? (
                  <span className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md">
                    {userProfile.selectedGenres[0]}
                  </span>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No genres selected</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* House Info */}
        <div className="col-span-2">
          {houseInfo && (
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-foreground mb-2">{houseInfo.name}</h1>
              <p className="text-muted-foreground mb-4">{houseInfo.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 bg-secondary rounded-lg flex items-center space-x-3 shadow-md"
                  >
                    <div className="w-10 h-10 flex-shrink-0">
                      <img
                        src={member.profilePicture || "/default-avatar.jpg"}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-foreground">
                        {member.name.split(" ")[0]} {/* Display only the first name */}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Last Added:{" "}
                        {movies.find((movie) => movie.addedBy === member.id)?.title || "None yet."}
                      </p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleShareInviteCode}
                  className="p-3 text-primary-foreground font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-md hover:bg-primary hover:text-primary-foreground transition"
                  style={{
                    backgroundColor: "var(--primary)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--primary-foreground)",
                      color: "var(--primary)",
                    }}
                  >
                    +
                  </div>
                  <span>Add Member</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Movies in House */}
        <div className="p-0 rounded-lg">
          <h1 className="text-2xl font-bold text-foreground mb-2">Movies in {houseInfo?.name}</h1>
          {movies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="p-4 bg-secondary rounded-lg shadow-md flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-md"
                    />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{movie.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Popularity: {movie.popularity ? movie.popularity.toFixed(1) : "N/A"}
                      </p>
                    </div>
                  </div>
                  <Avatar>
                    <img
                      src={
                        members.find((m) => m.id === movie.addedBy)?.profilePicture || "/default-avatar.jpg"
                      }
                      alt={members.find((m) => m.id === movie.addedBy)?.name || "Unknown"}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </Avatar>
                </div>
              ))}
            </div>
          ) : (
            <p>No movies have been added to this house yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyHome;