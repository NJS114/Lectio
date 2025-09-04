import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LibraireDashboardSimple = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStockManagement = () => {
    navigate('/stock-management');
  };

  const handleCreatePromotion = () => {
    navigate('/marketing-tools');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics-pro');
  };

  const handleManageOrders = () => {
    navigate('/dashboard');
  };

  const handleShipping = () => {
    navigate('/shipping');
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
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
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: 'white' }}>
          Dashboard Libraire Professionnel
        </h1>
        <p style={{ margin: 0, opacity: 0.9, color: 'white' }}>
          Bienvenue {user?.display_name || 'Libraire'} - Gérez votre activité avec Lectio Pro
        </p>
      </div>

      {/* Métriques principales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Chiffre d'Affaires</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            12,450€
          </p>
          <p style={{ margin: '0.5rem 0 0 0', color: '#059669', fontSize: '0.9rem' }}>
            +15% vs mois dernier
          </p>
        </div>

        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Commandes</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            247
          </p>
          <p style={{ margin: '0.5rem 0 0 0', color: '#059669', fontSize: '0.9rem' }}>
            +8% vs mois dernier
          </p>
        </div>

        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Clients Actifs</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            1,234
          </p>
          <p style={{ margin: '0.5rem 0 0 0', color: '#059669', fontSize: '0.9rem' }}>
            +23% vs mois dernier
          </p>
        </div>

        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Taux de Conversion</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            4.2%
          </p>
          <p style={{ margin: '0.5rem 0 0 0', color: '#059669', fontSize: '0.9rem' }}>
            +0.8% vs mois dernier
          </p>
        </div>
      </div>

      {/* Actions rapides */}
      <div style={{ 
        background: '#ffffff', 
        padding: '2rem', 
        borderRadius: '12px', 
        border: '2px solid #d1fae5',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ margin: '0 0 1.5rem 0', color: '#065f46' }}>Actions Rapides</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem'
        }}>
          <button 
            onClick={handleStockManagement}
            style={{
              background: '#047857',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(4, 120, 87, 0.2)'
            }}
          >
            Ajouter du Stock
          </button>
          <button 
            onClick={handleCreatePromotion}
            style={{
              background: '#047857',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(4, 120, 87, 0.2)'
            }}
          >
            Créer une Promotion
          </button>
          <button 
            onClick={handleViewAnalytics}
            style={{
              background: '#047857',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(4, 120, 87, 0.2)'
            }}
          >
            Voir les Analytics
          </button>
          <button 
            onClick={handleManageOrders}
            style={{
              background: '#047857',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(4, 120, 87, 0.2)'
            }}
          >
            Gérer les Commandes
          </button>
          <button 
            onClick={handleShipping}
            style={{
              background: '#047857',
              color: 'white',
              border: 'none',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(4, 120, 87, 0.2)'
            }}
          >
            Gestion Expéditions
          </button>
        </div>
      </div>

      {/* Alertes et notifications */}
      <div style={{ 
        background: '#ffffff', 
        padding: '2rem', 
        borderRadius: '12px', 
        border: '2px solid #d1fae5',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ margin: '0 0 1.5rem 0', color: '#065f46' }}>Alertes & Notifications</h2>
        
        <div style={{ 
          background: '#fef7ff', 
          border: '2px solid #a7f3d0', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Stock Faible</h4>
          <p style={{ margin: 0, color: '#047857' }}>
            3 livres ont un stock inférieur à 5 exemplaires
          </p>
        </div>

        <div style={{ 
          background: '#f0fdf4', 
          border: '2px solid #86efac', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Tendance Positive</h4>
          <p style={{ margin: 0, color: '#047857' }}>
            Les ventes de science-fiction sont en hausse de 45% cette semaine
          </p>
        </div>

        <div style={{ 
          background: '#ecfdf5', 
          border: '2px solid #6ee7b7', 
          padding: '1rem', 
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Nouveau Client Premium</h4>
          <p style={{ margin: 0, color: '#047857' }}>
            Marie L. vient de passer sa 10ème commande ce mois-ci
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        padding: '1rem',
        color: '#059669'
      }}>
        <p style={{ margin: 0 }}>
          Dashboard Libraire Professionnel - Lectio Pro v1.0
        </p>
      </div>
    </div>
  );
};

export default LibraireDashboardSimple;

