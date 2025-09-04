import React, { useState, useEffect } from 'react';
import { useAffiliation } from '../../hooks/useAffiliation';
import { useAuth } from '../../hooks/useAuth';
import {
  TrendingUp, DollarSign, MousePointer, Users, Link2,
  Plus, Copy, ExternalLink, BarChart3, Calendar,
  Settings, Award, Target, Zap, ArrowUpRight, Eye
} from 'lucide-react';

const AffiliationPage = () => {
  const { user } = useAuth();
  const {
    affiliatePrograms,
    userAffiliateData,
    affiliateLinks,
    joinProgram,
    createAffiliateLink,
    getAffiliateStats,
    getTopPerformingLinks,
    generatePromotionalContent
  } = useAffiliation();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [stats, setStats] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showCreateLinkModal, setShowCreateLinkModal] = useState(false);

  useEffect(() => {
    const currentStats = getAffiliateStats(selectedPeriod);
    setStats(currentStats);
  }, [selectedPeriod, getAffiliateStats]);

  const handleJoinProgram = async (programId) => {
    try {
      await joinProgram(programId);
      setShowJoinModal(false);
      // Afficher une notification de succès
    } catch (error) {
      console.error('Erreur lors de l\'adhésion:', error);
    }
  };

  const handleCreateLink = async (linkData) => {
    try {
      await createAffiliateLink(linkData.productId, linkData.programId, linkData.customParams);
      setShowCreateLinkModal(false);
      // Afficher une notification de succès
    } catch (error) {
      console.error('Erreur lors de la création du lien:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Afficher une notification de succès
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="stats-overview">
        <div className="period-selector">
          <h2>Tableau de bord des affiliations</h2>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>

        <div className="stats-grid">
          <div className="stat-card earnings">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <h3>Gains</h3>
              <div className="stat-value">{formatCurrency(stats?.earnings || 0)}</div>
              <div className="stat-change positive">
                <ArrowUpRight size={16} />
                +12.5% vs période précédente
              </div>
            </div>
          </div>

          <div className="stat-card clicks">
            <div className="stat-icon">
              <MousePointer size={24} />
            </div>
            <div className="stat-content">
              <h3>Clics</h3>
              <div className="stat-value">{formatNumber(stats?.clicks || 0)}</div>
              <div className="stat-change positive">
                <ArrowUpRight size={16} />
                +8.3% vs période précédente
              </div>
            </div>
          </div>

          <div className="stat-card conversions">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <h3>Conversions</h3>
              <div className="stat-value">{formatNumber(stats?.conversions || 0)}</div>
              <div className="stat-change positive">
                <ArrowUpRight size={16} />
                +15.7% vs période précédente
              </div>
            </div>
          </div>

          <div className="stat-card conversion-rate">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>Taux de conversion</h3>
              <div className="stat-value">{(stats?.conversion_rate || 0).toFixed(2)}%</div>
              <div className="stat-change positive">
                <ArrowUpRight size={16} />
                +2.1% vs période précédente
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <div className="section-header">
            <h3>Liens les plus performants</h3>
            <button className="btn btn-primary" onClick={() => setShowCreateLinkModal(true)}>
              <Plus size={16} />
              Créer un lien
            </button>
          </div>
          
          <div className="top-links">
            {getTopPerformingLinks(5).map((link, index) => (
              <div key={link.id} className="link-item">
                <div className="link-rank">#{index + 1}</div>
                <div className="link-info">
                  <div className="link-url">{link.short_url}</div>
                  <div className="link-stats">
                    {link.clicks} clics • {link.conversions} conversions • {formatCurrency(link.earnings)}
                  </div>
                </div>
                <div className="link-actions">
                  <button onClick={() => copyToClipboard(link.url)} title="Copier">
                    <Copy size={16} />
                  </button>
                  <button onClick={() => window.open(link.url, '_blank')} title="Ouvrir">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h3>Programmes actifs</h3>
            <button className="btn btn-secondary" onClick={() => setShowJoinModal(true)}>
              <Plus size={16} />
              Rejoindre un programme
            </button>
          </div>
          
          <div className="active-programs">
            {affiliatePrograms
              .filter(program => userAffiliateData?.active_programs?.includes(program.id))
              .map(program => (
                <div key={program.id} className="program-card active">
                  <img src={program.logo} alt={program.name} />
                  <div className="program-info">
                    <h4>{program.name}</h4>
                    <p>Commission: {program.commission_rate}</p>
                  </div>
                  <div className="program-status">
                    <span className="status-badge active">Actif</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrograms = () => (
    <div className="programs-content">
      <div className="section-header">
        <h2>Programmes d'affiliation</h2>
        <p>Rejoignez des programmes pour commencer à gagner des commissions</p>
      </div>

      <div className="programs-grid">
        {affiliatePrograms.map(program => {
          const isActive = userAffiliateData?.active_programs?.includes(program.id);
          
          return (
            <div key={program.id} className={`program-card ${isActive ? 'active' : ''}`}>
              <div className="program-header">
                <img src={program.logo} alt={program.name} />
                <div className="program-basic-info">
                  <h3>{program.name}</h3>
                  <p>{program.description}</p>
                </div>
                {isActive && (
                  <div className="status-badge active">
                    <Award size={16} />
                    Actif
                  </div>
                )}
              </div>

              <div className="program-details">
                <div className="detail-item">
                  <strong>Commission:</strong> {program.commission_rate}
                </div>
                <div className="detail-item">
                  <strong>Paiement minimum:</strong> {formatCurrency(program.min_payout)}
                </div>
                <div className="detail-item">
                  <strong>Fréquence:</strong> {program.payment_schedule}
                </div>
                <div className="detail-item">
                  <strong>Délai d'approbation:</strong> {program.approval_time}
                </div>
              </div>

              <div className="program-categories">
                {program.categories.map(category => (
                  <span key={category} className="category-tag">{category}</span>
                ))}
              </div>

              <div className="program-features">
                <h4>Fonctionnalités:</h4>
                <ul>
                  {program.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="program-actions">
                {isActive ? (
                  <button className="btn btn-success" disabled>
                    <Award size={16} />
                    Programme actif
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedProgram(program);
                      setShowJoinModal(true);
                    }}
                  >
                    <Plus size={16} />
                    Rejoindre
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLinks = () => (
    <div className="links-content">
      <div className="section-header">
        <h2>Mes liens d'affiliation</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateLinkModal(true)}>
          <Plus size={16} />
          Créer un nouveau lien
        </button>
      </div>

      <div className="links-table">
        <div className="table-header">
          <div>Lien</div>
          <div>Programme</div>
          <div>Clics</div>
          <div>Conversions</div>
          <div>Gains</div>
          <div>Actions</div>
        </div>
        
        {affiliateLinks.map(link => (
          <div key={link.id} className="table-row">
            <div className="link-cell">
              <div className="link-url">{link.short_url}</div>
              <div className="link-date">
                Créé le {link.created_date.toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div className="program-cell">
              {affiliatePrograms.find(p => p.id === link.program_id)?.name}
            </div>
            <div className="stat-cell">{formatNumber(link.clicks)}</div>
            <div className="stat-cell">{formatNumber(link.conversions)}</div>
            <div className="earnings-cell">{formatCurrency(link.earnings)}</div>
            <div className="actions-cell">
              <button onClick={() => copyToClipboard(link.url)} title="Copier">
                <Copy size={16} />
              </button>
              <button onClick={() => window.open(link.url, '_blank')} title="Ouvrir">
                <ExternalLink size={16} />
              </button>
              <button title="Statistiques">
                <BarChart3 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-content">
      <div className="section-header">
        <h2>Analyses et rapports</h2>
        <div className="analytics-controls">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="day">Dernières 24h</option>
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
            <option value="year">12 derniers mois</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Évolution des gains</h3>
          <div className="chart-placeholder">
            <BarChart3 size={48} />
            <p>Graphique des gains sur la période sélectionnée</p>
          </div>
        </div>

        <div className="chart-card">
          <h3>Répartition par programme</h3>
          <div className="chart-placeholder">
            <TrendingUp size={48} />
            <p>Répartition des gains par programme d'affiliation</p>
          </div>
        </div>

        <div className="metrics-card">
          <h3>Métriques détaillées</h3>
          <div className="metrics-list">
            <div className="metric-item">
              <span>Clics uniques</span>
              <span>{formatNumber(stats?.clicks * 0.85 || 0)}</span>
            </div>
            <div className="metric-item">
              <span>Taux de rebond</span>
              <span>23.4%</span>
            </div>
            <div className="metric-item">
              <span>Temps moyen sur page</span>
              <span>2m 34s</span>
            </div>
            <div className="metric-item">
              <span>Valeur moyenne par conversion</span>
              <span>{formatCurrency((stats?.earnings || 0) / (stats?.conversions || 1))}</span>
            </div>
          </div>
        </div>

        <div className="top-sources-card">
          <h3>Sources de trafic principales</h3>
          <div className="sources-list">
            <div className="source-item">
              <span>Recherche organique</span>
              <span>45.2%</span>
            </div>
            <div className="source-item">
              <span>Réseaux sociaux</span>
              <span>28.7%</span>
            </div>
            <div className="source-item">
              <span>Email marketing</span>
              <span>16.3%</span>
            </div>
            <div className="source-item">
              <span>Trafic direct</span>
              <span>9.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTools = () => (
    <div className="tools-content">
      <div className="section-header">
        <h2>Outils de promotion</h2>
        <p>Créez du contenu promotionnel pour vos liens d'affiliation</p>
      </div>

      <div className="tools-grid">
        <div className="tool-card">
          <div className="tool-icon">
            <Link2 size={32} />
          </div>
          <h3>Générateur de bannières</h3>
          <p>Créez des bannières publicitaires personnalisées pour vos produits</p>
          <button className="btn btn-primary">
            Créer une bannière
          </button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">
            <FileText size={32} />
          </div>
          <h3>Templates d'articles</h3>
          <p>Modèles d'articles de blog optimisés pour la conversion</p>
          <button className="btn btn-primary">
            Voir les templates
          </button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">
            <Users size={32} />
          </div>
          <h3>Widgets sociaux</h3>
          <p>Widgets pour partager vos recommandations sur les réseaux sociaux</p>
          <button className="btn btn-primary">
            Générer un widget
          </button>
        </div>

        <div className="tool-card">
          <div className="tool-icon">
            <BarChart3 size={32} />
          </div>
          <h3>Tracking avancé</h3>
          <p>Codes de suivi pour analyser la performance de vos campagnes</p>
          <button className="btn btn-primary">
            Configurer le tracking
          </button>
        </div>
      </div>

      <div className="promotional-content">
        <h3>Contenu promotionnel généré</h3>
        <div className="content-examples">
          <div className="content-example">
            <h4>Bannière HTML</h4>
            <div className="code-block">
              <code>{generatePromotionalContent('sample', 'banner').html}</code>
            </div>
            <button onClick={() => copyToClipboard(generatePromotionalContent('sample', 'banner').html)}>
              <Copy size={16} />
              Copier le code
            </button>
          </div>

          <div className="content-example">
            <h4>Texte promotionnel</h4>
            <div className="text-block">
              {generatePromotionalContent('sample', 'text').content}
            </div>
            <button onClick={() => copyToClipboard(generatePromotionalContent('sample', 'text').content)}>
              <Copy size={16} />
              Copier le texte
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="affiliation-page">
        <div className="container">
          <div className="login-required">
            <Users size={48} />
            <h2>Connexion requise</h2>
            <p>Vous devez être connecté pour accéder au programme d'affiliation.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="affiliation-page">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>Programme d'affiliation</h1>
            <p>Gagnez des commissions en recommandant des livres et ebooks</p>
          </div>
          
          <div className="header-stats">
            <div className="header-stat">
              <div className="stat-value">{formatCurrency(userAffiliateData?.total_earnings || 0)}</div>
              <div className="stat-label">Gains totaux</div>
            </div>
            <div className="header-stat">
              <div className="stat-value">{formatNumber(userAffiliateData?.total_clicks || 0)}</div>
              <div className="stat-label">Clics totaux</div>
            </div>
            <div className="header-stat">
              <div className="stat-value">{(userAffiliateData?.conversion_rate || 0).toFixed(2)}%</div>
              <div className="stat-label">Taux de conversion</div>
            </div>
          </div>
        </div>

        <div className="page-navigation">
          <nav className="tabs">
            <button 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 size={20} />
              Tableau de bord
            </button>
            <button 
              className={activeTab === 'programs' ? 'active' : ''}
              onClick={() => setActiveTab('programs')}
            >
              <Award size={20} />
              Programmes
            </button>
            <button 
              className={activeTab === 'links' ? 'active' : ''}
              onClick={() => setActiveTab('links')}
            >
              <Link2 size={20} />
              Mes liens
            </button>
            <button 
              className={activeTab === 'analytics' ? 'active' : ''}
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp size={20} />
              Analyses
            </button>
            <button 
              className={activeTab === 'tools' ? 'active' : ''}
              onClick={() => setActiveTab('tools')}
            >
              <Zap size={20} />
              Outils
            </button>
          </nav>
        </div>

        <div className="page-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'programs' && renderPrograms()}
          {activeTab === 'links' && renderLinks()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'tools' && renderTools()}
        </div>
      </div>

      <style jsx>{`
        .affiliation-page {
          min-height: 100vh;
          background: var(--color-background);
          padding: 2rem 0;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow-card);
        }

        .header-content h1 {
          margin: 0 0 0.5rem 0;
          color: var(--color-text);
        }

        .header-content p {
          margin: 0;
          color: var(--color-text-secondary);
        }

        .header-stats {
          display: flex;
          gap: 2rem;
        }

        .header-stat {
          text-align: center;
        }

        .header-stat .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 0.25rem;
        }

        .header-stat .stat-label {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .page-navigation {
          margin-bottom: 2rem;
        }

        .tabs {
          display: flex;
          background: white;
          border-radius: 12px;
          padding: 0.5rem;
          box-shadow: var(--shadow-card);
          gap: 0.5rem;
        }

        .tabs button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          background: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .tabs button:hover {
          background: var(--color-background);
          color: var(--color-text);
        }

        .tabs button.active {
          background: var(--color-primary);
          color: white;
        }

        .page-content {
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow-card);
          padding: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .section-header h2 {
          margin: 0;
          color: var(--color-text);
        }

        .section-header p {
          margin: 0.5rem 0 0 0;
          color: var(--color-text-secondary);
        }

        .period-selector {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .period-selector select {
          padding: 0.5rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--color-background);
          border-radius: 12px;
          border-left: 4px solid var(--color-primary);
        }

        .stat-card.earnings {
          border-left-color: var(--color-success);
        }

        .stat-card.clicks {
          border-left-color: var(--color-info);
        }

        .stat-card.conversions {
          border-left-color: var(--color-warning);
        }

        .stat-card.conversion-rate {
          border-left-color: var(--color-primary);
        }

        .stat-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: var(--color-primary-light);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content h3 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .stat-change.positive {
          color: var(--color-success);
        }

        .dashboard-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .section {
          background: var(--color-background);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .section .section-header {
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
        }

        .section .section-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: var(--color-text);
        }

        .top-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .link-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px solid var(--color-border);
        }

        .link-rank {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: var(--color-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .link-info {
          flex: 1;
        }

        .link-url {
          font-weight: 500;
          color: var(--color-text);
          margin-bottom: 0.25rem;
        }

        .link-stats {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .link-actions {
          display: flex;
          gap: 0.5rem;
        }

        .link-actions button {
          padding: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          background: white;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .link-actions button:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .active-programs {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .program-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          transition: all 0.3s ease;
        }

        .program-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-hover);
        }

        .program-card.active {
          border-color: var(--color-success);
          background: var(--color-success-light);
        }

        .program-card img {
          width: 3rem;
          height: 1.5rem;
          object-fit: contain;
        }

        .program-info {
          flex: 1;
        }

        .program-info h4 {
          margin: 0 0 0.25rem 0;
          color: var(--color-text);
        }

        .program-info p {
          margin: 0;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: var(--color-success);
          color: white;
        }

        .programs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .programs-grid .program-card {
          flex-direction: column;
          align-items: stretch;
          padding: 2rem;
        }

        .program-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .program-header img {
          width: 4rem;
          height: 2rem;
          object-fit: contain;
        }

        .program-basic-info {
          flex: 1;
        }

        .program-basic-info h3 {
          margin: 0 0 0.5rem 0;
          color: var(--color-text);
        }

        .program-basic-info p {
          margin: 0;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .program-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .detail-item strong {
          color: var(--color-text);
        }

        .program-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .category-tag {
          padding: 0.25rem 0.5rem;
          background: var(--color-primary-light);
          color: var(--color-primary);
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .program-features {
          margin-bottom: 1.5rem;
        }

        .program-features h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          color: var(--color-text);
        }

        .program-features ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .program-features li {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          margin-bottom: 0.25rem;
        }

        .program-actions {
          margin-top: auto;
        }

        .links-table {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: var(--color-border);
          border-radius: 8px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
          background: var(--color-background);
          font-weight: 600;
          color: var(--color-text);
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem;
          background: white;
          align-items: center;
        }

        .link-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .link-url {
          font-weight: 500;
          color: var(--color-text);
        }

        .link-date {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .stat-cell {
          font-weight: 500;
          color: var(--color-text);
        }

        .earnings-cell {
          font-weight: 600;
          color: var(--color-success);
        }

        .actions-cell {
          display: flex;
          gap: 0.5rem;
        }

        .actions-cell button {
          padding: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          background: white;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .actions-cell button:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .chart-card,
        .metrics-card,
        .top-sources-card {
          background: var(--color-background);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .chart-card h3,
        .metrics-card h3,
        .top-sources-card h3 {
          margin: 0 0 1rem 0;
          color: var(--color-text);
        }

        .chart-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: var(--color-text-secondary);
          text-align: center;
        }

        .metrics-list,
        .sources-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .metric-item,
        .source-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .tool-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem;
          background: var(--color-background);
          border-radius: 12px;
          border: 1px solid var(--color-border);
          transition: all 0.3s ease;
        }

        .tool-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-hover);
        }

        .tool-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background: var(--color-primary-light);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .tool-card h3 {
          margin: 0 0 0.5rem 0;
          color: var(--color-text);
        }

        .tool-card p {
          margin: 0 0 1.5rem 0;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .promotional-content {
          background: var(--color-background);
          border-radius: 12px;
          padding: 2rem;
        }

        .promotional-content h3 {
          margin: 0 0 1.5rem 0;
          color: var(--color-text);
        }

        .content-examples {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .content-example {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid var(--color-border);
        }

        .content-example h4 {
          margin: 0 0 1rem 0;
          color: var(--color-text);
        }

        .code-block {
          background: var(--color-background);
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 1rem;
          overflow-x: auto;
        }

        .code-block code {
          font-family: 'Courier New', monospace;
          font-size: 0.8rem;
          color: var(--color-text);
        }

        .text-block {
          background: var(--color-background);
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 1rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn-primary {
          background: var(--color-primary);
          color: white;
        }

        .btn-primary:hover {
          background: var(--color-primary-dark);
        }

        .btn-secondary {
          background: var(--color-border);
          color: var(--color-text);
        }

        .btn-secondary:hover {
          background: var(--color-text-secondary);
          color: white;
        }

        .btn-success {
          background: var(--color-success);
          color: white;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-required {
          text-align: center;
          padding: 4rem 0;
          color: var(--color-text-secondary);
        }

        .login-required h2 {
          margin: 1rem 0;
          color: var(--color-text);
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .header-stats {
            align-self: stretch;
            justify-content: space-around;
          }
          
          .tabs {
            flex-direction: column;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-sections {
            grid-template-columns: 1fr;
          }
          
          .programs-grid {
            grid-template-columns: 1fr;
          }
          
          .analytics-grid {
            grid-template-columns: 1fr;
          }
          
          .tools-grid {
            grid-template-columns: 1fr;
          }
          
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          
          .table-header {
            display: none;
          }
          
          .table-row {
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default AffiliationPage;

