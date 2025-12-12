// server/config/firebase-admin-config.js
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// Because we are in ESM (type: "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to service account JSON
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}

export const adminAuth = admin.auth();
