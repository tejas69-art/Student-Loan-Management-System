import React from 'react';
import { Route, Navigate,Routes } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, ...props }) => {
  return isAuthenticated ? <Routes><Route {...props} /></Routes> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
