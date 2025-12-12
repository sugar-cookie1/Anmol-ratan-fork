// server/services/authMiddleware.js

import { verifyIdToken } from "./authService.js";

/**
 * Express middleware to verify Authorization: Bearer <idToken>
 * Sets req.firebaseUser = decoded token
 */
export const verifyFirebaseIdToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);

  if (!match) {
    return res.status(401).json({ ok: false, message: "Missing Authorization header" });
  }

  const token = match[1];

  try {
    const decoded = await verifyIdToken(token);
    req.firebaseUser = decoded;
    return next();
  } catch (err) {
    console.error("verifyFirebaseIdToken error:", err);
    return res.status(401).json({ ok: false, message: "Invalid or expired token" });
  }
};
