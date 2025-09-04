import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Upload, MapPin, Book, DollarSign, Calendar, TrendingUp, Search, CheckCircle, AlertCircle, Loader2, X, Info, Calculator } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';
import PriceComparatorModalWithAPI from '../modals/PriceComparatorModalWithAPI';

const SellBookPageEcosystem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { requireAuth } = useAuth();
  const { addBook } = useBooks();

  // Configuration de l'écosystème
  const ECOSYSTEM_CONFIG = {
    COMMISSION_RATE: 0.20, // 20% de commission
    RENTAL_PERIOD_DAYS: 14, // Location par périodes de 2 semaines
    SHIPPING_COST: 3.50, // Coût d'expédition estimé
    HANDLING_FEE: 1.50, // Frais de gestion
    MIN_RENTAL_PRICE: 5.00, // Prix minimum de location pour 2 semaines
    MIN_SALE_PRICE: 2.00 // Prix minimum de vente
  };

  // État initial du formulaire
  const initialFormData = useMemo(() => ({
    title: '',
    author: '',
    isbn: '',
    price: '',
    rentalPriceTwoWeeks: '', // Prix pour 2 semaines au lieu de par jour
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
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  // Calculs de l'écosystème
  const priceCalculations = useMemo(() => {
    const salePrice = parseFloat(formData.price) || 0;
    const rentalPrice = parseFloat(formData.rentalPriceTwoWeeks) || 0;
    
    // Calculs pour la vente
    const saleCommission = salePrice * ECOSYSTEM_CONFIG.COMMISSION_RATE;
    const saleTotalCost = saleCommission + ECOSYSTEM_CONFIG.SHIPPING_COST + ECOSYSTEM_CONFIG.HANDLING_FEE;
    const saleUserReceives = Math.max(0, salePrice - saleTotalCost);
    const saleFinalPrice = salePrice + saleTotalCost; // Prix affiché à l'acheteur
    
    // Calculs pour la location
    const rentalCommission = rentalPrice * ECOSYSTEM_CONFIG.COMMISSION_RATE;
    const rentalTotalCost = rentalCommission + (ECOSYSTEM_CONFIG.SHIPPING_COST * 2) + ECOSYSTEM_CONFIG.HANDLING_FEE; // Aller-retour
    const rentalUserReceives = Math.max(0, rentalPrice - rentalTotalCost);
    const rentalFinalPrice = rentalPrice + rentalTotalCost; // Prix affiché au locataire
    
    return {
      sale: {
        userPrice: salePrice,
        commission: saleCommission,
        shipping: ECOSYSTEM_CONFIG.SHIPPING_COST,
        handling: ECOSYSTEM_CONFIG.HANDLING_FEE,
        totalCosts: saleTotalCost,
        userReceives: saleUserReceives,
        finalPrice: saleFinalPrice
      },
      rental: {
        userPrice: rentalPrice,
        commission: rentalCommission,
        shipping: ECOSYSTEM_CONFIG.SHIPPING_COST * 2, // Aller-retour
        handling: ECOSYSTEM_CONFIG.HANDLING_FEE,
        totalCosts: rentalTotalCost,
        userReceives: rentalUserReceives,
        finalPrice: rentalFinalPrice
      }
    };
  }, [formData.price, formData.rentalPriceTwoWeeks]);

  // Catégories disponibles
  const categories = [
    'Roman', 'Essai', 'Science-Fiction', 'Fantasy', 'Thriller', 'Policier',
    'Biographie', 'Histoire', 'Philosophie', 'Psychologie', 'Développement personnel',
    'Sciences', 'Informatique', 'Économie', 'Politique', 'Art', 'Cuisine',
    'Voyage', 'Santé', 'Sport', 'Jeunesse', 'Bande dessinée', 'Manga', 'Autre'
  ];

  // États des livres
  const conditions = [
    { value: 'new', label: 'Neuf', description: 'Livre jamais lu, en parfait état' },
    { value: 'very_good', label: 'Très bon état', description: 'Quelques traces d\'usage mineures' },
    { value: 'good', label: 'Bon état', description: 'Traces d\'usage visibles mais livre en bon état' },
    { value: 'fair', label: 'État correct', description: 'Usure visible, toutes les pages présentes' }
  ];

  // Réinitialiser le formulaire lors de la navigation
  useEffect(() => {
    if (location.state?.resetForm || location.key !== location.key) {
      setFormData(initialFormData);
      setErrors({});
      setSubmitStatus(null);
      setSubmitMessage('');
    }
  }, [location, initialFormData]);

  // Gestion des changements de formulaire
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Validation du formulaire
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'L\'auteur est requis';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (formData.availableForSale) {
      const price = parseFloat(formData.price);
      if (!formData.price || price < ECOSYSTEM_CONFIG.MIN_SALE_PRICE) {
        newErrors.price = `Le prix de vente doit être d'au moins ${ECOSYSTEM_CONFIG.MIN_SALE_PRICE}€`;
      }
    }

    if (formData.availableForRental) {
      const rentalPrice = parseFloat(formData.rentalPriceTwoWeeks);
      if (!formData.rentalPriceTwoWeeks || rentalPrice < ECOSYSTEM_CONFIG.MIN_RENTAL_PRICE) {
        newErrors.rentalPriceTwoWeeks = `Le prix de location doit être d'au moins ${ECOSYSTEM_CONFIG.MIN_RENTAL_PRICE}€ pour 2 semaines`;
      }
    }

    if (!formData.availableForSale && !formData.availableForRental) {
      newErrors.availability = 'Vous devez choisir au moins une option (vente ou location)';
    }

    return newErrors;
  }, [formData]);

  // Soumission du formulaire
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus('error');
      setSubmitMessage('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Préparer les données avec les calculs de l'écosystème
      const bookData = {
        ...formData,
        // Prix finaux affichés aux acheteurs/locataires
        finalSalePrice: priceCalculations.sale.finalPrice,
        finalRentalPrice: priceCalculations.rental.finalPrice,
        // Revenus nets pour le vendeur
        userSaleRevenue: priceCalculations.sale.userReceives,
        userRentalRevenue: priceCalculations.rental.userReceives,
        // Métadonnées de l'écosystème
        ecosystem: {
          commissionRate: ECOSYSTEM_CONFIG.COMMISSION_RATE,
          rentalPeriodDays: ECOSYSTEM_CONFIG.RENTAL_PERIOD_DAYS,
          calculations: priceCalculations
        }
      };

      await addBook(bookData);
      
      setSubmitStatus('success');
      setSubmitMessage('Votre livre a été ajouté avec succès ! Il sera visible dans le catalogue après validation.');
      
      // Réinitialiser le formulaire après succès
      setTimeout(() => {
        setFormData(initialFormData);
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de l\'ajout du livre:', error);
      setSubmitStatus('error');
      setSubmitMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, addBook, priceCalculations, initialFormData]);

  // Comparaison de prix
  const handlePriceComparison = useCallback(async () => {
    if (!formData.title || !formData.author) {
      setSubmitStatus('error');
      setSubmitMessage('Veuillez renseigner le titre et l\'auteur pour comparer les prix');
      return;
    }

    setIsComparingPrices(true);
    setShowPriceComparator(true);
  }, [formData.title, formData.author]);

  // Fermer le message de feedback
  const dismissMessage = useCallback(() => {
    setSubmitStatus(null);
    setSubmitMessage('');
  }, []);

  // Vérifier l'authentification
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  return (
    <div className="sell-book-page">
      <div className="container">
        <div className="page-header">
          <h1>Vendre un livre</h1>
          <p>Donnez une seconde vie à vos livres avec notre écosystème viable</p>
          <div className="ecosystem-info">
            <Info size={16} />
            <span>Location par périodes de 2 semaines • Commission transparente de 20%</span>
          </div>
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
                  min="1800"
                  max={new Date().getFullYear()}
                  disabled={isSubmitting}
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
                  placeholder="Nom de l'éditeur"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pages">Nombre de pages</label>
                <input
                  type="number"
                  id="pages"
                  name="pages"
                  value={formData.pages}
                  onChange={handleInputChange}
                  placeholder="250"
                  min="1"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="language">Langue</label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Espagnol">Espagnol</option>
                  <option value="Italien">Italien</option>
                  <option value="Allemand">Allemand</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez l'état du livre, son contenu, etc."
                rows="4"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* État du livre */}
          <div className="form-section">
            <h2><Search size={20} /> État du livre</h2>
            <div className="condition-grid">
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

          {/* Disponibilité et prix avec écosystème */}
          <div className="form-section">
            <h2><DollarSign size={20} /> Disponibilité et prix</h2>
            
            <div className="ecosystem-notice">
              <Calculator size={16} />
              <div>
                <strong>Écosystème Lectio :</strong> Nous ajoutons 20% de commission + frais de gestion pour assurer la viabilité de la plateforme
              </div>
            </div>
            
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
                <span>Location (par périodes de 2 semaines)</span>
              </label>
            </div>

            {errors.availability && <span className="error-message">{errors.availability}</span>}

            {formData.availableForSale && (
              <div className="price-section">
                <div className="form-group">
                  <label htmlFor="price">Votre prix de vente souhaité (€) *</label>
                  <div className="price-input-group">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min={ECOSYSTEM_CONFIG.MIN_SALE_PRICE}
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
                  
                  {formData.price && (
                    <div className="price-breakdown">
                      <div className="breakdown-header">
                        <span>Répartition des coûts :</span>
                        <button
                          type="button"
                          onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                          className="toggle-breakdown"
                        >
                          {showPriceBreakdown ? 'Masquer' : 'Afficher'} les détails
                        </button>
                      </div>
                      
                      {showPriceBreakdown && (
                        <div className="breakdown-details">
                          <div className="breakdown-item">
                            <span>Votre prix :</span>
                            <span>{priceCalculations.sale.userPrice.toFixed(2)}€</span>
                          </div>
                          <div className="breakdown-item">
                            <span>Commission (20%) :</span>
                            <span>+{priceCalculations.sale.commission.toFixed(2)}€</span>
                          </div>
                          <div className="breakdown-item">
                            <span>Expédition :</span>
                            <span>+{priceCalculations.sale.shipping.toFixed(2)}€</span>
                          </div>
                          <div className="breakdown-item">
                            <span>Gestion :</span>
                            <span>+{priceCalculations.sale.handling.toFixed(2)}€</span>
                          </div>
                          <div className="breakdown-total">
                            <span><strong>Prix final affiché :</strong></span>
                            <span><strong>{priceCalculations.sale.finalPrice.toFixed(2)}€</strong></span>
                          </div>
                          <div className="user-receives">
                            <span><strong>Vous recevrez :</strong></span>
                            <span><strong>{priceCalculations.sale.userReceives.toFixed(2)}€</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.availableForRental && (
              <div className="price-section">
                <div className="form-group">
                  <label htmlFor="rentalPriceTwoWeeks">Votre prix de location pour 2 semaines (€) *</label>
                  <input
                    type="number"
                    id="rentalPriceTwoWeeks"
                    name="rentalPriceTwoWeeks"
                    value={formData.rentalPriceTwoWeeks}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min={ECOSYSTEM_CONFIG.MIN_RENTAL_PRICE}
                    className={errors.rentalPriceTwoWeeks ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.rentalPriceTwoWeeks && <span className="error-message">{errors.rentalPriceTwoWeeks}</span>}
                  
                  <div className="rental-info">
                    <Calendar size={16} />
                    <span>Location par vagues de 2 semaines (14 jours)</span>
                  </div>
                  
                  {formData.rentalPriceTwoWeeks && (
                    <div className="price-breakdown">
                      <div className="breakdown-header">
                        <span>Répartition des coûts (location) :</span>
                        <button
                          type="button"
                          onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                          className="toggle-breakdown"
                        >
                          {showPriceBreakdown ? 'Masquer' : 'Afficher'} les détails
                        </button>
                      </div>
                      
                      {showPriceBreakdown && (
                        <div className="breakdown-details">
                          <div className="breakdown-item">
                            <span>Votre prix (2 semaines) :</span>
                            <span>{priceCalculations.rental.userPrice.toFixed(2)}€</span>
                          </div>
                          <div className="breakdown-item">
                            <span>Commission (20%) :</span>
                            <span>+{priceCalculations.rental.commission.toFixed(2)}€</span>
                          </div>
                          <div className="breakdown-item">
                            <span>Expédition (aller-retour) :</span>
                            <span>+{priceCalculations.rental.shipping.toFixed(2)}€</span>
                          </div>
                          <div className="breakdown-item">
                            <span>Gestion :</span>
                            <span>+{priceCalculations.rental.handling.toFixed(2)}€</span>
                          </div>
                          <div className="breakdown-total">
                            <span><strong>Prix final affiché :</strong></span>
                            <span><strong>{priceCalculations.rental.finalPrice.toFixed(2)}€</strong></span>
                          </div>
                          <div className="user-receives">
                            <span><strong>Vous recevrez :</strong></span>
                            <span><strong>{priceCalculations.rental.userReceives.toFixed(2)}€</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Images */}
          <div className="form-section">
            <h2><Camera size={20} /> Photos du livre</h2>
            <div className="image-upload-area">
              <div className="upload-placeholder">
                <Upload size={48} />
                <h3>Ajoutez des photos de votre livre</h3>
                <p>Glissez-déposez vos images ici ou cliquez pour sélectionner</p>
                <button type="button" className="upload-btn" disabled={isSubmitting}>
                  Choisir des fichiers
                </button>
              </div>
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="spinning" />
                  Publication en cours...
                </>
              ) : (
                <>
                  <Book size={20} />
                  Publier mon livre
                </>
              )}
            </button>
          </div>
        </form>

        {/* Modal de comparaison de prix */}
        {showPriceComparator && (
          <PriceComparatorModalWithAPI
            isOpen={showPriceComparator}
            onClose={() => {
              setShowPriceComparator(false);
              setIsComparingPrices(false);
            }}
            bookTitle={formData.title}
            bookAuthor={formData.author}
            onPriceSelect={(price) => {
              setFormData(prev => ({ ...prev, price: price.toString() }));
              setShowPriceComparator(false);
              setIsComparingPrices(false);
            }}
          />
        )}
      </div>

      <style jsx>{`
        .sell-book-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 40px 0;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .page-header p {
          font-size: 1.1rem;
          color: #6c757d;
          margin-bottom: 15px;
        }

        .ecosystem-info {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #e3f2fd;
          color: #1976d2;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .feedback-message {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          font-weight: 500;
        }

        .feedback-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .feedback-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .message-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dismiss-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .dismiss-btn:hover {
          opacity: 1;
        }

        .sell-form {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .form-section {
          padding: 30px;
          border-bottom: 1px solid #e9ecef;
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .form-section h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 25px;
        }

        .ecosystem-notice {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 25px;
          font-size: 0.9rem;
          color: #856404;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px 15px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input.error,
        .form-group select.error {
          border-color: #e74c3c;
        }

        .error-message {
          color: #e74c3c;
          font-size: 0.8rem;
          margin-top: 5px;
          font-weight: 500;
        }

        .condition-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .condition-option {
          cursor: pointer;
        }

        .condition-option input[type="radio"] {
          display: none;
        }

        .condition-card {
          padding: 20px;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          transition: all 0.3s ease;
          background: white;
        }

        .condition-option input[type="radio"]:checked + .condition-card {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .condition-card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 5px;
        }

        .condition-card p {
          font-size: 0.85rem;
          color: #6c757d;
          margin: 0;
        }

        .availability-options {
          display: flex;
          gap: 30px;
          margin-bottom: 25px;
        }

        .availability-option {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-weight: 500;
          color: #495057;
        }

        .availability-option input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #667eea;
        }

        .price-section {
          margin-top: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .price-input-group {
          display: flex;
          gap: 10px;
        }

        .price-input-group input {
          flex: 1;
        }

        .compare-price-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .compare-price-btn:hover:not(:disabled) {
          background: #5a6fd8;
          transform: translateY(-2px);
        }

        .compare-price-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .rental-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .price-breakdown {
          margin-top: 15px;
          padding: 15px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .breakdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .toggle-breakdown {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-size: 0.9rem;
          text-decoration: underline;
        }

        .breakdown-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .breakdown-total {
          display: flex;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid #e9ecef;
          margin-top: 8px;
        }

        .user-receives {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: #e8f5e8;
          border-radius: 5px;
          margin-top: 8px;
          color: #2d5a2d;
        }

        .image-upload-area {
          border: 2px dashed #dee2e6;
          border-radius: 10px;
          padding: 40px;
          text-align: center;
          background: #f8f9fa;
        }

        .upload-placeholder h3 {
          font-size: 1.2rem;
          color: #495057;
          margin: 15px 0 10px;
        }

        .upload-placeholder p {
          color: #6c757d;
          margin-bottom: 20px;
        }

        .upload-btn {
          padding: 10px 20px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .upload-btn:hover:not(:disabled) {
          background: #5a6fd8;
        }

        .form-actions {
          padding: 30px;
          text-align: center;
        }

        .submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
          justify-content: center;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .condition-grid {
            grid-template-columns: 1fr;
          }

          .availability-options {
            flex-direction: column;
            gap: 15px;
          }

          .price-input-group {
            flex-direction: column;
          }

          .breakdown-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default SellBookPageEcosystem;

