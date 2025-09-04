import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const MarketingToolsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // États pour les promotions
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: "Soldes d'été",
      type: "percentage",
      value: 20,
      startDate: "2024-07-01",
      endDate: "2024-07-31",
      status: "active",
      sales: 156,
      revenue: 2340
    },
    {
      id: 2,
      name: "Code WELCOME10",
      type: "fixed",
      value: 10,
      startDate: "2024-06-01",
      endDate: "2024-12-31",
      status: "active",
      sales: 89,
      revenue: 890
    }
  ]);

  // États pour le formulaire de nouvelle promotion
  const [newPromo, setNewPromo] = useState({
    name: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    targetBooks: 'all'
  });

  // États pour la newsletter
  const [newsletter, setNewsletter] = useState({
    subject: '',
    content: '',
    recipients: 'all'
  });

  const [emailStats] = useState({
    totalSubscribers: 1234,
    openRate: 24.5,
    clickRate: 3.2,
    lastCampaign: "Nouveautés de la semaine"
  });

  // Fonctions de gestion des promotions
  const handleCreatePromotion = () => {
    if (newPromo.name && newPromo.value && newPromo.startDate && newPromo.endDate) {
      const promotion = {
        id: promotions.length + 1,
        ...newPromo,
        value: parseFloat(newPromo.value),
        status: 'active',
        sales: 0,
        revenue: 0
      };
      setPromotions([...promotions, promotion]);
      setNewPromo({
        name: '',
        type: 'percentage',
        value: '',
        startDate: '',
        endDate: '',
        targetBooks: 'all'
      });
      alert('Promotion créée avec succès !');
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  };

  const handleDeletePromotion = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  const handleTogglePromotion = (id) => {
    setPromotions(promotions.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
  };

  // Fonction d'envoi de newsletter
  const handleSendNewsletter = () => {
    if (newsletter.subject && newsletter.content) {
      alert(`Newsletter "${newsletter.subject}" envoyée à ${newsletter.recipients === 'all' ? 'tous les abonnés' : 'clients actifs'} !`);
      setNewsletter({
        subject: '',
        content: '',
        recipients: 'all'
      });
    } else {
      alert('Veuillez remplir le sujet et le contenu');
    }
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: 'white' }}>
              Outils Marketing
            </h1>
            <p style={{ margin: 0, opacity: 0.9, color: 'white' }}>
              Gérez vos promotions et campagnes marketing - {user?.display_name || 'Libraire'}
            </p>
          </div>
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

      {/* Statistiques rapides */}
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
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Promotions Actives</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            {promotions.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Ventes Promo</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            {promotions.reduce((sum, p) => sum + p.sales, 0)}
          </p>
        </div>
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Revenus Promo</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            {promotions.reduce((sum, p) => sum + p.revenue, 0)}€
          </p>
        </div>
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Abonnés Newsletter</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            {emailStats.totalSubscribers}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Section Promotions */}
        <div style={{ 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#065f46' }}>Gestion des Promotions</h2>
          
          {/* Formulaire nouvelle promotion */}
          <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#065f46' }}>Créer une Promotion</h3>
            
            <input
              type="text"
              placeholder="Nom de la promotion"
              value={newPromo.name}
              onChange={(e) => setNewPromo({...newPromo, name: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid #d1fae5',
                borderRadius: '4px'
              }}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <select
                value={newPromo.type}
                onChange={(e) => setNewPromo({...newPromo, type: e.target.value})}
                style={{ padding: '0.5rem', border: '1px solid #d1fae5', borderRadius: '4px' }}
              >
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (€)</option>
              </select>
              
              <input
                type="number"
                placeholder={newPromo.type === 'percentage' ? 'Ex: 20' : 'Ex: 10'}
                value={newPromo.value}
                onChange={(e) => setNewPromo({...newPromo, value: e.target.value})}
                style={{ padding: '0.5rem', border: '1px solid #d1fae5', borderRadius: '4px' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="date"
                value={newPromo.startDate}
                onChange={(e) => setNewPromo({...newPromo, startDate: e.target.value})}
                style={{ padding: '0.5rem', border: '1px solid #d1fae5', borderRadius: '4px' }}
              />
              <input
                type="date"
                value={newPromo.endDate}
                onChange={(e) => setNewPromo({...newPromo, endDate: e.target.value})}
                style={{ padding: '0.5rem', border: '1px solid #d1fae5', borderRadius: '4px' }}
              />
            </div>
            
            <button
              onClick={handleCreatePromotion}
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
              Créer la Promotion
            </button>
          </div>

          {/* Liste des promotions */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#065f46' }}>Promotions Existantes</h3>
            {promotions.map(promo => (
              <div key={promo.id} style={{
                padding: '1rem',
                border: '1px solid #d1fae5',
                borderRadius: '6px',
                marginBottom: '0.5rem',
                background: promo.status === 'active' ? '#ecfdf5' : '#f9fafb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#065f46' }}>{promo.name}</h4>
                    <p style={{ margin: '0', fontSize: '0.9rem', color: '#059669' }}>
                      {promo.type === 'percentage' ? `${promo.value}%` : `${promo.value}€`} • 
                      {promo.sales} ventes • {promo.revenue}€ de revenus
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleTogglePromotion(promo.id)}
                      style={{
                        background: promo.status === 'active' ? '#dc2626' : '#047857',
                        color: 'white',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                        fontSize: '0.8rem'
                      }}
                    >
                      {promo.status === 'active' ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleDeletePromotion(promo.id)}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Newsletter */}
        <div style={{ 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#065f46' }}>Newsletter & Email Marketing</h2>
          
          {/* Statistiques email */}
          <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#065f46' }}>Statistiques Email</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#059669' }}>Taux d'ouverture</p>
                <p style={{ margin: '0', fontSize: '1.5rem', fontWeight: 'bold', color: '#047857' }}>
                  {emailStats.openRate}%
                </p>
              </div>
              <div>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#059669' }}>Taux de clic</p>
                <p style={{ margin: '0', fontSize: '1.5rem', fontWeight: 'bold', color: '#047857' }}>
                  {emailStats.clickRate}%
                </p>
              </div>
            </div>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
              Dernière campagne: {emailStats.lastCampaign}
            </p>
          </div>

          {/* Formulaire newsletter */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#065f46' }}>Envoyer une Newsletter</h3>
            
            <input
              type="text"
              placeholder="Sujet de l'email"
              value={newsletter.subject}
              onChange={(e) => setNewsletter({...newsletter, subject: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid #d1fae5',
                borderRadius: '4px'
              }}
            />
            
            <textarea
              placeholder="Contenu de la newsletter..."
              value={newsletter.content}
              onChange={(e) => setNewsletter({...newsletter, content: e.target.value})}
              rows={6}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid #d1fae5',
                borderRadius: '4px',
                resize: 'vertical'
              }}
            />
            
            <select
              value={newsletter.recipients}
              onChange={(e) => setNewsletter({...newsletter, recipients: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '1rem',
                border: '1px solid #d1fae5',
                borderRadius: '4px'
              }}
            >
              <option value="all">Tous les abonnés ({emailStats.totalSubscribers})</option>
              <option value="active">Clients actifs seulement</option>
              <option value="inactive">Clients inactifs</option>
            </select>
            
            <button
              onClick={handleSendNewsletter}
              style={{
                background: '#047857',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              Envoyer la Newsletter
            </button>
          </div>

          {/* Templates prédéfinis */}
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Templates Rapides</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setNewsletter({
                  ...newsletter,
                  subject: 'Nouveautés de la semaine',
                  content: 'Découvrez nos dernières arrivées en librairie...'
                })}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Nouveautés
              </button>
              <button
                onClick={() => setNewsletter({
                  ...newsletter,
                  subject: 'Offres spéciales du mois',
                  content: 'Profitez de nos promotions exceptionnelles...'
                })}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Promotions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingToolsPage;

