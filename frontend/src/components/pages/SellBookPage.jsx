import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, MapPin, Book, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';

const SellBookPage = () => {
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
    if (!formData.isbn) newErrors.isbn = 'L\'ISBN est requis';
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (!formData.description) newErrors.description = 'La description est requise';
    
    if (formData.availableForSale && !formData.price) {
      newErrors.price = 'Le prix de vente est requis';
    }
    
    if (formData.availableForRental && !formData.rentalPrice) {
      newErrors.rentalPrice = 'Le prix de location est requis';
    }

    if (!formData.availableForSale && !formData.availableForRental) {
      newErrors.availability = 'Sélectionnez au moins une option (vente ou location)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!requireAuth()) return;
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulation d'ajout de livre
      const newBook = addBook({
        ...formData,
        price: parseFloat(formData.price) || 0,
        rentalPrice: parseFloat(formData.rentalPrice) || 0,
        publishedYear: parseInt(formData.publishedYear) || new Date().getFullYear(),
        pages: parseInt(formData.pages) || 0,
        image: '/api/placeholder/240/320',
        seller: 'Vous',
        sellerId: 'current-user',
        city: 'Votre ville',
        sellerType: 'individual',
        deposit: formData.availableForRental ? parseFloat(formData.price) * 0.6 : 0
      });

      // Redirection vers la page du livre créé
      navigate(`/livre/${newBook.id}`);
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue lors de l\'ajout du livre' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Roman', 'Essai', 'Science-Fiction', 'Fantasy', 'Thriller', 'Policier',
    'Biographie', 'Histoire', 'Philosophie', 'Sciences', 'Art', 'Cuisine',
    'Voyage', 'Jeunesse', 'Bande Dessinée', 'Manga', 'Classique', 'Poésie'
  ];

  return (
    <div className="sell-book-page">
      <div className="container">
        <div className="page-header">
          <h1>Vendre un livre</h1>
          <p>Donnez une seconde vie à vos livres et gagnez de l'argent</p>
        </div>

        <form onSubmit={handleSubmit} className="sell-form">
          {errors.general && (
            <div className="error-banner">
              {errors.general}
            </div>
          )}

          <div className="form-section">
            <h3>📚 Informations du livre</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Titre *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input ${errors.title ? 'input--error' : ''}`}
                  placeholder="Le titre du livre"
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="author">Auteur *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className={`input ${errors.author ? 'input--error' : ''}`}
                  placeholder="Nom de l'auteur"
                />
                {errors.author && <span className="error-text">{errors.author}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="isbn">ISBN *</label>
                <div className="input-with-scan">
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className={`input ${errors.isbn ? 'input--error' : ''}`}
                    placeholder="9782070360024"
                  />
                  <button type="button" className="scan-btn" title="Scanner le code-barres">
                    <Camera size={16} />
                  </button>
                </div>
                {errors.isbn && <span className="error-text">{errors.isbn}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Catégorie *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`input ${errors.category ? 'input--error' : ''}`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
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
                  className="input"
                  placeholder="2023"
                  min="1800"
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
                  className="input"
                  placeholder="Gallimard"
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
                className={`input textarea ${errors.description ? 'input--error' : ''}`}
                placeholder="Décrivez l'état du livre, son contenu, etc."
                rows="4"
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>🏷️ État et prix</h3>
            
            <div className="form-group">
              <label>État du livre *</label>
              <div className="condition-options">
                {[
                  { value: 'new', label: 'Neuf', desc: 'Livre neuf, jamais ouvert' },
                  { value: 'very-good', label: 'Très bon', desc: 'Très bon état, traces mineures' },
                  { value: 'good', label: 'Bon', desc: 'Bon état général' },
                  { value: 'fair', label: 'Correct', desc: 'État correct, traces visibles' }
                ].map(condition => (
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
                      <span className="condition-desc">{condition.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="availability-section">
              <h4>Disponibilité</h4>
              {errors.availability && <span className="error-text">{errors.availability}</span>}
              
              <div className="availability-options">
                <label className="availability-option">
                  <input
                    type="checkbox"
                    name="availableForSale"
                    checked={formData.availableForSale}
                    onChange={handleInputChange}
                  />
                  <div className="availability-content">
                    <div className="availability-header">
                      <DollarSign size={20} />
                      <span>Vente</span>
                    </div>
                    {formData.availableForSale && (
                      <div className="price-input">
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className={`input ${errors.price ? 'input--error' : ''}`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <span>€</span>
                      </div>
                    )}
                  </div>
                </label>

                <label className="availability-option">
                  <input
                    type="checkbox"
                    name="availableForRental"
                    checked={formData.availableForRental}
                    onChange={handleInputChange}
                  />
                  <div className="availability-content">
                    <div className="availability-header">
                      <Calendar size={20} />
                      <span>Location</span>
                    </div>
                    {formData.availableForRental && (
                      <div className="price-input">
                        <input
                          type="number"
                          name="rentalPrice"
                          value={formData.rentalPrice}
                          onChange={handleInputChange}
                          className={`input ${errors.rentalPrice ? 'input--error' : ''}`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <span>€/jour</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              {errors.price && <span className="error-text">{errors.price}</span>}
              {errors.rentalPrice && <span className="error-text">{errors.rentalPrice}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>📸 Photos</h3>
            <div className="photo-upload">
              <div className="upload-area">
                <Upload size={48} />
                <h4>Ajoutez des photos de votre livre</h4>
                <p>Glissez-déposez vos images ou cliquez pour parcourir</p>
                <button type="button" className="btn btn--secondary">
                  Choisir des fichiers
                </button>
              </div>
            </div>
          </div>

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

      <style jsx>{`
        .sell-book-page {
          min-height: 100vh;
          padding: var(--spacing-xl) 0;
          background-color: var(--color-background);
        }

        .page-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .page-header h1 {
          font-size: 36px;
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-dark);
        }

        .page-header p {
          font-size: 18px;
          color: var(--color-gray-text);
        }

        .sell-form {
          max-width: 800px;
          margin: 0 auto;
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-2xl);
          box-shadow: var(--shadow-sm);
        }

        .error-banner {
          background: rgba(232, 168, 124, 0.1);
          border: 1px solid var(--color-error);
          color: var(--color-error);
          padding: var(--spacing-md);
          border-radius: var(--radius-sm);
          margin-bottom: var(--spacing-lg);
          text-align: center;
        }

        .form-section {
          margin-bottom: var(--spacing-2xl);
        }

        .form-section h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
          color: var(--color-gray-dark);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .form-group label {
          font-weight: 500;
          color: var(--color-gray-dark);
        }

        .input--error {
          border-color: var(--color-error);
        }

        .error-text {
          color: var(--color-error);
          font-size: 14px;
        }

        .input-with-scan {
          position: relative;
          display: flex;
          align-items: center;
        }

        .scan-btn {
          position: absolute;
          right: 8px;
          padding: 8px;
          background: none;
          border: none;
          color: var(--color-gray-text);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .scan-btn:hover {
          background: var(--color-gray-light);
          color: var(--color-green-primary);
        }

        .textarea {
          min-height: 100px;
          resize: vertical;
        }

        .condition-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-sm);
        }

        .condition-option {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          border: 1px solid var(--color-gray-medium);
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

        .condition-option:has(input:checked) {
          border-color: var(--color-green-primary);
          background: var(--color-green-mint);
        }

        .condition-content {
          display: flex;
          flex-direction: column;
        }

        .condition-label {
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
        }

        .condition-desc {
          font-size: 14px;
          color: var(--color-gray-text);
        }

        .availability-section h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-dark);
        }

        .availability-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
        }

        @media (max-width: 768px) {
          .availability-options {
            grid-template-columns: 1fr;
          }
        }

        .availability-option {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          padding: var(--spacing-lg);
          border: 1px solid var(--color-gray-medium);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .availability-option:hover {
          border-color: var(--color-purple-primary);
          background: var(--color-purple-mint);
        }

        .availability-option:has(input:checked) {
          border-color: var(--color-purple-primary);
          background: var(--color-purple-mint);
        }

        .availability-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .price-input {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-sm);
        }

        .price-input input {
          flex: 1;
        }

        .photo-upload {
          margin-top: var(--spacing-md);
        }

        .upload-area {
          border: 2px dashed var(--color-gray-medium);
          border-radius: var(--radius-md);
          padding: var(--spacing-2xl);
          text-align: center;
          color: var(--color-gray-text);
          transition: all var(--transition-fast);
        }

        .upload-area:hover {
          border-color: var(--color-green-primary);
          background: var(--color-green-mint);
        }

        .upload-area h4 {
          margin: var(--spacing-md) 0 var(--spacing-sm);
          color: var(--color-gray-dark);
        }

        .upload-area p {
          margin-bottom: var(--spacing-lg);
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-md);
          padding-top: var(--spacing-xl);
          border-top: 1px solid var(--color-gray-medium);
        }

        @media (max-width: 768px) {
          .form-actions {
            flex-direction: column-reverse;
          }

          .form-actions .btn {
            width: 100%;
          }
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SellBookPage;

