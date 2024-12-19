"use client";

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import AnimatedBackground from "../../../RandomAnimatedBackground";
import StreamingInfo from "../../../../app/api/StreamingInfo"; // Import the StreamingInfo component
import {motion, AnimatePresence} from "framer-motion";

const RandomMoviePicker = ({isOpen, onClose, houseMovies}) => {
    const [randomMovie, setRandomMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setError("");
            setRandomMovie(null);

            if (!houseMovies || houseMovies.length === 0) {
                setError("No films found in your house’s library.");
                setLoading(false);
                return;
            }

            const randomIndex = Math.floor(Math.random() * houseMovies.length);
            const selectedMovie = houseMovies[randomIndex];
            setRandomMovie(selectedMovie);
            setLoading(false);
        } else {
            setRandomMovie(null);
            setError("");
        }
    }, [isOpen, houseMovies]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}} // Fade-out animation
                    transition={{duration: 0.3}} // Adjust the duration of the fade
                    className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm"
                >
                    <AnimatedBackground />
                    <div className="relative z-10 w-full max-w-md p-4">
                        <Card className="bg-transparent border-none shadow-none">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="text-center text-2xl font-bold text-primary dark:text-white">
                                    {loading
                                        ? "Loading a Random Film..."
                                        : randomMovie
                                        ? randomMovie.title
                                        : error
                                        ? "Error"
                                        : "No Film Found"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {loading && <p className="text-center">Fetching your film...</p>}
                                {error && <p className="text-center text-red-500">{error}</p>}
                                {randomMovie && (
                                    <div className="text-center">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${randomMovie.posterPath}`}
                                            alt={randomMovie.title}
                                            className="mx-auto w-48 h-auto rounded-md shadow-md mb-4"
                                        />
                                        {/* Pass imdbId or tmdbId */}
                                        <StreamingInfo movieId={randomMovie.id} />
                                        </div>
                                )}
                            </CardContent>
                        </Card>
                        <Button className="w-full mt-4" variant="default" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RandomMoviePicker;
