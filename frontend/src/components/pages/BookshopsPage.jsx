import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Star, Clock, Phone, Mail, Globe,
  Award, Users, BookOpen, Calendar, ChevronRight, Heart,
  Verified, Crown, Leaf, Facebook, Instagram, Twitter
} from 'lucide-react';
import { bookshopsData } from '../../data/bookshopsData';

const BookshopsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'

  const stats = {
    totalBookshops: bookshopsData.length,
    totalBooks: bookshopsData.reduce((sum, bookshop) => sum + bookshop.stats.booksCount, 0),
    cities: [...new Set(bookshopsData.map(bookshop => bookshop.city))],
    specialties: [...new Set(bookshopsData.flatMap(bookshop => bookshop.specialties))],
    averageRating: (bookshopsData.reduce((sum, bookshop) => sum + bookshop.stats.rating, 0) / bookshopsData.length).toFixed(1)
  };

  const filteredBookshops = useMemo(() => {
    let filtered = bookshopsData.filter(bookshop => {
      const matchesSearch = bookshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bookshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bookshop.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCity = selectedCity === 'all' || bookshop.city === selectedCity;
      
      const matchesSpecialty = selectedSpecialty === 'all' || 
                              bookshop.specialties.some(s => s === selectedSpecialty);
      
      return matchesSearch && matchesCity && matchesSpecialty;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.stats.rating - a.stats.rating;
        case 'experience':
          return b.stats.yearsOfExperience - a.stats.yearsOfExperience;
        case 'books':
          return b.stats.booksCount - a.stats.booksCount;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    // Mettre les premium et featured en premier
    return filtered.sort((a, b) => {
      if (a.premium && !b.premium) return -1;
      if (!a.premium && b.premium) return 1;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [searchTerm, selectedCity, selectedSpecialty, sortBy]);

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Vérifiée': return <Verified size={14} />;
      case 'Partenaire Premium': return <Crown size={14} />;
      case 'Éco-responsable': return <Leaf size={14} />;
      default: return <Award size={14} />;
    }
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <Facebook size={16} />;
      case 'instagram': return <Instagram size={16} />;
      case 'twitter': return <Twitter size={16} />;
      default: return null;
    }
  };

  const BookshopCard = ({ bookshop }) => (
    <div className={`bookshop-card ${bookshop.premium ? 'bookshop-card--premium' : ''}`}>
      {bookshop.premium && (
        <div className="premium-badge">
          <Crown size={16} />
          Premium
        </div>
      )}
      
      <div className="bookshop-header">
        <div className="bookshop-image">
          <img 
            src={bookshop.images.storefront} 
            alt={bookshop.name}
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&crop=center`;
            }}
          />
          <div className="bookshop-overlay">
            <div className="bookshop-badges">
              {bookshop.badges.map((badge, index) => (
                <span key={index} className={`badge badge--${badge.toLowerCase().replace(/\s+/g, '-')}`}>
                  {getBadgeIcon(badge)}
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bookshop-info">
          <div className="bookshop-title">
            <h3>{bookshop.name}</h3>
            <div className="bookshop-rating">
              <Star size={16} fill="currentColor" />
              <span>{bookshop.stats.rating}</span>
              <span className="reviews-count">({bookshop.stats.reviewsCount})</span>
            </div>
          </div>
          
          <div className="bookshop-meta">
            <div className="meta-item">
              <MapPin size={14} />
              <span>{bookshop.city}</span>
            </div>
            <div className="meta-item">
              <BookOpen size={14} />
              <span>{bookshop.stats.booksCount} livres</span>
            </div>
            <div className="meta-item">
              <Clock size={14} />
              <span>{bookshop.stats.yearsOfExperience} ans</span>
            </div>
          </div>
          
          <p className="bookshop-description">{bookshop.description}</p>
          
          <div className="bookshop-specialties">
            {bookshop.specialties.slice(0, 3).map((specialty, index) => (
              <span key={index} className="specialty-tag">{specialty}</span>
            ))}
            {bookshop.specialties.length > 3 && (
              <span className="specialty-more">+{bookshop.specialties.length - 3}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="bookshop-footer">
        <div className="bookshop-contact">
          <div className="contact-item">
            <Phone size={14} />
            <span>{bookshop.phone}</span>
          </div>
          <div className="contact-item">
            <Globe size={14} />
            <span>Site web</span>
          </div>
        </div>
        
        <div className="bookshop-actions">
          <button className="btn btn--secondary btn--sm">
            <Heart size={14} />
            Suivre
          </button>
          <Link to={`/libraire/${bookshop.slug}`} className="btn btn--primary btn--sm">
            Découvrir
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
      
      {bookshop.events && bookshop.events.length > 0 && (
        <div className="bookshop-events">
          <div className="event-highlight">
            <Calendar size={14} />
            <span>Prochain événement: {bookshop.events[0].title}</span>
            <span className="event-date">{new Date(bookshop.events[0].date).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bookshops-page">
      {/* Hero Section */}
      <div className="bookshops-hero">
        <div className="hero-content">
          <h1>Nos Libraires Partenaires</h1>
          <p>Découvrez les librairies indépendantes qui font vivre la passion du livre dans toute la France</p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.totalBookshops}</div>
              <div className="stat-label">Libraires partenaires</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.totalBooks.toLocaleString()}</div>
              <div className="stat-label">Livres disponibles</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.cities.length}</div>
              <div className="stat-label">Villes couvertes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.averageRating}★</div>
              <div className="stat-label">Note moyenne</div>
            </div>
          </div>
        </div>
        
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop" 
            alt="Librairie indépendante"
          />
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bookshops-filters">
        <div className="filters-row">
          <div className="search-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Rechercher une librairie, une spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="filters-section">
            <div className="filter-group">
              <label>Ville</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                <option value="all">Toutes les villes</option>
                {stats.cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Spécialité</label>
              <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
                <option value="all">Toutes les spécialités</option>
                {stats.specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Trier par</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="rating">Note</option>
                <option value="experience">Expérience</option>
                <option value="books">Nombre de livres</option>
                <option value="name">Nom</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="results-info">
          <span>{filteredBookshops.length} libraire{filteredBookshops.length > 1 ? 's' : ''} trouvée{filteredBookshops.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Liste des libraires */}
      <div className="bookshops-grid">
        {filteredBookshops.map(bookshop => (
          <BookshopCard key={bookshop.id} bookshop={bookshop} />
        ))}
      </div>

      {filteredBookshops.length === 0 && (
        <div className="empty-state">
          <BookOpen size={64} />
          <h3>Aucune librairie trouvée</h3>
          <p>Essayez de modifier vos critères de recherche</p>
          <button 
            className="btn btn--primary"
            onClick={() => {
              setSearchTerm('');
              setSelectedCity('all');
              setSelectedSpecialty('all');
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      <style jsx>{`
        .bookshops-page {
          min-height: 100vh;
          background: var(--color-gray-warm-lightest);
        }

        .bookshops-hero {
          background: linear-gradient(135deg, var(--color-green-primary) 0%, var(--color-purple-primary) 100%);
          color: var(--color-white);
          padding: var(--spacing-xl) var(--spacing-lg);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-xl);
          align-items: center;
          min-height: 400px;
        }

        .hero-content h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: var(--spacing-md);
          line-height: 1.2;
        }

        .hero-content p {
          font-size: 20px;
          margin-bottom: var(--spacing-xl);
          opacity: 0.9;
          line-height: 1.5;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-lg);
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: var(--spacing-xs);
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }

        .hero-image {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bookshops-filters {
          background: var(--color-white);
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-gray-warm-light);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .filters-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: var(--spacing-lg);
          align-items: end;
          margin-bottom: var(--spacing-md);
        }

        .search-box {
          position: relative;
          max-width: 400px;
        }

        .search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-gray-warm-medium);
        }

        .search-box input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 2px solid var(--color-gray-warm-light);
          border-radius: var(--radius-lg);
          font-size: 16px;
          transition: all var(--transition-fast);
        }

        .search-box input:focus {
          outline: none;
          border-color: var(--color-green-primary);
          box-shadow: 0 0 0 3px rgba(168, 213, 186, 0.1);
        }

        .filters-section {
          display: flex;
          gap: var(--spacing-md);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .filter-group label {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-gray-warm-dark);
        }

        .filter-group select {
          padding: 12px 16px;
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          font-size: 14px;
          background: var(--color-white);
          min-width: 150px;
        }

        .results-info {
          color: var(--color-gray-warm-medium);
          font-size: 14px;
        }

        .bookshops-grid {
          padding: var(--spacing-lg);
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: var(--spacing-lg);
        }

        .bookshop-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all var(--transition-fast);
          position: relative;
        }

        .bookshop-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .bookshop-card--premium {
          border: 2px solid var(--color-purple-primary);
        }

        .premium-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: var(--color-purple-primary);
          color: var(--color-white);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 2;
        }

        .bookshop-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .bookshop-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-fast);
        }

        .bookshop-card:hover .bookshop-image img {
          transform: scale(1.05);
        }

        .bookshop-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
          display: flex;
          align-items: flex-end;
          padding: var(--spacing-md);
        }

        .bookshop-badges {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge--vérifiée {
          background: rgba(34, 197, 94, 0.9);
          color: var(--color-white);
        }

        .badge--partenaire-premium {
          background: rgba(147, 51, 234, 0.9);
          color: var(--color-white);
        }

        .badge--éco-responsable {
          background: rgba(34, 197, 94, 0.9);
          color: var(--color-white);
        }

        .badge--spécialisée,
        .badge--multilingue,
        .badge--familiale,
        .badge--arts-&-culture,
        .badge--événements {
          background: rgba(59, 130, 246, 0.9);
          color: var(--color-white);
        }

        .bookshop-info {
          padding: var(--spacing-lg);
        }

        .bookshop-title {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-md);
        }

        .bookshop-title h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--color-gray-warm-dark);
          margin: 0;
        }

        .bookshop-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #f59e0b;
          font-weight: 600;
        }

        .reviews-count {
          color: var(--color-gray-warm-medium);
          font-size: 12px;
          font-weight: 400;
        }

        .bookshop-meta {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--color-gray-warm-medium);
          font-size: 14px;
        }

        .bookshop-description {
          color: var(--color-gray-warm-medium);
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: var(--spacing-md);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .bookshop-specialties {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-md);
        }

        .specialty-tag {
          background: var(--color-green-lightest);
          color: var(--color-green-primary);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 500;
        }

        .specialty-more {
          background: var(--color-gray-warm-light);
          color: var(--color-gray-warm-medium);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 500;
        }

        .bookshop-footer {
          padding: 0 var(--spacing-lg) var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bookshop-contact {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-gray-warm-medium);
          font-size: 12px;
        }

        .bookshop-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .bookshop-events {
          background: var(--color-purple-lightest);
          padding: var(--spacing-sm) var(--spacing-lg);
          border-top: 1px solid var(--color-purple-light);
        }

        .event-highlight {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 12px;
          color: var(--color-purple-primary);
        }

        .event-date {
          margin-left: auto;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-xl);
          color: var(--color-gray-warm-medium);
          grid-column: 1 / -1;
        }

        .empty-state svg {
          margin-bottom: var(--spacing-md);
        }

        .empty-state h3 {
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-warm-dark);
        }

        .empty-state p {
          margin-bottom: var(--spacing-lg);
        }

        @media (max-width: 768px) {
          .bookshops-hero {
            grid-template-columns: 1fr;
            text-align: center;
            padding: var(--spacing-lg);
          }

          .hero-content h1 {
            font-size: 32px;
          }

          .hero-stats {
            grid-template-columns: repeat(4, 1fr);
            gap: var(--spacing-md);
          }

          .filters-row {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }

          .filters-section {
            flex-wrap: wrap;
          }

          .bookshops-grid {
            grid-template-columns: 1fr;
            padding: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
};

export default BookshopsPage;

