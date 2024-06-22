// src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (roles && roles.length > 0) {
    const userRole = user?.role?.toLowerCase();
    const hasRequiredRole = roles.some(role => role.toLowerCase() === userRole);
    
    if (!hasRequiredRole) {
      return <Navigate to="/login" state={{ from: location }} />;
    }
  }

  return children;
};

export default ProtectedRoute;
