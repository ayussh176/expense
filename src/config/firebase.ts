// firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBm8g11RHdGZ6Qe8iGddYjcZc0Yp4aYsDg",
  authDomain: "expense-tracker-89a44.firebaseapp.com",
  projectId: "expense-tracker-89a44",
  storageBucket: "expense-tracker-89a44.firebasestorage.app",
  messagingSenderId: "2178890667",
  appId: "1:2178890667:web:b0730dedac11cf9c0f30ee",
  measurementId: "G-L8Z8ZM6R4H"
};

// ✅ Ensure app is not initialized more than once
const app = getApps().length === 0 ? initializeApp(firebaseConfig, "expense-app") : getApps()[0];

// ✅ Now use named app so [DEFAULT] doesn’t override
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
