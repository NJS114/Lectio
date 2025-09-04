import React, { useState } from 'react';
import { 
  User, 
  Book, 
  Calendar, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  Eye,
  DollarSign,
  Clock,
  Star,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DashboardPageFixed = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');

  // Rediriger si non authentifié
  if (!isAuthenticated) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Vous devez être connecté pour accéder à votre dashboard.</p>
          <button 
            className="btn btn--primary"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Données simulées pour le dashboard
  const stats = {
    totalBooks: 12,
    activeListings: 8,
    totalEarnings: 247.50,
    totalViews: 1456,
    rentalsActive: 3,
    rentalsCompleted: 15
  };

  const recentActivity = [
    { id: 1, type: 'sale', book: 'L\'Étranger', amount: 8.5, date: '2024-08-15', buyer: 'Marie L.' },
    { id: 2, type: 'rental', book: 'Sapiens', amount: 5.6, date: '2024-08-14', renter: 'Pierre M.' },
    { id: 3, type: 'view', book: '1984', views: 12, date: '2024-08-13' },
    { id: 4, type: 'message', book: 'Le Petit Prince', from: 'Sophie D.', date: '2024-08-12' }
  ];

  const myBooks = [
    { id: 1, title: '1984', author: 'George Orwell', price: 12.99, status: 'active', views: 45 },
    { id: 2, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', price: 8.50, status: 'active', views: 32 },
    { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', price: 22.90, status: 'sold', views: 78 },
    { id: 4, title: 'L\'Étranger', author: 'Albert Camus', price: 9.20, status: 'active', views: 23 }
  ];

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#10b981', color: 'white', padding: '0.75rem', borderRadius: '8px' }}>
              <Book size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalBooks}</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>Livres en vente</p>
              <span style={{ color: '#10b981', fontSize: '0.875rem' }}>+2 ce mois</span>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#8b5cf6', color: 'white', padding: '0.75rem', borderRadius: '8px' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalEarnings.toFixed(2)}€</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>Revenus totaux</p>
              <span style={{ color: '#10b981', fontSize: '0.875rem' }}>+15% ce mois</span>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#f59e0b', color: 'white', padding: '0.75rem', borderRadius: '8px' }}>
              <Eye size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalViews}</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>Vues totales</p>
              <span style={{ color: '#10b981', fontSize: '0.875rem' }}>+8% cette semaine</span>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#ef4444', color: 'white', padding: '0.75rem', borderRadius: '8px' }}>
              <Calendar size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.rentalsActive}</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>Locations actives</p>
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Stable</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="section recent-activity" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Activité récente</h3>
            <button style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer' }}>Voir tout</button>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ background: '#f3f4f6', padding: '0.5rem', borderRadius: '6px' }}>
                  {activity.type === 'sale' && <DollarSign size={16} />}
                  {activity.type === 'rental' && <Calendar size={16} />}
                  {activity.type === 'view' && <Eye size={16} />}
                  {activity.type === 'message' && <User size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{activity.date}</span>
                    {activity.amount && (
                      <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 'bold' }}>+{activity.amount}€</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section quick-actions" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Actions rapides</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              onClick={() => navigate('/vendre', { state: { resetForm: true } })}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.75rem 1rem', 
                background: '#10b981', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              <Plus size={16} />
              Ajouter un livre
            </button>
            <button 
              onClick={() => navigate('/catalogue')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.75rem 1rem', 
                background: '#8b5cf6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              <Book size={16} />
              Parcourir le catalogue
            </button>
            <button 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.75rem 1rem', 
                background: '#f59e0b', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              <BarChart3 size={16} />
              Voir les statistiques
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyBooks = () => (
    <div className="dashboard-books">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ margin: 0 }}>Mes livres ({myBooks.length})</h3>
        <button 
          onClick={() => navigate('/vendre', { state: { resetForm: true } })}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.5rem 1rem', 
            background: '#10b981', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Ajouter un livre
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {myBooks.map(book => (
          <div key={book.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 'bold' }}>{book.title}</h4>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>{book.author}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>{book.price}€</span>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold',
                  background: book.status === 'active' ? '#dcfce7' : '#fef3c7',
                  color: book.status === 'active' ? '#166534' : '#92400e'
                }}>
                  {book.status === 'active' ? 'En vente' : book.status === 'sold' ? 'Vendu' : 'Autre'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Eye size={14} />
                <span>{book.views} vues</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'books', label: 'Mes livres', icon: Book },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', fontWeight: 'bold' }}>
          Dashboard
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '1.125rem' }}>
          Bonjour {user?.firstName || 'Utilisateur'} ! Voici un aperçu de votre activité.
        </p>
      </div>

      <div className="dashboard-tabs" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #8b5cf6' : '2px solid transparent',
                  color: activeTab === tab.id ? '#8b5cf6' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'books' && renderMyBooks()}
        {activeTab === 'settings' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3>Paramètres</h3>
            <p>Fonctionnalité en cours de développement...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPageFixed;

