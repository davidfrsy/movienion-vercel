import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // 1. Ambil token dari header request
  const token = req.header('x-auth-token');

  // 2. Jika tidak ada token, tolak akses
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // 3. Verifikasi token menggunakan JWT Secret kita
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Jika valid, tambahkan info user ke object request
    req.user = decoded.user;
    
    // 5. Lanjutkan ke endpoint tujuan
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export default auth;