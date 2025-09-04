import React, { useState } from 'react';
import { 
  User, 
  Book, 
  Calendar, 
  Settings, 
  Upload, 
  BarChart3, 
  TrendingUp, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  FileText,
  DollarSign,
  Clock,
  Star,
  MapPin,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBooks } from '../../hooks/useBooks';
import { useNavigate } from 'react-router-dom';
import ImportModal from '../modals/ImportModal';
import PriceComparatorModal from '../modals/PriceComparatorModal';

const DashboardPage = () => {
  const { user } = useAuth();
  const { getUserBooks, getUserRentals } = useBooks();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Données simulées pour le dashboard
  const userBooks = getUserBooks();
  const userRentals = getUserRentals();
  
  const stats = {
    totalBooks: userBooks.length,
    activeListings: userBooks.filter(book => book.status === 'active').length,
    totalEarnings: userBooks.reduce((sum, book) => sum + (book.earnings || 0), 0),
    totalViews: userBooks.reduce((sum, book) => sum + (book.views || 0), 0),
    rentalsActive: userRentals.filter(rental => rental.status === 'active').length,
    rentalsCompleted: userRentals.filter(rental => rental.status === 'completed').length
  };

  const recentActivity = [
    { id: 1, type: 'sale', book: 'L\'Étranger', amount: 8.5, date: '2024-08-15', buyer: 'Marie L.' },
    { id: 2, type: 'rental', book: 'Sapiens', amount: 5.6, date: '2024-08-14', renter: 'Pierre M.' },
    { id: 3, type: 'view', book: '1984', views: 12, date: '2024-08-13' },
    { id: 4, type: 'message', book: 'Le Petit Prince', from: 'Sophie D.', date: '2024-08-12' }
  ];

  const priceComparisons = [
    { book: 'L\'Étranger', myPrice: 8.5, avgPrice: 9.2, recommendation: 'optimal' },
    { book: 'Sapiens', myPrice: 12.0, avgPrice: 10.8, recommendation: 'high' },
    { book: '1984', myPrice: 9.5, avgPrice: 9.1, recommendation: 'optimal' }
  ];

  const handleImport = (results) => {
    console.log('Import results:', results);
    // Ici on pourrait mettre à jour la liste des livres
  };

  const handlePriceComparison = (book) => {
    setSelectedBook(book);
    setShowPriceModal(true);
  };

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Book size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalBooks}</h3>
            <p>Livres en vente</p>
            <span className="stat-change positive">+2 ce mois</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalEarnings.toFixed(2)}€</h3>
            <p>Revenus totaux</p>
            <span className="stat-change positive">+15% ce mois</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalViews}</h3>
            <p>Vues totales</p>
            <span className="stat-change positive">+8% cette semaine</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.rentalsActive}</h3>
            <p>Locations actives</p>
            <span className="stat-change neutral">Stable</span>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section recent-activity">
          <div className="section-header">
            <h3>Activité récente</h3>
            <button className="btn btn--quiet">Voir tout</button>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'sale' && <DollarSign size={16} />}
                  {activity.type === 'rental' && <Calendar size={16} />}
                  {activity.type === 'view' && <Eye size={16} />}
                  {activity.type === 'message' && <User size={16} />}
                </div>
                <div className="activity-content">
                  <div className="activity-main">
                    {activity.type === 'sale' && (
                      <span>Vente de <strong>{activity.book}</strong> à {activity.buyer}</span>
                    )}
                    {activity.type === 'rental' && (
                      <span>Location de <strong>{activity.book}</strong> par {activity.renter}</span>
                    )}
                    {activity.type === 'view' && (
                      <span><strong>{activity.book}</strong> a reçu {activity.views} nouvelles vues</span>
                    )}
                    {activity.type === 'message' && (
                      <span>Message de {activity.from} pour <strong>{activity.book}</strong></span>
                    )}
                  </div>
                  <div className="activity-meta">
                    <span className="activity-date">{activity.date}</span>
                    {activity.amount && (
                      <span className="activity-amount">+{activity.amount}€</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section price-comparison">
          <div className="section-header">
            <h3>Comparateur de prix</h3>
            <button 
              className="btn btn--quiet"
              onClick={() => setShowPriceModal(true)}
            >
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>
          <div className="price-list">
            {priceComparisons.map((item, index) => (
              <div key={index} className="price-item">
                <div className="price-book">{item.book}</div>
                <div className="price-comparison-data">
                  <div className="price-yours">
                    <span className="price-label">Votre prix</span>
                    <span className="price-value">{item.myPrice}€</span>
                  </div>
                  <div className="price-avg">
                    <span className="price-label">Prix moyen</span>
                    <span className="price-value">{item.avgPrice}€</span>
                  </div>
                  <div className={`price-recommendation ${item.recommendation}`}>
                    {item.recommendation === 'optimal' && '✓ Optimal'}
                    {item.recommendation === 'high' && '↑ Élevé'}
                    {item.recommendation === 'low' && '↓ Bas'}
                  </div>
                </div>
                <button 
                  className="btn btn--quiet btn--sm"
                  onClick={() => handlePriceComparison({ title: item.book, price: item.myPrice })}
                >
                  Analyser
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyBooks = () => (
    <div className="dashboard-books">
      <div className="section-header">
        <h3>Mes livres ({userBooks.length})</h3>
        <div className="header-actions">
          <button 
            className="btn btn--secondary"
            onClick={() => navigate('/vendre')}
          >
            <Plus size={16} />
            Ajouter un livre
          </button>
          <button 
            className="btn btn--quiet"
            onClick={() => setShowImportModal(true)}
          >
            <Upload size={16} />
            Import CSV/JSON
          </button>
        </div>
      </div>

      <div className="books-filters">
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher dans mes livres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input filter-select"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">En vente</option>
          <option value="sold">Vendus</option>
          <option value="rented">En location</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      <div className="books-grid">
        {userBooks.map(book => (
          <div key={book.id} className="book-card-dashboard">
            <div className="book-image">
              <img src={book.image} alt={book.title} />
              <div className="book-status">
                <span className={`status-badge ${book.status}`}>
                  {book.status === 'active' && 'En vente'}
                  {book.status === 'sold' && 'Vendu'}
                  {book.status === 'rented' && 'Loué'}
                </span>
              </div>
            </div>
            <div className="book-info">
              <h4>{book.title}</h4>
              <p>{book.author}</p>
              <div className="book-stats">
                <div className="stat">
                  <Eye size={14} />
                  <span>{book.views || 0}</span>
                </div>
                <div className="stat">
                  <DollarSign size={14} />
                  <span>{book.price}€</span>
                </div>
              </div>
            </div>
            <div className="book-actions">
              <button className="action-btn" title="Voir">
                <Eye size={16} />
              </button>
              <button className="action-btn" title="Modifier">
                <Edit size={16} />
              </button>
              <button className="action-btn delete" title="Supprimer">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRentals = () => (
    <div className="dashboard-rentals">
      <div className="section-header">
        <h3>Mes locations</h3>
        <div className="rental-stats">
          <span className="rental-stat">
            <Clock size={16} />
            {stats.rentalsActive} actives
          </span>
          <span className="rental-stat">
            <Star size={16} />
            {stats.rentalsCompleted} terminées
          </span>
        </div>
      </div>

      <div className="rentals-list">
        {userRentals.map(rental => (
          <div key={rental.id} className="rental-item">
            <div className="rental-book">
              <img src={rental.bookImage} alt={rental.bookTitle} />
              <div className="rental-book-info">
                <h4>{rental.bookTitle}</h4>
                <p>Loué par {rental.renterName}</p>
              </div>
            </div>
            <div className="rental-details">
              <div className="rental-dates">
                <span>Du {rental.startDate}</span>
                <span>Au {rental.endDate}</span>
              </div>
              <div className="rental-amount">
                {rental.totalAmount}€
              </div>
              <div className={`rental-status ${rental.status}`}>
                {rental.status === 'active' && 'En cours'}
                {rental.status === 'completed' && 'Terminée'}
                {rental.status === 'overdue' && 'En retard'}
              </div>
            </div>
            <div className="rental-actions">
              <button className="btn btn--quiet">Contacter</button>
              {rental.status === 'active' && (
                <button className="btn btn--secondary">Prolonger</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="dashboard-settings">
      <div className="settings-sections">
        <div className="settings-section">
          <h3>Profil</h3>
          <div className="settings-group">
            <label>Nom d'affichage</label>
            <input type="text" className="input" defaultValue={user?.firstName + ' ' + user?.lastName} />
          </div>
          <div className="settings-group">
            <label>Email</label>
            <input type="email" className="input" defaultValue={user?.email} />
          </div>
          <div className="settings-group">
            <label>Ville</label>
            <input type="text" className="input" defaultValue={user?.city} />
          </div>
        </div>

        <div className="settings-section">
          <h3>Préférences de vente</h3>
          <div className="settings-group">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Recevoir des notifications par email</span>
            </label>
          </div>
          <div className="settings-group">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Autoriser les offres de prix</span>
            </label>
          </div>
          <div className="settings-group">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Masquer ma localisation exacte</span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Import/Export</h3>
          <div className="import-export-actions">
            <button 
              className="btn btn--secondary"
              onClick={() => setShowImportModal(true)}
            >
              <Upload size={16} />
              Importer depuis CSV
            </button>
            <button 
              className="btn btn--secondary"
              onClick={() => setShowImportModal(true)}
            >
              <Upload size={16} />
              Importer depuis JSON
            </button>
            <button className="btn btn--quiet">
              <Download size={16} />
              Exporter mes données
            </button>
          </div>
          <div className="import-info">
            <p>Formats supportés : CSV, JSON</p>
            <a href="#" className="link">Télécharger le modèle CSV</a>
          </div>
        </div>

        <div className="settings-section">
          <h3>Comparateur de prix</h3>
          <div className="settings-group">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Activer le comparateur automatique</span>
            </label>
          </div>
          <div className="settings-group">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Recevoir des alertes de prix</span>
            </label>
          </div>
          <div className="settings-group">
            <label>Fréquence de vérification</label>
            <select className="input">
              <option>Quotidienne</option>
              <option>Hebdomadaire</option>
              <option>Mensuelle</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn--primary">Sauvegarder</button>
        <button className="btn btn--quiet">Annuler</button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'books', label: 'Mes livres', icon: Book },
    { id: 'rentals', label: 'Locations', icon: Calendar },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div className="user-welcome">
            <h1>Bonjour {user?.firstName} !</h1>
            <p>Gérez vos livres et suivez vos performances</p>
          </div>
          <div className="quick-actions">
            <button 
              className="btn btn--primary"
              onClick={() => navigate('/vendre')}
            >
              <Plus size={16} />
              Ajouter un livre
            </button>
          </div>
        </div>

        <div className="dashboard-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'books' && renderMyBooks()}
          {activeTab === 'rentals' && renderRentals()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background-color: var(--color-background);
          padding: var(--spacing-xl) 0;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-2xl);
        }

        .user-welcome h1 {
          font-size: 32px;
          margin-bottom: var(--spacing-xs);
          color: var(--color-gray-dark);
        }

        .user-welcome p {
          color: var(--color-gray-text);
          font-size: 16px;
        }

        .dashboard-nav {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-2xl);
          border-bottom: 1px solid var(--color-gray-medium);
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          background: none;
          border: none;
          color: var(--color-gray-text);
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all var(--transition-fast);
        }

        .nav-tab:hover {
          color: var(--color-green-primary);
          background: var(--color-green-mint);
        }

        .nav-tab.active {
          color: var(--color-green-dark);
          border-bottom-color: var(--color-green-primary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
        }

        .stat-card {
          background: var(--color-white);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: var(--color-green-mint);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-green-dark);
        }

        .stat-content h3 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--color-gray-dark);
        }

        .stat-content p {
          color: var(--color-gray-text);
          margin-bottom: var(--spacing-xs);
        }

        .stat-change {
          font-size: 14px;
          font-weight: 500;
        }

        .stat-change.positive {
          color: var(--color-green-dark);
        }

        .stat-change.neutral {
          color: var(--color-gray-text);
        }

        .dashboard-sections {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-2xl);
        }

        .section {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          box-shadow: var(--shadow-sm);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .section-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .activity-item:hover {
          background: var(--color-gray-light);
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          background: var(--color-purple-mint);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-purple-dark);
        }

        .activity-content {
          flex: 1;
        }

        .activity-main {
          margin-bottom: var(--spacing-xs);
        }

        .activity-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: var(--color-gray-text);
        }

        .activity-amount {
          color: var(--color-green-dark);
          font-weight: 500;
        }

        .price-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .price-item {
          padding: var(--spacing-md);
          border: 1px solid var(--color-gray-medium);
          border-radius: var(--radius-sm);
        }

        .price-book {
          font-weight: 500;
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-dark);
        }

        .price-comparison-data {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: var(--spacing-md);
          align-items: center;
        }

        .price-label {
          display: block;
          font-size: 12px;
          color: var(--color-gray-text);
          margin-bottom: var(--spacing-xs);
        }

        .price-value {
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .price-recommendation {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 500;
        }

        .price-recommendation.optimal {
          background: var(--color-green-mint);
          color: var(--color-green-dark);
        }

        .price-recommendation.high {
          background: var(--color-purple-mint);
          color: var(--color-purple-dark);
        }

        .books-filters {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .search-bar {
          position: relative;
          flex: 1;
        }

        .search-bar svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-gray-text);
        }

        .search-bar input {
          padding-left: 40px;
        }

        .filter-select {
          min-width: 200px;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }

        .book-card-dashboard {
          background: var(--color-white);
          border: 1px solid var(--color-gray-medium);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: all var(--transition-fast);
        }

        .book-card-dashboard:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .book-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .book-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .book-status {
          position: absolute;
          top: var(--spacing-sm);
          right: var(--spacing-sm);
        }

        .status-badge {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 500;
          background: var(--color-green-mint);
          color: var(--color-green-dark);
        }

        .status-badge.sold {
          background: var(--color-gray-medium);
          color: var(--color-gray-dark);
        }

        .status-badge.rented {
          background: var(--color-purple-mint);
          color: var(--color-purple-dark);
        }

        .book-info {
          padding: var(--spacing-md);
        }

        .book-info h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--color-gray-dark);
        }

        .book-info p {
          color: var(--color-gray-text);
          margin-bottom: var(--spacing-sm);
        }

        .book-stats {
          display: flex;
          gap: var(--spacing-md);
        }

        .stat {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 14px;
          color: var(--color-gray-text);
        }

        .book-actions {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-md);
          border-top: 1px solid var(--color-gray-medium);
        }

        .action-btn {
          padding: var(--spacing-sm);
          background: none;
          border: none;
          color: var(--color-gray-text);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .action-btn:hover {
          background: var(--color-gray-light);
          color: var(--color-gray-dark);
        }

        .action-btn.delete:hover {
          background: rgba(232, 168, 124, 0.1);
          color: var(--color-error);
        }

        .rentals-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .rental-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border: 1px solid var(--color-gray-medium);
          border-radius: var(--radius-md);
        }

        .rental-book {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
        }

        .rental-book img {
          width: 60px;
          height: 80px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .rental-book-info h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--color-gray-dark);
        }

        .rental-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          text-align: center;
        }

        .rental-dates {
          font-size: 14px;
          color: var(--color-gray-text);
        }

        .rental-amount {
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .rental-status {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 500;
        }

        .rental-status.active {
          background: var(--color-green-mint);
          color: var(--color-green-dark);
        }

        .rental-status.completed {
          background: var(--color-gray-medium);
          color: var(--color-gray-dark);
        }

        .rental-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .settings-sections {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2xl);
        }

        .settings-section {
          background: var(--color-white);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
        }

        .settings-section h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
          color: var(--color-gray-dark);
        }

        .settings-group {
          margin-bottom: var(--spacing-md);
        }

        .settings-group label {
          display: block;
          margin-bottom: var(--spacing-xs);
          font-weight: 500;
          color: var(--color-gray-dark);
        }

        .checkbox-label {
          display: flex !important;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }

        .import-export-actions {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .import-info {
          padding: var(--spacing-md);
          background: var(--color-gray-light);
          border-radius: var(--radius-sm);
        }

        .import-info p {
          margin-bottom: var(--spacing-xs);
          color: var(--color-gray-text);
        }

        .link {
          color: var(--color-green-dark);
          text-decoration: none;
        }

        .link:hover {
          text-decoration: underline;
        }

        .settings-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
          margin-top: var(--spacing-2xl);
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: var(--spacing-md);
            align-items: flex-start;
          }

          .dashboard-nav {
            flex-wrap: wrap;
          }

          .dashboard-sections {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .books-filters {
            flex-direction: column;
          }

          .books-grid {
            grid-template-columns: 1fr;
          }

          .rental-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .import-export-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />

      <PriceComparatorModal
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        book={selectedBook}
      />
    </div>
  );
};

export default DashboardPage;

