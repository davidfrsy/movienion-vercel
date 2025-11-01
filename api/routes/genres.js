import express from 'express';
import { supabase } from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('genre');

    if (error) throw error;
    if (!data) return res.status(200).json([]);

    const genreCounts = {};
    
    for (const item of data) {
      if (item.genre) {
        const individualGenres = item.genre.split(',').map(g => g.trim());
        
        for (const g of individualGenres) {
          if (g) { 
            genreCounts[g] = (genreCounts[g] || 0) + 1;
          }
        }
      }
    }

    const sortedGenres = Object.entries(genreCounts)
      .sort(([, countA], [, countB]) => countB - countA) 
      .slice(0, 10) 
      .map(([genre]) => genre); 

    res.status(200).json(sortedGenres);

  } catch (err) {
    console.error("Error fetching genres:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;