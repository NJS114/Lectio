import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEbooks } from '../../hooks/useEbooks';
import { useAuth } from '../../hooks/useAuth';
import {
  Search, Filter, Star, Download, Eye, Heart,
  BookOpen, Clock, DollarSign, Tag, User,
  Grid, List, SortAsc, SortDesc, Plus
} from 'lucide-react';

const EbooksPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ebooks, searchEbooks, isLoading } = useEbooks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 100],
    sortBy: 'newest'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [filteredEbooks, setFilteredEbooks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'all', 'Business', 'Informatique', 'Marketing', 'Design', 
    'Développement Personnel', 'Fiction', 'Non-Fiction', 'Éducation',
    'Santé', 'Cuisine', 'Voyage', 'Art'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'popular', label: 'Plus populaires' },
    { value: 'rating', label: 'Mieux notés' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' }
  ];

  useEffect(() => {
    const results = searchEbooks(searchQuery, filters);
    setFilteredEbooks(results);
  }, [searchQuery, filters, ebooks, searchEbooks]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'filled' : 'empty'}
      />
    ));
  };

  const renderEbookCard = (ebook) => (
    <div key={ebook.id} className="ebook-card" onClick={() => navigate(`/ebook/${ebook.id}`)}>
      <div className="ebook-cover">
        <img src={ebook.cover} alt={ebook.title} />
        <div className="ebook-overlay">
          <button className="action-btn preview" title="Aperçu">
            <Eye size={20} />
          </button>
          <button className="action-btn favorite" title="Favoris">
            <Heart size={20} />
          </button>
        </div>
        {ebook.discount > 0 && (
          <div className="discount-badge">-{ebook.discount}%</div>
        )}
      </div>
      
      <div className="ebook-info">
        <div className="ebook-category">{ebook.category}</div>
        <h3 className="ebook-title">{ebook.title}</h3>
        <p className="ebook-author">Par {ebook.author}</p>
        
        <div className="ebook-rating">
          <div className="stars">
            {renderStars(ebook.rating)}
          </div>
          <span className="rating-text">
            {ebook.rating.toFixed(1)} ({ebook.reviews} avis)
          </span>
        </div>

        <div className="ebook-details">
          <span className="format">{ebook.format}</span>
          <span className="pages">{ebook.pages} pages</span>
          <span className="language">{ebook.language}</span>
        </div>

        <div className="ebook-tags">
          {ebook.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
          {ebook.tags.length > 3 && (
            <span className="tag more">+{ebook.tags.length - 3}</span>
          )}
        </div>

        <div className="ebook-price">
          {ebook.originalPrice && ebook.originalPrice > ebook.price && (
            <span className="original-price">{formatPrice(ebook.originalPrice)}</span>
          )}
          <span className="current-price">{formatPrice(ebook.price)}</span>
        </div>

        <div className="ebook-stats">
          <div className="stat">
            <Download size={14} />
            <span>{ebook.sales_stats.total_sales}</span>
          </div>
          <div className="stat">
            <Clock size={14} />
            <span>{formatDate(ebook.publishDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEbookList = (ebook) => (
    <div key={ebook.id} className="ebook-list-item" onClick={() => navigate(`/ebook/${ebook.id}`)}>
      <div className="list-cover">
        <img src={ebook.cover} alt={ebook.title} />
        {ebook.discount > 0 && (
          <div className="discount-badge">-{ebook.discount}%</div>
        )}
      </div>
      
      <div className="list-content">
        <div className="list-header">
          <div className="list-category">{ebook.category}</div>
          <div className="list-price">
            {ebook.originalPrice && ebook.originalPrice > ebook.price && (
              <span className="original-price">{formatPrice(ebook.originalPrice)}</span>
            )}
            <span className="current-price">{formatPrice(ebook.price)}</span>
          </div>
        </div>
        
        <h3 className="list-title">{ebook.title}</h3>
        <p className="list-author">Par {ebook.author}</p>
        <p className="list-description">{ebook.description}</p>
        
        <div className="list-meta">
          <div className="list-rating">
            <div className="stars">
              {renderStars(ebook.rating)}
            </div>
            <span>{ebook.rating.toFixed(1)} ({ebook.reviews} avis)</span>
          </div>
          
          <div className="list-details">
            <span>{ebook.format}</span>
            <span>{ebook.pages} pages</span>
            <span>{ebook.language}</span>
            <span>{ebook.sales_stats.total_sales} téléchargements</span>
          </div>
        </div>

        <div className="list-tags">
          {ebook.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="list-actions">
        <button className="action-btn preview" title="Aperçu">
          <Eye size={20} />
        </button>
        <button className="action-btn favorite" title="Favoris">
          <Heart size={20} />
        </button>
        <button className="action-btn download" title="Télécharger">
          <Download size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="ebooks-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Ebooks</h1>
            <p>Découvrez notre collection de livres numériques</p>
          </div>
          
          {user && (
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/creer-ebook')}
            >
              <Plus size={20} />
              Créer un ebook
            </button>
          )}
        </div>

        <div className="search-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Rechercher un ebook, auteur, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="search-controls">
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filtres
            </button>
            
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Catégorie</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Toutes les catégories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Prix maximum</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
              />
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>

            <div className="filter-group">
              <label>Trier par</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="results-header">
          <div className="results-count">
            {filteredEbooks.length} ebook{filteredEbooks.length > 1 ? 's' : ''} trouvé{filteredEbooks.length > 1 ? 's' : ''}
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement des ebooks...</p>
          </div>
        ) : filteredEbooks.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={64} />
            <h3>Aucun ebook trouvé</h3>
            <p>Essayez de modifier vos critères de recherche ou de navigation.</p>
            {user && (
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/creer-ebook')}
              >
                <Plus size={20} />
                Créer le premier ebook
              </button>
            )}
          </div>
        ) : (
          <div className={`ebooks-grid ${viewMode}`}>
            {viewMode === 'grid' 
              ? filteredEbooks.map(renderEbookCard)
              : filteredEbooks.map(renderEbookList)
            }
          </div>
        )}
      </div>

      <style jsx>{`
        .ebooks-page {
          min-height: 100vh;
          background: var(--color-background);
          padding: 2rem 0;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow-card);
        }

        .header-content h1 {
          margin: 0 0 0.5rem 0;
          color: var(--color-text);
        }

        .header-content p {
          margin: 0;
          color: var(--color-text-secondary);
        }

        .search-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          align-items: center;
        }

        .search-bar {
          position: relative;
          flex: 1;
        }

        .search-bar svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-secondary);
        }

        .search-bar input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 1rem;
          background: white;
        }

        .search-bar input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .search-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: white;
          color: var(--color-text);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-toggle:hover,
        .filter-toggle.active {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .view-controls {
          display: flex;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }

        .view-btn {
          padding: 0.75rem;
          border: none;
          background: white;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn:hover,
        .view-btn.active {
          background: var(--color-primary);
          color: white;
        }

        .filters-panel {
          display: flex;
          gap: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: var(--shadow-card);
          margin-bottom: 1rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 200px;
        }

        .filter-group label {
          font-weight: 500;
          color: var(--color-text);
        }

        .filter-group select,
        .filter-group input {
          padding: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          background: white;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 0 0.5rem;
        }

        .results-count {
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .ebooks-grid {
          display: grid;
          gap: 2rem;
        }

        .ebooks-grid.grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }

        .ebooks-grid.list {
          grid-template-columns: 1fr;
        }

        .ebook-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-card);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .ebook-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }

        .ebook-cover {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
        }

        .ebook-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ebook-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .ebook-card:hover .ebook-overlay {
          opacity: 1;
        }

        .action-btn {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          border: none;
          background: white;
          color: var(--color-text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: var(--color-primary);
          color: white;
        }

        .discount-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: var(--color-error);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .ebook-info {
          padding: 1.5rem;
        }

        .ebook-category {
          color: var(--color-primary);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .ebook-title {
          margin: 0 0 0.5rem 0;
          color: var(--color-text);
          font-size: 1.1rem;
          line-height: 1.3;
        }

        .ebook-author {
          margin: 0 0 1rem 0;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .ebook-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stars {
          display: flex;
          gap: 0.125rem;
        }

        .stars svg.filled {
          color: var(--color-warning);
          fill: currentColor;
        }

        .stars svg.empty {
          color: var(--color-border);
        }

        .rating-text {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .ebook-details {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .ebook-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          padding: 0.25rem 0.5rem;
          background: var(--color-primary-light);
          color: var(--color-primary);
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .tag.more {
          background: var(--color-border);
          color: var(--color-text-secondary);
        }

        .ebook-price {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .original-price {
          text-decoration: line-through;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .current-price {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .ebook-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .ebook-list-item {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow-card);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .ebook-list-item:hover {
          box-shadow: var(--shadow-hover);
        }

        .list-cover {
          position: relative;
          width: 120px;
          height: 160px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
        }

        .list-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .list-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .list-category {
          color: var(--color-primary);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .list-price {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .list-title {
          margin: 0;
          color: var(--color-text);
          font-size: 1.2rem;
          line-height: 1.3;
        }

        .list-author {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .list-description {
          margin: 0;
          color: var(--color-text-secondary);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .list-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .list-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .list-details {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .list-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .list-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }

        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          text-align: center;
          color: var(--color-text-secondary);
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid var(--color-border);
          border-top: 3px solid var(--color-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state h3 {
          margin: 1rem 0 0.5rem 0;
          color: var(--color-text);
        }

        .empty-state p {
          margin: 0 0 2rem 0;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn-primary {
          background: var(--color-primary);
          color: white;
        }

        .btn-primary:hover {
          background: var(--color-primary-dark);
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .search-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-controls {
            justify-content: space-between;
          }
          
          .filters-panel {
            flex-direction: column;
            gap: 1rem;
          }
          
          .filter-group {
            min-width: auto;
          }
          
          .ebooks-grid.grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
          
          .ebook-list-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .list-cover {
            width: 150px;
            height: 200px;
          }
          
          .list-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
          }
          
          .list-meta {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }
          
          .list-actions {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default EbooksPage;

