import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, requireBookstore = false, redirectToLogin = true }) => {
  const { isAuthenticated, user, setIsLoginModalOpen } = useAuth();

  // Si l'authentification est requise mais l'utilisateur n'est pas connecté
  if (requireAuth && !isAuthenticated) {
    if (redirectToLogin) {
      // Ouvrir la modal de connexion
      setIsLoginModalOpen(true);
    }
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb',
          maxWidth: '400px'
        }}>
          <div style={{ 
            background: '#fef3c7', 
            color: '#92400e', 
            padding: '0.75rem', 
            borderRadius: '6px', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Connexion requise
          </div>
          <h3 style={{ margin: '0 0 1rem 0' }}>Accès restreint</h3>
          <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
            Vous devez être connecté pour accéder à cette page.
          </p>
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            style={{ 
              background: '#8b5cf6', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Si les droits admin sont requis mais l'utilisateur n'est pas admin
  if (requireAdmin && (!user || (user.type !== 'admin' && user.role !== 'admin'))) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb',
          maxWidth: '400px'
        }}>
          <div style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '0.75rem', 
            borderRadius: '6px', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            </svg>
            Accès refusé
          </div>
          <h3 style={{ margin: '0 0 1rem 0' }}>Droits administrateur requis</h3>
          <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <button 
            onClick={() => window.history.back()}
            style={{ 
              background: '#6b7280', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Si les droits libraire sont requis mais l'utilisateur n'est pas libraire
  if (requireBookstore && (!user || (user.type !== 'bookstore' && user.role !== 'bookstore'))) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          border: '1px solid #e5e7eb',
          maxWidth: '400px'
        }}>
          <div style={{ 
            background: '#dbeafe', 
            color: '#1d4ed8', 
            padding: '0.75rem', 
            borderRadius: '6px', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
            </svg>
            Accès Libraire Requis
          </div>
          <h3 style={{ margin: '0 0 1rem 0' }}>Compte Libraire Professionnel</h3>
          <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>
            Cette page est réservée aux libraires partenaires de Lectio.
          </p>
          <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
            Contactez-nous pour obtenir un accès professionnel.
          </p>
          <button 
            onClick={() => window.history.back()}
            style={{ 
              background: '#1d4ed8', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Si toutes les conditions sont remplies, afficher le contenu
  return children;
};

export default ProtectedRoute;

