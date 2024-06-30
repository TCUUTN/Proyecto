import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const rolUsuario = sessionStorage.getItem('SelectedRole');

  if (allowedRoles.includes(rolUsuario)) {
    return children;
  } else {
    return <Navigate to="/AccesoDenegado" />;
  }
};

export default ProtectedRoute;