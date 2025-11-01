import express from 'express';
import { supabase } from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 12; 
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit - 1;

    if (!query) return res.status(400).json({ error: 'Query parameter is required.' });

    const searchQuery = `%${query}%`;
    const searchFilter = `title.ilike.${searchQuery},genre.ilike.${searchQuery}`;

    const { count, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .or(searchFilter);

    if (countError) throw countError;

    const { data, error: dataError } = await supabase
      .from('reviews')
      .select(
        'id, title, poster_url, rating, release_year, genre, created_at, slug, users ( name )'
      )
      .or(searchFilter)
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex);

    if (dataError) throw dataError;

    res.status(200).json({
      reviews: data,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalReviews: count
    });

  } catch (err) {
    console.error("Search API error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;