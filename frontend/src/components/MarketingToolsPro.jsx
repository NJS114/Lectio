import React, { useState, useEffect } from 'react';
import { 
  Zap, Target, Mail, Percent, Calendar, Users, TrendingUp,
  Plus, Edit3, Trash2, Eye, Copy, Share2, BarChart3,
  Clock, Gift, Tag, Megaphone, Star, Send, Settings
} from 'lucide-react';

const MarketingToolsPro = () => {
  const [activeTab, setActiveTab] = useState('promotions');
  const [promotions, setPromotions] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadMarketingData();
  }, []);

  const loadMarketingData = () => {
    // Simulation des données marketing
    const mockPromotions = [
      {
        id: 1,
        name: 'Rentrée Littéraire 2024',
        type: 'percentage',
        value: 15,
        code: 'RENTREE15',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-09-30'),
        status: 'active',
        uses: 47,
        maxUses: 100,
        revenue: 1250.50,
        categories: ['Roman', 'Essai'],
        minAmount: 25,
        description: 'Découvrez notre sélection rentrée avec 15% de réduction'
      },
      {
        id: 2,
        name: 'Flash Weekend',
        type: 'fixed',
        value: 5,
        code: 'FLASH5',
        startDate: new Date('2024-09-07'),
        endDate: new Date('2024-09-08'),
        status: 'scheduled',
        uses: 0,
        maxUses: 50,
        revenue: 0,
        categories: ['Science-Fiction'],
        minAmount: 15,
        description: '5€ de réduction sur tous les livres de SF ce weekend'
      },
      {
        id: 3,
        name: 'Fidélité Client',
        type: 'percentage',
        value: 10,
        code: 'FIDELE10',
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-12-31'),
        status: 'active',
        uses: 123,
        maxUses: 500,
        revenue: 2890.75,
        categories: ['all'],
        minAmount: 30,
        description: 'Récompense pour nos clients fidèles'
      }
    ];

    const mockNewsletters = [
      {
        id: 1,
        name: 'Newsletter Septembre',
        subject: 'Nos coups de cœur de la rentrée littéraire',
        status: 'sent',
        sentDate: new Date('2024-09-01'),
        recipients: 1247,
        openRate: 24.5,
        clickRate: 3.2,
        revenue: 890.50,
        template: 'monthly'
      },
      {
        id: 2,
        name: 'Promo Flash SF',
        subject: 'Weekend Science-Fiction : -25% sur une sélection',
        status: 'draft',
        recipients: 0,
        openRate: 0,
        clickRate: 0,
        revenue: 0,
        template: 'promotion'
      }
    ];

    const mockCampaigns = [
      {
        id: 1,
        name: 'Campagne Rentrée',
        type: 'email_sequence',
        status: 'active',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-09-30'),
        target: 'new_customers',
        progress: 65,
        conversions: 23,
        revenue: 1456.80
      },
      {
        id: 2,
        name: 'Réactivation Clients',
        type: 'automated',
        status: 'active',
        startDate: new Date('2024-08-15'),
        endDate: null,
        target: 'inactive_customers',
        progress: 100,
        conversions: 12,
        revenue: 678.90
      }
    ];

    setPromotions(mockPromotions);
    setNewsletters(mockNewsletters);
    setCampaigns(mockCampaigns);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', class: 'active' },
      scheduled: { label: 'Programmée', class: 'scheduled' },
      expired: { label: 'Expirée', class: 'expired' },
      draft: { label: 'Brouillon', class: 'draft' },
      sent: { label: 'Envoyée', class: 'sent' }
    };

    const config = statusConfig[status] || { label: status, class: 'default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const PromotionCard = ({ promotion }) => (
    <div className="promotion-card">
      <div className="card-header">
        <div className="promotion-info">
          <h3>{promotion.name}</h3>
          <p>{promotion.description}</p>
        </div>
        <div className="promotion-status">
          {getStatusBadge(promotion.status)}
        </div>
      </div>

      <div className="promotion-details">
        <div className="detail-row">
          <span className="label">Code:</span>
          <span className="value code">
            {promotion.code}
            <button className="copy-btn" title="Copier">
              <Copy size={14} />
            </button>
          </span>
        </div>
        
        <div className="detail-row">
          <span className="label">Réduction:</span>
          <span className="value">
            {promotion.type === 'percentage' ? `${promotion.value}%` : `${promotion.value}€`}
          </span>
        </div>
        
        <div className="detail-row">
          <span className="label">Période:</span>
          <span className="value">
            {promotion.startDate.toLocaleDateString()} - {promotion.endDate.toLocaleDateString()}
          </span>
        </div>
        
        <div className="detail-row">
          <span className="label">Utilisation:</span>
          <span className="value">
            {promotion.uses} / {promotion.maxUses}
            <div className="usage-bar">
              <div 
                className="usage-fill" 
                style={{ width: `${(promotion.uses / promotion.maxUses) * 100}%` }}
              />
            </div>
          </span>
        </div>
        
        <div className="detail-row">
          <span className="label">Revenus:</span>
          <span className="value revenue">{promotion.revenue.toFixed(2)}€</span>
        </div>
      </div>

      <div className="card-actions">
        <button className="action-btn edit">
          <Edit3 size={14} />
          Modifier
        </button>
        <button className="action-btn share">
          <Share2 size={14} />
          Partager
        </button>
        <button className="action-btn stats">
          <BarChart3 size={14} />
          Stats
        </button>
        <button className="action-btn delete">
          <Trash2 size={14} />
        </button>
      </div>

      <style jsx>{`
        .promotion-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border-left: 4px solid #28a745;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .promotion-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .promotion-info h3 {
          margin: 0 0 5px 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .promotion-info p {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .promotion-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label {
          font-weight: 500;
          color: #495057;
          font-size: 0.9rem;
        }

        .value {
          font-weight: 600;
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .value.code {
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
        }

        .value.revenue {
          color: #28a745;
          font-size: 1.1rem;
        }

        .copy-btn {
          padding: 2px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6c757d;
          transition: color 0.2s ease;
        }

        .copy-btn:hover {
          color: #495057;
        }

        .usage-bar {
          width: 60px;
          height: 4px;
          background: #e9ecef;
          border-radius: 2px;
          overflow: hidden;
        }

        .usage-fill {
          height: 100%;
          background: #28a745;
          transition: width 0.3s ease;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }

        .action-btn.edit {
          background: #fff3cd;
          color: #856404;
        }

        .action-btn.share {
          background: #d1ecf1;
          color: #0c5460;
        }

        .action-btn.stats {
          background: #e2e3f1;
          color: #6f42c1;
        }

        .action-btn.delete {
          background: #f8d7da;
          color: #721c24;
        }

        .action-btn:hover {
          transform: scale(1.05);
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.scheduled {
          background: #d1ecf1;
          color: #0c5460;
        }

        .status-badge.expired {
          background: #f8d7da;
          color: #721c24;
        }

        .status-badge.draft {
          background: #e2e3f1;
          color: #6f42c1;
        }

        .status-badge.sent {
          background: #d4edda;
          color: #155724;
        }
      `}</style>
    </div>
  );

  const NewsletterCard = ({ newsletter }) => (
    <div className="newsletter-card">
      <div className="card-header">
        <div className="newsletter-info">
          <h3>{newsletter.name}</h3>
          <p>{newsletter.subject}</p>
        </div>
        <div className="newsletter-status">
          {getStatusBadge(newsletter.status)}
        </div>
      </div>

      <div className="newsletter-stats">
        <div className="stat">
          <span className="stat-label">Destinataires</span>
          <span className="stat-value">{newsletter.recipients.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Taux d'ouverture</span>
          <span className="stat-value">{newsletter.openRate}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Taux de clic</span>
          <span className="stat-value">{newsletter.clickRate}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Revenus</span>
          <span className="stat-value revenue">{newsletter.revenue.toFixed(2)}€</span>
        </div>
      </div>

      <div className="card-actions">
        <button className="action-btn edit">
          <Edit3 size={14} />
          Modifier
        </button>
        <button className="action-btn send">
          <Send size={14} />
          {newsletter.status === 'draft' ? 'Envoyer' : 'Dupliquer'}
        </button>
        <button className="action-btn stats">
          <BarChart3 size={14} />
          Rapport
        </button>
      </div>

      <style jsx>{`
        .newsletter-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border-left: 4px solid #17a2b8;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .newsletter-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .newsletter-info h3 {
          margin: 0 0 5px 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .newsletter-info p {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
          font-style: italic;
        }

        .newsletter-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .stat-value.revenue {
          color: #28a745;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }

        .action-btn.edit {
          background: #fff3cd;
          color: #856404;
        }

        .action-btn.send {
          background: #d4edda;
          color: #155724;
        }

        .action-btn.stats {
          background: #e2e3f1;
          color: #6f42c1;
        }

        .action-btn:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );

  const QuickAction = ({ icon, title, description, onClick, color = '#667eea' }) => (
    <button className="quick-action" onClick={onClick}>
      <div className="action-icon" style={{ color }}>
        {icon}
      </div>
      <div className="action-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      
      <style jsx>{`
        .quick-action {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .quick-action:hover {
          border-color: ${color};
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .action-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .action-content h4 {
          margin: 0 0 5px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .action-content p {
          margin: 0;
          font-size: 0.9rem;
          color: #6c757d;
        }
      `}</style>
    </button>
  );

  return (
    <div className="marketing-tools">
      <div className="marketing-header">
        <div className="header-content">
          <h1>Outils Marketing</h1>
          <p>Boostez vos ventes avec nos outils promotionnels</p>
        </div>
        
        <div className="header-actions">
          <button className="create-btn" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            Créer une campagne
          </button>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <h2>Actions Rapides</h2>
        <div className="actions-grid">
          <QuickAction
            icon={<Percent size={32} />}
            title="Créer une promotion"
            description="Code promo, réduction, vente flash"
            color="#28a745"
            onClick={() => console.log('Créer promotion')}
          />
          <QuickAction
            icon={<Mail size={32} />}
            title="Envoyer une newsletter"
            description="Nouveautés, recommandations, événements"
            color="#17a2b8"
            onClick={() => console.log('Newsletter')}
          />
          <QuickAction
            icon={<Target size={32} />}
            title="Campagne ciblée"
            description="Segmentation client, automatisation"
            color="#fd7e14"
            onClick={() => console.log('Campagne')}
          />
          <QuickAction
            icon={<Gift size={32} />}
            title="Programme fidélité"
            description="Points, récompenses, parrainage"
            color="#6f42c1"
            onClick={() => console.log('Fidélité')}
          />
        </div>
      </div>

      {/* Onglets */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'promotions' ? 'active' : ''}`}
            onClick={() => setActiveTab('promotions')}
          >
            <Percent size={16} />
            Promotions ({promotions.length})
          </button>
          <button 
            className={`tab ${activeTab === 'newsletters' ? 'active' : ''}`}
            onClick={() => setActiveTab('newsletters')}
          >
            <Mail size={16} />
            Newsletters ({newsletters.length})
          </button>
          <button 
            className={`tab ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            <Target size={16} />
            Campagnes ({campaigns.length})
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={16} />
            Analytics
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="tab-content">
        {activeTab === 'promotions' && (
          <div className="promotions-grid">
            {promotions.map(promotion => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </div>
        )}

        {activeTab === 'newsletters' && (
          <div className="newsletters-grid">
            {newsletters.map(newsletter => (
              <NewsletterCard key={newsletter.id} newsletter={newsletter} />
            ))}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="campaigns-list">
            <div className="coming-soon">
              <Megaphone size={48} />
              <h3>Campagnes Automatisées</h3>
              <p>Fonctionnalité en cours de développement</p>
              <p>Bientôt disponible : séquences email, remarketing, segmentation avancée</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-dashboard">
            <div className="coming-soon">
              <BarChart3 size={48} />
              <h3>Analytics Marketing</h3>
              <p>Tableaux de bord détaillés en cours de développement</p>
              <p>ROI, conversion, attribution, A/B testing</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .marketing-tools {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .marketing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content h1 {
          margin: 0 0 5px 0;
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .header-content p {
          margin: 0;
          color: #6c757d;
          font-size: 1.1rem;
        }

        .create-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .create-btn:hover {
          background: #218838;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .quick-actions {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .quick-actions h2 {
          margin: 0 0 20px 0;
          font-size: 1.4rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .tabs-container {
          background: white;
          border-radius: 12px 12px 0 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #e9ecef;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 15px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
        }

        .tab:hover {
          color: #495057;
          background: #f8f9fa;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: #f8f9fa;
        }

        .tab-content {
          background: white;
          border-radius: 0 0 12px 12px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          min-height: 400px;
        }

        .promotions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }

        .newsletters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }

        .coming-soon {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .coming-soon h3 {
          margin: 20px 0 10px;
          color: #495057;
          font-size: 1.5rem;
        }

        .coming-soon p {
          margin: 10px 0;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .marketing-tools {
            padding: 10px;
          }

          .marketing-header {
            flex-direction: column;
            gap: 20px;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .tabs {
            flex-direction: column;
          }

          .promotions-grid,
          .newsletters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MarketingToolsPro;

