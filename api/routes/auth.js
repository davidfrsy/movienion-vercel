import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../database.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide name, email, and password." });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select("id, name, email, role");

    if (error) {
      if (error.code === "23505") {
        return res.status(400).json({ error: "Email already in use." });
      }
      throw error;
    }

    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password dibutuhkan." });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*') 
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'Email tidak terdaftar.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Password salah.' });
    }
    
    const payload = { 
      user: { 
        id: user.id, 
        name: user.name, 
        role: user.role 
      } 
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });

  } catch (err) {
    console.error("Login server error:", err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

export default router;
