"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // For navigation
import { fetchMoviesBySearch, fetchPopularMovies } from "src/app/api/TMDb";

const SearchPage = ({ query: initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery);
  const [movies, setMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch popular movies on mount
  useEffect(() => {
    const getPopularMovies = async () => {
      try {
        const popularMovies = await fetchPopularMovies();
        setPopularMovies(popularMovies.slice(0, 8));
      } catch (err) {
        console.error("Error fetching popular movies:", err);
      }
    };

    getPopularMovies();
  }, []);

  // Restore state from query params if not set
  useEffect(() => {
    if (!query && initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const searchResults = await fetchMoviesBySearch(searchQuery);
      setMovies(searchResults);

      // Merge existing search parameters with the new query
      const currentTab = searchParams.get("tab") || "home";
      router.push(
        `/landing?tab=${currentTab}&query=${encodeURIComponent(searchQuery)}`,
        { shallow: true } // Avoid full page reload
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (id) => {
    const currentQuery = query || "";
    const currentTab = searchParams.get("tab") || "home"; // Get current tab from URL
    router.push(`/movie/${id}?tab=${currentTab}&query=${encodeURIComponent(currentQuery)}`);
  };

  return (
    <div className="p-6 bg-background" style={{ minHeight: "100%" }}>
      <div className="mb-6 p-0 rounded">
        <h1>Search</h1>
        <p className="mt-2 text-gray-600 dark:text-white leading-5">
          Use the search bar to find movies in your collection.
        </p>
      </div>

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="Enter movie name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
        />
        <button
          onClick={() => handleSearch(query)}
          className="py-2 px-4 bg-primary text-primary-foreground rounded shadow"
        >
          Search
        </button>
      </div>

      {/* Search Results Grid */}
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">{error}</p>
      ) : (
        query.trim() && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden cursor-pointer"
                onClick={() => handleMovieClick(movie.id)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-100 object-cover"
                />
                <div className="p-3">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {movie.title}
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {movie.release_date?.split("-")[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Popular Movies</h2>
      <div className="grid grid-cols-2 gap-4">
        {popularMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden cursor-pointer"
            onClick={() => handleMovieClick(movie.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-100 object-cover"
            />
            <div className="p-3">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                {movie.title}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Score: {movie.vote_average.toFixed(1)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;