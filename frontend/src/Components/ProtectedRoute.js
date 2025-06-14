import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, role, roles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  
  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  // If roles array is provided, check if user's role is in the array
  if (roles && Array.isArray(roles)) {
    if (!roles.includes(user.role)) {
      return <Navigate to="/auth" replace />;
    }
  }
  // If single role is provided, check if user has that role
  else if (role && user.role !== role) {
    return <Navigate to="/auth" replace />;
  }

  // Admin users bypass profile completion check
  if (user.role === 'admin') {
    return children;
  }

  // If profile is not completed and not already on the dashboard page, redirect to the appropriate dashboard
  if (!user.profileCompleted) {
    if (user.role === 'alumni' && location.pathname !== '/adash') {
      console.log('ProtectedRoute: Alumni with incomplete profile, redirecting to /adash');
      return <Navigate to="/adash" replace />;
    } else if (user.role === 'student' && location.pathname !== '/sdash') {
      console.log('ProtectedRoute: Student with incomplete profile, redirecting to /sdash');
      return <Navigate to="/sdash" replace />;
    }
  }

  // If profile is completed and trying to access dashboard pages, redirect to home
  if (user.profileCompleted) {
    if ((user.role === 'alumni' && location.pathname === '/adash') ||
        (user.role === 'student' && location.pathname === '/sdash')) {
      console.log('ProtectedRoute: Profile completed, redirecting to /dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 