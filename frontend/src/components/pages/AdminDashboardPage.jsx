import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  BarChart3, Users, BookOpen, DollarSign, TrendingUp, AlertTriangle,
  Settings, Shield, FileText, Download, Calendar, MapPin, Mail,
  Search, Filter, MoreVertical, Eye, Ban, CheckCircle
} from 'lucide-react';
import AdminStatsModal from '../modals/AdminStatsModal';
import UserManagementModal from '../modals/UserManagementModal';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

  // Vérification des permissions admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-content">
          <Shield size={64} />
          <h1>Accès refusé</h1>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <button className="btn btn--primary" onClick={() => window.location.href = '/'}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const dashboardStats = {
    overview: {
      totalUsers: 2847,
      activeUsers: 1923,
      totalBooks: 12456,
      totalRevenue: 45678,
      monthlyGrowth: 12.5,
      pendingReports: 8,
      suspendedUsers: 12,
      newRegistrations: 156
    },
    recentActivity: [
      { type: 'user_registered', user: 'Sophie Laurent', time: '5 min', action: 'Nouvel utilisateur inscrit' },
      { type: 'book_sold', user: 'Marie Dubois', time: '12 min', action: 'Livre vendu: "L\'Étranger"' },
      { type: 'report_submitted', user: 'Pierre Martin', time: '25 min', action: 'Signalement soumis' },
      { type: 'bookshop_verified', user: 'Librairie Mollat', time: '1h', action: 'Libraire vérifié' },
      { type: 'payment_processed', user: 'Julie Moreau', time: '2h', action: 'Paiement traité: 24.50€' }
    ],
    alerts: [
      { type: 'warning', message: '8 signalements en attente de modération', priority: 'high' },
      { type: 'info', message: '12 demandes de vérification libraire', priority: 'medium' },
      { type: 'error', message: '3 paiements échoués à vérifier', priority: 'high' },
      { type: 'success', message: 'Sauvegarde automatique effectuée', priority: 'low' }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'books', label: 'Livres', icon: BookOpen },
    { id: 'finance', label: 'Finances', icon: DollarSign },
    { id: 'reports', label: 'Signalements', icon: AlertTriangle },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="admin-overview">
      {/* Statistiques principales */}
      <div className="stats-grid">
        <div className="stat-card stat-card--primary">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardStats.overview.totalUsers.toLocaleString()}</div>
            <div className="stat-label">Utilisateurs totaux</div>
            <div className="stat-change positive">+{dashboardStats.overview.newRegistrations} ce mois</div>
          </div>
        </div>

        <div className="stat-card stat-card--success">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardStats.overview.totalBooks.toLocaleString()}</div>
            <div className="stat-label">Livres au catalogue</div>
            <div className="stat-change positive">+{dashboardStats.overview.monthlyGrowth}% ce mois</div>
          </div>
        </div>

        <div className="stat-card stat-card--warning">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">€{dashboardStats.overview.totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Chiffre d'affaires</div>
            <div className="stat-change positive">+{dashboardStats.overview.monthlyGrowth}% ce mois</div>
          </div>
        </div>

        <div className="stat-card stat-card--info">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardStats.overview.activeUsers.toLocaleString()}</div>
            <div className="stat-label">Utilisateurs actifs</div>
            <div className="stat-change">67% du total</div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <h3>Actions Rapides</h3>
        <div className="actions-grid">
          <button className="action-card" onClick={() => setIsStatsModalOpen(true)}>
            <BarChart3 size={20} />
            <span>Statistiques Avancées</span>
          </button>
          <button className="action-card" onClick={() => setIsUsersModalOpen(true)}>
            <Users size={20} />
            <span>Gérer les Utilisateurs</span>
          </button>
          <button className="action-card">
            <FileText size={20} />
            <span>Rapports Mensuels</span>
          </button>
          <button className="action-card">
            <Download size={20} />
            <span>Exporter les Données</span>
          </button>
          <button className="action-card">
            <Mail size={20} />
            <span>Notifications Masse</span>
          </button>
          <button className="action-card">
            <Settings size={20} />
            <span>Configuration</span>
          </button>
        </div>
      </div>

      {/* Alertes et activité récente */}
      <div className="admin-content-grid">
        <div className="alerts-section">
          <h3>🚨 Alertes</h3>
          <div className="alerts-list">
            {dashboardStats.alerts.map((alert, index) => (
              <div key={index} className={`alert alert--${alert.type} alert--${alert.priority}`}>
                <div className="alert-content">
                  <span className="alert-message">{alert.message}</span>
                  <span className="alert-priority">{alert.priority === 'high' ? '🔴' : alert.priority === 'medium' ? '🟡' : '🟢'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-section">
          <h3>📊 Activité Récente</h3>
          <div className="activity-list">
            {dashboardStats.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'user_registered' && '👤'}
                  {activity.type === 'book_sold' && '📚'}
                  {activity.type === 'report_submitted' && '⚠️'}
                  {activity.type === 'bookshop_verified' && '✅'}
                  {activity.type === 'payment_processed' && '💳'}
                </div>
                <div className="activity-content">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-user">{activity.user} • {activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <Shield size={24} />
          <h1>Dashboard Administrateur</h1>
        </div>
        <div className="admin-user">
          <span>Connecté en tant que: <strong>{user.firstName} {user.lastName}</strong></span>
        </div>
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && (
          <div className="admin-section">
            <h2>Gestion des Utilisateurs</h2>
            <p>Fonctionnalité en cours de développement...</p>
          </div>
        )}
        {activeTab === 'books' && (
          <div className="admin-section">
            <h2>Gestion du Catalogue</h2>
            <p>Fonctionnalité en cours de développement...</p>
          </div>
        )}
        {activeTab === 'finance' && (
          <div className="admin-section">
            <h2>Gestion Financière</h2>
            <p>Fonctionnalité en cours de développement...</p>
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="admin-section">
            <h2>Modération et Signalements</h2>
            <p>Fonctionnalité en cours de développement...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="admin-section">
            <h2>Paramètres Système</h2>
            <p>Fonctionnalité en cours de développement...</p>
          </div>
        )}
      </div>

      {/* Modales */}
      <AdminStatsModal 
        isOpen={isStatsModalOpen} 
        onClose={() => setIsStatsModalOpen(false)} 
      />
      <UserManagementModal 
        isOpen={isUsersModalOpen} 
        onClose={() => setIsUsersModalOpen(false)} 
      />

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: var(--color-gray-warm-lightest);
          padding: var(--spacing-lg);
        }

        .admin-access-denied {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-gray-warm-lightest);
        }

        .access-denied-content {
          text-align: center;
          padding: var(--spacing-xl);
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 400px;
        }

        .access-denied-content svg {
          color: var(--color-gray-warm-medium);
          margin-bottom: var(--spacing-md);
        }

        .access-denied-content h1 {
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-warm-dark);
        }

        .access-denied-content p {
          margin-bottom: var(--spacing-lg);
          color: var(--color-gray-warm-medium);
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
          padding: var(--spacing-lg);
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .admin-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-gray-warm-dark);
        }

        .admin-title h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }

        .admin-user {
          color: var(--color-gray-warm-medium);
          font-size: 14px;
        }

        .admin-tabs {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
          background: var(--color-white);
          padding: var(--spacing-sm);
          border-radius: var(--radius-lg);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .admin-tab {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          border: none;
          background: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-gray-warm-medium);
          transition: all var(--transition-fast);
        }

        .admin-tab:hover {
          background: var(--color-gray-warm-lightest);
          color: var(--color-gray-warm-dark);
        }

        .admin-tab--active {
          background: var(--color-purple-primary);
          color: var(--color-white);
        }

        .admin-tab--active:hover {
          background: var(--color-purple-dark);
        }

        .admin-content {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          background: var(--color-white);
          border: 1px solid var(--color-gray-warm-light);
          transition: transform var(--transition-fast);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .stat-card--primary .stat-icon {
          background: var(--color-purple-primary);
          color: var(--color-white);
        }

        .stat-card--success .stat-icon {
          background: var(--color-green-primary);
          color: var(--color-white);
        }

        .stat-card--warning .stat-icon {
          background: #f59e0b;
          color: var(--color-white);
        }

        .stat-card--info .stat-icon {
          background: #3b82f6;
          color: var(--color-white);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--color-gray-warm-dark);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--color-gray-warm-medium);
          margin-bottom: 4px;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 600;
        }

        .stat-change.positive {
          color: var(--color-green-primary);
        }

        .quick-actions {
          margin-bottom: var(--spacing-xl);
        }

        .quick-actions h3 {
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-warm-dark);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          background: var(--color-white);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-gray-warm-dark);
        }

        .action-card:hover {
          border-color: var(--color-purple-primary);
          background: var(--color-purple-lightest);
          transform: translateY(-1px);
        }

        .admin-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
        }

        .alerts-section, .activity-section {
          background: var(--color-gray-warm-lightest);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
        }

        .alerts-section h3, .activity-section h3 {
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-warm-dark);
        }

        .alerts-list, .activity-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .alert {
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-sm);
          border-left: 4px solid;
        }

        .alert--error {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
        }

        .alert--warning {
          background: rgba(249, 115, 22, 0.1);
          border-color: #f97316;
        }

        .alert--info {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3b82f6;
        }

        .alert--success {
          background: rgba(34, 197, 94, 0.1);
          border-color: var(--color-green-primary);
        }

        .alert-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .alert-message {
          font-size: 14px;
          color: var(--color-gray-warm-dark);
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm);
          background: var(--color-white);
          border-radius: var(--radius-sm);
        }

        .activity-icon {
          font-size: 20px;
        }

        .activity-action {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-gray-warm-dark);
        }

        .activity-user {
          font-size: 12px;
          color: var(--color-gray-warm-medium);
        }

        .admin-section {
          text-align: center;
          padding: var(--spacing-xl);
          color: var(--color-gray-warm-medium);
        }

        .admin-section h2 {
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-warm-dark);
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            padding: var(--spacing-md);
          }

          .admin-header {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
          }

          .admin-tabs {
            flex-wrap: wrap;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .admin-content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;

