
import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBm8g11RHdGZ6Qe8iGddYjcZc0Yp4aYsDg",
  authDomain: "expense-tracker-89a44.firebaseapp.com",
  projectId: "expense-tracker-89a44",
  storageBucket: "expense-tracker-89a44.firebasestorage.app",
  messagingSenderId: "2178890667",
  appId: "1:2178890667:web:b0730dedac11cf9c0f30ee",
  measurementId: "G-L8Z8ZM6R4H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const db = getFirestore(app);
export default app;
