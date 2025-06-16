import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">🔄 Checking authentication...</div>;
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
