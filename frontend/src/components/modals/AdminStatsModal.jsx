import React from 'react';
import { X, TrendingUp, Users, BookOpen, DollarSign, Calendar, MapPin } from 'lucide-react';

const AdminStatsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const advancedStats = {
    revenue: {
      total: 45678,
      growth: 12.5,
      monthly: [3200, 3800, 4100, 4500, 4200, 4800, 5100, 4900, 5300, 5600, 5200, 5800]
    },
    users: {
      total: 2847,
      active: 1923,
      new: 156,
      retention: 78.5
    },
    books: {
      total: 12456,
      sold: 8934,
      rented: 2341,
      available: 1181
    },
    geography: [
      { city: 'Paris', users: 1245, revenue: 18500 },
      { city: 'Lyon', users: 456, revenue: 8900 },
      { city: 'Marseille', users: 389, revenue: 7200 },
      { city: 'Toulouse', users: 234, revenue: 4800 },
      { city: 'Bordeaux', users: 198, revenue: 3900 }
    ]
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content--large">
        <div className="modal-header">
          <h2>📊 Statistiques Avancées</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Revenus */}
          <div className="stats-section">
            <h3><DollarSign size={20} /> Revenus</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">€{advancedStats.revenue.total.toLocaleString()}</div>
                <div className="stat-label">Chiffre d'affaires total</div>
                <div className="stat-growth positive">+{advancedStats.revenue.growth}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">€{advancedStats.revenue.monthly[advancedStats.revenue.monthly.length - 1]}</div>
                <div className="stat-label">Revenus ce mois</div>
              </div>
            </div>
            <div className="chart-placeholder">
              <TrendingUp size={24} />
              <span>Graphique des revenus mensuels</span>
            </div>
          </div>

          {/* Utilisateurs */}
          <div className="stats-section">
            <h3><Users size={20} /> Utilisateurs</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{advancedStats.users.total.toLocaleString()}</div>
                <div className="stat-label">Utilisateurs totaux</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{advancedStats.users.active.toLocaleString()}</div>
                <div className="stat-label">Utilisateurs actifs</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{advancedStats.users.new}</div>
                <div className="stat-label">Nouveaux ce mois</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{advancedStats.users.retention}%</div>
                <div className="stat-label">Taux de rétention</div>
              </div>
            </div>
          </div>

          {/* Livres */}
          <div className="stats-section">
            <h3><BookOpen size={20} /> Catalogue</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{advancedStats.books.total.toLocaleString()}</div>
                <div className="stat-label">Livres au catalogue</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{advancedStats.books.sold.toLocaleString()}</div>
                <div className="stat-label">Livres vendus</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{advancedStats.books.rented.toLocaleString()}</div>
                <div className="stat-label">Locations actives</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{advancedStats.books.available.toLocaleString()}</div>
                <div className="stat-label">Disponibles</div>
              </div>
            </div>
          </div>

          {/* Géographie */}
          <div className="stats-section">
            <h3><MapPin size={20} /> Répartition Géographique</h3>
            <div className="geography-table">
              <div className="table-header">
                <div>Ville</div>
                <div>Utilisateurs</div>
                <div>Revenus</div>
              </div>
              {advancedStats.geography.map((city, index) => (
                <div key={index} className="table-row">
                  <div>{city.city}</div>
                  <div>{city.users}</div>
                  <div>€{city.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn--secondary" onClick={onClose}>
            Fermer
          </button>
          <button className="btn btn--primary">
            <Calendar size={16} />
            Exporter le rapport
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-content--large {
          max-width: 1000px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .stats-section {
          margin-bottom: var(--spacing-xl);
          padding-bottom: var(--spacing-lg);
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .stats-section:last-child {
          border-bottom: none;
        }

        .stats-section h3 {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-warm-dark);
          font-size: 18px;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .stat-card {
          background: var(--color-white);
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          text-align: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--color-gray-warm-dark);
          margin-bottom: var(--spacing-xs);
        }

        .stat-label {
          font-size: 14px;
          color: var(--color-gray-warm-medium);
          margin-bottom: var(--spacing-xs);
        }

        .stat-growth {
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .stat-growth.positive {
          background: rgba(34, 197, 94, 0.1);
          color: var(--color-green-primary);
        }

        .chart-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          height: 200px;
          background: var(--color-gray-warm-lightest);
          border: 2px dashed var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          color: var(--color-gray-warm-medium);
        }

        .geography-table {
          background: var(--color-white);
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 120px 120px;
          background: var(--color-gray-warm-lightest);
          padding: var(--spacing-sm) var(--spacing-md);
          font-weight: 600;
          color: var(--color-gray-warm-dark);
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .table-row {
          display: grid;
          grid-template-columns: 1fr 120px 120px;
          padding: var(--spacing-sm) var(--spacing-md);
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row:hover {
          background: var(--color-gray-warm-lightest);
        }
      `}</style>
    </div>
  );
};

export default AdminStatsModal;

