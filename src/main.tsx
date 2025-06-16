import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initAuthPersistence } from './config/initFirebase';
import firebase from './config/firebase';

// ✅ Wait for Firebase auth to resolve before rendering (React 18+ safe)
firebase.auth().onAuthStateChanged(async (user) => {
  console.log("✅ Firebase restored user:", user);

  await initAuthPersistence();

  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});
