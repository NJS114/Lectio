import React from 'react';
import { useAuth } from '../hooks/useAuth';
import HeaderWithAuth from './HeaderWithAuth';

const ConditionalHeader = () => {
  const { isAuthenticated, user } = useAuth();

  // Fonction pour déterminer si un lien doit être visible
  const shouldShowLink = (linkType) => {
    switch (linkType) {
      case 'admin':
        return isAuthenticated && (user?.type === 'admin' || user?.role === 'admin');
      case 'dashboard':
        return isAuthenticated;
      case 'vendre':
        return true; // Toujours visible, mais protégé par ProtectedRoute
      case 'affiliation':
        return isAuthenticated;
      default:
        return true;
    }
  };

  return <HeaderWithAuth shouldShowLink={shouldShowLink} />;
};

export default ConditionalHeader;

