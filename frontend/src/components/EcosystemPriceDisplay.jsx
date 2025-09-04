import React from 'react';
import { Info, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { formatPrice } from '../utils/ecosystemCalculations';

const EcosystemPriceDisplay = ({ 
  calculations, 
  showBreakdown = false, 
  compact = false,
  showUserRevenue = true 
}) => {
  if (!calculations) return null;

  const { sale, rental } = calculations;

  if (compact) {
    return (
      <div className="ecosystem-price-compact">
        {sale.userPrice > 0 && (
          <div className="price-item">
            <span className="price-label">Vente:</span>
            <span className="price-final">{formatPrice(sale.finalPrice)}</span>
            {showUserRevenue && (
              <span className="price-user">({formatPrice(sale.userReceives)} pour vous)</span>
            )}
          </div>
        )}
        {rental.userPrice > 0 && (
          <div className="price-item">
            <span className="price-label">Location (2 sem.):</span>
            <span className="price-final">{formatPrice(rental.finalPrice)}</span>
            {showUserRevenue && (
              <span className="price-user">({formatPrice(rental.userReceives)} pour vous)</span>
            )}
          </div>
        )}
        
        <style jsx>{`
          .ecosystem-price-compact {
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 0.9rem;
          }
          
          .price-item {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }
          
          .price-label {
            color: #6c757d;
            font-weight: 500;
          }
          
          .price-final {
            font-weight: 700;
            color: #28a745;
          }
          
          .price-user {
            color: #6c757d;
            font-size: 0.8rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ecosystem-price-display">
      <div className="price-header">
        <DollarSign size={20} />
        <h3>Prix avec écosystème Lectio</h3>
        <div className="ecosystem-badge">
          <Info size={14} />
          <span>Commission 20%</span>
        </div>
      </div>

      <div className="price-grid">
        {sale.userPrice > 0 && (
          <div className="price-section sale">
            <div className="section-header">
              <TrendingUp size={16} />
              <h4>Vente</h4>
            </div>
            
            <div className="price-main">
              <div className="price-row">
                <span>Votre prix:</span>
                <span className="user-price">{formatPrice(sale.userPrice)}</span>
              </div>
              <div className="price-row final">
                <span>Prix affiché aux acheteurs:</span>
                <span className="final-price">{formatPrice(sale.finalPrice)}</span>
              </div>
              <div className="price-row revenue">
                <span>Vous recevrez:</span>
                <span className="user-revenue">{formatPrice(sale.userReceives)}</span>
              </div>
            </div>

            {showBreakdown && (
              <div className="price-breakdown">
                <h5>Répartition des coûts:</h5>
                <div className="breakdown-item">
                  <span>Commission (20%):</span>
                  <span>+{formatPrice(sale.commission)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Expédition:</span>
                  <span>+{formatPrice(sale.shipping)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Gestion:</span>
                  <span>+{formatPrice(sale.handling)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Plateforme:</span>
                  <span>+{formatPrice(sale.platformFee)}</span>
                </div>
                {sale.affiliateCommission > 0 && (
                  <div className="breakdown-item">
                    <span>Commission affiliation:</span>
                    <span>+{formatPrice(sale.affiliateCommission)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {rental.userPrice > 0 && (
          <div className="price-section rental">
            <div className="section-header">
              <Calendar size={16} />
              <h4>Location (2 semaines)</h4>
            </div>
            
            <div className="price-main">
              <div className="price-row">
                <span>Votre prix (2 sem.):</span>
                <span className="user-price">{formatPrice(rental.userPrice)}</span>
              </div>
              <div className="price-row final">
                <span>Prix affiché aux locataires:</span>
                <span className="final-price">{formatPrice(rental.finalPrice)}</span>
              </div>
              <div className="price-row revenue">
                <span>Vous recevrez:</span>
                <span className="user-revenue">{formatPrice(rental.userReceives)}</span>
              </div>
            </div>

            {showBreakdown && (
              <div className="price-breakdown">
                <h5>Répartition des coûts:</h5>
                <div className="breakdown-item">
                  <span>Commission (20%):</span>
                  <span>+{formatPrice(rental.commission)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Expédition (A/R):</span>
                  <span>+{formatPrice(rental.shipping)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Gestion:</span>
                  <span>+{formatPrice(rental.handling)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Plateforme:</span>
                  <span>+{formatPrice(rental.platformFee)}</span>
                </div>
                {rental.affiliateCommission > 0 && (
                  <div className="breakdown-item">
                    <span>Commission affiliation:</span>
                    <span>+{formatPrice(rental.affiliateCommission)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ecosystem-info">
        <Info size={16} />
        <div>
          <p><strong>Écosystème viable:</strong> Les frais couvrent l'expédition, la gestion des retours, le support client et le développement de la plateforme.</p>
          <p>Vos revenus sont nets, sans frais cachés.</p>
        </div>
      </div>

      <style jsx>{`
        .ecosystem-price-display {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }

        .price-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e9ecef;
        }

        .price-header h3 {
          flex: 1;
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .ecosystem-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .price-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .price-section {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 15px;
        }

        .price-section.sale {
          border-left: 4px solid #28a745;
        }

        .price-section.rental {
          border-left: 4px solid #007bff;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }

        .section-header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #495057;
        }

        .price-main {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .price-row.final {
          border-top: 1px solid #e9ecef;
          border-bottom: 1px solid #e9ecef;
          font-weight: 600;
        }

        .price-row.revenue {
          background: #e8f5e8;
          padding: 10px;
          border-radius: 6px;
          font-weight: 600;
        }

        .user-price {
          color: #6c757d;
          font-weight: 500;
        }

        .final-price {
          color: #dc3545;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .user-revenue {
          color: #28a745;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .price-breakdown {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e9ecef;
        }

        .price-breakdown h5 {
          margin: 0 0 10px 0;
          font-size: 0.9rem;
          color: #6c757d;
          font-weight: 600;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #6c757d;
          margin-bottom: 5px;
        }

        .ecosystem-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #17a2b8;
        }

        .ecosystem-info p {
          margin: 0 0 8px 0;
          font-size: 0.9rem;
          color: #495057;
          line-height: 1.4;
        }

        .ecosystem-info p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .price-grid {
            grid-template-columns: 1fr;
          }
          
          .price-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .ecosystem-info {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default EcosystemPriceDisplay;

