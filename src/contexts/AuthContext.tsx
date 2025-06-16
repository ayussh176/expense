// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import firebase from "../config/firebase";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  };

  const signup = async (email, password) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
  };

  const logout = async () => {
    return firebase.auth().signOut();
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      console.log("Auth state changed:", user);
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
