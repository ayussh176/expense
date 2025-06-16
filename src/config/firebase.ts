import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBm8g11RHdGZ6Qe8iGddYjcZc0Yp4aYsDg",
  authDomain: "expense-tracker-89a44.firebaseapp.com",
  projectId: "expense-tracker-89a44",
  storageBucket: "expense-tracker-89a44.appspot.com",
  messagingSenderId: "2178890667",
  appId: "1:2178890667:web:b0730dedac11cf9c0f30ee",
  measurementId: "G-L8Z8ZM6R4H"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
