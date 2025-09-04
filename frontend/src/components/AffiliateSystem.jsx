import React, { useState, useEffect } from 'react';
import { Link2, TrendingUp, DollarSign, Users, Copy, Eye, BarChart3, Calendar, CheckCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ECOSYSTEM_CONFIG } from '../utils/ecosystemCalculations';

const AffiliateSystem = () => {
  const { user } = useAuth();
  const [affiliateData, setAffiliateData] = useState({
    affiliateId: '',
    totalEarnings: 0,
    pendingEarnings: 0,
    totalClicks: 0,
    totalSales: 0,
    conversionRate: 0,
    affiliateLinks: [],
    recentActivity: [],
    monthlyStats: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [newLinkData, setNewLinkData] = useState({
    productId: '',
    productType: 'book', // book, ebook
    customName: '',
    campaign: ''
  });

  useEffect(() => {
    if (user) {
      loadAffiliateData();
    }
  }, [user]);

  const loadAffiliateData = () => {
    // Simulation des données d'affiliation
    const mockData = {
      affiliateId: `AFF-${user.id.toUpperCase()}`,
      totalEarnings: 247.85,
      pendingEarnings: 89.50,
      totalClicks: 1247,
      totalSales: 23,
      conversionRate: 1.84,
      affiliateLinks: [
        {
          id: 'link-001',
          name: 'Lien Catalogue Principal',
          url: `https://lectio.com/catalogue?ref=${user.id}`,
          shortUrl: 'lect.io/cat-abc123',
          clicks: 456,
          sales: 8,
          earnings: 67.20,
          conversionRate: 1.75,
          createdAt: new Date('2024-01-10'),
          isActive: true,
          campaign: 'catalogue-general'
        },
        {
          id: 'link-002',
          name: 'Python pour Débutants',
          url: `https://lectio.com/livre/python-debutants?ref=${user.id}`,
          shortUrl: 'lect.io/py-def456',
          clicks: 234,
          sales: 5,
          earnings: 45.75,
          conversionRate: 2.14,
          createdAt: new Date('2024-01-08'),
          isActive: true,
          campaign: 'ebooks-informatique'
        },
        {
          id: 'link-003',
          name: 'Collection Romans',
          url: `https://lectio.com/catalogue?category=roman&ref=${user.id}`,
          shortUrl: 'lect.io/rom-ghi789',
          clicks: 557,
          sales: 10,
          earnings: 134.90,
          conversionRate: 1.80,
          createdAt: new Date('2024-01-05'),
          isActive: true,
          campaign: 'romans-bestsellers'
        }
      ],
      recentActivity: [
        {
          id: 'act-001',
          type: 'sale',
          description: 'Vente: "1984" par George Orwell',
          amount: 12.45,
          commission: 2.49,
          date: new Date('2024-01-15'),
          linkId: 'link-001'
        },
        {
          id: 'act-002',
          type: 'click',
          description: 'Clic sur lien Python pour Débutants',
          amount: 0,
          commission: 0,
          date: new Date('2024-01-15'),
          linkId: 'link-002'
        },
        {
          id: 'act-003',
          type: 'sale',
          description: 'Location: "Le Petit Prince"',
          amount: 8.50,
          commission: 1.70,
          date: new Date('2024-01-14'),
          linkId: 'link-003'
        }
      ],
      monthlyStats: [
        { month: 'Jan 2024', earnings: 89.50, clicks: 456, sales: 8 },
        { month: 'Déc 2023', earnings: 67.20, clicks: 389, sales: 6 },
        { month: 'Nov 2023', earnings: 91.15, clicks: 402, sales: 9 }
      ]
    };

    setAffiliateData(mockData);
  };

  const generateAffiliateLink = (productId, productType, customName, campaign) => {
    const baseUrl = productType === 'book' 
      ? `https://lectio.com/livre/${productId}`
      : `https://lectio.com/ebook/${productId}`;
    
    const affiliateUrl = `${baseUrl}?ref=${user.id}&campaign=${campaign}`;
    const shortUrl = `lect.io/${productType.substring(0,2)}-${Math.random().toString(36).substring(2, 8)}`;
    
    const newLink = {
      id: `link-${Date.now()}`,
      name: customName || `Lien ${productType} ${productId}`,
      url: affiliateUrl,
      shortUrl: shortUrl,
      clicks: 0,
      sales: 0,
      earnings: 0,
      conversionRate: 0,
      createdAt: new Date(),
      isActive: true,
      campaign: campaign || 'default'
    };

    setAffiliateData(prev => ({
      ...prev,
      affiliateLinks: [...prev.affiliateLinks, newLink]
    }));

    return newLink;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Ici on pourrait ajouter une notification de succès
  };

  const toggleLinkStatus = (linkId) => {
    setAffiliateData(prev => ({
      ...prev,
      affiliateLinks: prev.affiliateLinks.map(link =>
        link.id === linkId ? { ...link, isActive: !link.isActive } : link
      )
    }));
  };

  const StatCard = ({ icon, title, value, subtitle, color = '#667eea' }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
      <style jsx>{`
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border-left: 4px solid ${color};
        }

        .stat-icon {
          font-size: 24px;
        }

        .stat-content h3 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .stat-content p {
          margin: 5px 0 0 0;
          color: #6c757d;
          font-weight: 500;
        }

        .stat-subtitle {
          font-size: 0.8rem;
          color: #95a5a6;
        }
      `}</style>
    </div>
  );

  const LinkCard = ({ link }) => (
    <div className="link-card">
      <div className="link-header">
        <div className="link-info">
          <h4>{link.name}</h4>
          <div className="link-urls">
            <div className="url-row">
              <span className="url-label">URL complète:</span>
              <code className="url-code">{link.url}</code>
              <button onClick={() => copyToClipboard(link.url)} className="copy-btn">
                <Copy size={14} />
              </button>
            </div>
            <div className="url-row">
              <span className="url-label">URL courte:</span>
              <code className="url-code short">{link.shortUrl}</code>
              <button onClick={() => copyToClipboard(link.shortUrl)} className="copy-btn">
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="link-status">
          <button 
            onClick={() => toggleLinkStatus(link.id)}
            className={`status-toggle ${link.isActive ? 'active' : 'inactive'}`}
          >
            {link.isActive ? 'Actif' : 'Inactif'}
          </button>
        </div>
      </div>

      <div className="link-stats">
        <div className="stat-item">
          <Eye size={16} />
          <span>{link.clicks} clics</span>
        </div>
        <div className="stat-item">
          <TrendingUp size={16} />
          <span>{link.sales} ventes</span>
        </div>
        <div className="stat-item">
          <DollarSign size={16} />
          <span>{link.earnings.toFixed(2)}€</span>
        </div>
        <div className="stat-item">
          <BarChart3 size={16} />
          <span>{link.conversionRate.toFixed(2)}%</span>
        </div>
      </div>

      <div className="link-meta">
        <span className="campaign">Campagne: {link.campaign}</span>
        <span className="date">Créé le {link.createdAt.toLocaleDateString()}</span>
      </div>

      <style jsx>{`
        .link-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 15px;
        }

        .link-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .link-info {
          flex: 1;
        }

        .link-info h4 {
          margin: 0 0 10px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .link-urls {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .url-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .url-label {
          font-size: 0.8rem;
          color: #6c757d;
          min-width: 80px;
        }

        .url-code {
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #495057;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .url-code.short {
          flex: none;
          min-width: 120px;
        }

        .copy-btn {
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background 0.3s ease;
        }

        .copy-btn:hover {
          background: #5a6fd8;
        }

        .status-toggle {
          padding: 6px 12px;
          border: none;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .status-toggle.active {
          background: #d4edda;
          color: #155724;
        }

        .status-toggle.inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .link-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .link-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #95a5a6;
          padding-top: 10px;
          border-top: 1px solid #e9ecef;
        }

        @media (max-width: 768px) {
          .link-header {
            flex-direction: column;
            gap: 15px;
          }

          .url-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .url-code {
            width: 100%;
          }

          .link-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .link-meta {
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );

  if (!user) {
    return (
      <div className="access-required">
        <Users size={48} />
        <h2>Connexion requise</h2>
        <p>Vous devez être connecté pour accéder au système d'affiliation.</p>
      </div>
    );
  }

  return (
    <div className="affiliate-system">
      <div className="system-header">
        <div className="header-content">
          <Link2 size={24} />
          <div>
            <h1>Système d'Affiliation Lectio</h1>
            <p>Gagnez {(ECOSYSTEM_CONFIG.AFFILIATE_COMMISSION_RATE * 100)}% de commission sur chaque vente</p>
          </div>
        </div>
        <div className="affiliate-id">
          <span>ID Affilié: <strong>{affiliateData.affiliateId}</strong></span>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="stats-grid">
        <StatCard
          icon={<DollarSign size={24} />}
          title="Gains totaux"
          value={`${affiliateData.totalEarnings.toFixed(2)}€`}
          subtitle={`${affiliateData.pendingEarnings.toFixed(2)}€ en attente`}
          color="#28a745"
        />
        <StatCard
          icon={<Eye size={24} />}
          title="Total clics"
          value={affiliateData.totalClicks.toLocaleString()}
          subtitle="Ce mois"
          color="#17a2b8"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          title="Ventes générées"
          value={affiliateData.totalSales}
          subtitle="Toutes périodes"
          color="#fd7e14"
        />
        <StatCard
          icon={<BarChart3 size={24} />}
          title="Taux de conversion"
          value={`${affiliateData.conversionRate.toFixed(2)}%`}
          subtitle="Moyenne"
          color="#6f42c1"
        />
      </div>

      {/* Générateur de liens */}
      <div className="link-generator">
        <div className="generator-header">
          <h2>Générateur de Liens d'Affiliation</h2>
          <button 
            onClick={() => setShowLinkGenerator(!showLinkGenerator)}
            className="toggle-generator"
          >
            {showLinkGenerator ? 'Masquer' : 'Créer un lien'}
          </button>
        </div>

        {showLinkGenerator && (
          <div className="generator-form">
            <div className="form-row">
              <div className="form-group">
                <label>Type de produit</label>
                <select
                  value={newLinkData.productType}
                  onChange={(e) => setNewLinkData(prev => ({ ...prev, productType: e.target.value }))}
                >
                  <option value="book">Livre physique</option>
                  <option value="ebook">Ebook</option>
                  <option value="catalogue">Catalogue</option>
                </select>
              </div>
              <div className="form-group">
                <label>ID Produit (optionnel)</label>
                <input
                  type="text"
                  value={newLinkData.productId}
                  onChange={(e) => setNewLinkData(prev => ({ ...prev, productId: e.target.value }))}
                  placeholder="ex: python-debutants"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nom personnalisé</label>
                <input
                  type="text"
                  value={newLinkData.customName}
                  onChange={(e) => setNewLinkData(prev => ({ ...prev, customName: e.target.value }))}
                  placeholder="ex: Mon lien Python"
                />
              </div>
              <div className="form-group">
                <label>Campagne</label>
                <input
                  type="text"
                  value={newLinkData.campaign}
                  onChange={(e) => setNewLinkData(prev => ({ ...prev, campaign: e.target.value }))}
                  placeholder="ex: newsletter-janvier"
                />
              </div>
            </div>
            <button 
              onClick={() => {
                generateAffiliateLink(
                  newLinkData.productId || 'catalogue',
                  newLinkData.productType,
                  newLinkData.customName,
                  newLinkData.campaign
                );
                setNewLinkData({ productId: '', productType: 'book', customName: '', campaign: '' });
                setShowLinkGenerator(false);
              }}
              className="generate-btn"
            >
              <Link2 size={16} />
              Générer le lien
            </button>
          </div>
        )}
      </div>

      {/* Liste des liens d'affiliation */}
      <div className="affiliate-links">
        <h2>Mes Liens d'Affiliation</h2>
        <div className="links-list">
          {affiliateData.affiliateLinks.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      </div>

      {/* Activité récente */}
      <div className="recent-activity">
        <h2>Activité Récente</h2>
        <div className="activity-list">
          {affiliateData.recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'sale' ? (
                  <DollarSign size={16} color="#28a745" />
                ) : (
                  <Eye size={16} color="#17a2b8" />
                )}
              </div>
              <div className="activity-content">
                <p>{activity.description}</p>
                <span className="activity-date">{activity.date.toLocaleDateString()}</span>
              </div>
              {activity.commission > 0 && (
                <div className="activity-commission">
                  +{activity.commission.toFixed(2)}€
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .affiliate-system {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .access-required {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .access-required h2 {
          margin: 20px 0 10px;
          color: #495057;
        }

        .system-header {
          background: white;
          border-radius: 10px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .header-content h1 {
          margin: 0 0 5px 0;
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .header-content p {
          margin: 0;
          color: #6c757d;
          font-size: 1.1rem;
        }

        .affiliate-id {
          background: #e3f2fd;
          color: #1976d2;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .link-generator {
          background: white;
          border-radius: 10px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .generator-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .generator-header h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .toggle-generator {
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .toggle-generator:hover {
          background: #5a6fd8;
        }

        .generator-form {
          border-top: 1px solid #e9ecef;
          padding-top: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select {
          padding: 10px 12px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #667eea;
        }

        .generate-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .generate-btn:hover {
          background: #218838;
        }

        .affiliate-links,
        .recent-activity {
          background: white;
          border-radius: 10px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .affiliate-links h2,
        .recent-activity h2 {
          margin: 0 0 20px 0;
          font-size: 1.4rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .activity-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: white;
          border-radius: 50%;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content p {
          margin: 0 0 5px 0;
          font-weight: 500;
          color: #2c3e50;
        }

        .activity-date {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .activity-commission {
          font-weight: 700;
          color: #28a745;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .affiliate-system {
            padding: 10px;
          }

          .system-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .generator-header {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default AffiliateSystem;

