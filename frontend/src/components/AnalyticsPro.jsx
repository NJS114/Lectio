import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Users, 
  ShoppingCart, Eye, Calendar, Download, Filter, RefreshCw,
  Target, Percent, Clock, Award, MapPin, Smartphone
} from 'lucide-react';

const AnalyticsPro = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [analyticsData, setAnalyticsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    // Simulation des données analytics complètes
    const mockData = {
      overview: {
        revenue: {
          current: 12450,
          previous: 10800,
          trend: 15.3,
          target: 15000,
          daily: [420, 380, 450, 520, 480, 390, 410, 460, 500, 440, 470, 490, 520, 480, 450, 430, 460, 490, 510, 480, 450, 470, 500, 520, 490, 460, 480, 510, 530, 500]
        },
        orders: {
          current: 234,
          previous: 198,
          trend: 18.2,
          target: 250,
          daily: [8, 6, 9, 12, 10, 7, 8, 9, 11, 8, 9, 10, 12, 9, 8, 7, 9, 10, 11, 9, 8, 9, 11, 12, 10, 8, 9, 11, 12, 10]
        },
        customers: {
          current: 67,
          previous: 52,
          trend: 28.8,
          new: 45,
          returning: 22
        },
        conversion: {
          current: 3.2,
          previous: 2.8,
          trend: 14.3,
          bySource: {
            direct: 4.1,
            search: 2.8,
            social: 2.1,
            email: 5.4
          }
        }
      },
      topProducts: [
        {
          id: 1,
          title: "Sapiens",
          author: "Yuval Noah Harari",
          sales: 45,
          revenue: 540,
          views: 1247,
          conversion: 3.6,
          category: "Essai"
        },
        {
          id: 2,
          title: "L'Étranger",
          author: "Albert Camus",
          sales: 38,
          revenue: 323,
          views: 892,
          conversion: 4.3,
          category: "Roman"
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          sales: 32,
          revenue: 304,
          views: 756,
          conversion: 4.2,
          category: "Science-Fiction"
        }
      ],
      customerSegments: [
        {
          segment: "Nouveaux clients",
          count: 45,
          percentage: 67.2,
          avgOrder: 28.50,
          ltv: 85.50
        },
        {
          segment: "Clients fidèles",
          count: 22,
          percentage: 32.8,
          avgOrder: 42.30,
          ltv: 234.80
        }
      ],
      trafficSources: [
        { source: "Recherche Google", visits: 1247, percentage: 42.3, conversion: 2.8 },
        { source: "Direct", visits: 892, percentage: 30.2, conversion: 4.1 },
        { source: "Réseaux sociaux", visits: 456, percentage: 15.4, conversion: 2.1 },
        { source: "Email marketing", visits: 234, percentage: 7.9, conversion: 5.4 },
        { source: "Autres", visits: 123, percentage: 4.2, conversion: 1.8 }
      ],
      geographicData: [
        { city: "Paris", orders: 89, revenue: 2340 },
        { city: "Lyon", orders: 45, revenue: 1180 },
        { city: "Marseille", orders: 34, revenue: 890 },
        { city: "Toulouse", orders: 28, revenue: 720 },
        { city: "Bordeaux", orders: 22, revenue: 580 }
      ],
      deviceData: [
        { device: "Desktop", percentage: 45.2, conversion: 3.8 },
        { device: "Mobile", percentage: 41.3, conversion: 2.9 },
        { device: "Tablette", percentage: 13.5, conversion: 3.2 }
      ],
      timeAnalysis: {
        bestHours: [
          { hour: "14h-15h", orders: 23, percentage: 9.8 },
          { hour: "20h-21h", orders: 21, percentage: 9.0 },
          { hour: "19h-20h", orders: 19, percentage: 8.1 }
        ],
        bestDays: [
          { day: "Mercredi", orders: 42, percentage: 17.9 },
          { day: "Samedi", orders: 38, percentage: 16.2 },
          { day: "Dimanche", orders: 35, percentage: 15.0 }
        ]
      }
    };

    // Simulation d'un délai de chargement
    setTimeout(() => {
      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  const MetricCard = ({ title, value, subtitle, trend, target, icon, color = '#667eea', chart = null }) => (
    <div className="metric-card">
      <div className="metric-header">
        <div className="metric-icon" style={{ color }}>
          {icon}
        </div>
        <div className="metric-trend">
          {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
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

      {chart && (
        <div className="metric-chart">
          <div className="mini-chart">
            {chart.map((value, index) => (
              <div 
                key={index}
                className="chart-bar"
                style={{ 
                  height: `${(value / Math.max(...chart)) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.7
                }}
              />
            ))}
          </div>
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

        .metric-chart {
          margin-top: 15px;
        }

        .mini-chart {
          display: flex;
          align-items: end;
          gap: 2px;
          height: 40px;
        }

        .chart-bar {
          flex: 1;
          min-height: 2px;
          border-radius: 1px;
          transition: all 0.3s ease;
        }

        .chart-bar:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );

  const TopProductRow = ({ product, index }) => (
    <tr className="product-row">
      <td>
        <div className="rank-badge">
          {index === 0 && <Award size={14} color="#ffd700" />}
          #{index + 1}
        </div>
      </td>
      <td>
        <div className="product-info">
          <strong>{product.title}</strong>
          <span>{product.author}</span>
        </div>
      </td>
      <td>
        <span className="category-badge">{product.category}</span>
      </td>
      <td className="metric-cell">{product.sales}</td>
      <td className="metric-cell">{product.revenue.toFixed(2)}€</td>
      <td className="metric-cell">{product.views.toLocaleString()}</td>
      <td className="metric-cell">{product.conversion.toFixed(1)}%</td>

      <style jsx>{`
        .product-row {
          border-bottom: 1px solid #e9ecef;
        }

        .product-row:hover {
          background: #f8f9fa;
        }

        .product-row td {
          padding: 12px 8px;
          vertical-align: middle;
        }

        .rank-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          color: #495057;
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

        .category-badge {
          padding: 4px 8px;
          background: #e9ecef;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #495057;
        }

        .metric-cell {
          text-align: center;
          font-weight: 600;
          color: #2c3e50;
        }
      `}</style>
    </tr>
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <RefreshCw size={48} className="loading-spinner" />
        <h3>Chargement des analytics...</h3>
        <p>Analyse des données en cours</p>
        
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            color: #6c757d;
          }

          .loading-spinner {
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          h3 {
            margin: 0 0 10px 0;
            color: #495057;
          }

          p {
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="analytics-pro">
      <div className="analytics-header">
        <div className="header-content">
          <h1>Analytics Avancées</h1>
          <p>Analysez vos performances et optimisez vos ventes</p>
        </div>
        
        <div className="header-controls">
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
          
          <button className="refresh-btn" onClick={loadAnalyticsData}>
            <RefreshCw size={16} />
            Actualiser
          </button>
          
          <button className="export-btn">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="metrics-grid">
        <MetricCard
          title="Chiffre d'affaires"
          value={`${analyticsData.overview?.revenue?.current?.toLocaleString()}€`}
          subtitle={`vs ${analyticsData.overview?.revenue?.previous?.toLocaleString()}€ période précédente`}
          trend={analyticsData.overview?.revenue?.trend}
          target={analyticsData.overview?.revenue?.target}
          icon={<DollarSign size={24} />}
          color="#28a745"
          chart={analyticsData.overview?.revenue?.daily}
        />
        
        <MetricCard
          title="Commandes"
          value={analyticsData.overview?.orders?.current?.toString()}
          subtitle="commandes traitées"
          trend={analyticsData.overview?.orders?.trend}
          target={analyticsData.overview?.orders?.target}
          icon={<ShoppingCart size={24} />}
          color="#17a2b8"
          chart={analyticsData.overview?.orders?.daily}
        />
        
        <MetricCard
          title="Nouveaux clients"
          value={analyticsData.overview?.customers?.current?.toString()}
          subtitle={`${analyticsData.overview?.customers?.new} nouveaux, ${analyticsData.overview?.customers?.returning} fidèles`}
          trend={analyticsData.overview?.customers?.trend}
          icon={<Users size={24} />}
          color="#fd7e14"
        />
        
        <MetricCard
          title="Taux de conversion"
          value={`${analyticsData.overview?.conversion?.current}%`}
          subtitle="visiteurs → acheteurs"
          trend={analyticsData.overview?.conversion?.trend}
          icon={<Target size={24} />}
          color="#6f42c1"
        />
      </div>

      {/* Grille d'analyses */}
      <div className="analysis-grid">
        {/* Top produits */}
        <div className="analysis-card">
          <div className="card-header">
            <h3>Top Produits</h3>
            <button className="card-action">
              <Eye size={16} />
              Voir tout
            </button>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rang</th>
                  <th>Livre</th>
                  <th>Catégorie</th>
                  <th>Ventes</th>
                  <th>CA</th>
                  <th>Vues</th>
                  <th>Conv.</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topProducts?.map((product, index) => (
                  <TopProductRow key={product.id} product={product} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sources de trafic */}
        <div className="analysis-card">
          <div className="card-header">
            <h3>Sources de Trafic</h3>
            <span className="total-visits">
              {analyticsData.trafficSources?.reduce((sum, source) => sum + source.visits, 0).toLocaleString()} visites
            </span>
          </div>
          
          <div className="traffic-sources">
            {analyticsData.trafficSources?.map((source, index) => (
              <div key={index} className="traffic-source">
                <div className="source-info">
                  <span className="source-name">{source.source}</span>
                  <span className="source-stats">
                    {source.visits.toLocaleString()} visites • {source.conversion}% conv.
                  </span>
                </div>
                <div className="source-percentage">
                  {source.percentage.toFixed(1)}%
                </div>
                <div className="source-bar">
                  <div 
                    className="source-fill" 
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analyse géographique */}
        <div className="analysis-card">
          <div className="card-header">
            <h3>Répartition Géographique</h3>
            <MapPin size={16} />
          </div>
          
          <div className="geographic-data">
            {analyticsData.geographicData?.map((location, index) => (
              <div key={index} className="location-item">
                <div className="location-info">
                  <span className="city-name">{location.city}</span>
                  <span className="city-stats">
                    {location.orders} commandes • {location.revenue.toFixed(2)}€
                  </span>
                </div>
                <div className="location-bar">
                  <div 
                    className="location-fill" 
                    style={{ 
                      width: `${(location.orders / Math.max(...analyticsData.geographicData.map(l => l.orders))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analyse temporelle */}
        <div className="analysis-card">
          <div className="card-header">
            <h3>Analyse Temporelle</h3>
            <Clock size={16} />
          </div>
          
          <div className="time-analysis">
            <div className="time-section">
              <h4>Meilleures heures</h4>
              {analyticsData.timeAnalysis?.bestHours?.map((hour, index) => (
                <div key={index} className="time-item">
                  <span className="time-label">{hour.hour}</span>
                  <span className="time-value">{hour.orders} commandes ({hour.percentage.toFixed(1)}%)</span>
                </div>
              ))}
            </div>
            
            <div className="time-section">
              <h4>Meilleurs jours</h4>
              {analyticsData.timeAnalysis?.bestDays?.map((day, index) => (
                <div key={index} className="time-item">
                  <span className="time-label">{day.day}</span>
                  <span className="time-value">{day.orders} commandes ({day.percentage.toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appareils */}
        <div className="analysis-card">
          <div className="card-header">
            <h3>Répartition par Appareil</h3>
            <Smartphone size={16} />
          </div>
          
          <div className="device-data">
            {analyticsData.deviceData?.map((device, index) => (
              <div key={index} className="device-item">
                <div className="device-info">
                  <span className="device-name">{device.device}</span>
                  <span className="device-conversion">Conv: {device.conversion}%</span>
                </div>
                <div className="device-percentage">
                  {device.percentage.toFixed(1)}%
                </div>
                <div className="device-bar">
                  <div 
                    className="device-fill" 
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Segments clients */}
        <div className="analysis-card">
          <div className="card-header">
            <h3>Segments Clients</h3>
            <Users size={16} />
          </div>
          
          <div className="customer-segments">
            {analyticsData.customerSegments?.map((segment, index) => (
              <div key={index} className="segment-item">
                <div className="segment-header">
                  <span className="segment-name">{segment.segment}</span>
                  <span className="segment-count">{segment.count} clients</span>
                </div>
                <div className="segment-metrics">
                  <div className="segment-metric">
                    <span className="metric-label">Panier moyen</span>
                    <span className="metric-value">{segment.avgOrder.toFixed(2)}€</span>
                  </div>
                  <div className="segment-metric">
                    <span className="metric-label">LTV</span>
                    <span className="metric-value">{segment.ltv.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-pro {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .analytics-header {
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

        .header-controls {
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

        .refresh-btn, .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .refresh-btn {
          background: #17a2b8;
          color: white;
        }

        .export-btn {
          background: #28a745;
          color: white;
        }

        .refresh-btn:hover, .export-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .analysis-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .analysis-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e9ecef;
        }

        .card-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .card-action {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: #f8f9fa;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          color: #495057;
          transition: all 0.2s ease;
        }

        .card-action:hover {
          background: #e9ecef;
        }

        .total-visits {
          font-size: 0.9rem;
          color: #6c757d;
          font-weight: 500;
        }

        .table-container {
          overflow-x: auto;
        }

        .table-container table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-container th {
          text-align: left;
          padding: 10px 8px;
          font-weight: 600;
          color: #495057;
          font-size: 0.8rem;
          text-transform: uppercase;
          border-bottom: 1px solid #e9ecef;
        }

        .traffic-sources, .geographic-data, .device-data {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .traffic-source, .location-item, .device-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .source-info, .location-info, .device-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .source-name, .city-name, .device-name {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }

        .source-stats, .city-stats, .device-conversion {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .source-percentage, .device-percentage {
          font-weight: 600;
          color: #495057;
          min-width: 50px;
          text-align: right;
        }

        .source-bar, .location-bar, .device-bar {
          width: 100px;
          height: 6px;
          background: #e9ecef;
          border-radius: 3px;
          overflow: hidden;
        }

        .source-fill, .location-fill, .device-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .time-analysis {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .time-section h4 {
          margin: 0 0 15px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #495057;
        }

        .time-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .time-label {
          font-weight: 500;
          color: #495057;
        }

        .time-value {
          font-size: 0.9rem;
          color: #6c757d;
        }

        .customer-segments {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .segment-item {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .segment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .segment-name {
          font-weight: 600;
          color: #2c3e50;
        }

        .segment-count {
          font-size: 0.9rem;
          color: #6c757d;
        }

        .segment-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .segment-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .metric-label {
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 4px;
        }

        .metric-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
        }

        @media (max-width: 768px) {
          .analytics-pro {
            padding: 10px;
          }

          .analytics-header {
            flex-direction: column;
            gap: 20px;
          }

          .header-controls {
            flex-direction: column;
            width: 100%;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .analysis-grid {
            grid-template-columns: 1fr;
          }

          .time-analysis {
            grid-template-columns: 1fr;
          }

          .segment-metrics {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsPro;

