import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios"; 
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Impor rute baru kita
import reviewRoutes from './routes/reviews.js';
import authRoutes from './routes/auth.js';
import tmdbRoutes from './routes/tmdb.js';
import genreRoutes from './routes/genres.js';
import searchRoutes from './routes/search.js';
import dashboardRoutes from './routes/dashboard.js';
import commentRoutes from './routes/comments.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Terlalu banyak request dari IP ini, silakan coba lagi setelah 15 menit.',
});

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 5, 
  message: 'Terlalu banyak percobaan membuat akun dari IP ini, silakan coba lagi setelah 1 jam.',
});

const postCommentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 10, 
  message: 'Terlalu banyak komentar dari IP ini, silakan coba lagi setelah 10 menit.',
});

// Terapkan rate limit khusus pada rute tertentu
app.use('/api/auth/register', createAccountLimiter);
app.use('/api/comments', postCommentLimiter);

// --- KONEKSIKAN RUTE ---
app.use('/api/', defaultLimiter);
app.use('/api/reviews', reviewRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/tmdb', tmdbRoutes); 
app.use('/api/genres', genreRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

export default app;