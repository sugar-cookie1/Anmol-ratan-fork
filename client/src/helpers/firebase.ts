import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  type Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User,
} from "firebase/auth";

// ---- CONFIG ----
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ---- INIT ----
let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

const auth: Auth = getAuth(app);
auth.useDeviceLanguage();

// Global scoped for convenience
let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

// ---- PUBLIC API ----

/**
 * Initialize reCAPTCHA (visible or invisible)
 */
export const initRecaptcha = (containerId: string): RecaptchaVerifier => {
  // If we already have one, clear it first to avoid "element removed" errors on re-mount
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }

  // Double check element exists
  const element = document.getElementById(containerId);
  if (!element) {
    console.error(`DEBUG: initRecaptcha - element #${containerId} NOT FOUND`);
    throw new Error(`Element #${containerId} not found`);
  }

  recaptchaVerifier = new RecaptchaVerifier(
    auth,
    containerId,
    {
      size: "invisible", // or "normal" if you want the widget visible
      callback: (response: unknown) => {
        console.log("DEBUG: reCAPTCHA solved", response);
      },
      "expired-callback": () => {
        console.warn("DEBUG: reCAPTCHA expired");
        recaptchaVerifier?.clear();
        recaptchaVerifier = null;
      },
    },
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).recaptchaVerifier = recaptchaVerifier;
  return recaptchaVerifier;
};

/**
 * Send OTP to user via Firebase SMS
 */
export const sendOtpToPhone = async (phoneNumber: string): Promise<void> => {
  console.log("DEBUG: sendOtpToPhone called with:", phoneNumber);

  if (!recaptchaVerifier) {
    throw new Error("reCAPTCHA not initialized. Call initRecaptcha() first.");
  }

  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    console.log("DEBUG: SMS sent successfully, conformationResult:", confirmationResult);
  } catch (err) {
    console.error("DEBUG: Failed to send SMS:", err);
    throw err;
  }
};

/**
 * Verify OTP (client-side verification)
 * Returns the Firebase user + JWT
 */
export const verifyOtpCode = async (
  code: string
): Promise<{ user: User; idToken: string }> => {
  if (!confirmationResult) {
    throw new Error("No pending OTP verification. Call sendOtpToPhone() first.");
  }

  const credential = await confirmationResult.confirm(code);
  const user = credential.user;

  const idToken = await user.getIdToken(true);

  confirmationResult = null;

  return { user, idToken };
};

/**
 * Get current user ID token
 */
export const getCurrentUserIdToken = async (
  forceRefresh = false
): Promise<string | null> => {
  if (!auth.currentUser) return null;
  return auth.currentUser.getIdToken(forceRefresh);
};

/**
 * Return currently signed-in Firebase user
 */
export const getCurrentUser = (): User | null => auth.currentUser;

// Export firebase objects if needed elsewhere
export { app, auth };
