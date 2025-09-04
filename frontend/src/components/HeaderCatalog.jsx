import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HeaderCatalog = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, logout, isAuthenticated, setIsLoginModalOpen } = useAuth();

  const handleUserAction = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="header-catalog">
      <div className="header-content">
        {/* Logo */}
        <div className="logo-section">
          <Link to="/" className="logo">
            LECTIO
          </Link>
        </div>

        {/* Navigation principale */}
        <nav className="main-nav">
          <Link to="/catalogue" className="nav-link active">Catalogue</Link>
          <Link to="/libraires" className="nav-link">Libraires</Link>
          <Link to="/vendre" className="nav-link">Vendre</Link>
          {isAuthenticated && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
        </nav>

        {/* Actions utilisateur */}
        <div className="user-actions">
          <button className="cart-button">
            🛒 <span className="cart-count">0</span>
          </button>
          
          <div className="user-menu-container">
            <button 
              onClick={handleUserAction}
              className="user-button"
              title={isAuthenticated ? user?.name || 'Mon compte' : 'Se connecter'}
            >
              {isAuthenticated ? (
                <span className="user-name">{user?.name || 'Mon compte'}</span>
              ) : (
                <span>Se connecter</span>
              )}
            </button>

            {showUserMenu && isAuthenticated && (
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item">Mon Profil</Link>
                <Link to="/orders" className="dropdown-item">Mes Commandes</Link>
                <Link to="/favorites" className="dropdown-item">Mes Favoris</Link>
                <hr className="dropdown-divider" />
                <button onClick={handleLogout} className="dropdown-item logout">
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .header-catalog {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
        }

        /* Logo */
        .logo-section {
          flex-shrink: 0;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 900;
          color: white;
          text-decoration: none;
          letter-spacing: 2px;
          transition: all 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
          text-shadow: 0 0 20px rgba(255,255,255,0.5);
        }

        /* Navigation principale */
        .main-nav {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .nav-link {
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          padding: 10px 15px;
          border-radius: 25px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          color: white;
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .nav-link.active {
          background: rgba(255,255,255,0.2);
          color: white;
          font-weight: 600;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 3px;
          background: white;
          border-radius: 2px;
        }

        /* Actions utilisateur */
        .user-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .cart-button {
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.2);
          color: white;
          padding: 10px 15px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cart-button:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .cart-count {
          background: #e74c3c;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
        }

        /* Menu utilisateur */
        .user-menu-container {
          position: relative;
        }

        .user-button {
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.2);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .user-button:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .user-name {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 10px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          min-width: 200px;
          overflow: hidden;
          z-index: 1000;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: 15px 20px;
          color: #2c3e50;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: #f8f9fa;
          color: #667eea;
        }

        .dropdown-item.logout {
          color: #e74c3c;
        }

        .dropdown-item.logout:hover {
          background: #fee;
          color: #c0392b;
        }

        .dropdown-divider {
          border: none;
          height: 1px;
          background: #ecf0f1;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-content {
            padding: 10px 15px;
          }

          .main-nav {
            gap: 15px;
          }

          .nav-link {
            font-size: 0.9rem;
            padding: 8px 12px;
          }

          .logo {
            font-size: 1.5rem;
          }

          .user-actions {
            gap: 10px;
          }

          .cart-button, .user-button {
            padding: 8px 15px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .main-nav {
            display: none;
          }

          .user-name {
            max-width: 80px;
          }
        }
      `}</style>
    </header>
  );
};

export default HeaderCatalog;

