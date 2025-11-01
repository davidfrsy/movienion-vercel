import express from 'express';
import { supabase } from '../database.js';
import auth from '../middleware/auth.js'; 

const router = express.Router();

router.get('/review/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;

    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        created_at,
        body,
        users ( name ) 
      `)
      .eq('review_id', reviewId)
      .order('created_at', { ascending: false }); 

    if (error) throw error;
    res.status(200).json(data);

  } catch (err) {
    console.error("Error fetching comments:", err.message);
    res.status(500).json({ error: 'Failed to fetch comments.' });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const { body, review_id } = req.body;
    const user_id = req.user.id; 

    if (!body || !review_id) {
      return res.status(400).json({ error: 'Comment body and review_id are required.' });
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        { body: body, review_id: review_id, user_id: user_id }
      ])
      .select(`
        id,
        created_at,
        body,
        users ( name )
      `) 
      .single();

    if (error) throw error;
    res.status(201).json(data); 

  } catch (err) {
    console.error("Error posting comment:", err.message);
    res.status(500).json({ error: 'Failed to post comment.' });
  }
});

export default router;