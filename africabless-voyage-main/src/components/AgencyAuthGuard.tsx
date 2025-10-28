import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AgencyAuthGuardProps {
  children?: React.ReactNode;
}

const AgencyAuthGuard: React.FC<AgencyAuthGuardProps> = ({ children }) => {
  const { isLoggedIn, user } = useAuth();

  // Vérifier si l'utilisateur est connecté et a le rôle 'agency'
  const isAgency = isLoggedIn && user && user.role === 'agency';

  if (!isAgency) {
    // Si ce n'est pas une agence, rediriger vers la page de connexion des agences
    return <Navigate to="/agency/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AgencyAuthGuard;