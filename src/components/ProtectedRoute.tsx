// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // 👇 Optional: Replace this with a proper spinner component
    return <div className="text-center mt-10 text-gray-500">Checking authentication...</div>;
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
