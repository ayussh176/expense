// src/config/initFirebase.ts
import { auth } from "./firebase";
import { browserLocalPersistence, setPersistence } from "firebase/auth";

// This ensures persistence is set BEFORE anything else runs
export const initAuthPersistence = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log("✅ Firebase auth persistence set to localStorage.");
  } catch (err) {
    console.error("❌ Failed to set Firebase persistence:", err);
  }
};
