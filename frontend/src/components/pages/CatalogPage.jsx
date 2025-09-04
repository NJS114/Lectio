import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, MapPin, Star, SlidersHorizontal } from 'lucide-react';
import { useBooks } from '../../hooks/useBooks';
import BookCard from '../BookCard';

const CatalogPage = () => {
  const { 
    books, 
    searchQuery, 
    filters, 
    isLoading, 
    searchBooks, 
    getCategories,
    setFilters 
  } = useBooks();

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [localFilters, setLocalFilters] = useState(filters);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Recherche initiale au chargement de la page
    searchBooks('', filters);
    
    // Charger les catégories
    const loadCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(localQuery, localFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    searchBooks(localQuery, newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: '',
      condition: '',
      priceRange: [0, 100],
      location: '',
      mode: 'all'
    };
    setLocalFilters(defaultFilters);
    searchBooks(localQuery, defaultFilters);
  };

  const sortedBooks = React.useMemo(() => {
    let sorted = [...books];
    
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'recent':
      default:
        sorted.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
        break;
    }
    
    return sorted;
  }, [books, sortBy]);

  return (
    <div className="catalog-page">
      <div className="container">
        {/* Header de recherche */}
        <div className="catalog-header">
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-bar-large">
                <Search className="search-bar-large__icon" size={24} />
                <input
                  type="text"
                  placeholder="Titre, auteur, ISBN..."
                  className="search-bar-large__input"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                />
                <button type="submit" className="btn btn--primary search-bar-large__submit">
                  Rechercher
                </button>
              </div>
            </form>

            <div className="quick-filters">
              <button 
                className={`filter-chip ${localFilters.mode === 'all' ? 'filter-chip--active' : ''}`}
                onClick={() => handleFilterChange('mode', 'all')}
              >
                Tous
              </button>
              <button 
                className={`filter-chip ${localFilters.mode === 'sale' ? 'filter-chip--active' : ''}`}
                onClick={() => handleFilterChange('mode', 'sale')}
              >
                Vente
              </button>
              <button 
                className={`filter-chip ${localFilters.mode === 'rental' ? 'filter-chip--active' : ''}`}
                onClick={() => handleFilterChange('mode', 'rental')}
              >
                Location
              </button>
            </div>
          </div>

          {/* Contrôles de vue et tri */}
          <div className="catalog-controls">
            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'view-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'view-btn--active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </button>
            </div>

            <div className="sort-controls">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="recent">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>

            <button
              className="filters-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={20} />
              Filtres
            </button>
          </div>
        </div>

        <div className="catalog-content">
          {/* Sidebar de filtres */}
          <aside className={`filters-sidebar ${showFilters ? 'filters-sidebar--open' : ''}`}>
            <div className="filters-header">
              <h3>Filtres</h3>
              <button onClick={clearFilters} className="btn btn--quiet">
                Effacer
              </button>
            </div>

            <div className="filter-group">
              <h4>Catégorie</h4>
              <select
                value={localFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <h4>État</h4>
              <div className="filter-options">
                {[
                  { value: '', label: 'Tous les états' },
                  { value: 'new', label: 'Neuf' },
                  { value: 'very-good', label: 'Très bon' },
                  { value: 'good', label: 'Bon' },
                  { value: 'fair', label: 'Correct' }
                ].map(option => (
                  <label key={option.value} className="filter-option">
                    <input
                      type="radio"
                      name="condition"
                      value={option.value}
                      checked={localFilters.condition === option.value}
                      onChange={(e) => handleFilterChange('condition', e.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Prix maximum</h4>
              <input
                type="range"
                min="0"
                max="100"
                value={localFilters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                className="price-range"
              />
              <div className="price-range-labels">
                <span>0€</span>
                <span>{localFilters.priceRange[1]}€</span>
              </div>
            </div>
          </aside>

          {/* Liste des résultats */}
          <div className="catalog-results">
            <div className="results-header">
              <h2>{books.length} livre{books.length > 1 ? 's' : ''} trouvé{books.length > 1 ? 's' : ''}</h2>
              {searchQuery && (
                <p>pour "{searchQuery}"</p>
              )}
            </div>

            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Recherche en cours...</p>
              </div>
            ) : books.length === 0 ? (
              <div className="empty-state">
                <h3>Aucun livre trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
                <button onClick={clearFilters} className="btn btn--primary">
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <div className={`books-grid books-grid--${viewMode}`}>
                {sortedBooks.map(book => (
                  <BookCard 
                    key={book.id} 
                    {...book} 
                    mode={book.availableForRental && book.availableForSale ? 'both' : 
                          book.availableForRental ? 'rental' : 'sale'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .catalog-page {
          min-height: 100vh;
          padding: var(--spacing-xl) 0;
        }

        .catalog-header {
          margin-bottom: var(--spacing-xl);
        }

        .search-section {
          margin-bottom: var(--spacing-lg);
        }

        .search-form {
          margin-bottom: var(--spacing-md);
        }

        .search-bar-large {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid var(--color-gray-warm-light);
          border-radius: var(--radius-lg);
          padding: var(--spacing-sm);
          box-shadow: var(--shadow-sm);
          max-width: 600px;
        }

        .search-bar-large:focus-within {
          border-color: var(--color-green-primary);
          box-shadow: 0 0 0 3px rgba(168, 213, 186, 0.1);
        }

        .search-bar-large__icon {
          color: var(--color-gray-warm-medium);
          margin: 0 var(--spacing-sm);
        }

        .search-bar-large__input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          padding: var(--spacing-sm);
        }

        .quick-filters {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .catalog-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-md);
          padding: var(--spacing-md) 0;
          border-top: 1px solid var(--color-gray-warm-light);
        }

        .view-controls {
          display: flex;
          gap: var(--spacing-xs);
        }

        .view-btn {
          padding: var(--spacing-sm);
          border: 1px solid var(--color-gray-warm-light);
          background: white;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .view-btn--active {
          background: var(--color-green-primary);
          color: white;
          border-color: var(--color-green-primary);
        }

        .sort-select {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-sm);
          background: white;
          font-size: 14px;
        }

        .filters-toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--color-gray-warm-light);
          background: white;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filters-toggle:hover {
          background: var(--color-beige-paper);
        }

        .catalog-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--spacing-xl);
        }

        @media (max-width: 1024px) {
          .catalog-content {
            grid-template-columns: 1fr;
          }
        }

        .filters-sidebar {
          background: white;
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          height: fit-content;
          position: sticky;
          top: var(--spacing-lg);
        }

        @media (max-width: 1024px) {
          .filters-sidebar {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            background: white;
            border: none;
            border-radius: 0;
            overflow-y: auto;
          }

          .filters-sidebar--open {
            display: block;
          }
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .filter-group {
          margin-bottom: var(--spacing-lg);
        }

        .filter-group h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-warm-dark);
        }

        .filter-select {
          width: 100%;
          padding: var(--spacing-sm);
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-sm);
          background: white;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }

        .filter-option input {
          margin: 0;
        }

        .price-range {
          width: 100%;
          margin-bottom: var(--spacing-sm);
        }

        .price-range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--color-gray-warm-medium);
        }

        .results-header {
          margin-bottom: var(--spacing-lg);
        }

        .results-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: var(--color-gray-warm-dark);
        }

        .results-header p {
          color: var(--color-gray-warm-medium);
          margin-top: var(--spacing-xs);
        }

        .books-grid--grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: var(--spacing-lg);
        }

        .books-grid--list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .loading-state {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--color-gray-warm-light);
          border-top: 3px solid var(--color-green-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto var(--spacing-md);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .empty-state h3 {
          font-size: 24px;
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-warm-dark);
        }

        .empty-state p {
          color: var(--color-gray-warm-medium);
          margin-bottom: var(--spacing-lg);
        }

        @media (max-width: 767px) {
          .catalog-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .view-controls {
            justify-content: center;
          }

          .books-grid--grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
};

export default CatalogPage;

