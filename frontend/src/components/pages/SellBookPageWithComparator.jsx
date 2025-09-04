import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, MapPin, Book, DollarSign, Calendar, TrendingUp, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';
import PriceComparatorModalWithAPI from '../modals/PriceComparatorModalWithAPI';

const SellBookPageWithComparator = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { addBook } = useBooks();

  const [formData, setFormData] = useState({
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
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPriceComparator, setShowPriceComparator] = useState(false);

  const categories = [
    'Roman', 'Essai', 'Science-Fiction', 'Fantasy', 'Thriller', 'Policier',
    'Biographie', 'Histoire', 'Sciences', 'Philosophie', 'Art', 'Cuisine',
    'Voyage', 'Jeunesse', 'Bande Dessinée', 'Manga', 'Poésie', 'Théâtre'
  ];

  const conditions = [
    { value: 'new', label: 'Neuf', description: 'Livre neuf, jamais ouvert' },
    { value: 'very_good', label: 'Très bon', description: 'Très bon état, traces mineures' },
    { value: 'good', label: 'Bon', description: 'Bon état général' },
    { value: 'fair', label: 'Correct', description: 'État correct, traces visibles' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = 'Le titre est requis';
    if (!formData.author) newErrors.author = 'L\'auteur est requis';
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (!formData.description) newErrors.description = 'La description est requise';
    
    if (formData.availableForSale && !formData.price) {
      newErrors.price = 'Le prix de vente est requis';
    }
    
    if (formData.availableForRental && !formData.rentalPrice) {
      newErrors.rentalPrice = 'Le prix de location est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const result = await addBook(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePriceComparison = () => {
    if (formData.title && formData.author) {
      setShowPriceComparator(true);
    } else {
      setErrors({ 
        title: !formData.title ? 'Le titre est requis pour la comparaison' : '',
        author: !formData.author ? 'L\'auteur est requis pour la comparaison' : ''
      });
    }
  };

  const bookForComparison = {
    title: formData.title,
    author: formData.author,
    price: parseFloat(formData.price) || 0,
    condition: formData.condition,
    isbn: formData.isbn
  };

  return (
    <div className="sell-book-page">
      <div className="container">
        <div className="page-header">
          <h1>Vendre un livre</h1>
          <p>Donnez une seconde vie à vos livres et gagnez de l'argent</p>
        </div>

        <form onSubmit={handleSubmit} className="sell-form">
          {errors.general && (
            <div className="error-message error-message--general">
              {errors.general}
            </div>
          )}

          {/* Informations du livre */}
          <div className="form-section">
            <h2>
              <Book size={20} />
              Informations du livre
            </h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Titre *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-input ${errors.title ? 'form-input--error' : ''}`}
                  placeholder="Titre du livre"
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
                  className={`form-input ${errors.author ? 'form-input--error' : ''}`}
                  placeholder="Nom de l'auteur"
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
                  className="form-input"
                  placeholder="978-2-123456-78-9"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Catégorie *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`form-input ${errors.category ? 'form-input--error' : ''}`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
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
                  className="form-input"
                  placeholder="2023"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="form-group">
                <label htmlFor="publisher">Éditeur</label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nom de l'éditeur"
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
                className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
                placeholder="Décrivez le livre, son état, son contenu..."
                rows={4}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
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
                  />
                  <div className="condition-content">
                    <span className="condition-label">{condition.label}</span>
                    <span className="condition-description">{condition.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Disponibilité et prix */}
          <div className="form-section">
            <h2>
              <DollarSign size={20} />
              Disponibilité et prix
            </h2>

            <div className="availability-options">
              <label className="availability-option">
                <input
                  type="checkbox"
                  name="availableForSale"
                  checked={formData.availableForSale}
                  onChange={handleInputChange}
                />
                <span>Vente</span>
              </label>

              <label className="availability-option">
                <input
                  type="checkbox"
                  name="availableForRental"
                  checked={formData.availableForRental}
                  onChange={handleInputChange}
                />
                <span>Location</span>
              </label>
            </div>

            {formData.availableForSale && (
              <div className="price-section">
                <div className="price-input-group">
                  <div className="form-group">
                    <label htmlFor="price">Prix de vente (€) *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`form-input ${errors.price ? 'form-input--error' : ''}`}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                    {errors.price && <span className="error-message">{errors.price}</span>}
                  </div>
                  
                  <button
                    type="button"
                    className="btn btn--secondary price-compare-btn"
                    onClick={handlePriceComparison}
                    disabled={!formData.title || !formData.author}
                  >
                    <TrendingUp size={16} />
                    Comparer les prix
                  </button>
                </div>
                
                <p className="price-help">
                  💡 Utilisez notre comparateur de prix pour optimiser vos revenus
                </p>
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
                  className={`form-input ${errors.rentalPrice ? 'form-input--error' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.rentalPrice && <span className="error-message">{errors.rentalPrice}</span>}
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="form-section">
            <h2>
              <Camera size={20} />
              Photos
            </h2>
            <div className="photo-upload">
              <div className="upload-area">
                <Upload size={48} />
                <h3>Ajoutez des photos de votre livre</h3>
                <p>Glissez-déposez vos images ou cliquez pour parcourir</p>
                <button type="button" className="btn btn--secondary">
                  Choisir des fichiers
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn--quiet"
              onClick={() => navigate(-1)}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publication...' : 'Publier mon livre'}
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
          background: var(--color-white-off);
          padding: var(--spacing-2xl) 0;
        }

        .page-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .page-header h1 {
          font-size: 36px;
          font-weight: 600;
          color: var(--color-gray-warm-dark);
          margin-bottom: var(--spacing-sm);
        }

        .page-header p {
          font-size: 18px;
          color: var(--color-gray-warm-medium);
        }

        .sell-form {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .form-section {
          padding: var(--spacing-2xl);
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .form-section h2 {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 20px;
          font-weight: 600;
          color: var(--color-gray-warm-dark);
          margin-bottom: var(--spacing-lg);
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
          gap: var(--spacing-xs);
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-gray-warm-dark);
        }

        .form-input,
        .form-textarea {
          padding: 12px 16px;
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-sm);
          font-size: 16px;
          background: white;
          transition: all var(--transition-fast);
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--color-green-primary);
          box-shadow: 0 0 0 3px rgba(168, 213, 186, 0.1);
        }

        .form-input--error {
          border-color: var(--color-error);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .condition-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
        }

        .condition-option {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .condition-option:hover {
          border-color: var(--color-green-primary);
          background: var(--color-green-mint);
        }

        .condition-option input:checked + .condition-content {
          color: var(--color-green-dark);
        }

        .condition-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .condition-label {
          font-weight: 600;
        }

        .condition-description {
          font-size: 14px;
          color: var(--color-gray-warm-medium);
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
          padding: var(--spacing-md);
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .availability-option:hover {
          border-color: var(--color-green-primary);
          background: var(--color-green-mint);
        }

        .price-section {
          background: var(--color-green-mint);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          margin-top: var(--spacing-lg);
        }

        .price-input-group {
          display: flex;
          align-items: end;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-sm);
        }

        .price-input-group .form-group {
          flex: 1;
        }

        .price-compare-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          white-space: nowrap;
          height: fit-content;
          padding: 12px 16px;
        }

        .price-help {
          font-size: 14px;
          color: var(--color-green-dark);
          margin: 0;
        }

        .photo-upload {
          margin-top: var(--spacing-lg);
        }

        .upload-area {
          border: 2px dashed var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          padding: var(--spacing-2xl);
          text-align: center;
          transition: all var(--transition-fast);
        }

        .upload-area:hover {
          border-color: var(--color-green-primary);
          background: var(--color-green-mint);
        }

        .upload-area h3 {
          margin: var(--spacing-md) 0 var(--spacing-sm);
          color: var(--color-gray-warm-dark);
        }

        .upload-area p {
          color: var(--color-gray-warm-medium);
          margin-bottom: var(--spacing-lg);
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-2xl);
          background: var(--color-gray-warm-light);
        }

        .error-message {
          color: var(--color-error);
          font-size: 12px;
        }

        .error-message--general {
          padding: var(--spacing-md);
          background: rgba(232, 168, 124, 0.1);
          border: 1px solid var(--color-error);
          border-radius: var(--radius-sm);
          text-align: center;
          margin-bottom: var(--spacing-lg);
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
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default SellBookPageWithComparator;

