import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Minus, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const PriceComparatorModal = ({ isOpen, onClose, book }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    if (isOpen && book) {
      fetchPriceData();
    }
  }, [isOpen, book, timeRange]);

  const fetchPriceData = async () => {
    setIsLoading(true);
    
    // Simulation de l'API de comparaison de prix
    setTimeout(() => {
      const mockData = {
        currentPrice: book?.price || 0,
        averagePrice: (book?.price || 0) * (0.9 + Math.random() * 0.2),
        minPrice: (book?.price || 0) * 0.8,
        maxPrice: (book?.price || 0) * 1.3,
        competitors: [
          { platform: 'Amazon', price: (book?.price || 0) * 1.15, condition: 'Bon', seller: 'Librairie Martin' },
          { platform: 'Fnac', price: (book?.price || 0) * 0.95, condition: 'Très bon', seller: 'Fnac Marketplace' },
          { platform: 'Rakuten', price: (book?.price || 0) * 1.05, condition: 'Bon', seller: 'Books & Co' },
          { platform: 'Momox', price: (book?.price || 0) * 0.85, condition: 'Correct', seller: 'Momox Shop' },
          { platform: 'Gibert', price: (book?.price || 0) * 1.25, condition: 'Neuf', seller: 'Gibert Joseph' }
        ],
        priceHistory: [
          { date: '2024-08-09', price: (book?.price || 0) * 1.1 },
          { date: '2024-08-10', price: (book?.price || 0) * 1.05 },
          { date: '2024-08-11', price: (book?.price || 0) * 1.0 },
          { date: '2024-08-12', price: (book?.price || 0) * 0.98 },
          { date: '2024-08-13', price: (book?.price || 0) * 0.95 },
          { date: '2024-08-14', price: (book?.price || 0) * 0.92 },
          { date: '2024-08-15', price: (book?.price || 0) * 0.90 }
        ],
        recommendation: {
          action: 'optimal', // 'increase', 'decrease', 'optimal'
          suggestedPrice: book?.price || 0,
          reason: 'Votre prix est dans la moyenne du marché et compétitif.'
        },
        marketInsights: {
          demand: 'high', // 'low', 'medium', 'high'
          supply: 'medium',
          trend: 'stable' // 'increasing', 'decreasing', 'stable'
        }
      };

      // Ajuster la recommandation selon le prix
      const priceRatio = mockData.currentPrice / mockData.averagePrice;
      if (priceRatio > 1.1) {
        mockData.recommendation = {
          action: 'decrease',
          suggestedPrice: mockData.averagePrice * 1.05,
          reason: 'Votre prix est supérieur à la moyenne. Considérez une baisse pour améliorer la compétitivité.'
        };
      } else if (priceRatio < 0.9) {
        mockData.recommendation = {
          action: 'increase',
          suggestedPrice: mockData.averagePrice * 0.95,
          reason: 'Votre prix est inférieur à la moyenne. Vous pourriez augmenter pour maximiser vos revenus.'
        };
      }

      setPriceData(mockData);
      setIsLoading(false);
    }, 1500);
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
        return 'var(--color-green-dark)';
      case 'medium':
        return 'var(--color-purple-dark)';
      default:
        return 'var(--color-gray-text)';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content price-comparator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>Comparateur de prix</h2>
            {book && <p>{book.title} - {book.author}</p>}
          </div>
          <div className="header-actions">
            <button 
              className="refresh-btn"
              onClick={fetchPriceData}
              disabled={isLoading}
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
              <h3>Analyse des prix en cours...</h3>
              <p>Comparaison avec les principales plateformes</p>
            </div>
          ) : priceData ? (
            <>
              <div className="price-overview">
                <div className="current-price">
                  <h3>Votre prix</h3>
                  <span className="price-value">{priceData.currentPrice.toFixed(2)}€</span>
                </div>
                <div className="market-price">
                  <h3>Prix moyen du marché</h3>
                  <span className="price-value">{priceData.averagePrice.toFixed(2)}€</span>
                </div>
                <div className="price-range">
                  <h3>Fourchette de prix</h3>
                  <span className="price-range-value">
                    {priceData.minPrice.toFixed(2)}€ - {priceData.maxPrice.toFixed(2)}€
                  </span>
                </div>
              </div>

              <div className="recommendation-section">
                <div className={`recommendation-card ${getRecommendationColor(priceData.recommendation.action)}`}>
                  <div className="recommendation-header">
                    {getRecommendationIcon(priceData.recommendation.action)}
                    <h3>
                      {priceData.recommendation.action === 'increase' && 'Augmentation recommandée'}
                      {priceData.recommendation.action === 'decrease' && 'Baisse recommandée'}
                      {priceData.recommendation.action === 'optimal' && 'Prix optimal'}
                    </h3>
                  </div>
                  <p>{priceData.recommendation.reason}</p>
                  {priceData.recommendation.action !== 'optimal' && (
                    <div className="suggested-price">
                      Prix suggéré: <strong>{priceData.recommendation.suggestedPrice.toFixed(2)}€</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="market-insights">
                <h3>Analyse du marché</h3>
                <div className="insights-grid">
                  <div className="insight-item">
                    <span className="insight-label">Demande</span>
                    <span 
                      className="insight-value"
                      style={{ color: getDemandColor(priceData.marketInsights.demand) }}
                    >
                      {priceData.marketInsights.demand === 'high' && 'Élevée'}
                      {priceData.marketInsights.demand === 'medium' && 'Moyenne'}
                      {priceData.marketInsights.demand === 'low' && 'Faible'}
                    </span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Offre</span>
                    <span className="insight-value">
                      {priceData.marketInsights.supply === 'high' && 'Élevée'}
                      {priceData.marketInsights.supply === 'medium' && 'Moyenne'}
                      {priceData.marketInsights.supply === 'low' && 'Faible'}
                    </span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Tendance</span>
                    <span className="insight-value">
                      {priceData.marketInsights.trend === 'increasing' && '↗ Hausse'}
                      {priceData.marketInsights.trend === 'decreasing' && '↘ Baisse'}
                      {priceData.marketInsights.trend === 'stable' && '→ Stable'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="competitors-section">
                <h3>Comparaison concurrentielle</h3>
                <div className="competitors-list">
                  {priceData.competitors.map((competitor, index) => (
                    <div key={index} className="competitor-item">
                      <div className="competitor-info">
                        <span className="platform">{competitor.platform}</span>
                        <span className="seller">{competitor.seller}</span>
                      </div>
                      <div className="competitor-details">
                        <span className="condition">{competitor.condition}</span>
                        <span className="price">{competitor.price.toFixed(2)}€</span>
                      </div>
                      <div className="price-diff">
                        {competitor.price > priceData.currentPrice ? (
                          <span className="higher">+{(competitor.price - priceData.currentPrice).toFixed(2)}€</span>
                        ) : competitor.price < priceData.currentPrice ? (
                          <span className="lower">-{(priceData.currentPrice - competitor.price).toFixed(2)}€</span>
                        ) : (
                          <span className="equal">=</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="time-range-selector">
                <h3>Historique des prix</h3>
                <div className="range-buttons">
                  {[
                    { value: '7d', label: '7 jours' },
                    { value: '30d', label: '30 jours' },
                    { value: '90d', label: '3 mois' }
                  ].map(range => (
                    <button
                      key={range.value}
                      className={`range-btn ${timeRange === range.value ? 'active' : ''}`}
                      onClick={() => setTimeRange(range.value)}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                <div className="price-chart">
                  <div className="chart-placeholder">
                    <TrendingUp size={48} />
                    <p>Graphique d'évolution des prix sur {timeRange}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="error-state">
              <AlertTriangle size={48} />
              <h3>Erreur de chargement</h3>
              <p>Impossible de récupérer les données de prix</p>
              <button className="btn btn--secondary" onClick={fetchPriceData}>
                Réessayer
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn--quiet" onClick={onClose}>
            Fermer
          </button>
          {priceData && priceData.recommendation.action !== 'optimal' && (
            <button className="btn btn--primary">
              Appliquer le prix suggéré
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
          max-width: 800px;
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
        .error-state {
          text-align: center;
          padding: var(--spacing-2xl);
        }

        .loading-state h3,
        .error-state h3 {
          margin: var(--spacing-lg) 0 var(--spacing-sm);
          color: var(--color-gray-dark);
        }

        .loading-state p,
        .error-state p {
          color: var(--color-gray-text);
          margin-bottom: var(--spacing-lg);
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

        .recommendation-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .recommendation-card p {
          color: var(--color-gray-text);
          margin-bottom: var(--spacing-sm);
        }

        .suggested-price {
          font-size: 16px;
          color: var(--color-gray-dark);
        }

        .market-insights {
          margin-bottom: var(--spacing-2xl);
        }

        .market-insights h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-dark);
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
        }

        .insight-item {
          text-align: center;
          padding: var(--spacing-md);
          background: var(--color-white);
          border: 1px solid var(--color-gray-medium);
          border-radius: var(--radius-sm);
        }

        .insight-label {
          display: block;
          font-size: 14px;
          color: var(--color-gray-text);
          margin-bottom: var(--spacing-xs);
        }

        .insight-value {
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .competitors-section {
          margin-bottom: var(--spacing-2xl);
        }

        .competitors-section h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-dark);
        }

        .competitors-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .competitor-item {
          display: grid;
          grid-template-columns: 2fr 1fr auto;
          gap: var(--spacing-md);
          align-items: center;
          padding: var(--spacing-md);
          background: var(--color-white);
          border: 1px solid var(--color-gray-medium);
          border-radius: var(--radius-sm);
        }

        .competitor-info {
          display: flex;
          flex-direction: column;
        }

        .platform {
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .seller {
          font-size: 14px;
          color: var(--color-gray-text);
        }

        .competitor-details {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .condition {
          font-size: 14px;
          color: var(--color-gray-text);
          margin-bottom: var(--spacing-xs);
        }

        .price {
          font-weight: 600;
          color: var(--color-gray-dark);
        }

        .price-diff {
          text-align: center;
          font-weight: 500;
        }

        .price-diff .higher {
          color: var(--color-error);
        }

        .price-diff .lower {
          color: var(--color-green-dark);
        }

        .price-diff .equal {
          color: var(--color-gray-text);
        }

        .time-range-selector h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-dark);
        }

        .range-buttons {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }

        .range-btn {
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--color-white);
          border: 1px solid var(--color-gray-medium);
          border-radius: var(--radius-sm);
          color: var(--color-gray-text);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .range-btn:hover {
          background: var(--color-gray-light);
        }

        .range-btn.active {
          background: var(--color-green-primary);
          border-color: var(--color-green-primary);
          color: var(--color-gray-dark);
        }

        .price-chart {
          background: var(--color-gray-light);
          border-radius: var(--radius-md);
          padding: var(--spacing-2xl);
        }

        .chart-placeholder {
          text-align: center;
          color: var(--color-gray-text);
        }

        .chart-placeholder p {
          margin-top: var(--spacing-md);
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
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
          }
        }
      `}</style>
    </div>
  );
};

export default PriceComparatorModal;

