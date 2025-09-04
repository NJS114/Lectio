import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const EbooksPageDedicated = () => {
  const [ebooks, setEbooks] = useState([]);
  const [filteredEbooks, setFilteredEbooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'default', // default, price_asc, price_desc, rating_desc
    category: 'all',
    format: 'all', // all, pdf, epub, mobi
    priceRange: 'all', // all, free, under_10, under_20, premium
    language: 'all' // all, french, english
  });
  
  const location = useLocation();

  // Ebook de la semaine (sélection spéciale)
  const featuredEbook = {
    id: 'featured-ebook-week',
    title: 'Maîtriser React et Next.js',
    author: 'Sophie Moreau',
    image: '/api/placeholder/400/600',
    category: 'Informatique',
    formats: ['PDF', 'EPUB'],
    price: 22.99,
    originalPrice: 29.99,
    pages: 350,
    size: '15.2 MB',
    language: 'Français',
    description: 'Guide complet pour développer des applications web modernes avec React et Next.js. Inclut des projets pratiques et les dernières bonnes pratiques.',
    rating: 4.9,
    reviews: 1247,
    downloads: 8542,
    badge: 'Ebook de la semaine',
    discount: 23,
    tags: ['React', 'Next.js', 'JavaScript', 'Web Development'],
    preview: true,
    bestseller: true
  };

  // Données d'ebooks enrichies
  const ebooksData = [
    {
      id: 'ebook-1',
      title: 'Python pour les Débutants - Guide Complet 2024',
      author: 'Jean-Pierre Dubois',
      image: '/api/placeholder/300/450',
      category: 'Informatique',
      formats: ['PDF', 'EPUB'],
      price: 18.99,
      originalPrice: 24.99,
      pages: 280,
      size: '12.5 MB',
      language: 'Français',
      description: 'Apprenez Python de zéro avec ce guide complet incluant des exercices pratiques et des projets réels.',
      rating: 4.7,
      reviews: 892,
      downloads: 5234,
      tags: ['Python', 'Programmation', 'Débutant'],
      preview: true,
      discount: 24
    },
    {
      id: 'ebook-2',
      title: 'Marketing Digital Avancé',
      author: 'Marie Dubois',
      image: '/api/placeholder/300/450',
      category: 'Business',
      formats: ['PDF', 'MOBI'],
      price: 15.99,
      originalPrice: 19.99,
      pages: 220,
      size: '8.7 MB',
      language: 'Français',
      description: 'Stratégies avancées de marketing digital pour développer votre business en ligne.',
      rating: 4.5,
      reviews: 634,
      downloads: 3421,
      tags: ['Marketing', 'Digital', 'Business'],
      preview: true,
      discount: 20
    },
    {
      id: 'ebook-3',
      title: 'Design Thinking & UX',
      author: 'Thomas Martin',
      image: '/api/placeholder/300/450',
      category: 'Design',
      formats: ['PDF', 'EPUB'],
      price: 21.99,
      originalPrice: 27.99,
      pages: 310,
      size: '18.3 MB',
      language: 'Français',
      description: 'Méthodes et outils pour créer des expériences utilisateur exceptionnelles.',
      rating: 4.8,
      reviews: 756,
      downloads: 4123,
      tags: ['UX', 'Design', 'Innovation'],
      preview: true,
      discount: 21
    },
    {
      id: 'ebook-4',
      title: 'Intelligence Artificielle Pratique',
      author: 'Dr. Claire Rousseau',
      image: '/api/placeholder/300/450',
      category: 'Informatique',
      formats: ['PDF', 'EPUB', 'MOBI'],
      price: 29.99,
      originalPrice: 39.99,
      pages: 420,
      size: '22.1 MB',
      language: 'Français',
      description: 'Introduction pratique à l\'IA avec des exemples concrets et des cas d\'usage réels.',
      rating: 4.9,
      reviews: 1123,
      downloads: 6789,
      tags: ['IA', 'Machine Learning', 'Technologie'],
      preview: true,
      bestseller: true,
      discount: 25
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
    setIsLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setEbooks(ebooksData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filtrer et trier les ebooks
  useEffect(() => {
    let filtered = ebooks;

    // Recherche par titre/auteur/tags
    if (searchQuery.trim()) {
      filtered = filtered.filter(ebook => 
        ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ebook.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filtres
    if (filters.category !== 'all') {
      filtered = filtered.filter(ebook => ebook.category === filters.category);
    }

    if (filters.format !== 'all') {
      filtered = filtered.filter(ebook => 
        ebook.formats.some(format => format.toLowerCase() === filters.format.toLowerCase())
      );
    }

    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'free':
          filtered = filtered.filter(ebook => ebook.price === 0);
          break;
        case 'under_10':
          filtered = filtered.filter(ebook => ebook.price < 10);
          break;
        case 'under_20':
          filtered = filtered.filter(ebook => ebook.price < 20);
          break;
        case 'premium':
          filtered = filtered.filter(ebook => ebook.price >= 20);
          break;
      }
    }

    if (filters.language !== 'all') {
      filtered = filtered.filter(ebook => ebook.language.toLowerCase().includes(filters.language.toLowerCase()));
    }

    // Tri
    switch (filters.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Tri par défaut : bestsellers en premier, puis par rating
        filtered.sort((a, b) => {
          if (a.bestseller && !b.bestseller) return -1;
          if (!a.bestseller && b.bestseller) return 1;
          return b.rating - a.rating;
        });
    }

    setFilteredEbooks(filtered);
  }, [ebooks, searchQuery, filters]);

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

  const EbookCard = ({ ebook }) => (
    <div className="ebook-card">
      <div className="ebook-image-container">
        <img src={ebook.image} alt={ebook.title} className="ebook-image" />
        
        {/* Badges */}
        <div className="ebook-badges">
          {ebook.bestseller && <span className="badge bestseller">Bestseller</span>}
          {ebook.discount && <span className="badge discount">-{ebook.discount}%</span>}
          {ebook.preview && <span className="badge preview">Aperçu</span>}
        </div>

        {/* Overlay au hover */}
        <div className="ebook-overlay">
          <div className="ebook-stats">
            <div className="stat">
              <span className="stat-icon">⭐</span>
              <span>{ebook.rating} ({ebook.reviews})</span>
            </div>
            <div className="stat">
              <span className="stat-icon">📥</span>
              <span>{ebook.downloads.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="ebook-actions">
            <button className="action-btn primary">Acheter {ebook.price}€</button>
            {ebook.preview && (
              <button className="action-btn secondary">Aperçu gratuit</button>
            )}
            <button className="action-btn tertiary">Ajouter au panier</button>
          </div>
        </div>
      </div>
      
      <div className="ebook-info">
        <div className="ebook-meta">
          <span className="ebook-category">{ebook.category}</span>
          <div className="ebook-formats">
            {ebook.formats.map(format => (
              <span key={format} className="format-badge">{format}</span>
            ))}
          </div>
        </div>
        
        <h3 className="ebook-title">{ebook.title}</h3>
        <p className="ebook-author">par {ebook.author}</p>
        
        <div className="ebook-details">
          <span className="detail">{ebook.pages} pages</span>
          <span className="detail">{ebook.size}</span>
          <span className="detail">{ebook.language}</span>
        </div>
        
        <div className="ebook-tags">
          {ebook.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="ebook-pricing">
          <div className="price-current">{ebook.price}€</div>
          {ebook.originalPrice && ebook.originalPrice > ebook.price && (
            <div className="price-original">{ebook.originalPrice}€</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="ebooks-page">
      {/* Hero Section - Ebook de la semaine */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">{featuredEbook.badge}</div>
              <h1 className="hero-title">{featuredEbook.title}</h1>
              <p className="hero-author">par {featuredEbook.author}</p>
              <p className="hero-description">{featuredEbook.description}</p>
              
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-icon">⭐</span>
                  <span>{featuredEbook.rating} • {featuredEbook.reviews} avis</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">📥</span>
                  <span>{featuredEbook.downloads.toLocaleString()} téléchargements</span>
                </div>
              </div>
              
              <div className="hero-details">
                <span className="detail">{featuredEbook.pages} pages</span>
                <span className="detail">{featuredEbook.size}</span>
                <span className="detail">{featuredEbook.formats.join(', ')}</span>
              </div>
              
              <div className="hero-actions">
                <button className="hero-btn primary">
                  Acheter {featuredEbook.price}€
                  {featuredEbook.originalPrice && (
                    <span className="original-price">{featuredEbook.originalPrice}€</span>
                  )}
                </button>
                <button className="hero-btn secondary">
                  Aperçu gratuit
                </button>
                <button className="hero-btn tertiary">
                  Ajouter au panier
                </button>
              </div>
            </div>
            
            <div className="hero-image">
              <img src={featuredEbook.image} alt={featuredEbook.title} />
              <div className="hero-image-glow"></div>
              {featuredEbook.discount && (
                <div className="hero-discount">-{featuredEbook.discount}%</div>
              )}
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
              placeholder="Rechercher un ebook, auteur, catégorie..."
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
              <h3>Filtres Ebooks</h3>
              <button className="close-filters" onClick={toggleFilters}>✕</button>
            </div>
            
            <div className="filter-group">
              <h4>Trier par</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sortBy"
                    value="default"
                    checked={filters.sortBy === 'default'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  />
                  Recommandés
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sortBy"
                    value="rating_desc"
                    checked={filters.sortBy === 'rating_desc'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  />
                  Mieux notés
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
              <h4>Catégorie</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={filters.category === 'all'}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />
                  Toutes les catégories
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value="Informatique"
                    checked={filters.category === 'Informatique'}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />
                  Informatique
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value="Business"
                    checked={filters.category === 'Business'}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />
                  Business
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value="Design"
                    checked={filters.category === 'Design'}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />
                  Design
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Format</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="format"
                    value="all"
                    checked={filters.format === 'all'}
                    onChange={(e) => handleFilterChange('format', e.target.value)}
                  />
                  Tous les formats
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    checked={filters.format === 'pdf'}
                    onChange={(e) => handleFilterChange('format', e.target.value)}
                  />
                  PDF
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="format"
                    value="epub"
                    checked={filters.format === 'epub'}
                    onChange={(e) => handleFilterChange('format', e.target.value)}
                  />
                  EPUB
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="format"
                    value="mobi"
                    checked={filters.format === 'mobi'}
                    onChange={(e) => handleFilterChange('format', e.target.value)}
                  />
                  MOBI
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Prix</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    value="all"
                    checked={filters.priceRange === 'all'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  Tous les prix
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    value="free"
                    checked={filters.priceRange === 'free'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  Gratuit
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    value="under_10"
                    checked={filters.priceRange === 'under_10'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  Moins de 10€
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    value="under_20"
                    checked={filters.priceRange === 'under_20'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  Moins de 20€
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    value="premium"
                    checked={filters.priceRange === 'premium'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  Premium (20€+)
                </label>
              </div>
            </div>
          </aside>

          {/* Ebooks Grid */}
          <main className="ebooks-main">
            <div className="results-header">
              <h2>
                {searchQuery ? 
                  `Résultats pour "${searchQuery}" (${filteredEbooks.length})` :
                  `Ebooks (${filteredEbooks.length} disponibles)`
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
                <p>Chargement des ebooks...</p>
              </div>
            ) : filteredEbooks.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">📱</div>
                <h3>Aucun ebook trouvé</h3>
                <p>Essayez de modifier vos critères de recherche ou vos filtres</p>
              </div>
            ) : (
              <div className="ebooks-grid">
                {filteredEbooks.map(ebook => (
                  <EbookCard key={ebook.id} ebook={ebook} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>

      <style jsx>{`
        .ebooks-page {
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
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 10px;
          line-height: 1.1;
        }

        .hero-author {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 20px;
          font-weight: 300;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 25px;
          opacity: 0.95;
        }

        .hero-stats {
          display: flex;
          gap: 30px;
          margin-bottom: 20px;
        }

        .hero-stats .stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          opacity: 0.9;
        }

        .hero-details {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .hero-details .detail {
          background: rgba(255, 255, 255, 0.15);
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 500;
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
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .hero-btn.primary {
          background: white;
          color: #667eea;
        }

        .hero-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .original-price {
          text-decoration: line-through;
          opacity: 0.7;
          font-size: 0.9rem;
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

        .hero-discount {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #e74c3c;
          color: white;
          padding: 8px 12px;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.9rem;
          z-index: 3;
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

        /* Ebooks Main */
        .ebooks-main {
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

        /* Ebooks Grid */
        .ebooks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        /* Ebook Cards */
        .ebook-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .ebook-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .ebook-image-container {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .ebook-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .ebook-card:hover .ebook-image {
          transform: scale(1.05);
        }

        .ebook-badges {
          position: absolute;
          top: 15px;
          left: 15px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge.bestseller {
          background: #f39c12;
          color: white;
        }

        .badge.discount {
          background: #e74c3c;
          color: white;
        }

        .badge.preview {
          background: #3498db;
          color: white;
        }

        .ebook-overlay {
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

        .ebook-card:hover .ebook-overlay {
          opacity: 1;
        }

        .ebook-stats {
          align-self: flex-end;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ebook-stats .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.9);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #333;
        }

        .ebook-actions {
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
          background: #3498db;
          color: white;
        }

        .action-btn.tertiary {
          background: #95a5a6;
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px);
        }

        .ebook-info {
          padding: 20px;
        }

        .ebook-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .ebook-category {
          font-size: 0.8rem;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #e3f2fd;
          color: #1976d2;
        }

        .ebook-formats {
          display: flex;
          gap: 4px;
        }

        .format-badge {
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 8px;
          font-weight: 600;
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }

        .ebook-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .ebook-author {
          color: #6c757d;
          font-size: 1rem;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .ebook-details {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .ebook-details .detail {
          font-size: 0.8rem;
          color: #6c757d;
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 8px;
        }

        .ebook-tags {
          display: flex;
          gap: 6px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .tag {
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: 10px;
          background: #e9ecef;
          color: #495057;
          font-weight: 500;
        }

        .ebook-pricing {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .price-current {
          font-size: 1.4rem;
          font-weight: 700;
          color: #28a745;
        }

        .price-original {
          font-size: 1rem;
          color: #6c757d;
          text-decoration: line-through;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }

          .hero-title {
            font-size: 2.2rem;
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

          .ebooks-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default EbooksPageDedicated;

