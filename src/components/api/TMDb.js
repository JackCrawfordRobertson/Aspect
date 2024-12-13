import axios from "axios";

const TMDB_API_KEY = "d7e403c801f3833e46a9b3e68f81fc65"; // Replace with your TMDb API key
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-UK",
        page: 1,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const fetchMoviesBySearch = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        language: "en-UK",
        page: 1,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching for movies:", error);
    throw error;
  }
};