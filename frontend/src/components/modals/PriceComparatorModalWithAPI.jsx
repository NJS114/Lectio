import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Minus, RefreshCw, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { API_CONFIG } from '../../config/api';

const PriceComparatorModalWithAPI = ({ isOpen, onClose, book }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && book && book.title && book.author) {
      fetchPriceData();
    }
  }, [isOpen, book]);

  const fetchPriceData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/price-comparison`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: book.title,
          author: book.author,
          isbn: book.isbn || '',
          current_price: book.price || 0
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setPriceData(result.data);
      } else {
        throw new Error(result.message || 'Réponse API invalide');
      }
      
    } catch (error) {
      console.error('Erreur API comparaison prix:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationIcon = (action) => {
    switch (action) {
      case 'increase':
        return <TrendingUp className="recommendation-icon increase" />;
      case 'decrease':
        return <TrendingDown className="recommendation-icon decrease" />;
      default:
        return <CheckCircle className="recommendation-icon optimal" />;
    }
  };

  const getRecommendationColor = (action) => {
    switch (action) {
      case 'increase':
        return 'increase';
      case 'decrease':
        return 'decrease';
      default:
        return 'optimal';
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'high':
      case 'élevée':
        return 'var(--color-green-dark)';
      case 'medium':
      case 'moyenne':
        return 'var(--color-purple-dark)';
      default:
        return 'var(--color-gray-text)';
    }
  };

  const formatDemandLevel = (level) => {
    const mapping = {
      'high': 'Élevée',
      'medium': 'Moyenne', 
      'low': 'Faible',
      'élevée': 'Élevée',
      'moyenne': 'Moyenne',
      'faible': 'Faible'
    };
    return mapping[level] || level;
  };

  const formatTrend = (trend) => {
    const mapping = {
      'increasing': '↗ Hausse',
      'decreasing': '↘ Baisse',
      'stable': '→ Stable'
    };
    return mapping[trend] || trend;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content price-comparator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>Comparateur de prix intelligent</h2>
            {book && <p>{book.title} - {book.author}</p>}
          </div>
          <div className="header-actions">
            <button 
              className="refresh-btn"
              onClick={fetchPriceData}
              disabled={isLoading}
              title="Actualiser l'analyse"
            >
              <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div className="loading-state">
              <RefreshCw size={48} className="spinning" />
              <h3>Analyse IA en cours...</h3>
              <p>Recherche des meilleurs prix sur le marché français</p>
              <div className="loading-steps">
                <div className="step">✓ Analyse du livre avec OpenAI</div>
                <div className="step">⏳ Comparaison concurrentielle</div>
                <div className="step">⏳ Génération des recommandations</div>
              </div>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertTriangle size={48} />
              <h3>Erreur d'analyse</h3>
              <p>{error}</p>
              <button className="btn btn--secondary" onClick={fetchPriceData}>
                <RefreshCw size={16} />
                Réessayer
              </button>
            </div>
          ) : priceData ? (
            <>
              <div className="price-overview">
                <div className="current-price">
                  <h3>Votre prix</h3>
                  <span className="price-value">{priceData.current_price?.toFixed(2) || '0.00'}€</span>
                </div>
                <div className="market-price">
                  <h3>Prix moyen IA</h3>
                  <span className="price-value">{priceData.market_analysis?.average_price?.toFixed(2) || '0.00'}€</span>
                </div>
                <div className="price-range">
                  <h3>Fourchette marché</h3>
                  <span className="price-range-value">
                    {priceData.market_analysis?.min_price?.toFixed(2) || '0.00'}€ - {priceData.market_analysis?.max_price?.toFixed(2) || '0.00'}€
                  </span>
                </div>
              </div>

              <div className="ai-confidence">
                <div className="confidence-bar">
                  <div className="confidence-label">
                    Fiabilité de l'analyse IA: {Math.round((priceData.market_analysis?.confidence_score || 0.8) * 100)}%
                  </div>
                  <div className="confidence-progress">
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${(priceData.market_analysis?.confidence_score || 0.8) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="recommendation-section">
                <div className={`recommendation-card ${getRecommendationColor(priceData.recommendation?.action)}`}>
                  <div className="recommendation-header">
                    {getRecommendationIcon(priceData.recommendation?.action)}
                    <h3>
                      {priceData.recommendation?.action === 'increase' && 'Augmentation recommandée'}
                      {priceData.recommendation?.action === 'decrease' && 'Baisse recommandée'}
                      {priceData.recommendation?.action === 'optimal' && 'Prix optimal'}
                    </h3>
                  </div>
                  <p>{priceData.recommendation?.reason}</p>
                  {priceData.recommendation?.action !== 'optimal' && (
                    <div className="suggested-price">
                      Prix suggéré par IA: <strong>{priceData.recommendation?.suggested_price?.toFixed(2)}€</strong>
                    </div>
                  )}
                  <div className="market-position">
                    Position: <span className={`position-${priceData.recommendation?.market_position}`}>
                      {priceData.recommendation?.market_position === 'lowest' && 'Prix le plus bas'}
                      {priceData.recommendation?.market_position === 'highest' && 'Prix le plus élevé'}
                      {priceData.recommendation?.market_position === 'competitive' && 'Compétitif'}
                      {priceData.recommendation?.market_position === 'unknown' && 'Position inconnue'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="market-insights">
                <h3>Analyse de marché IA</h3>
                <div className="insights-grid">
                  <div className="insight-item">
                    <span className="insight-label">Demande</span>
                    <span 
                      className="insight-value"
                      style={{ color: getDemandColor(priceData.market_analysis?.demand_level) }}
                    >
                      {formatDemandLevel(priceData.market_analysis?.demand_level)}
                    </span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Offre</span>
                    <span className="insight-value">
                      {formatDemandLevel(priceData.market_analysis?.supply_level)}
                    </span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Tendance</span>
                    <span className="insight-value">
                      {formatTrend(priceData.market_analysis?.price_trend)}
                    </span>
                  </div>
                </div>
                
                {priceData.market_analysis?.market_factors && (
                  <div className="market-factors">
                    <h4>Facteurs d'influence :</h4>
                    <ul>
                      {priceData.market_analysis.market_factors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {priceData.competitors && priceData.competitors.length > 0 && (
                <div className="competitors-section">
                  <h3>Comparaison concurrentielle</h3>
                  <div className="competitors-list">
                    {priceData.competitors.map((competitor, index) => (
                      <div key={index} className="competitor-item">
                        <div className="competitor-info">
                          <span className="platform">{competitor.platform}</span>
                          <span className="seller">{competitor.seller}</span>
                          {competitor.url && (
                            <a 
                              href={competitor.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="competitor-link"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                        <div className="competitor-details">
                          <span className="condition">{competitor.condition}</span>
                          <span className="price">{competitor.price?.toFixed(2) || 'N/A'}€</span>
                          <span className="availability">{competitor.availability}</span>
                        </div>
                        {competitor.price && priceData.current_price && (
                          <div className="price-diff">
                            {competitor.price > priceData.current_price ? (
                              <span className="higher">+{(competitor.price - priceData.current_price).toFixed(2)}€</span>
                            ) : competitor.price < priceData.current_price ? (
                              <span className="lower">-{(priceData.current_price - competitor.price).toFixed(2)}€</span>
                            ) : (
                              <span className="equal">=</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="data-sources">
                <h4>Sources de données :</h4>
                <div className="sources-list">
                  {priceData.data_sources?.map((source, index) => (
                    <span key={index} className="source-tag">{source}</span>
                  ))}
                </div>
                <p className="last-updated">
                  Dernière mise à jour : {new Date(priceData.last_updated).toLocaleString('fr-FR')}
                </p>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <AlertTriangle size={48} />
              <h3>Aucune donnée disponible</h3>
              <p>Veuillez renseigner le titre et l'auteur du livre</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn--quiet" onClick={onClose}>
            Fermer
          </button>
          {priceData && priceData.recommendation?.action !== 'optimal' && (
            <button className="btn btn--primary">
              Appliquer le prix suggéré ({priceData.recommendation?.suggested_price?.toFixed(2)}€)
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--spacing-lg);
        }

        .price-comparator-modal {
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-gray-medium);
          background: linear-gradient(135deg, var(--color-green-mint), var(--color-purple-mint));
        }

        .header-content h2 {
          font-size: 24px;
          font-weight: 600;
          color: var(--color-gray-dark);
          margin-bottom: var(--spacing-xs);
        }

        .header-content p {
          color: var(--color-gray-text);
          font-size: 16px;
        }

        .header-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .refresh-btn,
        .close-btn {
          background: none;
          border: none;
          color: var(--color-gray-text);
          cursor: pointer;
          padding: var(--spacing-sm);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .refresh-btn:hover,
        .close-btn:hover {
          background: var(--color-gray-light);
          color: var(--color-gray-dark);
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .modal-body {
          padding: var(--spacing-lg);
        }

        .loading-state,
        .error-state,
        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-state h3,
        .error-state h3,
        .empty-state h3 {
          margin: var(--spacing-lg) 0 var(--spacing-sm);
          color: var(--color-gray-dark);
        }

        .loading-state p,
        .error-state p,
        .empty-state p {
          color: var(--color-gray-text);
          margin-bottom: var(--spacing-lg);
        }

        .loading-steps {
          margin-top: var(--spacing-lg);
          text-align: left;
          max-width: 300px;
          margin-left: auto;
          margin-right: auto;
        }

        .step {
          padding: var(--spacing-xs);
          font-size: 14px;
          color: var(--color-gray-text);
        }

        .price-overview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
        }

        .current-price,
        .market-price,
        .price-range {
          text-align: center;
          padding: var(--spacing-lg);
          background: var(--color-gray-light);
          border-radius: var(--radius-md);
        }

        .current-price {
          background: var(--color-green-mint);
        }

        .market-price {
          background: var(--color-purple-mint);
        }

        .current-price h3,
        .market-price h3,
        .price-range h3 {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-gray-text);
          margin-bottom: var(--spacing-sm);
        }

        .price-value,
        .price-range-value {
          font-size: 24px;
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .ai-confidence {
          margin-bottom: var(--spacing-2xl);
          padding: var(--spacing-md);
          background: var(--color-gray-light);
          border-radius: var(--radius-md);
        }

        .confidence-label {
          font-size: 14px;
          color: var(--color-gray-text);
          margin-bottom: var(--spacing-xs);
        }

        .confidence-progress {
          height: 8px;
          background: var(--color-gray-medium);
          border-radius: 4px;
          overflow: hidden;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-green-primary), var(--color-purple-primary));
          transition: width 0.3s ease;
        }

        .recommendation-section {
          margin-bottom: var(--spacing-2xl);
        }

        .recommendation-card {
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          border-left: 4px solid;
        }

        .recommendation-card.optimal {
          background: var(--color-green-mint);
          border-left-color: var(--color-green-primary);
        }

        .recommendation-card.increase {
          background: var(--color-purple-mint);
          border-left-color: var(--color-purple-primary);
        }

        .recommendation-card.decrease {
          background: rgba(232, 168, 124, 0.1);
          border-left-color: var(--color-error);
        }

        .recommendation-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .recommendation-icon {
          width: 24px;
          height: 24px;
        }

        .recommendation-icon.optimal {
          color: var(--color-green-dark);
        }

        .recommendation-icon.increase {
          color: var(--color-purple-dark);
        }

        .recommendation-icon.decrease {
          color: var(--color-error);
        }

        .suggested-price {
          margin-top: var(--spacing-sm);
          padding: var(--spacing-sm);
          background: rgba(255, 255, 255, 0.5);
          border-radius: var(--radius-sm);
          font-weight: 500;
        }

        .market-position {
          margin-top: var(--spacing-sm);
          font-size: 14px;
        }

        .position-lowest {
          color: var(--color-green-dark);
          font-weight: 600;
        }

        .position-highest {
          color: var(--color-error);
          font-weight: 600;
        }

        .position-competitive {
          color: var(--color-purple-dark);
          font-weight: 600;
        }

        .market-insights {
          margin-bottom: var(--spacing-2xl);
        }

        .market-insights h3 {
          margin-bottom: var(--spacing-lg);
          color: var(--color-gray-dark);
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .insight-item {
          text-align: center;
          padding: var(--spacing-md);
          background: var(--color-gray-light);
          border-radius: var(--radius-sm);
        }

        .insight-label {
          display: block;
          font-size: 12px;
          color: var(--color-gray-text);
          margin-bottom: var(--spacing-xs);
        }

        .insight-value {
          font-weight: 600;
          font-size: 16px;
        }

        .market-factors {
          margin-top: var(--spacing-lg);
          padding: var(--spacing-md);
          background: var(--color-gray-light);
          border-radius: var(--radius-sm);
        }

        .market-factors h4 {
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-dark);
        }

        .market-factors ul {
          margin: 0;
          padding-left: var(--spacing-lg);
        }

        .market-factors li {
          margin-bottom: var(--spacing-xs);
          color: var(--color-gray-text);
        }

        .competitors-section {
          margin-bottom: var(--spacing-2xl);
        }

        .competitors-section h3 {
          margin-bottom: var(--spacing-lg);
          color: var(--color-gray-dark);
        }

        .competitors-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .competitor-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--color-gray-light);
          border-radius: var(--radius-sm);
          align-items: center;
        }

        .competitor-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .platform {
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .seller {
          font-size: 14px;
          color: var(--color-gray-text);
        }

        .competitor-link {
          color: var(--color-purple-primary);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 12px;
        }

        .competitor-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          text-align: center;
        }

        .condition {
          font-size: 12px;
          color: var(--color-gray-text);
        }

        .price {
          font-weight: 600;
          font-size: 16px;
          color: var(--color-gray-dark);
        }

        .availability {
          font-size: 12px;
          color: var(--color-green-dark);
        }

        .price-diff {
          text-align: center;
        }

        .higher {
          color: var(--color-error);
          font-weight: 600;
        }

        .lower {
          color: var(--color-green-dark);
          font-weight: 600;
        }

        .equal {
          color: var(--color-gray-text);
        }

        .data-sources {
          margin-top: var(--spacing-2xl);
          padding: var(--spacing-lg);
          background: var(--color-gray-light);
          border-radius: var(--radius-md);
        }

        .data-sources h4 {
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-dark);
        }

        .sources-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-sm);
        }

        .source-tag {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--color-green-mint);
          border-radius: var(--radius-sm);
          font-size: 12px;
          color: var(--color-green-dark);
        }

        .last-updated {
          font-size: 12px;
          color: var(--color-gray-text);
          margin: 0;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-2xl);
          background: var(--color-gray-light);
          border-top: 1px solid var(--color-gray-medium);
        }

        @media (max-width: 768px) {
          .price-overview {
            grid-template-columns: 1fr;
          }

          .insights-grid {
            grid-template-columns: 1fr;
          }

          .competitor-item {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .modal-footer {
            flex-direction: column;
            gap: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
};

export default PriceComparatorModalWithAPI;

