import express from "express";
import auth from "../middleware/auth.js";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { supabase } from "../database.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit - 1;

  try {
    const { count, error: countError } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true });
    if (countError) throw countError;

    const { data, error: dataError } = await supabase
      .from("reviews")
      .select(
        "id, title, poster_url, rating, release_year, genre, created_at, slug, users ( name )"
      )
      .order("created_at", { ascending: false })
      .range(startIndex, endIndex);
    if (dataError) throw dataError;

    res.status(200).json({
      reviews: data,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalReviews: count,
    });
  } catch (error) {
    console.error("Reviews API Error:", err.message); 
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

router.get("/latest", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        'id, title, poster_url, backdrop_url, slug, users ( name ), ' + 
        'rating, genre, created_at'
      )
      .not("backdrop_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(8);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Reviews API Error:", err.message); 
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

router.get("/top-rated", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, title, poster_url, rating, slug")
      .order("rating", { ascending: false })
      .limit(5);
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error("Reviews API Error:", err.message); 
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

router.get('/related/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: currentReview, error: currentError } = await supabase
      .from('reviews')
      .select('genre')
      .eq('slug', slug)
      .single();

    if (currentError || !currentReview) {
      return res.status(404).json({ error: 'Review tidak ditemukan.' });
    }

    const primaryGenre = currentReview.genre.split(',')[0].trim();

    const { data: relatedReviews, error: relatedError } = await supabase
      .from('reviews')
      .select(
        'id, title, poster_url, rating, release_year, genre, created_at, slug, users ( name )'
      )
      .like('genre', `%${primaryGenre}%`) 
      .neq('slug', slug) 
      .limit(4); 

    if (relatedError) throw relatedError;
    
    res.status(200).json(relatedReviews);

  } catch (err) {
    console.error("Related Reviews Error:", err.message);
    res.status(500).json({ error: 'Gagal mengambil review terkait.' });
  }
});

router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;

    const isNumericId = !isNaN(parseInt(identifier));

    let query = supabase.from("reviews").select("*, users ( name )");

    if (isNumericId) {
      query = query.eq("id", identifier);
    } else {
      query = query.eq("slug", identifier);
    }

    const { data, error } = await query.single();

    if (error) throw error;
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error("Reviews API Error:", err.message); 
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    if (type !== 'movie' && type !== 'tv') {
      return res.status(400).json({ error: 'Invalid media type specified.' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .select(
        'id, title, poster_url, rating, release_year, genre, created_at, slug, users ( name )'
      )
      .eq('media_type', type) 
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error("Reviews API Error:", err.message); 
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      poster_url,
      rating,
      release_year,
      review_text,
      tmdb_id,
      genre,
      backdrop_url,
      media_type,
    } = req.body;
    const author_id = req.user.id;
    const baseSlug = slugify(title, { lower: true, strict: true });
    const uniqueSlug = `${baseSlug}-${nanoid(6)}`;

    if (!title || !genre) {
      return res.status(400).json({ error: "Title and Genre are required" });
    }
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          title,
          poster_url,
          rating,
          release_year,
          review_text,
          author_id,
          tmdb_id,
          genre,
          backdrop_url,
          slug: uniqueSlug,
          media_type: media_type,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    const { review_text, rating, genre } = req.body;
    if (!review_text || !rating || !genre) {
      return res
        .status(400)
        .json({ error: "Review text, rating, and genre are required." });
    }

    const { data: existingReview, error: findError } = await supabase
      .from("reviews")
      .select("author_id")
      .eq("id", reviewId)
      .single();
    if (findError) throw new Error("Review not found.");
    if (existingReview.author_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this review." });
    }

    const { data: updatedData, error: updateError } = await supabase
      .from("reviews")
      .update({ review_text, rating, genre })
      .eq("id", reviewId)
      .select()
      .single();
    if (updateError) throw updateError;
    res.status(200).json(updatedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    const { data: review, error: findError } = await supabase
      .from("reviews")
      .select("author_id")
      .eq("id", reviewId)
      .single();
    if (findError)
      throw new Error("Review not found or could not be accessed.");
    if (review.author_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this review." });
    }
    const { error: deleteError } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);
    if (deleteError) throw deleteError;
    res.status(200).json({ message: "Review deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
