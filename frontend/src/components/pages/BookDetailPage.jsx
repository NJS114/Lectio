import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Star, 
  Calendar, 
  ShoppingCart, 
  Clock,
  Book,
  User,
  Shield,
  ArrowLeft,
  Plus,
  Minus
} from 'lucide-react';
import { useBooks } from '../../hooks/useBooks';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import BookCard from '../BookCard';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookById, getRecommendations, toggleFavorite, isFavorite } = useBooks();
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();

  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedMode, setSelectedMode] = useState('purchase');
  const [rentalDays, setRentalDays] = useState(7);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const bookData = getBookById(id);
    if (bookData) {
      setBook(bookData);
      setRecommendations(getRecommendations(parseInt(id)));
      
      // Définir le mode par défaut selon la disponibilité
      if (bookData.availableForSale && bookData.availableForRental) {
        setSelectedMode('purchase');
      } else if (bookData.availableForRental) {
        setSelectedMode('rental');
      } else {
        setSelectedMode('purchase');
      }
    } else {
      navigate('/catalogue');
    }
  }, [id, getBookById, getRecommendations, navigate]);

  if (!book) {
    return (
      <div className="book-detail-loading">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!requireAuth()) return;
    
    addToCart(book, selectedMode, selectedMode === 'rental' ? rentalDays : null);
  };

  const handleToggleFavorite = () => {
    if (!requireAuth()) return;
    
    toggleFavorite(book.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `${book.title} par ${book.author} - ${book.price}€ sur Lectio`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier l'URL
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const getConditionLabel = (condition) => {
    const labels = {
      'new': 'Neuf',
      'very-good': 'Très Bon',
      'good': 'Bon',
      'fair': 'Correct'
    };
    return labels[condition] || 'Bon';
  };

  const getConditionDescription = (condition) => {
    const descriptions = {
      'new': 'Livre neuf, jamais ouvert',
      'very-good': 'Très bon état, quelques traces d\'usage mineures',
      'good': 'Bon état général, quelques marques d\'usage',
      'fair': 'État correct, traces d\'usage visibles mais lisible'
    };
    return descriptions[condition] || '';
  };

  const calculateRentalTotal = () => {
    const rentalCost = book.rentalPrice * rentalDays;
    const deposit = book.deposit || book.price * 0.6;
    return rentalCost + deposit;
  };

  // Images de démonstration (normalement viendraient de l'API)
  const bookImages = [
    book.image,
    '/api/placeholder/400/600',
    '/api/placeholder/400/600'
  ];

  return (
    <div className="book-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate(-1)} className="breadcrumb-back">
            <ArrowLeft size={16} />
            Retour
          </button>
          <span className="breadcrumb-separator">/</span>
          <span>{book.category}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{book.title}</span>
        </nav>

        <div className="book-detail-content">
          {/* Images */}
          <div className="book-images">
            <div className="main-image">
              <img 
                src={bookImages[activeImageIndex]} 
                alt={book.title}
                className="main-image__img"
              />
              <button 
                className={`favorite-btn ${isFavorite(book.id) ? 'favorite-btn--active' : ''}`}
                onClick={handleToggleFavorite}
              >
                <Heart size={20} fill={isFavorite(book.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            {bookImages.length > 1 && (
              <div className="image-thumbnails">
                {bookImages.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === activeImageIndex ? 'thumbnail--active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={image} alt={`${book.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations principales */}
          <div className="book-info">
            <div className="book-header">
              <h1 className="book-title">{book.title}</h1>
              <p className="book-author">par {book.author}</p>
              
              <div className="book-meta">
                <div className="book-rating">
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < book.rating ? 'currentColor' : 'none'}
                        className="rating-star"
                      />
                    ))}
                  </div>
                  <span className="rating-text">({book.rating}/5)</span>
                </div>
                
                <div className="book-condition">
                  <span className={`condition-badge condition-badge--${book.condition}`}>
                    {getConditionLabel(book.condition)}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendeur */}
            <div className="seller-info">
              <div className="seller-avatar">
                <User size={24} />
              </div>
              <div className="seller-details">
                <div className="seller-name">
                  {book.seller}
                  {book.sellerType === 'bookshop' && (
                    <div className="verified-badge">
                      <Shield size={14} />
                      <span>Vérifié</span>
                    </div>
                  )}
                </div>
                <div className="seller-location">
                  <MapPin size={14} />
                  <span>{book.city}</span>
                </div>
              </div>
            </div>

            {/* Options d'achat/location */}
            <div className="purchase-options">
              {book.availableForSale && book.availableForRental && (
                <div className="mode-selector">
                  <button
                    className={`mode-btn ${selectedMode === 'purchase' ? 'mode-btn--active' : ''}`}
                    onClick={() => setSelectedMode('purchase')}
                  >
                    <ShoppingCart size={16} />
                    Acheter
                  </button>
                  <button
                    className={`mode-btn ${selectedMode === 'rental' ? 'mode-btn--active' : ''}`}
                    onClick={() => setSelectedMode('rental')}
                  >
                    <Calendar size={16} />
                    Louer
                  </button>
                </div>
              )}

              {selectedMode === 'purchase' ? (
                <div className="purchase-option">
                  <div className="price-display">
                    <span className="price-amount">{book.price}€</span>
                    <span className="price-label">Prix d'achat</span>
                  </div>
                </div>
              ) : (
                <div className="rental-option">
                  <div className="rental-duration">
                    <label>Durée de location :</label>
                    <div className="duration-selector">
                      <button 
                        onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                        className="duration-btn"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="duration-value">{rentalDays} jour{rentalDays > 1 ? 's' : ''}</span>
                      <button 
                        onClick={() => setRentalDays(rentalDays + 1)}
                        className="duration-btn"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="rental-pricing">
                    <div className="price-breakdown">
                      <div className="price-item">
                        <span>Location ({rentalDays} jour{rentalDays > 1 ? 's' : ''})</span>
                        <span>{(book.rentalPrice * rentalDays).toFixed(2)}€</span>
                      </div>
                      <div className="price-item">
                        <span>Caution</span>
                        <span>{book.deposit?.toFixed(2) || (book.price * 0.6).toFixed(2)}€</span>
                      </div>
                      <div className="price-item price-item--total">
                        <span>Total</span>
                        <span>{calculateRentalTotal().toFixed(2)}€</span>
                      </div>
                    </div>
                    <p className="rental-note">
                      La caution vous sera remboursée au retour du livre
                    </p>
                  </div>
                </div>
              )}

              <button 
                className="btn btn--primary btn--large add-to-cart-btn"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} />
                {selectedMode === 'purchase' ? 'Ajouter au panier' : 'Louer ce livre'}
              </button>

              <button 
                className="btn btn--secondary share-btn"
                onClick={handleShare}
              >
                <Share2 size={16} />
                Partager
              </button>
            </div>
          </div>
        </div>

        {/* Détails du livre */}
        <div className="book-details">
          <div className="details-grid">
            <div className="details-main">
              <h3>Description</h3>
              <div className="book-description">
                <p>
                  {showFullDescription 
                    ? book.description 
                    : book.description.length > 200 
                      ? book.description.substring(0, 200) + '...'
                      : book.description
                  }
                </p>
                {book.description.length > 200 && (
                  <button 
                    className="show-more-btn"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Voir moins' : 'Voir plus'}
                  </button>
                )}
              </div>

              <div className="condition-details">
                <h4>État du livre</h4>
                <p>{getConditionDescription(book.condition)}</p>
              </div>
            </div>

            <div className="details-sidebar">
              <h3>Informations</h3>
              <div className="info-list">
                <div className="info-item">
                  <Book size={16} />
                  <div>
                    <span className="info-label">ISBN</span>
                    <span className="info-value">{book.isbn}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📅</span>
                  <div>
                    <span className="info-label">Année</span>
                    <span className="info-value">{book.publishedYear}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🏢</span>
                  <div>
                    <span className="info-label">Éditeur</span>
                    <span className="info-value">{book.publisher}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📄</span>
                  <div>
                    <span className="info-label">Pages</span>
                    <span className="info-value">{book.pages}</span>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🌍</span>
                  <div>
                    <span className="info-label">Langue</span>
                    <span className="info-value">{book.language}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Clock size={16} />
                  <div>
                    <span className="info-label">Publié le</span>
                    <span className="info-value">{new Date(book.postedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommandations */}
        {recommendations.length > 0 && (
          <div className="recommendations">
            <h3>Vous pourriez aussi aimer</h3>
            <div className="recommendations-grid">
              {recommendations.map(recBook => (
                <BookCard 
                  key={recBook.id} 
                  {...recBook}
                  mode={recBook.availableForRental && recBook.availableForSale ? 'both' : 
                        recBook.availableForRental ? 'rental' : 'sale'}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .book-detail-page {
          min-height: 100vh;
          padding: var(--spacing-lg) 0;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
          font-size: 14px;
          color: var(--color-gray-warm-medium);
        }

        .breadcrumb-back {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          background: none;
          border: none;
          color: var(--color-green-primary);
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: var(--radius-sm);
          transition: background-color var(--transition-fast);
        }

        .breadcrumb-back:hover {
          background-color: var(--color-beige-paper);
        }

        .breadcrumb-separator {
          color: var(--color-gray-warm-light);
        }

        .breadcrumb-current {
          color: var(--color-gray-warm-dark);
          font-weight: 500;
        }

        .book-detail-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-2xl);
          margin-bottom: var(--spacing-2xl);
        }

        @media (max-width: 768px) {
          .book-detail-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-xl);
          }
        }

        .book-images {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .main-image {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .main-image__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .favorite-btn {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          background: rgba(255, 255, 255, 0.9);
          border: none;
          padding: var(--spacing-sm);
          border-radius: 50%;
          color: var(--color-gray-warm-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .favorite-btn:hover {
          background: white;
          color: var(--color-green-primary);
          transform: scale(1.1);
        }

        .favorite-btn--active {
          color: var(--color-green-primary);
          background: white;
        }

        .image-thumbnails {
          display: flex;
          gap: var(--spacing-sm);
        }

        .thumbnail {
          width: 60px;
          height: 80px;
          border: 2px solid transparent;
          border-radius: var(--radius-sm);
          overflow: hidden;
          cursor: pointer;
          transition: border-color var(--transition-fast);
        }

        .thumbnail--active {
          border-color: var(--color-green-primary);
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .book-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .book-title {
          font-size: 32px;
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: var(--spacing-xs);
          color: var(--color-gray-warm-dark);
        }

        .book-author {
          font-size: 18px;
          color: var(--color-gray-warm-medium);
          margin-bottom: var(--spacing-md);
        }

        .book-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .book-rating {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .rating-stars {
          display: flex;
          gap: 2px;
        }

        .rating-star {
          color: var(--color-beige-gold);
        }

        .rating-text {
          font-size: 14px;
          color: var(--color-gray-warm-medium);
        }

        .condition-badge {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-xl);
          font-size: 14px;
          font-weight: 500;
        }

        .condition-badge--new {
          background-color: var(--color-green-mint);
          color: var(--color-green-dark);
        }

        .condition-badge--very-good {
          background-color: var(--color-green-primary);
          color: white;
        }

        .condition-badge--good {
          background-color: var(--color-beige-gold);
          color: var(--color-gray-warm-dark);
        }

        .condition-badge--fair {
          background-color: var(--color-gray-warm-light);
          color: var(--color-gray-warm-dark);
        }

        .seller-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--color-beige-paper);
          border-radius: var(--radius-md);
        }

        .seller-avatar {
          width: 48px;
          height: 48px;
          background: var(--color-green-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .seller-name {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-weight: 600;
          color: var(--color-gray-warm-dark);
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--color-green-primary);
          font-size: 12px;
        }

        .seller-location {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 14px;
          color: var(--color-gray-warm-medium);
        }

        .purchase-options {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .mode-selector {
          display: flex;
          gap: var(--spacing-sm);
        }

        .mode-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-md);
          border: 1px solid var(--color-gray-warm-light);
          background: white;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .mode-btn--active {
          background: var(--color-green-primary);
          color: white;
          border-color: var(--color-green-primary);
        }

        .price-display {
          text-align: center;
          padding: var(--spacing-lg);
          background: var(--color-green-mint);
          border-radius: var(--radius-md);
        }

        .price-amount {
          display: block;
          font-size: 32px;
          font-weight: 700;
          color: var(--color-green-dark);
        }

        .price-label {
          font-size: 14px;
          color: var(--color-gray-warm-medium);
        }

        .rental-option {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .rental-duration {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .rental-duration label {
          font-weight: 500;
          color: var(--color-gray-warm-dark);
        }

        .duration-selector {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .duration-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-gray-warm-light);
          background: white;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .duration-btn:hover {
          background: var(--color-beige-paper);
        }

        .duration-value {
          font-weight: 600;
          min-width: 80px;
          text-align: center;
        }

        .rental-pricing {
          background: var(--color-beige-paper);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
        }

        .price-breakdown {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .price-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-item--total {
          font-weight: 600;
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--color-gray-warm-light);
          color: var(--color-gray-warm-dark);
        }

        .rental-note {
          font-size: 12px;
          color: var(--color-gray-warm-medium);
          text-align: center;
        }

        .btn--large {
          padding: var(--spacing-md) var(--spacing-xl);
          font-size: 18px;
        }

        .add-to-cart-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
        }

        .share-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
        }

        .book-details {
          margin-bottom: var(--spacing-2xl);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-2xl);
        }

        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-xl);
          }
        }

        .details-main h3,
        .details-sidebar h3 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
          color: var(--color-gray-warm-dark);
        }

        .book-description {
          line-height: 1.6;
          color: var(--color-gray-warm-medium);
          margin-bottom: var(--spacing-lg);
        }

        .show-more-btn {
          background: none;
          border: none;
          color: var(--color-green-primary);
          cursor: pointer;
          font-weight: 500;
          margin-top: var(--spacing-sm);
        }

        .condition-details h4 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-warm-dark);
        }

        .condition-details p {
          color: var(--color-gray-warm-medium);
          line-height: 1.5;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .info-icon {
          width: 16px;
          text-align: center;
        }

        .info-item div {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 12px;
          color: var(--color-gray-warm-medium);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-weight: 500;
          color: var(--color-gray-warm-dark);
        }

        .recommendations {
          margin-top: var(--spacing-2xl);
        }

        .recommendations h3 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
          color: var(--color-gray-warm-dark);
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: var(--spacing-lg);
        }

        @media (max-width: 767px) {
          .recommendations-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: var(--spacing-md);
          }
        }

        .book-detail-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: var(--spacing-md);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--color-gray-warm-light);
          border-top: 3px solid var(--color-green-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BookDetailPage;

