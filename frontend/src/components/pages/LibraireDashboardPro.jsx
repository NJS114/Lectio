import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Package, Users, DollarSign, Eye, 
  ShoppingCart, Star, Calendar, Filter, Download, Plus,
  BookOpen, Target, Zap, Bell, Settings, Search, Upload
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LibraireDashboardPro = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dashboardData, setDashboardData] = useState({
    metrics: {},
    sales: [],
    inventory: [],
    customers: [],
    analytics: {}
  });

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = () => {
    // Simulation des données business pour libraire
    const mockData = {
      metrics: {
        revenue: {
          current: 12450,
          previous: 10800,
          trend: 15.3,
          target: 15000
        },
        orders: {
          current: 234,
          previous: 198,
          trend: 18.2,
          target: 250
        },
        customers: {
          current: 67,
          previous: 52,
          trend: 28.8,
          target: 75
        },
        conversion: {
          current: 3.2,
          previous: 2.8,
          trend: 14.3,
          target: 4.0
        },
        avgOrder: {
          current: 53.20,
          previous: 54.55,
          trend: -2.5,
          target: 55.00
        },
        inventory: {
          current: 1247,
          lowStock: 23,
          outOfStock: 5,
          trend: -1.2
        }
      },
      topProducts: [
        {
          id: 1,
          title: "Sapiens",
          author: "Yuval Noah Harari",
          sales: 45,
          revenue: 540,
          stock: 12,
          category: "Essai",
          trend: 23
        },
        {
          id: 2,
          title: "L'Étranger",
          author: "Albert Camus",
          sales: 38,
          revenue: 323,
          stock: 8,
          category: "Roman",
          trend: 15
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          sales: 32,
          revenue: 304,
          stock: 15,
          category: "Science-Fiction",
          trend: -5
        },
        {
          id: 4,
          title: "Le Petit Prince",
          author: "Antoine de Saint-Exupéry",
          sales: 28,
          revenue: 193,
          stock: 22,
          category: "Jeunesse",
          trend: 8
        }
      ],
      recentOrders: [
        {
          id: "CMD-001",
          customer: "Marie Dubois",
          items: 2,
          total: 25.50,
          status: "shipped",
          date: new Date('2024-09-02T10:30:00')
        },
        {
          id: "CMD-002",
          customer: "Pierre Martin",
          items: 1,
          total: 12.00,
          status: "processing",
          date: new Date('2024-09-02T09:15:00')
        },
        {
          id: "CMD-003",
          customer: "Sophie Laurent",
          items: 3,
          total: 38.90,
          status: "delivered",
          date: new Date('2024-09-01T16:45:00')
        }
      ],
      alerts: [
        {
          id: 1,
          type: "stock",
          message: "23 livres en stock faible",
          priority: "medium",
          date: new Date()
        },
        {
          id: 2,
          type: "sales",
          message: "Objectif mensuel à 83%",
          priority: "low",
          date: new Date()
        },
        {
          id: 3,
          type: "promotion",
          message: "Promotion 'Rentrée' se termine demain",
          priority: "high",
          date: new Date()
        }
      ]
    };

    setDashboardData(mockData);
  };

  const MetricCard = ({ title, value, subtitle, trend, target, icon, color = '#667eea' }) => (
    <div className="metric-card">
      <div className="metric-header">
        <div className="metric-icon" style={{ color }}>
          {icon}
        </div>
        <div className="metric-trend">
          <TrendingUp 
            size={16} 
            className={trend >= 0 ? 'trend-positive' : 'trend-negative'} 
          />
          <span className={trend >= 0 ? 'trend-positive' : 'trend-negative'}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="metric-content">
        <h3>{value}</h3>
        <p>{title}</p>
        {subtitle && <span className="metric-subtitle">{subtitle}</span>}
      </div>

      {target && (
        <div className="metric-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min((parseFloat(value.toString().replace(/[^0-9.]/g, '')) / target) * 100, 100)}%`,
                backgroundColor: color 
              }}
            />
          </div>
          <span className="progress-text">
            Objectif: {typeof target === 'number' ? target.toLocaleString() : target}
          </span>
        </div>
      )}

      <style jsx>{`
        .metric-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border-left: 4px solid ${color};
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .metric-icon {
          font-size: 24px;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .trend-positive {
          color: #28a745;
        }

        .trend-negative {
          color: #dc3545;
        }

        .metric-content h3 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .metric-content p {
          margin: 5px 0 0 0;
          color: #6c757d;
          font-weight: 500;
        }

        .metric-subtitle {
          font-size: 0.8rem;
          color: #95a5a6;
        }

        .metric-progress {
          margin-top: 15px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e9ecef;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 5px;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.7rem;
          color: #6c757d;
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
          padding: 15px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
        }

        .quick-action:hover {
          border-color: ${color};
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .action-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .action-content h4 {
          margin: 0 0 5px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .action-content p {
          margin: 0;
          font-size: 0.8rem;
          color: #6c757d;
        }
      `}</style>
    </button>
  );

  const ProductRow = ({ product }) => (
    <tr className="product-row">
      <td>
        <div className="product-info">
          <strong>{product.title}</strong>
          <span>{product.author}</span>
        </div>
      </td>
      <td>{product.category}</td>
      <td>{product.sales}</td>
      <td>{product.revenue.toFixed(2)}€</td>
      <td>
        <span className={`stock-badge ${product.stock < 10 ? 'low' : 'normal'}`}>
          {product.stock}
        </span>
      </td>
      <td>
        <span className={`trend ${product.trend >= 0 ? 'positive' : 'negative'}`}>
          {product.trend >= 0 ? '+' : ''}{product.trend}%
        </span>
      </td>
      
      <style jsx>{`
        .product-row {
          border-bottom: 1px solid #e9ecef;
        }

        .product-row:hover {
          background: #f8f9fa;
        }

        .product-info {
          display: flex;
          flex-direction: column;
        }

        .product-info strong {
          font-weight: 600;
          color: #2c3e50;
        }

        .product-info span {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .stock-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .stock-badge.normal {
          background: #d4edda;
          color: #155724;
        }

        .stock-badge.low {
          background: #f8d7da;
          color: #721c24;
        }

        .trend {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .trend.positive {
          color: #28a745;
        }

        .trend.negative {
          color: #dc3545;
        }

        td {
          padding: 12px 8px;
          vertical-align: middle;
        }
      `}</style>
    </tr>
  );

  if (!user || user.type !== 'bookstore') {
    return (
      <div className="access-denied">
        <BookOpen size={48} />
        <h2>Accès Libraire Requis</h2>
        <p>Ce dashboard est réservé aux comptes libraires professionnels.</p>
      </div>
    );
  }

  return (
    <div className="libraire-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Dashboard Professionnel</h1>
            <p>Librairie {user.name} • {user.city}</p>
          </div>
          <div className="header-actions">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-selector"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
            <button className="export-btn">
              <Download size={16} />
              Exporter
            </button>
          </div>
        </div>

        {/* Alertes */}
        {dashboardData.alerts && dashboardData.alerts.length > 0 && (
          <div className="alerts-bar">
            <Bell size={16} />
            <span>{dashboardData.alerts.length} notification(s)</span>
            <div className="alerts-preview">
              {dashboardData.alerts.slice(0, 2).map(alert => (
                <span key={alert.id} className={`alert-item ${alert.priority}`}>
                  {alert.message}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Métriques principales */}
      <div className="metrics-grid">
        <MetricCard
          title="Chiffre d'affaires"
          value={`${dashboardData.metrics.revenue?.current?.toLocaleString()}€`}
          subtitle={`vs ${dashboardData.metrics.revenue?.previous?.toLocaleString()}€ période précédente`}
          trend={dashboardData.metrics.revenue?.trend}
          target={dashboardData.metrics.revenue?.target}
          icon={<DollarSign size={24} />}
          color="#28a745"
        />
        <MetricCard
          title="Commandes"
          value={dashboardData.metrics.orders?.current?.toString()}
          subtitle="commandes traitées"
          trend={dashboardData.metrics.orders?.trend}
          target={dashboardData.metrics.orders?.target}
          icon={<ShoppingCart size={24} />}
          color="#17a2b8"
        />
        <MetricCard
          title="Nouveaux clients"
          value={dashboardData.metrics.customers?.current?.toString()}
          subtitle="clients acquis"
          trend={dashboardData.metrics.customers?.trend}
          target={dashboardData.metrics.customers?.target}
          icon={<Users size={24} />}
          color="#fd7e14"
        />
        <MetricCard
          title="Taux de conversion"
          value={`${dashboardData.metrics.conversion?.current}%`}
          subtitle="visiteurs → acheteurs"
          trend={dashboardData.metrics.conversion?.trend}
          target={dashboardData.metrics.conversion?.target}
          icon={<Target size={24} />}
          color="#6f42c1"
        />
        <MetricCard
          title="Panier moyen"
          value={`${dashboardData.metrics.avgOrder?.current?.toFixed(2)}€`}
          subtitle="par commande"
          trend={dashboardData.metrics.avgOrder?.trend}
          target={dashboardData.metrics.avgOrder?.target}
          icon={<BarChart3 size={24} />}
          color="#e83e8c"
        />
        <MetricCard
          title="Stock total"
          value={dashboardData.metrics.inventory?.current?.toString()}
          subtitle={`${dashboardData.metrics.inventory?.lowStock} en stock faible`}
          trend={dashboardData.metrics.inventory?.trend}
          icon={<Package size={24} />}
          color="#20c997"
        />
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <h2>Actions Rapides</h2>
        <div className="actions-grid">
          <QuickAction
            icon={<Plus size={24} />}
            title="Ajouter des livres"
            description="Import CSV ou ajout manuel"
            color="#28a745"
            onClick={() => console.log('Ajouter livres')}
          />
          <QuickAction
            icon={<Zap size={24} />}
            title="Créer une promotion"
            description="Soldes et codes promo"
            color="#fd7e14"
            onClick={() => console.log('Créer promotion')}
          />
          <QuickAction
            icon={<BarChart3 size={24} />}
            title="Analytics détaillées"
            description="Rapports et tendances"
            color="#6f42c1"
            onClick={() => console.log('Analytics')}
          />
          <QuickAction
            icon={<Upload size={24} />}
            title="Synchroniser stock"
            description="Mise à jour automatique"
            color="#17a2b8"
            onClick={() => console.log('Sync stock')}
          />
        </div>
      </div>

      {/* Top produits */}
      <div className="top-products">
        <div className="section-header">
          <h2>Top Produits</h2>
          <div className="section-actions">
            <button className="filter-btn">
              <Filter size={16} />
              Filtrer
            </button>
            <button className="search-btn">
              <Search size={16} />
            </button>
          </div>
        </div>
        
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Livre</th>
                <th>Catégorie</th>
                <th>Ventes</th>
                <th>CA</th>
                <th>Stock</th>
                <th>Tendance</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.topProducts?.map(product => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commandes récentes */}
      <div className="recent-orders">
        <h2>Commandes Récentes</h2>
        <div className="orders-list">
          {dashboardData.recentOrders?.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <strong>{order.id}</strong>
                <span>{order.customer}</span>
              </div>
              <div className="order-details">
                <span>{order.items} article(s)</span>
                <span>{order.total.toFixed(2)}€</span>
              </div>
              <div className={`order-status ${order.status}`}>
                {order.status === 'shipped' && 'Expédiée'}
                {order.status === 'processing' && 'En cours'}
                {order.status === 'delivered' && 'Livrée'}
              </div>
              <div className="order-date">
                {order.date.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .libraire-dashboard {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .access-denied {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .access-denied h2 {
          margin: 20px 0 10px;
          color: #495057;
        }

        .dashboard-header {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header-info h1 {
          margin: 0 0 5px 0;
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .header-info p {
          margin: 0;
          color: #6c757d;
          font-size: 1.1rem;
        }

        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .period-selector {
          padding: 8px 12px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          background: white;
          color: #495057;
          cursor: pointer;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .export-btn:hover {
          background: #5a6fd8;
        }

        .alerts-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          color: #856404;
        }

        .alerts-preview {
          display: flex;
          gap: 15px;
          margin-left: auto;
        }

        .alert-item {
          font-size: 0.8rem;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .alert-item.high {
          background: #f8d7da;
          color: #721c24;
        }

        .alert-item.medium {
          background: #fff3cd;
          color: #856404;
        }

        .alert-item.low {
          background: #d1ecf1;
          color: #0c5460;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
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
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .top-products {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .section-actions {
          display: flex;
          gap: 10px;
        }

        .filter-btn, .search-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          background: white;
          color: #495057;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-btn:hover, .search-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .products-table {
          overflow-x: auto;
        }

        .products-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .products-table th {
          text-align: left;
          padding: 12px 8px;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
        }

        .recent-orders {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .recent-orders h2 {
          margin: 0 0 20px 0;
          font-size: 1.4rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .order-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 20px;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .order-info {
          display: flex;
          flex-direction: column;
        }

        .order-info strong {
          font-weight: 600;
          color: #2c3e50;
        }

        .order-info span {
          font-size: 0.9rem;
          color: #6c757d;
        }

        .order-details {
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
          color: #495057;
        }

        .order-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
        }

        .order-status.shipped {
          background: #d1ecf1;
          color: #0c5460;
        }

        .order-status.processing {
          background: #fff3cd;
          color: #856404;
        }

        .order-status.delivered {
          background: #d4edda;
          color: #155724;
        }

        .order-date {
          font-size: 0.8rem;
          color: #6c757d;
          text-align: right;
        }

        @media (max-width: 768px) {
          .libraire-dashboard {
            padding: 10px;
          }

          .header-content {
            flex-direction: column;
            gap: 20px;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .order-item {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .order-date {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default LibraireDashboardPro;

