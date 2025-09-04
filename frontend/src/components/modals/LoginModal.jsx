import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, register, isLoading } = useAuth();
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
      let result;
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData);
      }

      if (!result.success) {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
  };

  if (!isLoginModalOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={handleClose} />

      {/* Modal */}
      <div className="login-modal">
        <div className="modal-header">
          <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {/* Comptes de démonstration */}
          <div className="demo-accounts">
            <h4>Comptes de démonstration</h4>
            <div className="demo-buttons">
              <button 
                className="demo-btn"
                onClick={() => setFormData({ 
                  ...formData, 
                  email: 'marie@example.com', 
                  password: 'demo123' 
                })}
              >
                <User size={16} />
                Particulier (Marie)
              </button>
              <button 
                className="demo-btn"
                onClick={() => setFormData({ 
                  ...formData, 
                  email: 'mollat@example.com', 
                  password: 'demo123' 
                })}
              >
                <User size={16} />
                Libraire (Mollat)
              </button>
            </div>
          </div>

          <div className="divider">
            <span>ou</span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {errors.general && (
              <div className="error-message error-message--general">
                {errors.general}
              </div>
            )}

            {mode === 'register' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Prénom</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={16} />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
                        placeholder="Votre prénom"
                      />
                    </div>
                    {errors.firstName && (
                      <span className="error-message">{errors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Nom</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={16} />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.lastName ? 'form-input--error' : ''}`}
                        placeholder="Votre nom"
                      />
                    </div>
                    {errors.lastName && (
                      <span className="error-message">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="city">Ville</label>
                  <div className="input-wrapper">
                    <MapPin className="input-icon" size={16} />
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`form-input ${errors.city ? 'form-input--error' : ''}`}
                      placeholder="Votre ville"
                    />
                  </div>
                  {errors.city && (
                    <span className="error-message">{errors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Type de compte</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="type"
                        value="individual"
                        checked={formData.type === 'individual'}
                        onChange={handleInputChange}
                      />
                      <span>Particulier</span>
                    </label>
                    <label className="radio-option">
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

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={16} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn--primary btn--full submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner-small"></div>
              ) : (
                mode === 'login' ? 'Se connecter' : 'S\'inscrire'
              )}
            </button>
          </form>

          <div className="modal-footer">
            <p>
              {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
              <button className="link-btn" onClick={switchMode}>
                {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
              </button>
            </p>
          </div>
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-lg);
          }

          .login-modal {
            background: var(--color-white-off);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            width: 100%;
            max-width: 480px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            z-index: 10000;
          }

          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--color-gray-warm-light);
          }

          .modal-header h2 {
            font-size: 24px;
            font-weight: 600;
            color: var(--color-gray-warm-dark);
          }

          .close-btn {
            padding: var(--spacing-sm);
            background: none;
            border: none;
            color: var(--color-gray-warm-medium);
            cursor: pointer;
            border-radius: var(--radius-sm);
            transition: all var(--transition-fast);
          }

          .close-btn:hover {
            background: var(--color-beige-paper);
            color: var(--color-gray-warm-dark);
          }

          .modal-content {
            padding: var(--spacing-lg);
          }

          .demo-accounts {
            margin-bottom: var(--spacing-lg);
          }

          .demo-accounts h4 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: var(--spacing-md);
            color: var(--color-gray-warm-dark);
            text-align: center;
          }

          .demo-buttons {
            display: flex;
            gap: var(--spacing-sm);
          }

          .demo-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-xs);
            padding: var(--spacing-sm);
            border: 1px solid var(--color-green-primary);
            background: var(--color-green-mint);
            color: var(--color-green-dark);
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-size: 14px;
            transition: all var(--transition-fast);
          }

          .demo-btn:hover {
            background: var(--color-green-primary);
            color: white;
          }

          .divider {
            display: flex;
            align-items: center;
            margin: var(--spacing-lg) 0;
            color: var(--color-gray-warm-medium);
          }

          .divider::before,
          .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--color-gray-warm-light);
          }

          .divider span {
            padding: 0 var(--spacing-md);
            font-size: 14px;
          }

          .login-form {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-md);
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-xs);
          }

          .form-group label {
            font-size: 14px;
            font-weight: 500;
            color: var(--color-gray-warm-dark);
          }

          .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
          }

          .input-icon {
            position: absolute;
            left: 12px;
            color: var(--color-gray-warm-medium);
            z-index: 1;
            pointer-events: none;
          }

          .form-input {
            width: 100%;
            padding: 12px 16px 12px 40px;
            border: 1px solid var(--color-gray-warm-light);
            border-radius: var(--radius-sm);
            font-size: 16px;
            background: white;
            transition: all var(--transition-fast);
            position: relative;
            z-index: 2;
          }

          .form-input:focus {
            outline: none;
            border-color: var(--color-green-primary);
            box-shadow: 0 0 0 3px rgba(168, 213, 186, 0.1);
            z-index: 3;
          }

          .form-input--error {
            border-color: var(--color-error);
          }

          .password-toggle {
            position: absolute;
            right: 12px;
            background: none;
            border: none;
            color: var(--color-gray-warm-medium);
            cursor: pointer;
            padding: var(--spacing-xs);
            border-radius: var(--radius-sm);
            transition: all var(--transition-fast);
          }

          .password-toggle:hover {
            color: var(--color-gray-warm-dark);
          }

          .radio-group {
            display: flex;
            gap: var(--spacing-md);
          }

          .radio-option {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            cursor: pointer;
          }

          .radio-option input {
            margin: 0;
          }

          .error-message {
            color: var(--color-error);
            font-size: 12px;
          }

          .error-message--general {
            padding: var(--spacing-sm);
            background: rgba(232, 168, 124, 0.1);
            border: 1px solid var(--color-error);
            border-radius: var(--radius-sm);
            text-align: center;
          }

          .btn--full {
            width: 100%;
          }

          .submit-btn {
            margin-top: var(--spacing-md);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-sm);
          }

          .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .loading-spinner-small {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .modal-footer {
            text-align: center;
            padding-top: var(--spacing-lg);
            border-top: 1px solid var(--color-gray-warm-light);
            margin-top: var(--spacing-lg);
          }

          .modal-footer p {
            color: var(--color-gray-warm-medium);
            font-size: 14px;
          }

          .link-btn {
            background: none;
            border: none;
            color: var(--color-green-primary);
            cursor: pointer;
            font-weight: 500;
            margin-left: var(--spacing-xs);
            text-decoration: underline;
          }

          .link-btn:hover {
            color: var(--color-green-dark);
          }

          @media (max-width: 480px) {
            .form-row {
              grid-template-columns: 1fr;
            }

            .demo-buttons {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default LoginModal;

