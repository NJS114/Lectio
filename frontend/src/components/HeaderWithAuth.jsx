import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';

const HeaderWithAuth = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, logout, isAuthenticated, setIsLoginModalOpen } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleUserAction = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      // Ouvrir modal de connexion
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          {/* Logo */}
          <div className="header__logo">
            <Link to="/" className="logo">
              <div className="logo__icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path 
                    d="M8 6h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none"
                  />
                  <path 
                    d="M12 10v12M20 10v12M16 6v20" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  />
                  <circle 
                    cx="16" 
                    cy="16" 
                    r="12" 
                    stroke="var(--color-green-primary)" 
                    strokeWidth="1" 
                    fill="none" 
                    strokeDasharray="2 2"
                  />
                </svg>
              </div>
              <span className="logo__text">LECTIO</span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="header__nav header__nav--desktop">
            <Link to="/catalogue" className="nav-link">Catalogue</Link>
            <Link to="/ebooks" className="nav-link">Ebooks</Link>
            <Link to="/libraires" className="nav-link">Libraires</Link>
            <Link to="/tracking" className="nav-link">Suivi</Link>
            <Link to="/support" className="nav-link">Support</Link>
            <Link to="/vendre" className="nav-link">Vendre</Link>
            {isAuthenticated && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
            {isAuthenticated && user && (user.type === 'admin' || user.role === 'admin') && (
              <>
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
                <Link to="/invoices" className="nav-link admin-link">Factures</Link>
                <Link to="/communication" className="nav-link admin-link">Communication</Link>
              </>
            )}
          </nav>

          {/* Barre de recherche */}
          <div className="header__search">
            <form onSubmit={handleSearch} className="search-bar">
              <Search className="search-bar__icon" size={20} />
              <input
                type="text"
                placeholder="Titre, auteur, ISBN..."
                className="search-bar__input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Actions utilisateur */}
          <div className="header__actions">
            <button className="action-btn" title="Panier">
              <ShoppingCart size={20} />
              <span className="action-btn__badge">0</span>
            </button>
            
            <div className="user-menu-container">
              <button 
                className="action-btn" 
                title={isAuthenticated ? "Mon compte" : "Se connecter"}
                onClick={handleUserAction}
              >
                {user && user.avatar ? (
                  <img src={user.avatar} alt={user.display_name} className="user-avatar" />
                ) : (
                  <User size={20} />
                )}
              </button>

              {/* Menu utilisateur */}
              {showUserMenu && isAuthenticated && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-name">{user.display_name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profil" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <User size={16} />
                    Mon Profil
                  </Link>
                  <Link to="/mes-commandes" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <ShoppingCart size={16} />
                    Mes Commandes
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item dropdown-item--danger" onClick={handleLogout}>
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
            
            {/* Menu mobile toggle */}
            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Navigation Mobile */}
        {isMenuOpen && (
          <nav className="header__nav header__nav--mobile">
            <Link to="/catalogue" className="nav-link" onClick={() => setIsMenuOpen(false)}>Catalogue</Link>
            <Link to="/ebooks" className="nav-link" onClick={() => setIsMenuOpen(false)}>Ebooks</Link>
            <Link to="/libraires" className="nav-link" onClick={() => setIsMenuOpen(false)}>Libraires</Link>
            <Link to="/vendre" className="nav-link" onClick={() => setIsMenuOpen(false)}>Vendre</Link>
            <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <Link to="/admin" className="nav-link admin-link" onClick={() => setIsMenuOpen(false)}>Admin</Link>
            <div className="nav-divider"></div>
            {isAuthenticated ? (
              <>
                <Link to="/profil" className="nav-link" onClick={() => setIsMenuOpen(false)}>Mon Compte</Link>
                <Link to="/mes-commandes" className="nav-link" onClick={() => setIsMenuOpen(false)}>Mes Commandes</Link>
                <button className="nav-link nav-link--button" onClick={handleLogout}>Déconnexion</button>
              </>
            ) : (
              <button 
                className="nav-link nav-link--button" 
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                Se connecter
              </button>
            )}
          </nav>
        )}
      </div>

      <style jsx>{`
        .header {
          background-color: var(--color-white-off);
          border-bottom: 1px solid var(--color-gray-warm-light);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md) 0;
          gap: var(--spacing-lg);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          text-decoration: none;
          color: var(--color-gray-warm-dark);
        }

        .logo__icon {
          color: var(--color-green-primary);
        }

        .logo__text {
          font-family: var(--font-editorial);
          font-size: 24px;
          font-weight: 600;
          color: var(--color-gray-warm-dark);
        }

        .header__nav--desktop {
          display: none;
        }

        @media (min-width: 768px) {
          .header__nav--desktop {
            display: flex;
            gap: var(--spacing-lg);
          }
        }

        .nav-link {
          color: var(--color-gray-warm-dark);
          text-decoration: none;
          font-weight: 500;
          transition: color var(--transition-fast);
          padding: var(--spacing-xs) 0;
        }

        .nav-link:hover {
          color: var(--color-green-primary);
        }

        .nav-link--button {
          background: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          cursor: pointer;
          text-align: left;
          width: 100%;
        }

        .header__search {
          flex: 1;
          max-width: 500px;
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-bar__icon {
          position: absolute;
          left: 12px;
          color: var(--color-gray-warm-medium);
          z-index: 1;
        }

        .search-bar__input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          font-size: 16px;
          background-color: white;
          transition: all var(--transition-fast);
        }

        .search-bar__input:focus {
          outline: none;
          border-color: var(--color-green-primary);
          box-shadow: 0 0 0 3px rgba(168, 213, 186, 0.1);
        }

        .header__actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .action-btn {
          position: relative;
          padding: 8px;
          background: none;
          border: none;
          color: var(--color-gray-warm-dark);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .action-btn:hover {
          background-color: var(--color-beige-paper);
          color: var(--color-green-primary);
        }

        .action-btn__badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: var(--color-green-primary);
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .user-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-menu-container {
          position: relative;
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          min-width: 200px;
          z-index: 1000;
          margin-top: var(--spacing-xs);
        }

        .user-info {
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .user-name {
          font-weight: 600;
          color: var(--color-gray-warm-dark);
        }

        .user-email {
          font-size: 14px;
          color: var(--color-gray-warm-medium);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          background: none;
          border: none;
          color: var(--color-gray-warm-dark);
          text-decoration: none;
          font-size: 14px;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .dropdown-item:hover {
          background-color: var(--color-beige-paper);
        }

        .dropdown-item--danger {
          color: var(--color-error);
        }

        .dropdown-item--danger:hover {
          background-color: rgba(232, 168, 124, 0.1);
        }

        .dropdown-divider {
          height: 1px;
          background-color: var(--color-gray-warm-light);
          margin: var(--spacing-xs) 0;
        }

        .menu-toggle {
          display: block;
          padding: 8px;
          background: none;
          border: none;
          color: var(--color-gray-warm-dark);
          cursor: pointer;
          border-radius: var(--radius-sm);
        }

        @media (min-width: 768px) {
          .menu-toggle {
            display: none;
          }
        }

        .header__nav--mobile {
          display: flex;
          flex-direction: column;
          padding: var(--spacing-md) 0;
          border-top: 1px solid var(--color-gray-warm-light);
          gap: var(--spacing-sm);
        }

        @media (min-width: 768px) {
          .header__nav--mobile {
            display: none;
          }
        }

        .nav-divider {
          height: 1px;
          background-color: var(--color-gray-warm-light);
          margin: var(--spacing-sm) 0;
        }

        .admin-link {
          background: linear-gradient(135deg, var(--color-purple-primary), var(--color-purple-dark)) !important;
          color: var(--color-white) !important;
          border-radius: var(--radius-sm);
          font-weight: 600;
          padding: var(--spacing-sm) var(--spacing-md) !important;
        }

        .admin-link:hover {
          background: linear-gradient(135deg, var(--color-purple-dark), var(--color-purple-primary)) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        @media (max-width: 767px) {
          .header__search {
            order: 3;
            width: 100%;
            margin-top: var(--spacing-md);
          }

          .header__content {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </header>
  );
};

export default HeaderWithAuth;

