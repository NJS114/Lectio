import React from 'react';
import { MapPin, Calendar, Star, Heart } from 'lucide-react';

const BookCard = ({ 
  id,
  title, 
  author, 
  price, 
  rentalPrice, 
  condition, 
  category, 
  seller, 
  city, 
  sellerType, 
  image, 
  mode = 'sale',
  rating,
  isFavorite = false 
}) => {
  const getConditionClass = (condition) => {
    const conditionMap = {
      'new': 'tag--condition-new',
      'very-good': 'tag--condition-very-good', 
      'good': 'tag--condition-good',
      'fair': 'tag--condition-fair'
    };
    return conditionMap[condition] || 'tag--condition-good';
  };

  const getConditionLabel = (condition) => {
    const labelMap = {
      'new': 'Neuf',
      'very-good': 'Très Bon',
      'good': 'Bon', 
      'fair': 'Correct'
    };
    return labelMap[condition] || 'Bon';
  };

  return (
    <article className="book-card" data-listing-id={id}>
      <div className="book-card__image-container">
        <img 
          src={image || '/api/placeholder/240/320'} 
          alt={title} 
          className="book-card__image" 
        />
        
        {/* Overlays */}
        <div className="book-card__tags">
          <span className="tag tag--category">{category}</span>
          <span className={`tag ${getConditionClass(condition)}`}>
            {getConditionLabel(condition)}
          </span>
        </div>
        
        <div className="book-card__price">
          <span className="price">{price}€</span>
          {mode === 'both' && rentalPrice && (
            <span className="price price--rental">ou {rentalPrice}€/j</span>
          )}
        </div>
        
        {mode === 'rental' && (
          <div className="book-card__mode-badge">
            <Calendar size={14} />
            <span>Location</span>
          </div>
        )}

        {/* Bouton favori */}
        <button className={`book-card__favorite ${isFavorite ? 'book-card__favorite--active' : ''}`}>
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="book-card__content">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__author">{author}</p>
        
        <div className="book-card__seller">
          <MapPin size={14} />
          <span>{seller} • {city}</span>
          {sellerType === 'bookshop' && (
            <div className="verified-badge" title="Libraire vérifié">
              <Star size={12} fill="currentColor" />
            </div>
          )}
        </div>

        {rating && (
          <div className="book-card__rating">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < rating ? 'currentColor' : 'none'}
                  className="rating-star"
                />
              ))}
            </div>
            <span className="rating-text">({rating}/5)</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .book-card {
          background: var(--color-white-off);
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-normal);
          cursor: pointer;
          height: fit-content;
        }

        .book-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .book-card__image-container {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
        }

        .book-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }

        .book-card:hover .book-card__image {
          transform: scale(1.02);
        }

        .book-card__tags {
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 2;
        }

        .book-card__price {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 14px;
          z-index: 2;
        }

        .price--rental {
          display: block;
          font-size: 12px;
          font-weight: 400;
          opacity: 0.9;
          margin-top: 2px;
        }

        .book-card__mode-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--color-green-primary);
          color: white;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 2;
        }

        .book-card__favorite {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          padding: 8px;
          border-radius: 50%;
          color: var(--color-gray-warm-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
          z-index: 3;
        }

        .book-card__favorite:hover {
          background: white;
          color: var(--color-green-primary);
          transform: scale(1.1);
        }

        .book-card__favorite--active {
          color: var(--color-green-primary);
          background: white;
        }

        .book-card__content {
          padding: var(--spacing-md);
        }

        .book-card__title {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: var(--spacing-xs);
          color: var(--color-gray-warm-dark);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .book-card__author {
          font-size: 14px;
          color: var(--color-gray-warm-medium);
          margin-bottom: var(--spacing-sm);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .book-card__seller {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 12px;
          color: var(--color-gray-warm-medium);
          margin-bottom: var(--spacing-xs);
        }

        .verified-badge {
          color: var(--color-green-primary);
          display: flex;
          align-items: center;
        }

        .book-card__rating {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-top: var(--spacing-xs);
        }

        .rating-stars {
          display: flex;
          gap: 2px;
        }

        .rating-star {
          color: var(--color-beige-gold);
        }

        .rating-text {
          font-size: 12px;
          color: var(--color-gray-warm-medium);
        }

        /* Responsive */
        @media (max-width: 480px) {
          .book-card__content {
            padding: var(--spacing-sm);
          }

          .book-card__title {
            font-size: 14px;
          }

          .book-card__author {
            font-size: 12px;
          }
        }
      `}</style>
    </article>
  );
};

export default BookCard;

