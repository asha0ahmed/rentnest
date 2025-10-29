import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, ownerOnly = false, tenantOnly = false }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (ownerOnly && user?.accountType !== 'owner') {
    return <Navigate to="/" />;
  }

  if (tenantOnly && user?.accountType !== 'tenant') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;