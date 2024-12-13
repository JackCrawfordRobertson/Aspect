"use client";

import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {fetchPopularMovies} from "@/components/api/TMDb"; // Import the API utility

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMovies = async () => {
            try {
                const popularMovies = await fetchPopularMovies();
                setMovies(popularMovies.slice(0, 4)); // Fetch only the top 4 movies
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getMovies();
    }, []);

    return (
        <div className="p-6 bg-background" style={{minHeight: "100vh"}}>
            {" "}
            {/* Welcome Card */}
            <div className="mb-6 p-0  rounded">
                <h1>Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Here you can add movies, pick a random one, or explore your collection!
                </p>
            </div>
            {/* Popular Movies Grid */}
            {loading ? (
                <p className="text-gray-600 dark:text-gray-400">Loading popular movies...</p>
            ) : error ? (
                <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {movies.map((movie) => (
                        <div key={movie.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden">
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-3">
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{movie.title}</h2>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {movie.release_date.split("-")[0]}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Action Buttons */}
            <div className="space-y-4">
                <Button className="w-full" variant="default">
                    Add Movie
                </Button>
                <Button className="w-full" variant="secondary">
                    Pick a Random Movie
                </Button>
                <Button className="w-full" variant="outline">
                    View All Movies
                </Button>
            </div>
        </div>
    );
};

export default HomePage;
