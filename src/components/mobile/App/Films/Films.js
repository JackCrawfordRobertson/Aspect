"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useAuth } from "../../../../app/Firebase/authContext";
import { useRouter } from "next/navigation"; 
import { db } from "../../../../app/Firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";


const Films = ({ onMovieClick }) => {
    const { user, loading: authLoading, error: authError } = useAuth();
    const router = useRouter();

    const [movies, setMovies] = useState([]); // Popular movies
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [houseMovies, setHouseMovies] = useState([]); 
    const [houseLoading, setHouseLoading] = useState(true);
    const [houseError, setHouseError] = useState(null);

    // Fetch Popular Movies
    useEffect(() => {
        const getMovies = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
                );
                const data = await res.json();
                setMovies(data.results.slice(0, 10));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getMovies();
    }, []);

    // Fetch House Movies Logic:
    // 1. Wait for auth to load. If no user, redirect to /login.
    // 2. Fetch user's document from Firestore, get their house ID.
    // 3. Fetch that house document and retrieve its movies.
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push("/login");
            return;
        }

        const fetchHouseMovies = async () => {
            try {
                // Get the user's document
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();

                    // Check if user belongs to any houses
                    if (userData.houses?.length > 0) {
                        const houseId = userData.houses[0];
                        const houseDocRef = doc(db, "houses", houseId);
                        const houseDoc = await getDoc(houseDocRef);

                        if (houseDoc.exists()) {
                            const houseData = houseDoc.data();
                            // houseData.movies should be array of {id, posterPath, ...} objects
                            setHouseMovies(houseData.movies || []);
                        } else {
                            setHouseMovies([]);
                        }
                    } else {
                        // No houses associated with this user
                        setHouseMovies([]);
                    }
                } else {
                    // No user doc found
                    setHouseMovies([]);
                }
            } catch (err) {
                setHouseError(err.message);
            } finally {
                setHouseLoading(false);
            }
        };

        fetchHouseMovies();
    }, [authLoading, user, router]);

    const cardVariants = {
        initial: { scale: 1, opacity: 1 },
        hover: { scale: 1.05, opacity: 1 },
        tap: { scale: 0.95, opacity: 0.8 },
    };

    if (authLoading) return <div>Loading...</div>;
    if (authError) return <div>Error: {authError.message}</div>;

    return (
        <div className="p-6 bg-background flex flex-col justify-between min-h-full">
            {/* Dashboard header */}
            <div className="mb-2 p-0 rounded">
                <h1>Dashboard</h1>
                <p className="mt-2 text-gray-600 dark:text-white leading-5">
                    View popular movies, pick a random movie from your list, or add to your collection!
                </p>
            </div>

            {/* Popular Movies Carousel */}
            <div>
                <h2 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">Popular Movies</h2>
                {loading ? (
                    <p className="text-gray-600 dark:text-white">Loading popular movies...</p>
                ) : error ? (
                    <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                ) : (
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={16}
                        slidesPerView={2}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                        }}
                        className="mb-0"
                    >
                        {movies.map((movie) => (
                            <SwiperSlide key={movie.id}>
                                <motion.div
                                    className="bg-white dark:bg-gray-800 rounded-md mb-2 overflow-hidden cursor-pointer"
                                    variants={cardVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                    onClick={() => onMovieClick(movie.id)}
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            {/* House Library Section */}
            <div>
                <h2 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">House Library</h2>
                {houseLoading ? (
                    <p className="text-gray-600 dark:text-gray-400">Loading movies...</p>
                ) : houseError ? (
                    <p className="text-red-600 dark:text-red-400">Error: {houseError}</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4 mb-5">
                        {houseMovies.length > 0 ? (
                            houseMovies.slice(-3).reverse().map((movie) => (
                                <motion.div
                                    key={movie.id}
                                    className="bg-white dark:bg-gray-800 rounded-md overflow-hidden cursor-pointer"
                                    variants={cardVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <p>No movies have been added to this house yet.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
            <Button
                    className="w-full"
                    variant="default"
                    onClick={() => {
                        // Navigate directly to the search tab
                        router.push("/landing?tab=search");
                    }}
                >
                    Add to Your House Library
                </Button>
                <motion.div
                    className="relative w-full rounded-md"
                    animate={{
                        boxShadow: [
                            "0 0 10px 1px rgba(255, 87, 51, 0.8)",
                            "0 0 10px 1px rgba(255, 195, 0, 0.8)",
                        ],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 6,
                        ease: "linear",
                    }}
                >
                    <Button className="w-full rounded-md" variant="secondary">
                        Pick a Random Movie
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default Films;