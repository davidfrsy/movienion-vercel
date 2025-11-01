import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/search", async (req, res) => {
  const { query, year } = req.query; 
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "Server configuration error" });

  let url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}`;
  
  if (year) {
    url += `&year=${year}`;
  }

  try {
    const response = await axios.get(url);
    const simplifiedResults = response.data.results
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .map((item) => {
        const isMovie = item.media_type === "movie";
        return {
          id: item.id,
          title: isMovie ? item.title : item.name,
          poster_url: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "https://placehold.co/50x75?text=No+Image",
          release_year: isMovie
            ? item.release_date
              ? item.release_date.substring(0, 4)
              : "N/A"
            : item.first_air_date
            ? item.first_air_date.substring(0, 4)
            : "N/A",
          media_type: item.media_type,
        };
      });
    res.json(simplifiedResults);
  } catch (error) {
    console.error("Error fetching from TMDB (multi):", error.message);
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
});

router.get("/details", async (req, res) => {
  const { id, type } = req.query;
  const apiKey = process.env.TMDB_API_KEY;
  if (!id || !type)
    return res
      .status(400)
      .json({ error: "ID and type parameters are required." });
  if (!apiKey)
    return res.status(500).json({ error: "Server configuration error" });

  let url;
  if (type === "movie")
    url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
  else if (type === "tv")
    url = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`;
  else return res.status(400).json({ error: "Invalid media type." });

  try {
    const response = await axios.get(url);
    const data = response.data;
    const details = {
      tmdb_id: data.id,
      title: type === "movie" ? data.title : data.name,
      media_type: type,
      poster_url: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "https://placehold.co/500x750?text=No+Image",
      backdrop_url: data.backdrop_path
        ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
        : null,
      release_year:
        type === "movie"
          ? data.release_date
            ? data.release_date.substring(0, 4)
            : "N/A"
          : data.first_air_date
          ? data.first_air_date.substring(0, 4)
          : "N/A",
      genre: data.genres.map((g) => g.name).join(", "),
    };
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch details from TMDB" });
  }
});

export default router;
