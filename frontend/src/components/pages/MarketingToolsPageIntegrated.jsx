import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { buildApiUrl, apiRequest } from '../../config/api';

const MarketingToolsPageIntegrated = () => {
  const { user } = useAuth();
  const [promotions, setPromotions] = useState([]);
  const [marketingStats, setMarketingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    start_date: '',
    end_date: '',
    target_audience: 'all'
  });

  useEffect(() => {
    if (user?.id) {
      fetchMarketingData();
    }
  }, [user?.id]);

  const fetchMarketingData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les promotions
      const promotionsResponse = await apiRequest('/api/marketing/promotions');
      if (promotionsResponse.success) {
        setPromotions(promotionsResponse.data);
      }
      
      // Récupérer les statistiques marketing
      const statsUrl = buildApiUrl('/api/marketing/stats/:userId', { userId: user.id });
      const statsResponse = await apiRequest(statsUrl);
      if (statsResponse.success) {
        setMarketingStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données marketing:', error);
      // Fallback avec données de démonstration
      setPromotions([
        {
          id: 1,
          name: 'Soldes d\'été',
          description: 'Réduction sur tous les livres',
          discount_type: 'percentage',
          discount_value: 20,
          start_date: '2024-06-01',
          end_date: '2024-08-31',
          is_active: true,
          usage_count: 45
        },
        {
          id: 2,
          name: 'Nouveaux clients',
          description: 'Offre de bienvenue',
          discount_type: 'fixed',
          discount_value: 5,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          is_active: false,
          usage_count: 23
        }
      ]);
      
      setMarketingStats({
        active_promotions: 2,
        total_sales_from_promos: 245,
        promo_revenue: 3230,
        newsletter_subscribers: 1234,
        email_open_rate: 24.5,
        email_click_rate: 3.2
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest('/api/marketing/promotions', {
        method: 'POST',
        body: JSON.stringify(newPromotion)
      });
      
      if (response.success) {
        setPromotions([...promotions, response.data]);
        setNewPromotion({
          name: '',
          description: '',
          discount_type: 'percentage',
          discount_value: '',
          start_date: '',
          end_date: '',
          target_audience: 'all'
        });
        setShowCreateForm(false);
        alert('Promotion créée avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la promotion:', error);
      alert('Erreur lors de la création de la promotion');
    }
  };

  const handleTogglePromotion = async (promotionId, currentStatus) => {
    try {
      const url = buildApiUrl('/api/marketing/promotions/:id/toggle', { id: promotionId });
      const response = await apiRequest(url, {
        method: 'POST'
      });
      
      if (response.success) {
        setPromotions(promotions.map(promo => 
          promo.id === promotionId 
            ? { ...promo, is_active: !currentStatus }
            : promo
        ));
        alert(`Promotion ${!currentStatus ? 'activée' : 'désactivée'} avec succès !`);
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la promotion:', error);
      alert('Erreur lors de la modification de la promotion');
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return;
    
    try {
      const url = buildApiUrl('/api/marketing/promotions/:id', { id: promotionId });
      const response = await apiRequest(url, {
        method: 'DELETE'
      });
      
      if (response.success) {
        setPromotions(promotions.filter(promo => promo.id !== promotionId));
        alert('Promotion supprimée avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la promotion:', error);
      alert('Erreur lors de la suppression de la promotion');
    }
  };

  const handleSendNewsletter = async (template) => {
    try {
      const response = await apiRequest('/api/marketing/newsletter/send', {
        method: 'POST',
        body: JSON.stringify({ template, sender_id: user.id })
      });
      
      if (response.success) {
        alert(`Newsletter "${template}" envoyée avec succès à ${response.data.sent_count} abonnés !`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la newsletter:', error);
      alert('Erreur lors de l\'envoi de la newsletter');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#047857', fontSize: '18px' }}>Chargement des outils marketing...</div>
      </div>
    );
  }

  const stats = marketingStats || {};

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          margin: '0 0 10px 0',
          color: 'white'
        }}>
          Outils Marketing
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Gérez vos promotions et campagnes marketing
        </p>
      </div>

      {/* Statistiques Marketing */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #d1fae5',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ 
            color: '#065f46', 
            fontSize: '14px', 
            fontWeight: '600', 
            margin: '0 0 8px 0',
            textTransform: 'uppercase'
          }}>
            Promotions Actives
          </h3>
          <div style={{ color: '#047857', fontSize: '24px', fontWeight: 'bold' }}>
            {stats.active_promotions || 0}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          border: '2px solid #d1fae5',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ 
            color: '#065f46', 
            fontSize: '14px', 
            fontWeight: '600', 
            margin: '0 0 8px 0',
            textTransform: 'uppercase'
          }}>
            Ventes Promo
          </h3>
          <div style={{ color: '#047857', fontSize: '24px', fontWeight: 'bold' }}>
            {stats.total_sales_from_promos || 0}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          border: '2px solid #d1fae5',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ 
            color: '#065f46', 
            fontSize: '14px', 
            fontWeight: '600', 
            margin: '0 0 8px 0',
            textTransform: 'uppercase'
          }}>
            Revenus Promo
          </h3>
          <div style={{ color: '#047857', fontSize: '24px', fontWeight: 'bold' }}>
            {stats.promo_revenue?.toFixed(0) || 0}€
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          border: '2px solid #d1fae5',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ 
            color: '#065f46', 
            fontSize: '14px', 
            fontWeight: '600', 
            margin: '0 0 8px 0',
            textTransform: 'uppercase'
          }}>
            Abonnés Newsletter
          </h3>
          <div style={{ color: '#047857', fontSize: '24px', fontWeight: 'bold' }}>
            {stats.newsletter_subscribers?.toLocaleString() || 0}
          </div>
        </div>
      </div>

      {/* Gestion des Promotions */}
      <div style={{
        backgroundColor: 'white',
        border: '2px solid #d1fae5',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            color: '#065f46', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: 0
          }}>
            Gestion des Promotions
          </h3>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              backgroundColor: '#047857',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {showCreateForm ? 'Annuler' : 'Créer une Promotion'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreatePromotion} style={{
            backgroundColor: '#f0fdf4',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px', 
                  fontWeight: '600',
                  color: '#065f46'
                }}>
                  Nom de la promotion
                </label>
                <input
                  type="text"
                  value={newPromotion.name}
                  onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1fae5',
                    borderRadius: '6px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px', 
                  fontWeight: '600',
                  color: '#065f46'
                }}>
                  Type de réduction
                </label>
                <select
                  value={newPromotion.discount_type}
                  onChange={(e) => setNewPromotion({...newPromotion, discount_type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1fae5',
                    borderRadius: '6px'
                  }}
                >
                  <option value="percentage">Pourcentage</option>
                  <option value="fixed">Montant fixe</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px', 
                  fontWeight: '600',
                  color: '#065f46'
                }}>
                  Valeur de la réduction
                </label>
                <input
                  type="number"
                  value={newPromotion.discount_value}
                  onChange={(e) => setNewPromotion({...newPromotion, discount_value: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1fae5',
                    borderRadius: '6px'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '600',
                color: '#065f46'
              }}>
                Description
              </label>
              <textarea
                value={newPromotion.description}
                onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1fae5',
                  borderRadius: '6px',
                  minHeight: '80px'
                }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#047857',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Créer la Promotion
            </button>
          </form>
        )}

        {/* Liste des promotions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {promotions.map(promo => (
            <div key={promo.id} style={{
              border: '1px solid #d1fae5',
              borderRadius: '8px',
              padding: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ 
                  color: '#065f46', 
                  margin: '0 0 5px 0',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {promo.name}
                </h4>
                <p style={{ 
                  color: '#047857', 
                  margin: '0 0 5px 0',
                  fontSize: '14px'
                }}>
                  {promo.description}
                </p>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#059669'
                }}>
                  {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `${promo.discount_value}€`} de réduction
                  • {promo.usage_count || 0} utilisations
                  • {promo.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleTogglePromotion(promo.id, promo.is_active)}
                  style={{
                    backgroundColor: promo.is_active ? '#dc2626' : '#047857',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {promo.is_active ? 'Désactiver' : 'Activer'}
                </button>
                
                <button
                  onClick={() => handleDeletePromotion(promo.id)}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter & Email Marketing */}
      <div style={{
        backgroundColor: 'white',
        border: '2px solid #d1fae5',
        borderRadius: '12px',
        padding: '25px'
      }}>
        <h3 style={{ 
          color: '#065f46', 
          fontSize: '18px', 
          fontWeight: 'bold', 
          margin: '0 0 20px 0'
        }}>
          Newsletter & Email Marketing
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            backgroundColor: '#f0fdf4',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #d1fae5'
          }}>
            <div style={{ color: '#065f46', fontSize: '14px', fontWeight: '600' }}>
              Taux d'ouverture
            </div>
            <div style={{ color: '#047857', fontSize: '20px', fontWeight: 'bold' }}>
              {stats.email_open_rate?.toFixed(1) || 0}%
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f0fdf4',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #d1fae5'
          }}>
            <div style={{ color: '#065f46', fontSize: '14px', fontWeight: '600' }}>
              Taux de clic
            </div>
            <div style={{ color: '#047857', fontSize: '20px', fontWeight: 'bold' }}>
              {stats.email_click_rate?.toFixed(1) || 0}%
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleSendNewsletter('nouveautes')}
            style={{
              backgroundColor: '#047857',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Envoyer Newsletter Nouveautés
          </button>
          
          <button
            onClick={() => handleSendNewsletter('promotions')}
            style={{
              backgroundColor: '#047857',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Envoyer Newsletter Promotions
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketingToolsPageIntegrated;

