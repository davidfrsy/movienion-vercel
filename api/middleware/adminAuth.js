import auth from "./auth.js";

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Akses ditolak. Memerlukan hak admin." });
    }
  });
};

export default adminAuth;