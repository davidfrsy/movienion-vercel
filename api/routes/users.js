import express from "express";
import { supabase } from "../database.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error("Users API Error:", err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

router.put("/:id/role", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (role !== "user" && role !== "author" && role !== "admin") {
      return res.status(400).json({ error: "Role tidak valid." });
    }

    const { data, error } = await supabase
      .from("users")
      .update({ role: role })
      .eq("id", id)
      .select("id, name, email, role, created_at")
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error("Update Role Error:", err.message);
    res.status(500).json({ error: "Gagal memperbarui role." });
  }
});

export default router;
