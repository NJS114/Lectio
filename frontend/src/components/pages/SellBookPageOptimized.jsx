import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Upload, MapPin, Book, DollarSign, Calendar, TrendingUp, Search, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';
import PriceComparatorModalWithAPI from '../modals/PriceComparatorModalWithAPI';

const SellBookPageOptimized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { requireAuth } = useAuth();
  const { addBook } = useBooks();

  // État initial du formulaire
  const initialFormData = useMemo(() => ({
    title: '',
    author: '',
    isbn: '',
    price: '',
    rentalPrice: '',
    condition: 'good',
    category: '',
    description: '',
    publishedYear: '',
    publisher: '',
    pages: '',
    language: 'Français',
    availableForSale: true,
    availableForRental: false,
    images: []
  }), []);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPriceComparator, setShowPriceComparator] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isComparingPrices, setIsComparingPrices] = useState(false);

  // Réinitialiser le formulaire lors de la navigation
  useEffect(() => {
    // Réinitialiser seulement si on vient du dashboard ou d'une autre page
    if (location.state?.resetForm || location.key !== location.key) {
      setFormData(initialFormData);
      setErrors({});
      setSubmitStatus(null);
      setSubmitMessage('');
    }
  }, [location, initialFormData]);

  const categories = useMemo(() => [
    'Roman', 'Essai', 'Science-Fiction', 'Fantasy', 'Thriller', 'Policier',
    'Biographie', 'Histoire', 'Sciences', 'Philosophie', 'Art', 'Cuisine',
    'Voyage', 'Jeunesse', 'Bande Dessinée', 'Manga', 'Poésie', 'Théâtre'
  ], []);

  const conditions = useMemo(() => [
    { value: 'new', label: 'Neuf', description: 'Livre neuf, jamais ouvert' },
    { value: 'very_good', label: 'Très bon', description: 'Très bon état, traces mineures' },
    { value: 'good', label: 'Bon', description: 'Bon état général' },
    { value: 'fair', label: 'Correct', description: 'État correct, traces visibles' }
  ], []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Effacer les messages de statut si l'utilisateur modifie le formulaire
    if (submitStatus) {
      setSubmitStatus(null);
      setSubmitMessage('');
    }
  }, [errors, submitStatus]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.author.trim()) newErrors.author = 'L\'auteur est requis';
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    
    if (formData.availableForSale && (!formData.price || parseFloat(formData.price) <= 0)) {
      newErrors.price = 'Le prix de vente doit être supérieur à 0';
    }
    
    if (formData.availableForRental && (!formData.rentalPrice || parseFloat(formData.rentalPrice) <= 0)) {
      newErrors.rentalPrice = 'Le prix de location doit être supérieur à 0';
    }

    if (formData.publishedYear && (isNaN(formData.publishedYear) || formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear())) {
      newErrors.publishedYear = 'Année de publication invalide';
    }

    if (formData.pages && (isNaN(formData.pages) || formData.pages <= 0)) {
      newErrors.pages = 'Le nombre de pages doit être un nombre positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      setSubmitMessage('Veuillez corriger les erreurs dans le formulaire');
      // Scroll vers le haut pour voir le message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');
    
    try {
      const result = await addBook(formData);
      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage('Votre livre a été publié avec succès !');
        
        // Réinitialiser le formulaire après succès
        setTimeout(() => {
          setFormData(initialFormData);
          setErrors({});
          navigate('/dashboard', { state: { bookAdded: true } });
        }, 2000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'Une erreur est survenue lors de la publication');
        setErrors({ general: result.error });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Une erreur réseau est survenue. Veuillez réessayer.');
      setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, addBook, navigate, initialFormData]);

  const handlePriceComparison = useCallback(async () => {
    if (!formData.title.trim() || !formData.author.trim()) {
      setErrors({ 
        title: !formData.title.trim() ? 'Le titre est requis pour la comparaison' : '',
        author: !formData.author.trim() ? 'L\'auteur est requis pour la comparaison' : ''
      });
      return;
    }

    setIsComparingPrices(true);
    
    // Simuler un délai pour montrer l'indicateur de chargement
    setTimeout(() => {
      setShowPriceComparator(true);
      setIsComparingPrices(false);
    }, 500);
  }, [formData.title, formData.author]);

  const bookForComparison = useMemo(() => ({
    title: formData.title,
    author: formData.author,
    price: parseFloat(formData.price) || 0,
    condition: formData.condition,
    isbn: formData.isbn
  }), [formData.title, formData.author, formData.price, formData.condition, formData.isbn]);

  const dismissMessage = useCallback(() => {
    setSubmitStatus(null);
    setSubmitMessage('');
  }, []);

  const handleCancel = useCallback(() => {
    if (Object.values(formData).some(value => value !== '' && value !== false && value !== 'good' && value !== 'Français' && value !== true && value.length !== 0)) {
      if (window.confirm('Êtes-vous sûr de vouloir annuler ? Toutes les données saisies seront perdues.')) {
        setFormData(initialFormData);
        setErrors({});
        setSubmitStatus(null);
        setSubmitMessage('');
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  }, [formData, navigate, initialFormData]);

  return (
    <div className="sell-book-page">
      <div className="container">
        <div className="page-header">
          <h1>Vendre un livre</h1>
          <p>Donnez une seconde vie à vos livres et gagnez de l'argent</p>
        </div>

        {/* Messages de feedback globaux */}
        {submitStatus && (
          <div className={`feedback-message ${submitStatus}`}>
            <div className="message-content">
              {submitStatus === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span>{submitMessage}</span>
            </div>
            <button onClick={dismissMessage} className="dismiss-btn" type="button">
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="sell-form">
          {/* Informations du livre */}
          <div className="form-section">
            <h2><Book size={20} /> Informations du livre</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Titre *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Titre du livre"
                  className={errors.title ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="author">Auteur *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Nom de l'auteur"
                  className={errors.author ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.author && <span className="error-message">{errors.author}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  placeholder="978-2-123456-78-9"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Catégorie *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={errors.category ? 'error' : ''}
                  disabled={isSubmitting}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="publishedYear">Année de publication</label>
                <input
                  type="number"
                  id="publishedYear"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleInputChange}
                  placeholder="2023"
                  min="1000"
                  max={new Date().getFullYear()}
                  className={errors.publishedYear ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.publishedYear && <span className="error-message">{errors.publishedYear}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="publisher">Éditeur</label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  placeholder="Nom de l'éditeur"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez le livre, son état, son contenu..."
                rows="4"
                className={errors.description ? 'error' : ''}
                maxLength="500"
                disabled={isSubmitting}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
              <div className="char-count">
                {formData.description.length}/500 caractères
              </div>
            </div>
          </div>

          {/* État du livre */}
          <div className="form-section">
            <h2>État du livre</h2>
            <div className="condition-options">
              {conditions.map(condition => (
                <label key={condition.value} className="condition-option">
                  <input
                    type="radio"
                    name="condition"
                    value={condition.value}
                    checked={formData.condition === condition.value}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <div className="condition-card">
                    <h3>{condition.label}</h3>
                    <p>{condition.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Disponibilité et prix */}
          <div className="form-section">
            <h2><DollarSign size={20} /> Disponibilité et prix</h2>
            
            <div className="availability-options">
              <label className="availability-option">
                <input
                  type="checkbox"
                  name="availableForSale"
                  checked={formData.availableForSale}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <span>Vente</span>
              </label>
              
              <label className="availability-option">
                <input
                  type="checkbox"
                  name="availableForRental"
                  checked={formData.availableForRental}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <span>Location</span>
              </label>
            </div>

            {formData.availableForSale && (
              <div className="price-section">
                <div className="form-group">
                  <label htmlFor="price">Prix de vente (€) *</label>
                  <div className="price-input-group">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={errors.price ? 'error' : ''}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={handlePriceComparison}
                      className="compare-price-btn"
                      disabled={isComparingPrices || isSubmitting}
                    >
                      {isComparingPrices ? (
                        <>
                          <Loader2 size={16} className="spinning" />
                          Analyse...
                        </>
                      ) : (
                        <>
                          <TrendingUp size={16} />
                          Comparer les prix
                        </>
                      )}
                    </button>
                  </div>
                  {errors.price && <span className="error-message">{errors.price}</span>}
                  <div className="price-hint">
                    💡 Utilisez notre comparateur de prix pour optimiser vos revenus
                  </div>
                </div>
              </div>
            )}

            {formData.availableForRental && (
              <div className="form-group">
                <label htmlFor="rentalPrice">Prix de location par jour (€) *</label>
                <input
                  type="number"
                  id="rentalPrice"
                  name="rentalPrice"
                  value={formData.rentalPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={errors.rentalPrice ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.rentalPrice && <span className="error-message">{errors.rentalPrice}</span>}
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="form-section">
            <h2><Camera size={20} /> Photos</h2>
            <div className="photo-upload">
              <div className="upload-area">
                <Upload size={48} />
                <h3>Ajoutez des photos de votre livre</h3>
                <p>Glissez-déposez vos images ou cliquez pour parcourir</p>
                <button type="button" className="upload-btn" disabled={isSubmitting}>
                  Choisir des fichiers
                </button>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn--secondary"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spinning" />
                  Publication en cours...
                </>
              ) : (
                <>
                  <Book size={16} />
                  Publier mon livre
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de comparaison de prix */}
      <PriceComparatorModalWithAPI
        isOpen={showPriceComparator}
        onClose={() => setShowPriceComparator(false)}
        book={bookForComparison}
      />

      <style jsx>{`
        .sell-book-page {
          min-height: 100vh;
          background: var(--color-gray-light);
          padding: var(--spacing-lg) 0;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }

        .page-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .page-header h1 {
          font-size: 32px;
          font-weight: 600;
          color: var(--color-gray-dark);
          margin-bottom: var(--spacing-sm);
        }

        .page-header p {
          color: var(--color-gray-text);
          font-size: 18px;
        }

        .feedback-message {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-lg);
          animation: slideIn 0.3s ease-out;
        }

        .feedback-message.success {
          background: var(--color-green-mint);
          border: 1px solid var(--color-green-light);
          color: var(--color-green-dark);
        }

        .feedback-message.error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
        }

        .message-content {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .dismiss-btn {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: var(--radius-sm);
          transition: background-color var(--transition-fast);
        }

        .dismiss-btn:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.1);
        }

        .sell-form {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-2xl);
          box-shadow: var(--shadow-sm);
        }

        .form-section {
          margin-bottom: var(--spacing-2xl);
        }

        .form-section h2 {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 20px;
          font-weight: 600;
          color: var(--color-gray-dark);
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-sm);
          border-bottom: 2px solid var(--color-gray-light);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          color: var(--color-gray-dark);
          margin-bottom: var(--spacing-xs);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: var(--spacing-sm);
          border: 1px solid var(--color-gray-medium);
          border-radius: var(--radius-sm);
          font-size: 16px;
          transition: border-color var(--transition-fast);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-green-light);
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .form-group input:disabled,
        .form-group select:disabled,
        .form-group textarea:disabled {
          background-color: var(--color-gray-light);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .error-message {
          color: #dc2626;
          font-size: 14px;
          margin-top: var(--spacing-xs);
        }

        .char-count {
          font-size: 12px;
          color: var(--color-gray-text);
          text-align: right;
          margin-top: var(--spacing-xs);
        }

        .condition-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
        }

        .condition-option {
          cursor: pointer;
        }

        .condition-option input {
          display: none;
        }

        .condition-card {
          padding: var(--spacing-md);
          border: 2px solid var(--color-gray-medium);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .condition-option input:checked + .condition-card {
          border-color: var(--color-green-light);
          background: var(--color-green-mint);
        }

        .condition-card h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
        }

        .condition-card p {
          font-size: 14px;
          color: var(--color-gray-text);
        }

        .availability-options {
          display: flex;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .availability-option {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
          padding: var(--spacing-sm) var(--spacing-md);
          border: 2px solid var(--color-gray-medium);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .availability-option:has(input:checked) {
          border-color: var(--color-green-light);
          background: var(--color-green-mint);
        }

        .price-input-group {
          display: flex;
          gap: var(--spacing-sm);
        }

        .price-input-group input {
          flex: 1;
        }

        .compare-price-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--color-purple-light);
          color: var(--color-white);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 14px;
          transition: background-color var(--transition-fast);
          white-space: nowrap;
        }

        .compare-price-btn:hover:not(:disabled) {
          background: var(--color-purple-dark);
        }

        .compare-price-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .price-hint {
          font-size: 12px;
          color: var(--color-gray-text);
          margin-top: var(--spacing-xs);
        }

        .upload-area {
          border: 2px dashed var(--color-gray-medium);
          border-radius: var(--radius-md);
          padding: var(--spacing-2xl);
          text-align: center;
          transition: border-color var(--transition-fast);
        }

        .upload-area:hover {
          border-color: var(--color-green-light);
        }

        .upload-btn {
          margin-top: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-lg);
          background: var(--color-green-light);
          color: var(--color-white);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .upload-btn:hover:not(:disabled) {
          background: var(--color-green-dark);
        }

        .upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          gap: var(--spacing-md);
          margin-top: var(--spacing-2xl);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-gray-light);
        }

        .btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--radius-md);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
        }

        .btn--secondary {
          background: var(--color-gray-light);
          color: var(--color-gray-dark);
        }

        .btn--secondary:hover:not(:disabled) {
          background: var(--color-gray-medium);
        }

        .btn--primary {
          background: var(--color-green-light);
          color: var(--color-white);
        }

        .btn--primary:hover:not(:disabled) {
          background: var(--color-green-dark);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .condition-options {
            grid-template-columns: 1fr;
          }

          .availability-options {
            flex-direction: column;
          }

          .price-input-group {
            flex-direction: column;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default SellBookPageOptimized;

