import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchPopularMovies } from "@/components/api/TMDb";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const HomePage = () => {
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

    return (
        <div className="p-6 bg-background flex flex-col justify-between" style={{ minHeight: "100%" }}>
            {/* Top Content */}
            <div>
                {/* Welcome Card */}
                <div className="mb-2 p-0 rounded">
                    <h1>Dashboard</h1>
                    <p className="mt-2 text-gray-600 dark:text-white leading-5 ">
                        View popular movies, pick a random movie from your list, or add to your colection!
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
                            modules={[Autoplay, Pagination]} // Add modules
                            spaceBetween={16}
                            slidesPerView={2} // Show 3 movies at a time
                            autoplay={{
                                delay: 3000, // Auto-scroll every 3 seconds
                                disableOnInteraction: false, // Keep autoplay on user interaction
                            }}
                          
                            breakpoints={{
                                640: { slidesPerView: 2 }, // Adjust for smaller screens
                                768: { slidesPerView: 3 }, // Default for larger screens
                            }}
                            className="mb-0"
                        >
                            {movies.map((movie) => (
                                <SwiperSlide key={movie.id}>
                                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-md mb-2 overflow-hidden">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
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
                            <div
                                key={movie.id}
                                className="bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden"
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
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
                            "0 0 10px 1px rgba(255, 87, 51, 0.8)", // Subtle orange glow
                            "0 0 10px 1px rgba(255, 195, 0, 0.8)", // Subtle yellow glow
                            "0 0 10px 1px rgba(40, 180, 99, 0.8)", // Subtle green glow
                            "0 0 10px 1px rgba(40, 116, 166, 0.8)", // Subtle blue glow
                            "0 0 10px 1px rgba(175, 122, 197, 0.8)", // Subtle purple glow
                            "0 0 10px 1px rgba(231, 76, 60, 0.8)", // Subtle red glow
                            "0 0 10px 1px rgba(243, 156, 18, 0.8)", // Subtle orange-yellow glow
                            "0 0 10px 1px rgba(26, 188, 156, 0.8)", // Subtle teal glow
                            "0 0 10px 1px rgba(255, 87, 51, 0.8)", // Loop back to start
                        ],
                    }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 12, // Smooth long duration
                        ease: "linear", // Linear easing for smooth transitions
                    }}
                    style={{
                        borderRadius: "0.375rem", // Matches Tailwind `rounded-md`
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

export default HomePage;