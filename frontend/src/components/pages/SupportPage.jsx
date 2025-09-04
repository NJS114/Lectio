import React, { useState } from 'react';
import { API_BASE } from '../../config/api';

const SupportPage = () => {
  const [formData, setFormData] = useState({
    contact_name: '',
    contact_email: '',
    subject: '',
    description: '',
    category: 'other',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/support/ticket/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          user_id: 1 // ID utilisateur par défaut
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setFormData({
          contact_name: '',
          contact_email: '',
          subject: '',
          description: '',
          category: 'other',
          priority: 'medium'
        });
        alert(`Ticket créé avec succès ! Numéro : ${data.ticket.ticket_number}`);
      } else {
        alert(`Erreur : ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      alert('Erreur lors de la création du ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2d5a27', marginBottom: '10px' }}>
          🎧 Support Client Lectio
        </h1>
        <p style={{ color: '#666', fontSize: '18px' }}>
          Nous sommes là pour vous aider ! Décrivez votre problème et nous vous répondrons rapidement.
        </p>
      </div>

      {/* Informations de contact rapide */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        <div style={{ 
          backgroundColor: '#f0f8f0', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center' 
        }}>
          <h3 style={{ color: '#2d5a27', marginBottom: '10px' }}>📧 Email</h3>
          <p style={{ margin: 0, color: '#666' }}>support@lectio.fr</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#888' }}>
            Réponse sous 24h
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#f0f8f0', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center' 
        }}>
          <h3 style={{ color: '#2d5a27', marginBottom: '10px' }}>⏰ Horaires</h3>
          <p style={{ margin: 0, color: '#666' }}>Lun-Ven : 9h-18h</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#888' }}>
            Hors jours fériés
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#f0f8f0', 
          padding: '20px', 
          borderRadius: '10px', 
          textAlign: 'center' 
        }}>
          <h3 style={{ color: '#2d5a27', marginBottom: '10px' }}>🚀 Urgence</h3>
          <p style={{ margin: 0, color: '#666' }}>Réponse prioritaire</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#888' }}>
            Sous 2-4h
          </p>
        </div>
      </div>

      {/* Formulaire de contact */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ color: '#2d5a27', marginBottom: '20px' }}>
          📝 Créer un ticket de support
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Votre nom *
              </label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Votre email *
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              >
                <option value="order">📦 Commande</option>
                <option value="payment">💳 Paiement</option>
                <option value="technical">🔧 Technique</option>
                <option value="account">👤 Compte</option>
                <option value="other">❓ Autre</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Priorité
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              >
                <option value="low">🟢 Faible</option>
                <option value="medium">🟡 Moyenne</option>
                <option value="high">🟠 Élevée</option>
                <option value="urgent">🔴 Urgente</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Sujet *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              placeholder="Résumé de votre problème"
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Description détaillée *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                resize: 'vertical'
              }}
              placeholder="Décrivez votre problème en détail. Plus vous donnez d'informations, plus nous pourrons vous aider efficacement."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: loading ? '#ccc' : '#2d5a27',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? '⏳ Envoi en cours...' : '📤 Envoyer le ticket'}
          </button>
        </form>
      </div>

      {/* FAQ Section */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ color: '#2d5a27', marginBottom: '20px', textAlign: 'center' }}>
          ❓ Questions Fréquentes
        </h2>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          {[
            {
              question: "Comment suivre ma commande ?",
              answer: "Utilisez le lien 'Suivi' dans le menu principal avec votre numéro de commande."
            },
            {
              question: "Comment modifier mon profil ?",
              answer: "Connectez-vous et accédez à 'Mon Compte' dans le menu utilisateur."
            },
            {
              question: "Problème de paiement ?",
              answer: "Vérifiez vos informations bancaires ou contactez-nous avec le numéro de transaction."
            },
            {
              question: "Comment vendre un livre ?",
              answer: "Utilisez la page 'Vendre' pour ajouter vos livres au catalogue."
            }
          ].map((faq, index) => (
            <div key={index} style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '5px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <h4 style={{ color: '#2d5a27', marginBottom: '10px' }}>
                {faq.question}
              </h4>
              <p style={{ margin: 0, color: '#666' }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

