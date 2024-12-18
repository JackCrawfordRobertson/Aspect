"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchPopularMovies } from "src/app/api/TMDb";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Films = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMovies = async () => {
            try {
                const popularMovies = await fetchPopularMovies();
                setMovies(popularMovies.slice(0, 10)); // Fetch the top 10 movies for the carousel
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getMovies();
    }, []);

    const cardVariants = {
        initial: { scale: 1, opacity: 1 },
        hover: { scale: 1.05, opacity: 1 },
        tap: { scale: 0.95, opacity: 0.8 },
    };

    return (
        <div className="p-6 bg-background flex flex-col justify-between" style={{ minHeight: "100%" }}>
            {/* Top Content */}
            <div>
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
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                768: { slidesPerView: 3 },
                            }}
                            className="mb-0"
                        >
                            {movies.map((movie) => (
                                <SwiperSlide key={movie.id}>
                                    <Link href={`/movie/${movie.id}`} passHref>
                                        <motion.div
                                            className="bg-white dark:bg-gray-800 rounded-md mb-2 overflow-hidden cursor-pointer"
                                            variants={cardVariants}
                                            initial="initial"
                                            whileHover="hover"
                                            whileTap="tap"
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>

            {/* "Our House Movies" Section */}
            <div>
                <h2 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">House Library</h2>
                {loading ? (
                    <p className="text-gray-600 dark:text-gray-400">Loading popular movies...</p>
                ) : error ? (
                    <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4 mb-5">
                        {movies.slice(0, 3).map((movie) => (
                            <Link href={`/movie/${movie.id}`} key={movie.id} passHref>
                                <motion.div
                                    className="bg-white dark:bg-gray-800 rounded-md overflow-hidden cursor-pointer"
                                    variants={cardVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
                <Button className="w-full" variant="default">
                    Add to Your House Library
                </Button>

                <motion.div
                    className="relative w-full rounded-md"
                    animate={{
                        boxShadow: [
                            "0 0 10px 1px rgba(255, 87, 51, 0.8)",
                            "0 0 10px 1px rgba(255, 195, 0, 8)",
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