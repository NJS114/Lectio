import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CatalogPageClean = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'default', // default, price_asc, price_desc
    genre: 'all',
    type: 'all' // all, sale, rent
  });
  
  const location = useLocation();

  // Livre de la semaine (sélection spéciale)
  const featuredBook = {
    id: 'featured-week',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    image: '/api/placeholder/400/600',
    genre: 'Essai',
    type: 'both',
    price: 12,
    rentPrice: 0.8,
    condition: 'Bon',
    description: 'Une brève histoire de l\'humanité qui révolutionne notre compréhension de l\'évolution humaine.',
    rating: 4.8,
    reviews: 2847,
    badge: 'Livre de la semaine'
  };

  // Extraire la requête de recherche depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/books');
        const data = await response.json();
        
        // Enrichir les données avec des informations supplémentaires
        const enrichedBooks = (data.books || []).map(book => ({
          ...book,
          image: '/api/placeholder/300/450',
          genre: getGenreFromTitle(book.title),
          type: Math.random() > 0.5 ? 'sale' : (Math.random() > 0.5 ? 'rent' : 'both'),
          condition: ['Neuf', 'Très Bon', 'Bon', 'Correct'][Math.floor(Math.random() * 4)],
          rentPrice: book.price * 0.1,
          rating: (Math.random() * 2 + 3).toFixed(1),
          reviews: Math.floor(Math.random() * 500 + 50)
        }));
        
        setBooks(enrichedBooks);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBooks();
  }, []);

  // Fonction pour déterminer le genre basé sur le titre
  const getGenreFromTitle = (title) => {
    const genres = {
      'L\'Étranger': 'Roman',
      'Sapiens': 'Essai', 
      '1984': 'Science-Fiction',
      'Le Petit Prince': 'Jeunesse'
    };
    return genres[title] || 'Littérature';
  };

  // Filtrer et trier les livres
  useEffect(() => {
    let filtered = books;

    // Recherche par titre/auteur
    if (searchQuery.trim()) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtres
    if (filters.genre !== 'all') {
      filtered = filtered.filter(book => book.genre === filters.genre);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(book => 
        book.type === filters.type || book.type === 'both'
      );
    }

    // Tri
    if (filters.sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredBooks(filtered);
  }, [books, searchQuery, filters]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const BookCard = ({ book }) => (
    <div className="book-card">
      <div className="book-image-container">
        <img src={book.image} alt={book.title} className="book-image" />
        <div className="book-overlay">
          <div className="book-rating">
            ⭐ {book.rating} ({book.reviews})
          </div>
          <div className="book-actions">
            <button className="action-btn primary">Voir détails</button>
            {book.type === 'sale' || book.type === 'both' ? (
              <button className="action-btn secondary">Acheter {book.price}€</button>
            ) : null}
            {book.type === 'rent' || book.type === 'both' ? (
              <button className="action-btn tertiary">Louer {book.rentPrice?.toFixed(1)}€/j</button>
            ) : null}
          </div>
        </div>
      </div>
      
      <div className="book-info">
        <div className="book-meta">
          <span className="book-genre">{book.genre}</span>
          <span className="book-condition">{book.condition}</span>
        </div>
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <div className="book-pricing">
          {book.type === 'sale' || book.type === 'both' ? (
            <span className="price-sale">{book.price}€</span>
          ) : null}
          {book.type === 'rent' || book.type === 'both' ? (
            <span className="price-rent">{book.rentPrice?.toFixed(1)}€/jour</span>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <div className="catalog-clean">
      {/* Hero Section - Livre de la semaine */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">{featuredBook.badge}</div>
              <h1 className="hero-title">{featuredBook.title}</h1>
              <p className="hero-author">par {featuredBook.author}</p>
              <p className="hero-description">{featuredBook.description}</p>
              <div className="hero-rating">
                ⭐ {featuredBook.rating} • {featuredBook.reviews} avis
              </div>
              <div className="hero-actions">
                <button className="hero-btn primary">
                  Acheter {featuredBook.price}€
                </button>
                <button className="hero-btn secondary">
                  Louer {featuredBook.rentPrice}€/jour
                </button>
                <button className="hero-btn tertiary">
                  Aperçu gratuit
                </button>
              </div>
            </div>
            <div className="hero-image">
              <img src={featuredBook.image} alt={featuredBook.title} />
              <div className="hero-image-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un livre, auteur..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="search-button">
              🔍
            </button>
          </div>
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={toggleFilters}
          >
            <span className="filter-icon">⚙️</span>
            Filtres
          </button>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="main-content">
        <div className="content-container">
          {/* Sidebar Filters */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="sidebar-header">
              <h3>Filtres</h3>
              <button className="close-filters" onClick={toggleFilters}>✕</button>
            </div>
            
            <div className="filter-group">
              <h4>Trier par prix</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sortBy"
                    value="default"
                    checked={filters.sortBy === 'default'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  />
                  Par défaut
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sortBy"
                    value="price_asc"
                    checked={filters.sortBy === 'price_asc'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  />
                  Prix croissant
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sortBy"
                    value="price_desc"
                    checked={filters.sortBy === 'price_desc'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  />
                  Prix décroissant
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Genre</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="genre"
                    value="all"
                    checked={filters.genre === 'all'}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                  />
                  Tous les genres
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="genre"
                    value="Roman"
                    checked={filters.genre === 'Roman'}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                  />
                  Roman
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="genre"
                    value="Essai"
                    checked={filters.genre === 'Essai'}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                  />
                  Essai
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="genre"
                    value="Science-Fiction"
                    checked={filters.genre === 'Science-Fiction'}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                  />
                  Science-Fiction
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="genre"
                    value="Jeunesse"
                    checked={filters.genre === 'Jeunesse'}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                  />
                  Jeunesse
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Type</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="type"
                    value="all"
                    checked={filters.type === 'all'}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  />
                  Achat et Location
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="type"
                    value="sale"
                    checked={filters.type === 'sale'}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  />
                  Achat uniquement
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="type"
                    value="rent"
                    checked={filters.type === 'rent'}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  />
                  Location uniquement
                </label>
              </div>
            </div>
          </aside>

          {/* Books Grid */}
          <main className="books-main">
            <div className="results-header">
              <h2>
                {searchQuery ? 
                  `Résultats pour "${searchQuery}" (${filteredBooks.length})` :
                  `Catalogue (${filteredBooks.length} livres)`
                }
              </h2>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="clear-search"
                >
                  Effacer la recherche
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Chargement des livres...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">📚</div>
                <h3>Aucun livre trouvé</h3>
                <p>Essayez de modifier vos critères de recherche ou vos filtres</p>
              </div>
            ) : (
              <div className="books-grid">
                {filteredBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>

      <style jsx>{`
        .catalog-clean {
          min-height: 100vh;
          background: #ffffff;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 0;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 60px;
          align-items: center;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 10px;
          line-height: 1.1;
        }

        .hero-author {
          font-size: 1.3rem;
          opacity: 0.9;
          margin-bottom: 20px;
          font-weight: 300;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 20px;
          opacity: 0.95;
        }

        .hero-rating {
          font-size: 1rem;
          margin-bottom: 30px;
          opacity: 0.9;
        }

        .hero-actions {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .hero-btn {
          padding: 15px 30px;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .hero-btn.primary {
          background: white;
          color: #667eea;
        }

        .hero-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .hero-btn.secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .hero-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .hero-btn.tertiary {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.5);
        }

        .hero-btn.tertiary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .hero-image {
          position: relative;
          text-align: center;
        }

        .hero-image img {
          width: 300px;
          height: 450px;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
          position: relative;
          z-index: 2;
        }

        .hero-image-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 350px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 1;
        }

        /* Search Section */
        .search-section {
          padding: 40px 0;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .search-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .search-bar {
          display: flex;
          background: white;
          border-radius: 50px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
          flex: 1;
          max-width: 600px;
        }

        .search-input {
          flex: 1;
          padding: 18px 25px;
          border: none;
          outline: none;
          font-size: 1.1rem;
          background: transparent;
        }

        .search-button {
          padding: 18px 25px;
          background: #667eea;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-button:hover {
          background: #5a6fd8;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 25px;
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #495057;
        }

        .filter-toggle:hover,
        .filter-toggle.active {
          border-color: #667eea;
          color: #667eea;
          background: #f8f9ff;
        }

        .filter-icon {
          font-size: 1.2rem;
        }

        /* Main Content */
        .main-content {
          padding: 40px 0;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          gap: 30px;
          position: relative;
        }

        /* Sidebar Filters */
        .filters-sidebar {
          width: 280px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          padding: 25px;
          height: fit-content;
          position: sticky;
          top: 20px;
          transform: translateX(-320px);
          transition: transform 0.3s ease;
        }

        .filters-sidebar.show {
          transform: translateX(0);
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f8f9fa;
        }

        .sidebar-header h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .close-filters {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6c757d;
          padding: 5px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .close-filters:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .filter-group {
          margin-bottom: 30px;
        }

        .filter-group h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #495057;
          margin-bottom: 15px;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .filter-option:hover {
          background: #f8f9fa;
        }

        .filter-option input[type="radio"] {
          margin: 0;
          accent-color: #667eea;
        }

        /* Books Main */
        .books-main {
          flex: 1;
          transition: margin-left 0.3s ease;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .results-header h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .clear-search {
          padding: 10px 20px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .clear-search:hover {
          background: #c0392b;
          transform: translateY(-2px);
        }

        /* Loading */
        .loading {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .no-results h3 {
          font-size: 1.5rem;
          color: #495057;
          margin-bottom: 10px;
        }

        /* Books Grid */
        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        /* Book Cards */
        .book-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .book-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .book-image-container {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .book-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .book-card:hover .book-image {
          transform: scale(1.05);
        }

        .book-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .book-card:hover .book-overlay {
          opacity: 1;
        }

        .book-rating {
          align-self: flex-start;
          background: rgba(255,255,255,0.9);
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
        }

        .book-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .action-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: white;
          color: #333;
        }

        .action-btn.secondary {
          background: #28a745;
          color: white;
        }

        .action-btn.tertiary {
          background: #17a2b8;
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px);
        }

        .book-info {
          padding: 20px;
        }

        .book-meta {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .book-genre,
        .book-condition {
          font-size: 0.8rem;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .book-genre {
          background: #e3f2fd;
          color: #1976d2;
        }

        .book-condition {
          background: #f3e5f5;
          color: #7b1fa2;
        }

        .book-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .book-author {
          color: #6c757d;
          font-size: 1rem;
          margin-bottom: 15px;
          font-weight: 500;
        }

        .book-pricing {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .price-sale {
          font-size: 1.3rem;
          font-weight: 700;
          color: #28a745;
        }

        .price-rent {
          font-size: 1rem;
          color: #17a2b8;
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-image img {
            width: 250px;
            height: 375px;
          }

          .search-container {
            flex-direction: column;
            gap: 15px;
          }

          .content-container {
            flex-direction: column;
          }

          .filters-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1000;
            overflow-y: auto;
            transform: translateX(-100%);
          }

          .filters-sidebar.show {
            transform: translateX(0);
          }

          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CatalogPageClean;

