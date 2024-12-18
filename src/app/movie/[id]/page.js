"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebaseConfig";
import { useAuth } from "../../Firebase/authContext"; 
import handleAddToLibrary from "../../Firebase/firebaseHouses";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MovieDetail = () => {
  const { user } = useAuth(); 
  const params = useParams();
  const { id } = params;
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // "idle", "loading", "success", "error"
  const [addStatus, setAddStatus] = useState("idle");
  const [houseId, setHouseId] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const previousTab = searchParams.get("tab") || "";
  const previousQuery = searchParams.get("query") || "";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const videosRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );

        if (!movieRes.ok || !creditsRes.ok || !videosRes.ok) throw new Error("Failed to fetch movie details");

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();
        const videosData = await videosRes.json();

        setMovie(movieData);
        setCredits(creditsData);

        const trailer = videosData.results.find((video) => video.type === "Trailer" && video.site === "YouTube");
        if (trailer) setTrailerKey(trailer.key);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Once movie and user are available, fetch user's house and check if movie is in library
  useEffect(() => {
    const checkHouseLibrary = async () => {
      if (!user || !user.uid || !movie) return;

      // Get user doc to find houseId
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) return;
      const userData = userDocSnap.data();
      if (!userData.houses || userData.houses.length === 0) return;

      const currentHouseId = userData.houses[0];
      setHouseId(currentHouseId);

      // Check if this movie is already in the house's library
      const houseRef = doc(db, "houses", currentHouseId);
      const houseSnap = await getDoc(houseRef);
      if (houseSnap.exists()) {
        const houseData = houseSnap.data();
        const movieInLibrary = houseData.movies?.some((m) => m.id === movie.id);
        if (movieInLibrary) {
          setAddStatus("success");
        } else {
          setAddStatus("idle");
        }
      }
    };

    if (movie) {
      checkHouseLibrary();
    }
  }, [user, movie]);

  const handleAddToLibrary = async () => {
    if (!movie || !houseId || !user) return; // Ensure user and house exist
  
    setAddStatus("loading");
  
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        alert("User document not found. Please ensure you are logged in and registered.");
        setAddStatus("error");
        return;
      }
  
      const userData = userDocSnap.data();
  
      const houseRef = doc(db, "houses", houseId);
      const houseSnap = await getDoc(houseRef);
  
      if (!houseSnap.exists()) {
        alert("House not found. Please ensure you have a valid house.");
        setAddStatus("error");
        return;
      }
  
      const houseData = houseSnap.data();
      const moviesArray = houseData.movies || [];
      const movieExists = moviesArray.some((m) => m.id === movie.id);
  
      if (movieExists) {
        // Remove the movie
        const updatedMovies = moviesArray.filter((m) => m.id !== movie.id);
        await updateDoc(houseRef, { movies: updatedMovies });
        setAddStatus("idle");
      } else {
        // Add the movie with metadata
        const movieData = {
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          tagline: movie.tagline || "",
          releaseDate: movie.release_date || "",
          genres: movie.genres?.map((genre) => genre.name) || [],
          addedBy: user.uid, // Use UID from authentication
          addedByName: userData.name || "Unknown", // Fetch name from Firestore user document
          dateAdded: new Date().toISOString(), // Current date/time in ISO format
        };
  
        await updateDoc(houseRef, {
          movies: arrayUnion(movieData),
        });
  
        setAddStatus("success");
      }
    } catch (error) {
      console.error("Error toggling movie in library:", error);
      alert("An error occurred while updating the library. Please try again.");
      setAddStatus("error");
    }
  };

  const chartData = {
    labels: ["Budget", "Revenue"],
    datasets: [
      {
        label: "USD",
        data: [movie?.budget || 0, movie?.revenue || 0],
        backgroundColor: [
          getComputedStyle(document.documentElement).getPropertyValue("--chart-6"),
          getComputedStyle(document.documentElement).getPropertyValue("--chart-1"),
        ],
        borderColor: [
          getComputedStyle(document.documentElement).getPropertyValue("--chart-6"),
          getComputedStyle(document.documentElement).getPropertyValue("--chart-1"),
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  const buttonText = {
    idle: "Add to My House Library",
    loading: "Updating...",
    success: "Remove from My House Library",
    error: "Error. Try Again",
  };

  let buttonClasses = "w-full mt-6";
  if (addStatus === "success") {
    // Movie is in the library, show a distinctive style
    buttonClasses += " bg-green-600 text-white hover:bg-green-500";
  } else if (addStatus === "error") {
    buttonClasses += " bg-red-600 text-white hover:bg-red-500";
  } else {
    buttonClasses += " bg-primary text-primary-foreground hover:bg-primary/80";
  }

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container ">
      <Card className="bg-card text-card-foreground shadow-lg border-none rounded-none p-7">
        <CardContent className="p-0">
          <div className="flex gap-1">
            <div className="flex-shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                alt={movie?.title}
                className="rounded-md shadow-md object-cover w-[150px] h-auto"
              />
            </div>
            <div className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">{movie?.title}</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  {movie?.tagline || "No tagline available"}
                </CardDescription>
                {trailerKey && (
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank")}
                  >
                    Watch Trailer
                  </Button>
                )}
              </CardHeader>
            </div>
          </div>
        </CardContent>

        <CardContent className="p-0">
          <p className="text-foreground mt-4">{movie?.overview || "No overview available"}</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex flex-col bg-secondary p-4 rounded-md">
              <span className="text-muted-foreground font-medium">Director</span>
              <span className="text-foreground font-bold">
                {credits?.crew.find((c) => c.job === "Director")?.name || "N/A"}
              </span>
            </div>
            <div className="flex flex-col bg-secondary p-4 rounded-md">
              <span className="text-muted-foreground font-medium">Release Date</span>
              <span className="text-foreground font-bold">{movie?.release_date || "N/A"}</span>
            </div>
            <div className="flex flex-col bg-secondary p-4 rounded-md">
              <span className="text-muted-foreground font-medium">Genres</span>
              <span className="text-foreground font-bold">{movie?.genres?.[0]?.name || "N/A"}</span>
            </div>
            <div className="flex flex-col bg-primary p-4 rounded-md">
              <span className="text-primary-foreground font-medium">Runtime</span>
              <span className="text-foreground font-bold">
                {Math.floor(movie?.runtime / 60)}h {movie?.runtime % 60}m
              </span>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-bold text-foreground">Cast</h3>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={16}
              slidesPerView={3}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 3 },
              }}
              className="mt-4"
            >
              {credits?.cast.slice(0, 10).map((actor) => (
                <SwiperSlide key={actor.id}>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-16 h-16 border border-muted rounded-full">
                      <AvatarImage
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                            : "/default-avatar.jpg"
                        }
                        alt={actor.name}
                        className="object-cover"
                      />
                      <AvatarFallback>{actor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="mt-2 text-sm font-semibold">{actor.name}</p>
                    <p className="text-xs text-muted-foreground">{actor.character}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="mt-6">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <Button
            onClick={handleAddToLibrary}
            disabled={addStatus === "loading"}
            className={buttonClasses}
          >
            {buttonText[addStatus]}
          </Button>
        </CardContent>
        <CardContent className="p-0">
          <Button
            onClick={() => {
              router.push(`/landing?tab=${previousTab}${previousQuery ? `&query=${encodeURIComponent(previousQuery)}` : ""}`);
            }}
            className="mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full"
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovieDetail;