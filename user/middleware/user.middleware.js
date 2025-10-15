import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklistToken.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const isTokenBlacklisted = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const blacklistedToken = await BlacklistToken.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};
