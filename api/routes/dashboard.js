import express from 'express';
import auth from '../middleware/auth.js';
import { supabase } from '../database.js';

const router = express.Router();

router.get('/reviews', auth, async (req, res) => {
  try {
    const userId = req.user.id; 

    const { data, error } = await supabase
      .from('reviews')
      .select('id, title, release_year, rating, slug, genre')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;