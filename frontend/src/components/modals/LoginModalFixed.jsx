import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginModalFixed = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, register, loginWithDemo, loginWithGoogle, isLoading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' ou 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    city: '',
    type: 'individual'
  });
  const [errors, setErrors] = useState({});

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setMode('login');
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      city: '',
      type: 'individual'
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (mode === 'register') {
      if (!formData.firstName) {
        newErrors.firstName = 'Le prénom est requis';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Le nom est requis';
      }
      if (!formData.city) {
        newErrors.city = 'La ville est requise';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      handleClose();
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const handleGoogleLogin = () => {
    // Utiliser la fonction loginWithGoogle du hook useAuth
    loginWithGoogle();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
  };

  const fillDemoAccount = async (type) => {
    try {
      let result;
      if (type === 'marie') {
        result = loginWithDemo('user');
      } else if (type === 'mollat') {
        result = loginWithDemo('bookstore');
      } else if (type === 'admin') {
        result = loginWithDemo('admin');
      }
      
      if (result && result.success) {
        handleClose(); // Fermer le modal après connexion réussie
      } else {
        setErrors({ submit: 'Erreur lors de la connexion avec le compte de démonstration' });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="modal-overlay-fixed" onClick={handleClose}>
      <div className="login-modal-fixed" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-fixed">
          <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>
          <button className="close-btn-fixed" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content-fixed">
          {/* Comptes de démonstration */}
          <div className="demo-accounts-fixed">
            <h4>Comptes de démonstration</h4>
            <div className="demo-buttons-fixed">
              <button className="demo-btn-fixed" onClick={() => fillDemoAccount('marie')}>
                <User size={16} />
                Marie (Particulier)
              </button>
              <button className="demo-btn-fixed" onClick={() => fillDemoAccount('mollat')}>
                <User size={16} />
                Mollat (Libraire)
              </button>
              <button className="demo-btn-fixed" onClick={() => fillDemoAccount('admin')}>
                <User size={16} />
                Admin (Administrateur)
              </button>
            </div>
          </div>

          {/* Bouton Google */}
          <div className="google-auth-fixed">
            <button className="google-btn-fixed" onClick={handleGoogleLogin}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>
          </div>

          <div className="divider-fixed">
            <span>ou</span>
          </div>

          <form onSubmit={handleSubmit}>
            {errors.submit && (
              <div className="error-message-fixed">{errors.submit}</div>
            )}

            {mode === 'register' && (
              <>
                <div className="form-row-fixed">
                  <div className="form-group-fixed">
                    <label htmlFor="firstName">Prénom</label>
                    <div className="input-wrapper-fixed">
                      <User className="input-icon-fixed" size={16} />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`form-input-fixed ${errors.firstName ? 'form-input--error-fixed' : ''}`}
                        placeholder="Votre prénom"
                      />
                    </div>
                    {errors.firstName && (
                      <span className="error-message-fixed">{errors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group-fixed">
                    <label htmlFor="lastName">Nom</label>
                    <div className="input-wrapper-fixed">
                      <User className="input-icon-fixed" size={16} />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`form-input-fixed ${errors.lastName ? 'form-input--error-fixed' : ''}`}
                        placeholder="Votre nom"
                      />
                    </div>
                    {errors.lastName && (
                      <span className="error-message-fixed">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="form-group-fixed">
                  <label htmlFor="city">Ville</label>
                  <div className="input-wrapper-fixed">
                    <MapPin className="input-icon-fixed" size={16} />
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`form-input-fixed ${errors.city ? 'form-input--error-fixed' : ''}`}
                      placeholder="Votre ville"
                    />
                  </div>
                  {errors.city && (
                    <span className="error-message-fixed">{errors.city}</span>
                  )}
                </div>

                <div className="form-group-fixed">
                  <label>Type de compte</label>
                  <div className="radio-group-fixed">
                    <label className="radio-option-fixed">
                      <input
                        type="radio"
                        name="type"
                        value="individual"
                        checked={formData.type === 'individual'}
                        onChange={handleInputChange}
                      />
                      <span>Particulier</span>
                    </label>
                    <label className="radio-option-fixed">
                      <input
                        type="radio"
                        name="type"
                        value="bookshop"
                        checked={formData.type === 'bookshop'}
                        onChange={handleInputChange}
                      />
                      <span>Libraire</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="form-group-fixed">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper-fixed">
                <Mail className="input-icon-fixed" size={16} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input-fixed ${errors.email ? 'form-input--error-fixed' : ''}`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <span className="error-message-fixed">{errors.email}</span>
              )}
            </div>

            <div className="form-group-fixed">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-wrapper-fixed">
                <Lock className="input-icon-fixed" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input-fixed ${errors.password ? 'form-input--error-fixed' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle-fixed"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message-fixed">{errors.password}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="btn-primary-fixed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner-fixed"></div>
              ) : (
                mode === 'login' ? 'Se connecter' : 'S\'inscrire'
              )}
            </button>
          </form>

          <div className="modal-footer-fixed">
            <p>
              {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
              <button className="link-btn-fixed" onClick={switchMode}>
                {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .login-modal-fixed {
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          z-index: 10000;
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-header-fixed {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header-fixed h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .close-btn-fixed {
          padding: 8px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn-fixed:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .modal-content-fixed {
          padding: 24px;
        }

        .demo-accounts-fixed {
          margin-bottom: 24px;
        }

        .demo-accounts-fixed h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1f2937;
          text-align: center;
        }

        .demo-buttons-fixed {
          display: flex;
          gap: 8px;
        }

        .demo-btn-fixed {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: 1px solid #10b981;
          background: #ecfdf5;
          color: #047857;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .demo-btn-fixed:hover {
          background: #d1fae5;
          border-color: #059669;
        }

        .google-auth-fixed {
          margin-bottom: 24px;
        }

        .google-btn-fixed {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .google-btn-fixed:hover {
          background: #f9fafb;
          border-color: #9ca3af;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .divider-fixed {
          position: relative;
          text-align: center;
          margin: 24px 0;
        }

        .divider-fixed::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
        }

        .divider-fixed span {
          background: white;
          padding: 0 16px;
          color: #6b7280;
          font-size: 14px;
        }

        .form-row-fixed {
          display: flex;
          gap: 16px;
        }

        .form-group-fixed {
          margin-bottom: 20px;
          flex: 1;
        }

        .form-group-fixed label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .input-wrapper-fixed {
          position: relative;
        }

        .input-icon-fixed {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          z-index: 1;
        }

        .form-input-fixed {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .form-input-fixed:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .form-input--error-fixed {
          border-color: #ef4444;
        }

        .password-toggle-fixed {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .password-toggle-fixed:hover {
          color: #6b7280;
          background: #f3f4f6;
        }

        .radio-group-fixed {
          display: flex;
          gap: 16px;
        }

        .radio-option-fixed {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
        }

        .radio-option-fixed input[type="radio"] {
          margin: 0;
        }

        .btn-primary-fixed {
          width: 100%;
          padding: 12px 16px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .btn-primary-fixed:hover:not(:disabled) {
          background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .btn-primary-fixed:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner-fixed {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message-fixed {
          color: #ef4444;
          font-size: 14px;
          margin-top: 4px;
          display: block;
        }

        .modal-footer-fixed {
          text-align: center;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .modal-footer-fixed p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .link-btn-fixed {
          background: none;
          border: none;
          color: #8b5cf6;
          cursor: pointer;
          font-weight: 500;
          margin-left: 4px;
          text-decoration: underline;
          font-size: 14px;
        }

        .link-btn-fixed:hover {
          color: #7c3aed;
        }

        @media (max-width: 640px) {
          .modal-overlay-fixed {
            padding: 16px;
          }
          
          .login-modal-fixed {
            max-width: 100%;
          }
          
          .modal-header-fixed,
          .modal-content-fixed {
            padding: 20px;
          }
          
          .form-row-fixed {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginModalFixed;

