import firebase from "./firebase"; // your firebase.js (not modular)

export const initAuthPersistence = async () => {
  try {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    console.log("✅ Firebase auth persistence set to LOCAL.");
  } catch (err) {
    console.error("❌ Failed to set persistence:", err);
  }
};
