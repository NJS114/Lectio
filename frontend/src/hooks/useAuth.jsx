import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';

// Configuration API directe
const API_BASE = API_CONFIG.BASE_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authProvider, setAuthProvider] = useState(null); // 'demo', 'google', 'email'

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const provider = localStorage.getItem('authProvider');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setAuthProvider(provider || 'demo');
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('authProvider');
      }
    }

    // Gérer le callback Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    const oauthProvider = urlParams.get('provider');
    const message = urlParams.get('message');

    if (authStatus === 'success' && oauthProvider === 'google') {
      // Récupérer les données utilisateur Google depuis le backend
      fetch('http://localhost:5000/api/auth/google/user', {
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.user) {
          const googleUser = data.user;
          
          // Stocker les informations utilisateur
          setUser(googleUser);
          setIsAuthenticated(true);
          setAuthProvider('google');
          
          localStorage.setItem('user', JSON.stringify(googleUser));
          localStorage.setItem('token', 'google_oauth_token');
          localStorage.setItem('authProvider', 'google');
          
          // Fermer le modal de connexion s'il est ouvert
          setIsLoginModalOpen(false);
          
          console.log('Connexion Google réussie:', googleUser);
        } else {
          console.error('Erreur dans la réponse Google:', data);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération utilisateur Google:', error);
      })
      .finally(() => {
        // Nettoyer l'URL dans tous les cas
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    } else if (authStatus === 'error') {
      console.error('Erreur d\'authentification Google:', message);
      
      // Afficher un message d'erreur à l'utilisateur
      if (message) {
        // Vous pouvez ajouter ici une notification toast ou un message d'erreur
        console.error('Détails de l\'erreur:', message);
      }
      
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const url = `${API_BASE}/api/auth/login`;
      console.log('Tentative de connexion à:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Réponse de connexion:', data);

      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authProvider', 'email');
        
        setUser(data.user);
        setIsAuthenticated(true);
        setAuthProvider('email');
        setIsLoginModalOpen(false);
        
        return { success: true, user: data.user };
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const url = `${API_BASE}/api/auth/register`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authProvider', 'email');
        
        setUser(data.user);
        setIsAuthenticated(true);
        setAuthProvider('email');
        setIsLoginModalOpen(false);
        
        return { success: true, user: data.user };
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Si l'utilisateur est connecté via Google, appeler l'endpoint de déconnexion Google
      if (authProvider === 'google') {
        await fetch('http://localhost:5000/api/auth/google/logout', {
          method: 'POST',
          credentials: 'include'
        }).catch(error => {
          console.error('Erreur lors de la déconnexion Google:', error);
        });
      }
      
      // Nettoyage local dans tous les cas
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('authProvider');
      
      setUser(null);
      setIsAuthenticated(false);
      setAuthProvider(null);
      
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');

      const url = `${API_BASE}/api/auth/profile`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');

      const url = `${API_BASE}/api/auth/change-password`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur de changement de mot de passe:', error);
      return { success: false, error: error.message };
    }
  };

  // Comptes de démonstration
  const demoUsers = [
    {
      id: 1,
      email: 'admin@lectio.fr',
      password: 'demo123',
      display_name: 'Admin',
      role: 'admin',
      avatar: null,
      city: 'Paris',
      is_verified: true
    },
    {
      id: 2,
      email: 'marie@lectio.fr',
      password: 'demo123',
      display_name: 'Marie L.',
      role: 'user',
      avatar: null,
      city: 'Paris',
      is_verified: true
    },
    {
      id: 3,
      email: 'mollat@libraire.fr',
      password: 'demo123',
      display_name: 'Librairie Mollat',
      role: 'bookstore',
      type: 'bookstore',
      avatar: null,
      city: 'Bordeaux',
      is_verified: true
    }
  ];

  const loginWithDemo = (userType) => {
    try {
      const demoUser = demoUsers.find(u => u.role === userType);
      if (demoUser) {
        // Simuler un token
        const fakeToken = `demo_token_${demoUser.id}_${Date.now()}`;
        
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('authProvider', 'demo');
        
        setUser(demoUser);
        setIsAuthenticated(true);
        setAuthProvider('demo');
        setIsLoginModalOpen(false);
        
        console.log('Connexion démo réussie:', demoUser);
        return { success: true, user: demoUser };
      }
      return { success: false, error: 'Utilisateur de démonstration non trouvé' };
    } catch (error) {
      console.error('Erreur lors de la connexion démo:', error);
      return { success: false, error: error.message };
    }
  };

  // Fonction pour initier la connexion Google
  const loginWithGoogle = () => {
    try {
      // Redirection vers le backend pour Google OAuth
      window.location.href = 'http://localhost:5000/api/auth/google/login';
    } catch (error) {
      console.error('Erreur lors de l\'initiation Google OAuth:', error);
    }
  };

  // Fonction pour vérifier le statut de l'authentification Google
  const checkGoogleAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google/status', {
        credentials: 'include'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut Google:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isLoginModalOpen,
    authProvider,
    setIsLoginModalOpen,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loginWithDemo,
    loginWithGoogle,
    checkGoogleAuthStatus,
    demoUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;

