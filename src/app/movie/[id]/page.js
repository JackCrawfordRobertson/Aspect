"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MovieDetail = () => {
  const params = useParams();
  const { id } = params;
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null); // For director and cast
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const previousTab = searchParams.get("tab") || "home";
  const previousQuery = searchParams.get("query") || "";

  // Fetch movie and credits data
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );

        if (!movieRes.ok || !creditsRes.ok) throw new Error("Failed to fetch movie details");

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();

        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleAddToLibrary = () => {
    alert(`Movie "${movie?.title}" added to your house library!`);
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
      legend: {
        display: false, // Disable the legend
      },
    },
  };

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
    <div className="container">
      {/* Movie Detail Card */}
      <Card className="bg-card text-card-foreground shadow-lg border-none rounded-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{movie?.title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {movie?.tagline || "No tagline available"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Poster */}
            <div>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                alt={movie?.title}
                className="rounded-md shadow-md object-cover w-full h-full"
              />
            </div>
            {/* Details */}
            <div className="col-span-2 space-y-4">
              <p className="text-foreground text-m">{movie?.overview}</p>
              <div className="text-foreground space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  {/* Director */}
                  <div className="flex flex-col bg-secondary p-4 rounded-[var(--radius)]">
                    <span className="text-muted-foreground font-medium">Director</span>
                    <span className="text-foreground font-bold">
                      {credits?.crew.find((c) => c.job === "Director")?.name || "N/A"}
                    </span>
                  </div>
                  {/* Release Date */}
                  <div className="flex flex-col bg-secondary p-4 rounded-[var(--radius)]">
                    <span className="text-secondary-foreground font-medium">Release Date</span>
                    <span className="text-foreground font-bold">{movie?.release_date || "N/A"}</span>
                  </div>
                  {/* Genres */}
                  <div className="flex flex-col bg-secondary p-4 rounded-[var(--radius)]">
                    <span className="text-secondary-foreground font-medium">Genres</span>
                    <span className="text-foreground font-bold">
                      {movie?.genres?.[0]?.name || "N/A"}
                    </span>
                  </div>
                  {/* Runtime */}
                  <div className="flex flex-col bg-primary p-4 rounded-[var(--radius)]">
                    <span className="text-primary-foreground font-medium">Runtime</span>
                    <span className="text-foreground font-bold">
                      {Math.floor(movie?.runtime / 60)}h {movie?.runtime % 60}m
                    </span>
                  </div>
                </div>
                <div>
                  <strong>Cast:</strong>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {credits?.cast?.slice(0, 3).map((actor) => (
                      <div key={actor.id} className="flex flex-col items-center text-center">
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
                    ))}
                  </div>
                </div>
              </div>
              {/* Budget vs Revenue Chart */}
              <div className="mt-6">
                <Bar data={chartData} options={chartOptions} />
              </div>
              {/* Add to Library */}
              <Button
                onClick={handleAddToLibrary}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
              >
                Add to My House Library
              </Button>
            </div>
          </div>

          {/* Go Back Button */}
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