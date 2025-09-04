import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderCatalog from '../HeaderCatalog';

const CatalogPageModern = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all', // all, sale, rent
    priceRange: [0, 100],
    condition: 'all'
  });
  
  const location = useLocation();

  // Livres de la semaine (sélection spéciale)
  const featuredBooks = [
    {
      id: 'featured-1',
      title: 'L\'Étranger',
      author: 'Albert Camus',
      image: '/api/placeholder/400/300',
      genre: 'Roman',
      type: 'sale',
      price: 8.5,
      condition: 'Très Bon',
      description: 'Un classique de la littérature française'
    },
    {
      id: 'featured-2', 
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      image: '/api/placeholder/400/300',
      genre: 'Essai',
      type: 'both',
      price: 12,
      rentPrice: 0.8,
      condition: 'Bon',
      description: 'Une brève histoire de l\'humanité'
    },
    {
      id: 'featured-3',
      title: '1984',
      author: 'George Orwell', 
      image: '/api/placeholder/400/300',
      genre: 'Science-Fiction',
      type: 'sale',
      price: 9.5,
      condition: 'Bon',
      description: 'Le chef-d\'œuvre dystopique'
    },
    {
      id: 'featured-4',
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      image: '/api/placeholder/400/300', 
      genre: 'Jeunesse',
      type: 'sale',
      price: 6.9,
      condition: 'Neuf',
      description: 'Le conte poétique intemporel'
    }
  ];

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
          image: '/api/placeholder/300/400',
          genre: getGenreFromTitle(book.title),
          type: Math.random() > 0.5 ? 'sale' : (Math.random() > 0.5 ? 'rent' : 'both'),
          condition: ['Neuf', 'Très Bon', 'Bon', 'Correct'][Math.floor(Math.random() * 4)],
          rentPrice: book.price * 0.1
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

  // Filtrer les livres selon la requête de recherche et les filtres
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
    if (filters.category !== 'all') {
      filtered = filtered.filter(book => book.genre === filters.category);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(book => 
        book.type === filters.type || book.type === 'both'
      );
    }

    if (filters.condition !== 'all') {
      filtered = filtered.filter(book => book.condition === filters.condition);
    }

    // Filtre par prix
    filtered = filtered.filter(book => 
      book.price >= filters.priceRange[0] && book.price <= filters.priceRange[1]
    );

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

  const BookCard = ({ book, isFeatured = false }) => (
    <div className={`book-card ${isFeatured ? 'featured-card' : ''}`}>
      <div className="book-image-container">
        <img src={book.image} alt={book.title} className="book-image" />
        
        {/* Tags overlay */}
        <div className="book-tags">
          <span className={`genre-tag ${book.genre.toLowerCase().replace(/[^a-z]/g, '')}`}>
            {book.genre}
          </span>
          {book.type === 'sale' && <span className="type-tag sale">À vendre</span>}
          {book.type === 'rent' && <span className="type-tag rent">À louer</span>}
          {book.type === 'both' && (
            <>
              <span className="type-tag sale">À vendre</span>
              <span className="type-tag rent">À louer</span>
            </>
          )}
          <span className={`condition-tag ${book.condition.toLowerCase().replace(/[^a-z]/g, '')}`}>
            {book.condition}
          </span>
        </div>

        {/* Prix overlay */}
        <div className="book-price">
          {book.type === 'sale' || book.type === 'both' ? (
            <span className="sale-price">{book.price}€</span>
          ) : null}
          {book.type === 'rent' || book.type === 'both' ? (
            <span className="rent-price">{book.rentPrice?.toFixed(1)}€/j</span>
          ) : null}
        </div>
      </div>
      
      {/* Informations du livre */}
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        {isFeatured && book.description && (
          <p className="book-description">{book.description}</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <HeaderCatalog />
      <div className="catalog-modern">
      {/* Carrousel des livres de la semaine */}
      <section className="featured-section">
        <div className="featured-carousel">
          <h2 className="section-title">📚 Livres de la semaine</h2>
          <div className="carousel-container">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} isFeatured={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Barre de recherche centrale */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un livre, auteur, genre..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="search-button">🔍</button>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label>Catégorie:</label>
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">Toutes</option>
              <option value="Roman">Roman</option>
              <option value="Essai">Essai</option>
              <option value="Science-Fiction">Science-Fiction</option>
              <option value="Jeunesse">Jeunesse</option>
              <option value="Littérature">Littérature</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Type:</label>
            <select 
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="sale">À vendre</option>
              <option value="rent">À louer</option>
            </select>
          </div>

          <div className="filter-group">
            <label>État:</label>
            <select 
              value={filters.condition} 
              onChange={(e) => handleFilterChange('condition', e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="Neuf">Neuf</option>
              <option value="Très Bon">Très Bon</option>
              <option value="Bon">Bon</option>
              <option value="Correct">Correct</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Prix max: {filters.priceRange[1]}€</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
              className="price-slider"
            />
          </div>
        </div>
      </section>

      {/* Résultats */}
      <section className="results-section">
        <div className="results-header">
          <h2>
            {searchQuery ? 
              `Résultats pour "${searchQuery}" (${filteredBooks.length})` :
              `Tous les livres (${filteredBooks.length})`
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
          <div className="loading">Chargement des livres...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="no-results">
            <p>Aucun livre trouvé</p>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .catalog-modern {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 0;
        }

        /* Carrousel des livres de la semaine */
        .featured-section {
          padding: 40px 20px;
          background: white;
          margin-bottom: 30px;
        }

        .featured-carousel {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 30px;
          font-weight: 700;
        }

        .carousel-container {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 20px 0;
          scroll-behavior: smooth;
          width: 70%;
          margin: 0 auto;
          border-radius: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .carousel-container::-webkit-scrollbar {
          height: 8px;
        }

        .carousel-container::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }

        .carousel-container::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 4px;
        }

        /* Barre de recherche centrale */
        .search-section {
          padding: 40px 20px;
          background: white;
          margin-bottom: 20px;
        }

        .search-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .search-bar {
          display: flex;
          background: white;
          border-radius: 50px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          overflow: hidden;
          border: 2px solid #e1e8ed;
          transition: all 0.3s ease;
        }

        .search-bar:focus-within {
          border-color: #667eea;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .search-input {
          flex: 1;
          padding: 20px 30px;
          border: none;
          outline: none;
          font-size: 1.1rem;
          background: transparent;
        }

        .search-button {
          padding: 20px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-button:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }

        /* Filtres */
        .filters-section {
          padding: 20px;
          background: white;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .filters-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 150px;
        }

        .filter-group label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }

        .filter-group select {
          padding: 10px 15px;
          border: 2px solid #e1e8ed;
          border-radius: 10px;
          background: white;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-group select:focus {
          border-color: #667eea;
          outline: none;
        }

        .price-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e1e8ed;
          outline: none;
          cursor: pointer;
        }

        .price-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #667eea;
          cursor: pointer;
        }

        /* Résultats */
        .results-section {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
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
          color: #2c3e50;
          font-size: 1.8rem;
          font-weight: 600;
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

        .loading, .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #7f8c8d;
          font-size: 1.2rem;
        }

        .no-results p:first-child {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        /* Grille des livres */
        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
          padding: 20px 0;
        }

        /* Cards des livres */
        .book-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .book-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .featured-card {
          min-width: 300px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
        }

        .book-image-container {
          position: relative;
          height: 300px;
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

        /* Tags overlay */
        .book-tags {
          position: absolute;
          top: 15px;
          left: 15px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .genre-tag, .type-tag, .condition-tag {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .genre-tag {
          background: rgba(52, 152, 219, 0.9);
          color: white;
        }

        .type-tag.sale {
          background: rgba(46, 204, 113, 0.9);
          color: white;
        }

        .type-tag.rent {
          background: rgba(241, 196, 15, 0.9);
          color: white;
        }

        .condition-tag {
          background: rgba(155, 89, 182, 0.9);
          color: white;
        }

        /* Prix overlay */
        .book-price {
          position: absolute;
          bottom: 15px;
          right: 15px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          align-items: flex-end;
        }

        .sale-price, .rent-price {
          padding: 8px 15px;
          border-radius: 25px;
          font-weight: 700;
          font-size: 1.1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .sale-price {
          background: rgba(231, 76, 60, 0.9);
          color: white;
        }

        .rent-price {
          background: rgba(52, 152, 219, 0.9);
          color: white;
          font-size: 0.9rem;
        }

        /* Informations du livre */
        .book-info {
          padding: 20px;
        }

        .book-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .book-author {
          color: #7f8c8d;
          font-size: 1rem;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .book-description {
          color: #95a5a6;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-top: 10px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .carousel-container {
            width: 95%;
            padding: 20px;
          }

          .featured-card {
            min-width: 250px;
          }

          .filters-container {
            flex-direction: column;
            gap: 20px;
          }

          .filter-group {
            width: 100%;
            max-width: 300px;
          }

          .results-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }

          .section-title {
            font-size: 2rem;
          }
        }
      `}</style>
      </div>
    </>
  );
};

export default CatalogPageModern;

