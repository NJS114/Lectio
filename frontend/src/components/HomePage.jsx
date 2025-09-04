import React from 'react';
import { Search, ArrowRight, Leaf, Users, Heart, Star, MapPin } from 'lucide-react';
import BookCard from './BookCard';

const HomePage = () => {
  // Données d'exemple pour les livres
  const newArrivals = [
    {
      id: 1,
      title: "L'Étranger",
      author: "Albert Camus",
      price: 8.50,
      condition: "very-good",
      category: "Roman",
      seller: "Marie L.",
      city: "Paris",
      sellerType: "individual",
      image: "/api/placeholder/240/320",
      rating: 4
    },
    {
      id: 2,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      price: 12.00,
      rentalPrice: 0.80,
      condition: "good",
      category: "Essai",
      seller: "Librairie Mollat",
      city: "Bordeaux",
      sellerType: "bookshop",
      mode: "both",
      image: "/api/placeholder/240/320",
      rating: 5
    },
    {
      id: 3,
      title: "Le Petit Prince",
      author: "Antoine de Saint-Exupéry",
      price: 6.90,
      condition: "new",
      category: "Jeunesse",
      seller: "Pierre M.",
      city: "Lyon",
      sellerType: "individual",
      image: "/api/placeholder/240/320",
      rating: 5
    },
    {
      id: 4,
      title: "1984",
      author: "George Orwell",
      price: 9.50,
      condition: "good",
      category: "Science-Fiction",
      seller: "Librairie du Centre",
      city: "Toulouse",
      sellerType: "bookshop",
      image: "/api/placeholder/240/320",
      rating: 4
    }
  ];

  const featuredBookshops = [
    {
      name: "Librairie Mollat",
      city: "Bordeaux",
      specialty: "Littérature générale",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Librairie Charlemagne",
      city: "Paris",
      specialty: "Sciences humaines",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Librairie Sauramps",
      city: "Montpellier",
      specialty: "Beaux-arts",
      image: "/api/placeholder/80/80"
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title">
              Donnez une seconde vie à vos livres
            </h1>
            <p className="hero__subtitle">
              Vendez, achetez, louez entre passionnés. Soutenez vos libraires locaux.
            </p>
            <div className="hero__actions">
              <button className="btn btn--primary">
                Commencer à vendre
              </button>
              <button className="btn btn--secondary">
                Explorer le catalogue
              </button>
            </div>
          </div>
          <div className="hero__image">
            <div className="hero__illustration">
              <div className="floating-books">
                <div className="book book--1"></div>
                <div className="book book--2"></div>
                <div className="book book--3"></div>
              </div>
              <div className="circulation-arrow">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <path
                    d="M100 20 A80 80 0 1 1 99 20"
                    stroke="var(--color-green-primary)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5 5"
                  />
                  <polygon
                    points="95,25 105,25 100,15"
                    fill="var(--color-green-primary)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barre de recherche centrale */}
      <section className="search-section">
        <div className="container">
          <div className="search-hero">
            <div className="search-bar-large">
              <Search className="search-bar-large__icon" size={24} />
              <input
                type="text"
                placeholder="Titre, auteur, ISBN..."
                className="search-bar-large__input"
              />
              <button className="search-bar-large__scan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <button className="btn btn--primary search-bar-large__submit">
                Rechercher
              </button>
            </div>
            <div className="search-filters">
              <button className="filter-chip filter-chip--active">Vente</button>
              <button className="filter-chip">Location</button>
              <button className="filter-chip">Près de chez moi</button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Nouveautés */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Derniers arrivages</h2>
            <button className="btn btn--quiet">
              Voir tout <ArrowRight size={16} />
            </button>
          </div>
          <div className="books-grid">
            {newArrivals.map(book => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Coups de Cœur */}
      <section className="section section--alt">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Recommandations de la communauté</h2>
            <button className="btn btn--quiet">
              Tous les coups de cœur <ArrowRight size={16} />
            </button>
          </div>
          <div className="recommendations-grid">
            <div className="recommendation-card">
              <div className="recommendation-card__book">
                <img src="/api/placeholder/60/80" alt="Livre" />
              </div>
              <div className="recommendation-card__content">
                <h4>Un livre bouleversant</h4>
                <p>"Ce roman m'a complètement transportée. L'écriture est sublime et l'histoire inoubliable."</p>
                <div className="recommendation-card__author">
                  <Heart size={14} fill="var(--color-green-primary)" />
                  <span>Sophie M. • Paris</span>
                </div>
              </div>
            </div>
            <div className="recommendation-card">
              <div className="recommendation-card__book">
                <img src="/api/placeholder/60/80" alt="Livre" />
              </div>
              <div className="recommendation-card__content">
                <h4>Parfait pour l'été</h4>
                <p>"Une lecture légère et divertissante, idéale pour les vacances. Je le recommande vivement !"</p>
                <div className="recommendation-card__author">
                  <Heart size={14} fill="var(--color-green-primary)" />
                  <span>Librairie du Port • Nice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Libraires */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Nos libraires partenaires</h2>
            <button className="btn btn--quiet">
              Voir tous les libraires <ArrowRight size={16} />
            </button>
          </div>
          <div className="bookshops-grid">
            {featuredBookshops.map((bookshop, index) => (
              <div key={index} className="bookshop-card">
                <img src={bookshop.image} alt={bookshop.name} className="bookshop-card__image" />
                <div className="bookshop-card__content">
                  <h4 className="bookshop-card__name">{bookshop.name}</h4>
                  <p className="bookshop-card__specialty">{bookshop.specialty}</p>
                  <div className="bookshop-card__location">
                    <MapPin size={14} />
                    <span>{bookshop.city}</span>
                    <div className="verified-badge">
                      <Star size={12} fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Impact Écologique */}
      <section className="section section--eco">
        <div className="container">
          <div className="eco-impact">
            <div className="eco-impact__content">
              <h2 className="eco-impact__title">
                <Leaf className="eco-impact__icon" />
                Votre impact écologique
              </h2>
              <div className="eco-stats">
                <div className="eco-stat">
                  <div className="eco-stat__number">142M</div>
                  <div className="eco-stat__label">livres détruits chaque année en France</div>
                </div>
                <div className="eco-stat">
                  <div className="eco-stat__number">2.3kg</div>
                  <div className="eco-stat__label">de CO₂ économisés par livre d'occasion</div>
                </div>
                <div className="eco-stat">
                  <div className="eco-stat__number">85%</div>
                  <div className="eco-stat__label">de réduction d'empreinte carbone</div>
                </div>
              </div>
              <p className="eco-impact__description">
                En choisissant Lectio, vous participez à l'économie circulaire du livre et soutenez un avenir plus durable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .homepage {
          min-height: 100vh;
        }

        .hero {
          background: linear-gradient(135deg, var(--color-white-off) 0%, var(--color-beige-paper) 100%);
          padding: var(--spacing-2xl) 0;
          overflow: hidden;
        }

        .hero .container {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-xl);
          align-items: center;
        }

        @media (min-width: 768px) {
          .hero .container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .hero__title {
          font-size: 48px;
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-warm-dark);
        }

        @media (max-width: 767px) {
          .hero__title {
            font-size: 36px;
          }
        }

        .hero__subtitle {
          font-size: 20px;
          color: var(--color-gray-warm-medium);
          margin-bottom: var(--spacing-xl);
          line-height: 1.5;
        }

        .hero__actions {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .hero__illustration {
          position: relative;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-books {
          position: relative;
        }

        .book {
          position: absolute;
          width: 40px;
          height: 60px;
          background: var(--color-green-primary);
          border-radius: 4px;
          box-shadow: var(--shadow-md);
        }

        .book--1 {
          top: -30px;
          left: -60px;
          background: var(--color-green-medium);
          transform: rotate(-15deg);
          animation: float 3s ease-in-out infinite;
        }

        .book--2 {
          top: 20px;
          right: -40px;
          background: var(--color-green-sage);
          transform: rotate(10deg);
          animation: float 3s ease-in-out infinite 1s;
        }

        .book--3 {
          bottom: -20px;
          left: -20px;
          background: var(--color-beige-gold);
          transform: rotate(-5deg);
          animation: float 3s ease-in-out infinite 2s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--rotation, 0deg)); }
          50% { transform: translateY(-10px) rotate(var(--rotation, 0deg)); }
        }

        .circulation-arrow {
          position: absolute;
          opacity: 0.6;
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .search-section {
          padding: var(--spacing-xl) 0;
          background: white;
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .search-hero {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        .search-bar-large {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid var(--color-gray-warm-light);
          border-radius: var(--radius-lg);
          padding: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
          box-shadow: var(--shadow-sm);
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
          font-size: 18px;
          padding: var(--spacing-sm);
        }

        .search-bar-large__scan {
          padding: var(--spacing-sm);
          background: none;
          border: none;
          color: var(--color-gray-warm-medium);
          cursor: pointer;
          border-radius: var(--radius-sm);
          margin-right: var(--spacing-sm);
        }

        .search-bar-large__scan:hover {
          background: var(--color-beige-paper);
          color: var(--color-green-primary);
        }

        .search-filters {
          display: flex;
          gap: var(--spacing-sm);
          justify-content: center;
          flex-wrap: wrap;
        }

        .filter-chip {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--color-gray-warm-light);
          background: white;
          border-radius: var(--radius-xl);
          font-size: 14px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filter-chip:hover {
          border-color: var(--color-green-primary);
          background: var(--color-green-mint);
        }

        .filter-chip--active {
          background: var(--color-green-primary);
          color: white;
          border-color: var(--color-green-primary);
        }

        .section {
          padding: var(--spacing-2xl) 0;
        }

        .section--alt {
          background: var(--color-beige-paper);
        }

        .section--eco {
          background: linear-gradient(135deg, var(--color-green-mint) 0%, var(--color-beige-paper) 100%);
        }

        .section__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
        }

        .section__title {
          font-size: 36px;
          font-weight: 600;
          color: var(--color-gray-warm-dark);
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: var(--spacing-lg);
        }

        @media (max-width: 767px) {
          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: var(--spacing-md);
          }
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .recommendation-card {
          background: white;
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          display: flex;
          gap: var(--spacing-md);
        }

        .recommendation-card__book img {
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
        }

        .recommendation-card__content h4 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-warm-dark);
        }

        .recommendation-card__content p {
          color: var(--color-gray-warm-medium);
          line-height: 1.5;
          margin-bottom: var(--spacing-sm);
        }

        .recommendation-card__author {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 14px;
          color: var(--color-gray-warm-medium);
        }

        .bookshops-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
        }

        .bookshop-card {
          background: white;
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          text-align: center;
          transition: all var(--transition-normal);
        }

        .bookshop-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .bookshop-card__image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin: 0 auto var(--spacing-md);
          object-fit: cover;
        }

        .bookshop-card__name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--color-gray-warm-dark);
        }

        .bookshop-card__specialty {
          color: var(--color-gray-warm-medium);
          margin-bottom: var(--spacing-sm);
        }

        .bookshop-card__location {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          font-size: 14px;
          color: var(--color-gray-warm-medium);
        }

        .verified-badge {
          color: var(--color-green-primary);
        }

        .eco-impact {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .eco-impact__title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          font-size: 36px;
          font-weight: 600;
          margin-bottom: var(--spacing-xl);
          color: var(--color-gray-warm-dark);
        }

        .eco-impact__icon {
          color: var(--color-green-primary);
        }

        .eco-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }

        .eco-stat__number {
          font-size: 48px;
          font-weight: 700;
          color: var(--color-green-primary);
          margin-bottom: var(--spacing-xs);
        }

        .eco-stat__label {
          color: var(--color-gray-warm-medium);
          font-size: 16px;
        }

        .eco-impact__description {
          font-size: 18px;
          color: var(--color-gray-warm-medium);
          line-height: 1.6;
        }

        @media (max-width: 767px) {
          .section__header {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
          }

          .section__title {
            font-size: 28px;
          }

          .eco-impact__title {
            font-size: 28px;
          }

          .eco-stat__number {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;

