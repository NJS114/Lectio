import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AnalyticsProPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Données de démonstration pour les analytics
  const [analyticsData] = useState({
    sales: {
      daily: [
        { date: '2024-01-01', amount: 450, orders: 12 },
        { date: '2024-01-02', amount: 680, orders: 18 },
        { date: '2024-01-03', amount: 520, orders: 14 },
        { date: '2024-01-04', amount: 750, orders: 22 },
        { date: '2024-01-05', amount: 890, orders: 25 },
        { date: '2024-01-06', amount: 640, orders: 17 },
        { date: '2024-01-07', amount: 720, orders: 19 }
      ],
      monthly: {
        current: 12450,
        previous: 10800,
        growth: 15.3
      }
    },
    topBooks: [
      { title: "L'Étranger", author: "Albert Camus", sales: 45, revenue: 675 },
      { title: "1984", author: "George Orwell", sales: 38, revenue: 608 },
      { title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", sales: 32, revenue: 384 },
      { title: "Sapiens", author: "Yuval Noah Harari", sales: 28, revenue: 588 }
    ],
    categories: [
      { name: "Roman", sales: 156, percentage: 42 },
      { name: "Essai", sales: 89, percentage: 24 },
      { name: "Science-Fiction", sales: 67, percentage: 18 },
      { name: "Jeunesse", sales: 45, percentage: 12 },
      { name: "Autres", sales: 15, percentage: 4 }
    ],
    customers: {
      total: 1234,
      new: 89,
      returning: 145,
      averageOrderValue: 32.50
    },
    traffic: {
      pageViews: 15420,
      uniqueVisitors: 3240,
      conversionRate: 4.2,
      bounceRate: 35.8
    }
  });

  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Fonction pour formater les nombres
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Fonction pour formater les pourcentages
  const formatPercentage = (num) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  // Fonctions d'export
  const handleExportPDF = () => {
    // Simulation d'export PDF
    const reportData = {
      period: selectedPeriod,
      ca: analyticsData.sales.monthly.current,
      visitors: analyticsData.traffic.uniqueVisitors,
      conversion: analyticsData.traffic.conversionRate,
      topBooks: analyticsData.topBooks,
      categories: analyticsData.categories
    };
    
    // Créer un contenu PDF simulé
    const pdfContent = `
RAPPORT ANALYTICS LECTIO
========================

Période: ${selectedPeriod === '7days' ? '7 derniers jours' : 
           selectedPeriod === '30days' ? '30 derniers jours' : 
           selectedPeriod === '90days' ? '3 derniers mois' :
           selectedPeriod === '6months' ? '6 derniers mois' : 'Année complète'}

MÉTRIQUES PRINCIPALES
- Chiffre d'Affaires: ${formatNumber(reportData.ca)}€
- Visiteurs Uniques: ${formatNumber(reportData.visitors)}
- Taux de Conversion: ${reportData.conversion}%

TOP LIVRES
${reportData.topBooks.map((book, i) => `${i+1}. ${book.title} - ${book.sales} ventes`).join('\n')}

CATÉGORIES
${reportData.categories.map(cat => `${cat.name}: ${cat.sales} ventes (${cat.percentage}%)`).join('\n')}
    `;
    
    // Créer et télécharger le fichier
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Rapport PDF généré et téléchargé !');
  };

  const handleExportExcel = () => {
    // Simulation d'export Excel (CSV)
    const csvData = [
      ['Métrique', 'Valeur'],
      ['Chiffre d\'Affaires', `${analyticsData.sales.monthly.current}€`],
      ['Visiteurs Uniques', analyticsData.traffic.uniqueVisitors],
      ['Taux de Conversion', `${analyticsData.traffic.conversionRate}%`],
      ['Panier Moyen', `${analyticsData.customers.averageOrderValue}€`],
      [''],
      ['Top Livres', 'Ventes', 'Revenus'],
      ...analyticsData.topBooks.map(book => [book.title, book.sales, `${book.revenue}€`]),
      [''],
      ['Catégories', 'Ventes', 'Pourcentage'],
      ...analyticsData.categories.map(cat => [cat.name, cat.sales, `${cat.percentage}%`])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-data-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Données Excel exportées et téléchargées !');
  };

  const handleExportCSV = () => {
    // Export CSV détaillé
    const csvData = [
      ['Date', 'Chiffre d\'Affaires', 'Commandes'],
      ...analyticsData.sales.daily.map(day => [
        new Date(day.date).toLocaleDateString('fr-FR'),
        `${day.amount}€`,
        day.orders
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventes-quotidiennes-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Données CSV des ventes quotidiennes téléchargées !');
  };

  // Simulation d'un graphique simple avec CSS
  const SimpleChart = ({ data, height = 100 }) => {
    const maxValue = Math.max(...data.map(d => d.amount));
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'end', 
        height: `${height}px`, 
        gap: '2px',
        padding: '1rem 0'
      }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: `${(item.amount / maxValue) * height}px`,
              background: 'linear-gradient(to top, #047857, #10b981)',
              borderRadius: '2px 2px 0 0',
              position: 'relative'
            }}
            title={`${item.date}: ${item.amount}€`}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: 'white' }}>
              Analytics Professionnel
            </h1>
            <p style={{ margin: 0, opacity: 0.9, color: 'white' }}>
              Analyse détaillée de vos performances - {user?.display_name || 'Libraire'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.5rem',
                borderRadius: '6px'
              }}
            >
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">3 derniers mois</option>
              <option value="6months">6 derniers mois</option>
              <option value="1year">Année complète</option>
              <option value="custom">Période personnalisée</option>
            </select>
            <button 
              onClick={() => navigate('/dashboard-pro')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Retour Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* KPIs principaux */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46', fontSize: '0.9rem' }}>Chiffre d'Affaires</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            {formatNumber(analyticsData.sales.monthly.current)}€
          </p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#059669' }}>
            {formatPercentage(analyticsData.sales.monthly.growth)} vs mois dernier
          </p>
        </div>
        
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46', fontSize: '0.9rem' }}>Visiteurs Uniques</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            {formatNumber(analyticsData.traffic.uniqueVisitors)}
          </p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#059669' }}>
            {formatNumber(analyticsData.traffic.pageViews)} pages vues
          </p>
        </div>
        
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46', fontSize: '0.9rem' }}>Taux de Conversion</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            {analyticsData.traffic.conversionRate}%
          </p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#059669' }}>
            Taux de rebond: {analyticsData.traffic.bounceRate}%
          </p>
        </div>
        
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46', fontSize: '0.9rem' }}>Panier Moyen</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            {analyticsData.customers.averageOrderValue}€
          </p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#059669' }}>
            {analyticsData.customers.new} nouveaux clients
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Graphique des ventes */}
        <div style={{ 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: '#065f46' }}>Évolution des Ventes</h2>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1fae5',
                borderRadius: '6px',
                background: 'white'
              }}
            >
              <option value="revenue">Chiffre d'affaires</option>
              <option value="orders">Nombre de commandes</option>
            </select>
          </div>
          
          <SimpleChart data={analyticsData.sales.daily} height={200} />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '1rem',
            fontSize: '0.8rem',
            color: '#6b7280'
          }}>
            {analyticsData.sales.daily.map((item, index) => (
              <span key={index}>
                {new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
              </span>
            ))}
          </div>
        </div>

        {/* Top livres */}
        <div style={{ 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#065f46' }}>Top Livres</h2>
          
          {analyticsData.topBooks.map((book, index) => (
            <div key={index} style={{
              padding: '1rem',
              border: '1px solid #d1fae5',
              borderRadius: '6px',
              marginBottom: '0.5rem',
              background: '#f0fdf4'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#065f46', fontSize: '0.9rem' }}>
                    {book.title}
                  </h4>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#6b7280' }}>
                    {book.author}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                    <span style={{ color: '#047857' }}>{book.sales} ventes</span>
                    <span style={{ color: '#047857', fontWeight: 'bold' }}>{book.revenue}€</span>
                  </div>
                </div>
                <div style={{
                  background: '#047857',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  #{index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Répartition par catégories */}
        <div style={{ 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#065f46' }}>Ventes par Catégorie</h2>
          
          {analyticsData.categories.map((category, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#065f46', fontWeight: 'bold' }}>{category.name}</span>
                <span style={{ color: '#047857' }}>{category.sales} ventes ({category.percentage}%)</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#d1fae5',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${category.percentage}%`,
                  height: '100%',
                  background: `linear-gradient(to right, #047857, #10b981)`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Analyse des clients */}
        <div style={{ 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#065f46' }}>Analyse Clientèle</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
                <p style={{ margin: '0', fontSize: '1.5rem', fontWeight: 'bold', color: '#047857' }}>
                  {formatNumber(analyticsData.customers.total)}
                </p>
                <p style={{ margin: '0', fontSize: '0.8rem', color: '#065f46' }}>Total clients</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
                <p style={{ margin: '0', fontSize: '1.5rem', fontWeight: 'bold', color: '#047857' }}>
                  {analyticsData.customers.returning}
                </p>
                <p style={{ margin: '0', fontSize: '0.8rem', color: '#065f46' }}>Clients fidèles</p>
              </div>
            </div>
            
            <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Insights Clients</h4>
              <ul style={{ margin: 0, paddingLeft: '1rem', color: '#047857', fontSize: '0.9rem' }}>
                <li>Taux de fidélisation: {((analyticsData.customers.returning / analyticsData.customers.total) * 100).toFixed(1)}%</li>
                <li>Croissance nouveaux clients: +{analyticsData.customers.new} ce mois</li>
                <li>Segment principal: Lecteurs 25-45 ans</li>
                <li>Préférence: Romans et essais (66% des ventes)</li>
              </ul>
            </div>
          </div>

          {/* Actions recommandées */}
          <div>
            <h4 style={{ margin: '0 0 1rem 0', color: '#065f46' }}>Actions Recommandées</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button style={{
                background: '#047857',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                Créer une campagne pour la science-fiction (+45%)
              </button>
              <button style={{
                background: '#059669',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                Réactiver les clients inactifs (newsletter)
              </button>
              <button style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                Optimiser le taux de conversion (+0.8%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export et rapports */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        background: '#f0fdf4',
        borderRadius: '12px',
        border: '2px solid #d1fae5',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#065f46' }}>Exporter les Données</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            onClick={handleExportPDF}
            style={{
              background: '#047857',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Rapport PDF
          </button>
          <button 
            onClick={handleExportExcel}
            style={{
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Export Excel
          </button>
          <button 
            onClick={handleExportCSV}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Données CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsProPage;

