// server/routes/api.js
import { Router } from "express";
import { User } from "#models/user.js";
import {
  loginWithIdToken,
  verifyFirebaseIdToken,
  findUserByPhone,
} from "../services/services.js";
import { addWhitelistedUser } from "../services/userService.js";

const router = Router();

// ---------------- AUTH: LOGIN WITH FIREBASE ID TOKEN ----------------
// Client verifies OTP with Firebase and sends ONLY the Firebase ID token here.
router.post("/auth/login", async (req, res) => {
  try {
    const { idToken, username } = req.body;

    if (!idToken) {
      return res.status(400).json({ ok: false, message: "Missing idToken" });
    }

    const result = await loginWithIdToken(idToken, username);

    if (!result.allowed) {
      return res.status(403).json({
        ok: false,
        message: "User not whitelisted",
        user: result.user,
      });
    }

    return res.json({
      ok: true,
      message: "Login successful",
      user: result.user,
      firebaseUid: result.firebaseUid,
      phoneNumber: result.phoneNumber,
    });
  } catch (err) {
    console.error("/auth/login error:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
});

// ---------------- PROTECTED: CURRENT USER ----------------
router.get("/user/me", verifyFirebaseIdToken, async (req, res) => {
  try {
    const decoded = req.firebaseUser;
    const phone = decoded.phone_number;

    const user = await findUserByPhone(phone);

    return res.json({ ok: true, user, firebase: decoded });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});


// ---------------- ADMIN: ADD / WHITELIST USER ----------------
// ---------------- ADMIN: ADD / WHITELIST USER ----------------
router.post("/admin/users", async (req, res) => {
  try {
    // LOG for debug (remove after verifying)
    const receivedHeader = req.headers["x-admin-secret"];

    // Ensure ADMIN_SECRET exists in env
    if (!process.env.ADMIN_SECRET) {
      console.error("[admin/users] MISSING process.env.ADMIN_SECRET");
      return res.status(500).json({ ok: false, message: "Server misconfigured: admin secret missing" });
    }

    // Strict compare (no coercion)
    if (!receivedHeader || receivedHeader !== process.env.ADMIN_SECRET) {
      console.warn("[admin/users] Unauthorized attempt, header mismatch");
      return res.status(403).json({ ok: false, message: "Unauthorized: Invalid admin secret" });
    }

    // Validate body
    const { username, phoneNumber } = req.body;
    if (!username || !phoneNumber) {
      return res.status(400).json({ ok: false, message: "username and phoneNumber are required" });
    }

    // Add or update user (imported from services/userService.js)
    const user = await addWhitelistedUser(username, phoneNumber);

    return res.json({ ok: true, message: "User whitelisted successfully", user });
  } catch (err) {
    if (err && err.code === "USERNAME_TAKEN") {
      return res.status(409).json({
        ok: false,
        message: "username already taken",
        existing: {
          _id: err.existingUser?._id,
          username: err.existingUser?.username,
          phoneNumber: err.existingUser?.phoneNumber,
        },
      });
    }
    console.error("admin/users error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});


export default router;
