import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Star, Phone, Mail, Globe, Clock, Users, Calendar,
  Award, BookOpen, Heart, Share2, MessageCircle, ChevronRight,
  Facebook, Instagram, Twitter, ExternalLink, Verified, Crown,
  Filter, Search, Grid, List, ArrowLeft
} from 'lucide-react';
import { bookshopsData } from '../../data/bookshopsData';

const BookshopDetailPage = () => {
  const { slug } = useParams();
  const [bookshop, setBookshop] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const data = bookshopsData.find(bookshop => bookshop.slug === slug);
    setBookshop(data);
  }, [slug]);

  if (!bookshop) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Chargement de la librairie...</p>
      </div>
    );
  }

  // Mock books data - à remplacer par une vraie API
  const books = [
    {
      id: 1,
      title: "L'Étranger",
      author: "Albert Camus",
      price: 8.5,
      condition: "Très Bon",
      category: "Littérature",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
      rating: 4.5,
      available: true
    },
    {
      id: 2,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      price: 12,
      condition: "Bon",
      category: "Sciences humaines",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop",
      rating: 4.8,
      available: true
    },
    {
      id: 3,
      title: "Le Petit Prince",
      author: "Antoine de Saint-Exupéry",
      price: 6.9,
      condition: "Neuf",
      category: "Jeunesse",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
      rating: 5.0,
      available: true
    }
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Vérifiée': return <Verified size={14} />;
      case 'Partenaire Premium': return <Crown size={14} />;
      default: return <Award size={14} />;
    }
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <Facebook size={20} />;
      case 'instagram': return <Instagram size={20} />;
      case 'twitter': return <Twitter size={20} />;
      default: return null;
    }
  };

  const formatOpeningHours = (hours) => {
    const days = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche'
    };
    return Object.entries(hours).map(([day, time]) => ({
      day: days[day],
      time
    }));
  };

  return (
    <div className="bookshop-detail-page">
      {/* Navigation breadcrumb */}
      <div className="breadcrumb">
        <Link to="/libraires" className="breadcrumb-link">
          <ArrowLeft size={16} />
          Retour aux libraires
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bookshop-hero">
        <div className="hero-background">
          <img 
            src={bookshop.images.storefront} 
            alt={bookshop.name}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop";
            }}
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-main">
            <div className="bookshop-badges">
              {bookshop.badges.map((badge, index) => (
                <span key={index} className={`badge badge--${badge.toLowerCase().replace(/\s+/g, '-')}`}>
                  {getBadgeIcon(badge)}
                  {badge}
                </span>
              ))}
            </div>
            
            <h1>{bookshop.name}</h1>
            <p className="bookshop-tagline">{bookshop.type}</p>
            
            <div className="hero-meta">
              <div className="rating-section">
                <div className="rating">
                  <Star size={20} fill="currentColor" />
                  <span className="rating-value">{bookshop.stats.rating}</span>
                  <span className="rating-count">({bookshop.stats.reviewsCount} avis)</span>
                </div>
              </div>
              
              <div className="location-section">
                <MapPin size={16} />
                <span>{bookshop.address}</span>
              </div>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <BookOpen size={20} />
                <div>
                  <div className="stat-number">{bookshop.stats.booksCount}</div>
                  <div className="stat-label">Livres</div>
                </div>
              </div>
              <div className="stat-item">
                <Users size={20} />
                <div>
                  <div className="stat-number">{bookshop.stats.salesCount}</div>
                  <div className="stat-label">Ventes</div>
                </div>
              </div>
              <div className="stat-item">
                <Clock size={20} />
                <div>
                  <div className="stat-number">{bookshop.stats.yearsOfExperience}</div>
                  <div className="stat-label">Ans</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="btn btn--primary btn--lg">
              <MessageCircle size={20} />
              Contacter
            </button>
            <button className="btn btn--secondary btn--lg">
              <Heart size={20} />
              Suivre
            </button>
            <button className="btn btn--secondary btn--lg">
              <Share2 size={20} />
              Partager
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="tabs-navigation">
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'about' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            À propos
          </button>
          <button 
            className={`tab ${activeTab === 'books' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            Livres ({bookshop.stats.booksCount})
          </button>
          <button 
            className={`tab ${activeTab === 'events' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Événements
          </button>
          <button 
            className={`tab ${activeTab === 'contact' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact
          </button>
        </div>
      </div>

      {/* Content sections */}
      <div className="bookshop-content">
        {activeTab === 'about' && (
          <div className="about-section">
            <div className="about-main">
              <div className="story-section">
                <h2>Notre histoire</h2>
                <p className="story-text">{bookshop.story}</p>
                
                <h3>Nos spécialités</h3>
                <div className="specialties-grid">
                  {bookshop.specialties.map((specialty, index) => (
                    <div key={index} className="specialty-card">
                      <BookOpen size={24} />
                      <span>{specialty}</span>
                    </div>
                  ))}
                </div>
                
                <h3>Nos services</h3>
                <div className="services-list">
                  {bookshop.services.map((service, index) => (
                    <div key={index} className="service-item">
                      <ChevronRight size={16} />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="about-sidebar">
              <div className="info-card">
                <h3>Informations</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Équipe</span>
                    <span className="info-value">{bookshop.stats.employeesCount} personnes</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Expérience</span>
                    <span className="info-value">{bookshop.stats.yearsOfExperience} ans</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Type</span>
                    <span className="info-value">{bookshop.type}</span>
                  </div>
                </div>
              </div>
              
              {bookshop.socialMedia && (
                <div className="social-card">
                  <h3>Suivez-nous</h3>
                  <div className="social-links">
                    {Object.entries(bookshop.socialMedia).map(([platform, url]) => (
                      <a key={platform} href={url} className="social-link" target="_blank" rel="noopener noreferrer">
                        {getSocialIcon(platform)}
                        <span>{platform}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div className="books-section">
            <div className="books-header">
              <div className="books-search">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un livre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="books-filters">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Toutes les catégories</option>
                  {bookshop.specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
                
                <div className="view-toggle">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'view-btn--active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={16} />
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'view-btn--active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`books-grid ${viewMode === 'list' ? 'books-list' : ''}`}>
              {filteredBooks.map(book => (
                <Link key={book.id} to={`/livre/${book.id}`} className="book-card">
                  <div className="book-image">
                    <img src={book.image} alt={book.title} />
                    <div className="book-overlay">
                      <span className={`condition-tag condition--${book.condition.toLowerCase().replace(' ', '-')}`}>
                        {book.condition}
                      </span>
                    </div>
                  </div>
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                    <div className="book-meta">
                      <span className="price">{book.price}€</span>
                      <div className="book-rating">
                        <Star size={14} fill="currentColor" />
                        <span>{book.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {filteredBooks.length === 0 && (
              <div className="empty-books">
                <BookOpen size={48} />
                <h3>Aucun livre trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-section">
            <h2>Événements à venir</h2>
            {bookshop.events && bookshop.events.length > 0 ? (
              <div className="events-list">
                {bookshop.events.map((event, index) => (
                  <div key={index} className="event-card">
                    <div className="event-date">
                      <div className="event-day">{new Date(event.date).getDate()}</div>
                      <div className="event-month">
                        {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}
                      </div>
                    </div>
                    <div className="event-content">
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      <div className="event-meta">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <button className="btn btn--secondary">
                      S'inscrire
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-events">
                <Calendar size={48} />
                <h3>Aucun événement prévu</h3>
                <p>Revenez bientôt pour découvrir nos prochains événements</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-section">
            <div className="contact-main">
              <h2>Nous contacter</h2>
              
              <div className="contact-info">
                <div className="contact-item">
                  <Phone size={20} />
                  <div>
                    <span className="contact-label">Téléphone</span>
                    <span className="contact-value">{bookshop.phone}</span>
                  </div>
                </div>
                
                <div className="contact-item">
                  <Mail size={20} />
                  <div>
                    <span className="contact-label">Email</span>
                    <span className="contact-value">{bookshop.email}</span>
                  </div>
                </div>
                
                <div className="contact-item">
                  <Globe size={20} />
                  <div>
                    <span className="contact-label">Site web</span>
                    <a href={bookshop.website} target="_blank" rel="noopener noreferrer" className="contact-link">
                      Visiter le site
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
                
                <div className="contact-item">
                  <MapPin size={20} />
                  <div>
                    <span className="contact-label">Adresse</span>
                    <span className="contact-value">{bookshop.address}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-sidebar">
              <div className="hours-card">
                <h3>Horaires d'ouverture</h3>
                <div className="hours-list">
                  {formatOpeningHours(bookshop.openingHours).map((item, index) => (
                    <div key={index} className="hours-item">
                      <span className="day">{item.day}</span>
                      <span className={`hours ${item.time === 'Fermé' ? 'hours--closed' : ''}`}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .bookshop-detail-page {
          min-height: 100vh;
          background: var(--color-gray-warm-lightest);
        }

        .breadcrumb {
          padding: var(--spacing-md) var(--spacing-lg);
          background: var(--color-white);
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .breadcrumb-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-gray-warm-medium);
          text-decoration: none;
          font-size: 14px;
          transition: color var(--transition-fast);
        }

        .breadcrumb-link:hover {
          color: var(--color-green-primary);
        }

        .bookshop-hero {
          position: relative;
          height: 500px;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .hero-background img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: var(--spacing-xl);
          color: var(--color-white);
        }

        .bookshop-badges {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 12px;
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

        .hero-content h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: var(--spacing-xs);
          line-height: 1.2;
        }

        .bookshop-tagline {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: var(--spacing-lg);
        }

        .hero-meta {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .rating {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: #f59e0b;
        }

        .rating-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--color-white);
        }

        .rating-count {
          color: var(--color-white);
          opacity: 0.8;
        }

        .location-section {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          opacity: 0.9;
        }

        .hero-stats {
          display: flex;
          gap: var(--spacing-xl);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }

        .hero-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          align-items: flex-end;
        }

        .tabs-navigation {
          background: var(--color-white);
          border-bottom: 1px solid var(--color-gray-warm-light);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .tabs-container {
          display: flex;
          padding: 0 var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
        }

        .tab {
          padding: var(--spacing-lg) var(--spacing-xl);
          border: none;
          background: none;
          font-size: 16px;
          font-weight: 500;
          color: var(--color-gray-warm-medium);
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all var(--transition-fast);
        }

        .tab:hover {
          color: var(--color-green-primary);
        }

        .tab--active {
          color: var(--color-green-primary);
          border-bottom-color: var(--color-green-primary);
        }

        .bookshop-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-xl);
        }

        .about-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-xl);
        }

        .story-section h2,
        .story-section h3 {
          color: var(--color-gray-warm-dark);
          margin-bottom: var(--spacing-md);
        }

        .story-text {
          color: var(--color-gray-warm-medium);
          line-height: 1.7;
          font-size: 16px;
          margin-bottom: var(--spacing-xl);
        }

        .specialties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .specialty-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          color: var(--color-green-primary);
        }

        .services-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-sm);
        }

        .service-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-gray-warm-medium);
        }

        .info-card,
        .social-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: var(--spacing-lg);
        }

        .info-card h3,
        .social-card h3 {
          color: var(--color-gray-warm-dark);
          margin-bottom: var(--spacing-md);
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          color: var(--color-gray-warm-medium);
          font-size: 14px;
        }

        .info-value {
          color: var(--color-gray-warm-dark);
          font-weight: 500;
        }

        .social-links {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm);
          color: var(--color-gray-warm-medium);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .social-link:hover {
          background: var(--color-gray-warm-lightest);
          color: var(--color-green-primary);
        }

        .books-section {
          max-width: none;
        }

        .books-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
          gap: var(--spacing-lg);
        }

        .books-search {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .books-search svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-gray-warm-medium);
        }

        .books-search input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 2px solid var(--color-gray-warm-light);
          border-radius: var(--radius-lg);
          font-size: 16px;
          transition: all var(--transition-fast);
        }

        .books-search input:focus {
          outline: none;
          border-color: var(--color-green-primary);
          box-shadow: 0 0 0 3px rgba(168, 213, 186, 0.1);
        }

        .books-filters {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .books-filters select {
          padding: 12px 16px;
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          font-size: 14px;
          background: var(--color-white);
        }

        .view-toggle {
          display: flex;
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .view-btn {
          padding: 12px;
          border: none;
          background: var(--color-white);
          color: var(--color-gray-warm-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .view-btn:hover {
          background: var(--color-gray-warm-lightest);
        }

        .view-btn--active {
          background: var(--color-green-primary);
          color: var(--color-white);
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--spacing-lg);
        }

        .books-list {
          grid-template-columns: 1fr;
        }

        .book-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all var(--transition-fast);
          text-decoration: none;
          color: inherit;
        }

        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .book-image {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .book-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .book-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .condition-tag {
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .condition--neuf {
          background: var(--color-green-primary);
          color: var(--color-white);
        }

        .condition--très-bon {
          background: var(--color-green-lightest);
          color: var(--color-green-primary);
        }

        .condition--bon {
          background: var(--color-purple-lightest);
          color: var(--color-purple-primary);
        }

        .book-info {
          padding: var(--spacing-lg);
        }

        .book-info h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--color-gray-warm-dark);
        }

        .book-info p {
          color: var(--color-gray-warm-medium);
          font-size: 14px;
          margin-bottom: var(--spacing-md);
        }

        .book-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-green-primary);
        }

        .book-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #f59e0b;
          font-size: 14px;
        }

        .empty-books,
        .empty-events {
          text-align: center;
          padding: var(--spacing-xl);
          color: var(--color-gray-warm-medium);
        }

        .empty-books svg,
        .empty-events svg {
          margin-bottom: var(--spacing-md);
        }

        .events-section h2 {
          color: var(--color-gray-warm-dark);
          margin-bottom: var(--spacing-xl);
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .event-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .event-date {
          text-align: center;
          background: var(--color-purple-primary);
          color: var(--color-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          min-width: 80px;
        }

        .event-day {
          font-size: 24px;
          font-weight: 700;
        }

        .event-month {
          font-size: 12px;
          text-transform: uppercase;
        }

        .event-content {
          flex: 1;
        }

        .event-content h3 {
          color: var(--color-gray-warm-dark);
          margin-bottom: var(--spacing-sm);
        }

        .event-content p {
          color: var(--color-gray-warm-medium);
          margin-bottom: var(--spacing-sm);
        }

        .event-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-gray-warm-medium);
          font-size: 14px;
        }

        .contact-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-xl);
        }

        .contact-section h2 {
          color: var(--color-gray-warm-dark);
          margin-bottom: var(--spacing-xl);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-lg);
          padding: var(--spacing-lg);
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .contact-item svg {
          color: var(--color-green-primary);
          margin-top: 2px;
        }

        .contact-label {
          display: block;
          font-size: 14px;
          color: var(--color-gray-warm-medium);
          margin-bottom: 4px;
        }

        .contact-value {
          font-weight: 500;
          color: var(--color-gray-warm-dark);
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-green-primary);
          text-decoration: none;
          font-weight: 500;
        }

        .hours-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .hours-card h3 {
          color: var(--color-gray-warm-dark);
          margin-bottom: var(--spacing-md);
        }

        .hours-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .hours-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm) 0;
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .hours-item:last-child {
          border-bottom: none;
        }

        .day {
          font-weight: 500;
          color: var(--color-gray-warm-dark);
        }

        .hours {
          color: var(--color-gray-warm-medium);
        }

        .hours--closed {
          color: var(--color-red-primary);
          font-weight: 500;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: var(--color-gray-warm-medium);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--color-gray-warm-light);
          border-top: 3px solid var(--color-green-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: var(--spacing-md);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-lg);
          }

          .hero-content h1 {
            font-size: 32px;
          }

          .hero-stats {
            flex-wrap: wrap;
            gap: var(--spacing-lg);
          }

          .hero-actions {
            flex-direction: row;
            align-items: center;
            width: 100%;
          }

          .tabs-container {
            overflow-x: auto;
            padding: 0 var(--spacing-md);
          }

          .about-section,
          .contact-section {
            grid-template-columns: 1fr;
          }

          .books-header {
            flex-direction: column;
            align-items: stretch;
          }

          .books-filters {
            justify-content: space-between;
          }

          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .event-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default BookshopDetailPage;

