import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../config/api';

const CommunicationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // États pour Newsletter
  const [newsletters, setNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [newNewsletter, setNewNewsletter] = useState({
    title: '',
    subject: '',
    content: ''
  });

  // États pour Support
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadStats();
    loadNewsletters();
    loadSubscribers();
    loadTickets();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/communication/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const loadNewsletters = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/newsletter/list`);
      const data = await response.json();
      if (data.success) {
        setNewsletters(data.newsletters);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des newsletters:', error);
    }
  };

  const loadSubscribers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/newsletter/subscribers`);
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.subscribers);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des abonnés:', error);
    }
  };

  const loadTickets = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/support/tickets`);
      const data = await response.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tickets:', error);
    }
  };

  const createNewsletter = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/newsletter/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newNewsletter,
          html_content: generateNewsletterHTML(newNewsletter.content)
        })
      });
      
      const data = await response.json();
      if (data.success) {
        alert('Newsletter créée avec succès !');
        setNewNewsletter({ title: '', subject: '', content: '' });
        loadNewsletters();
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendNewsletter = async (newsletterId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/newsletter/send/${newsletterId}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Newsletter envoyée avec succès ! ${data.message}`);
        loadNewsletters();
        loadStats();
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateNewsletterHTML = (content) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2d5a27; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { background-color: #2d5a27; color: white; padding: 15px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📚 Newsletter Lectio</h1>
            </div>
            <div class="content">
                <p>Bonjour {{subscriber_name}},</p>
                ${content.replace(/\n/g, '<br>')}
                <p>Cordialement,<br>L'équipe Lectio</p>
            </div>
            <div class="footer">
                <p>Lectio - Votre marketplace du livre d'occasion</p>
                <p><small>Pour vous désabonner, cliquez <a href="#" style="color: #90EE90;">ici</a></small></p>
            </div>
        </div>
    </body>
    </html>
    `;
  };

  const loadTicketMessages = async (ticketId) => {
    try {
      const response = await fetch(`${API_BASE}/api/support/ticket/${ticketId}/messages`);
      const data = await response.json();
      if (data.success) {
        setTicketMessages(data.messages);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const addTicketMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const response = await fetch(`${API_BASE}/api/support/ticket/${selectedTicket.id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          is_from_staff: true,
          created_by: 3 // ID admin
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        loadTicketMessages(selectedTicket.id);
        loadTickets();
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du message:', error);
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      const response = await fetch(`${API_BASE}/api/support/ticket/${ticketId}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (data.success) {
        loadTickets();
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#f44336';
      case 'in_progress': return '#ff9800';
      case 'resolved': return '#4caf50';
      case 'closed': return '#9e9e9e';
      default: return '#2196f3';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#1976d2';
      case 'low': return '#388e3c';
      default: return '#757575';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ color: '#2d5a27', marginBottom: '30px' }}>
        📧 Dashboard Communication
      </h1>

      {/* Navigation par onglets */}
      <div style={{ marginBottom: '30px', borderBottom: '2px solid #e0e0e0' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { id: 'overview', label: '📊 Vue d\'ensemble', icon: '📊' },
            { id: 'newsletter', label: '📰 Newsletter', icon: '📰' },
            { id: 'support', label: '🎧 Support', icon: '🎧' },
            { id: 'emails', label: '📧 Emails', icon: '📧' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: activeTab === tab.id ? '#2d5a27' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#2d5a27',
                borderBottom: activeTab === tab.id ? '3px solid #2d5a27' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div>
          <h2>📊 Statistiques de Communication</h2>
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              {/* Newsletter Stats */}
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>📰 Newsletter</h3>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d5a27', marginBottom: '10px' }}>
                  {stats.newsletter.active_subscribers}
                </div>
                <div style={{ color: '#666', marginBottom: '10px' }}>Abonnés actifs</div>
                <div style={{ fontSize: '14px', color: '#888' }}>
                  Total: {stats.newsletter.total_subscribers} | Envoyées: {stats.newsletter.newsletters_sent}
                </div>
              </div>

              {/* Support Stats */}
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>🎧 Support</h3>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336', marginBottom: '10px' }}>
                  {stats.support.open_tickets}
                </div>
                <div style={{ color: '#666', marginBottom: '10px' }}>Tickets ouverts</div>
                <div style={{ fontSize: '14px', color: '#888' }}>
                  Résolus: {stats.support.resolved_tickets} | Taux: {stats.support.resolution_rate}%
                </div>
              </div>

              {/* Email Stats */}
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>📧 Emails</h3>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3', marginBottom: '10px' }}>
                  {stats.emails.sent_today}
                </div>
                <div style={{ color: '#666', marginBottom: '10px' }}>Envoyés aujourd'hui</div>
                <div style={{ fontSize: '14px', color: '#888' }}>
                  Cette semaine: {stats.emails.sent_this_week}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Newsletter */}
      {activeTab === 'newsletter' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Création de newsletter */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#2d5a27', marginBottom: '20px' }}>✍️ Créer une Newsletter</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Titre :</label>
                <input
                  type="text"
                  value={newNewsletter.title}
                  onChange={(e) => setNewNewsletter({...newNewsletter, title: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  placeholder="Titre de la newsletter"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sujet de l'email :</label>
                <input
                  type="text"
                  value={newNewsletter.subject}
                  onChange={(e) => setNewNewsletter({...newNewsletter, subject: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  placeholder="Sujet qui apparaîtra dans l'email"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contenu :</label>
                <textarea
                  value={newNewsletter.content}
                  onChange={(e) => setNewNewsletter({...newNewsletter, content: e.target.value})}
                  style={{ width: '100%', height: '200px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  placeholder="Contenu de votre newsletter..."
                />
              </div>

              <button
                onClick={createNewsletter}
                disabled={loading || !newNewsletter.title || !newNewsletter.subject || !newNewsletter.content}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#2d5a27',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  fontWeight: 'bold'
                }}
              >
                {loading ? '⏳ Création...' : '📝 Créer Newsletter'}
              </button>
            </div>

            {/* Liste des newsletters */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#2d5a27', marginBottom: '20px' }}>📋 Newsletters ({newsletters.length})</h3>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {newsletters.map(newsletter => (
                  <div key={newsletter.id} style={{ 
                    padding: '15px', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '5px', 
                    marginBottom: '10px',
                    backgroundColor: newsletter.status === 'sent' ? '#e8f5e8' : '#f9f9f9'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', color: '#2d5a27' }}>{newsletter.title}</h4>
                        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>{newsletter.subject}</p>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          Créée le {new Date(newsletter.created_at).toLocaleDateString('fr-FR')}
                          {newsletter.sent_at && ` • Envoyée le ${new Date(newsletter.sent_at).toLocaleDateString('fr-FR')}`}
                          {newsletter.recipients_count > 0 && ` • ${newsletter.recipients_count} destinataires`}
                        </div>
                      </div>
                      
                      {newsletter.status === 'draft' && (
                        <button
                          onClick={() => sendNewsletter(newsletter.id)}
                          disabled={loading}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          📤 Envoyer
                        </button>
                      )}
                      
                      {newsletter.status === 'sent' && (
                        <span style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#4CAF50', 
                          color: 'white', 
                          borderRadius: '3px', 
                          fontSize: '12px' 
                        }}>
                          ✅ Envoyée
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Abonnés */}
          <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2d5a27', marginBottom: '20px' }}>👥 Abonnés Newsletter ({subscribers.length})</h3>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nom</th>
                    <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Statut</th>
                    <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Inscrit le</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(subscriber => (
                    <tr key={subscriber.id}>
                      <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{subscriber.email}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{subscriber.name || '-'}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '3px',
                          fontSize: '12px',
                          backgroundColor: subscriber.status === 'active' ? '#e8f5e8' : '#ffebee',
                          color: subscriber.status === 'active' ? '#2d5a27' : '#d32f2f'
                        }}>
                          {subscriber.status === 'active' ? '✅ Actif' : '❌ Inactif'}
                        </span>
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center', fontSize: '14px', color: '#666' }}>
                        {new Date(subscriber.subscribed_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Support */}
      {activeTab === 'support' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '1fr 1fr' : '1fr', gap: '30px' }}>
            {/* Liste des tickets */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#2d5a27', marginBottom: '20px' }}>🎧 Tickets de Support ({tickets.length})</h3>
              
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {tickets.map(ticket => (
                  <div 
                    key={ticket.id} 
                    onClick={() => {
                      setSelectedTicket(ticket);
                      loadTicketMessages(ticket.id);
                    }}
                    style={{ 
                      padding: '15px', 
                      border: selectedTicket?.id === ticket.id ? '2px solid #2d5a27' : '1px solid #e0e0e0', 
                      borderRadius: '5px', 
                      marginBottom: '10px',
                      cursor: 'pointer',
                      backgroundColor: selectedTicket?.id === ticket.id ? '#f0f8f0' : 'white'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#2d5a27' }}>#{ticket.ticket_number}</h4>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{ticket.subject}</p>
                        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                          {ticket.contact_name} ({ticket.contact_email})
                        </p>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '3px',
                          fontSize: '12px',
                          backgroundColor: getStatusColor(ticket.status),
                          color: 'white',
                          marginBottom: '5px',
                          display: 'inline-block'
                        }}>
                          {ticket.status.toUpperCase()}
                        </span>
                        <br />
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '3px',
                          fontSize: '12px',
                          backgroundColor: getPriorityColor(ticket.priority),
                          color: 'white'
                        }}>
                          {ticket.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')} • 
                      Catégorie: {ticket.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Détail du ticket sélectionné */}
            {selectedTicket && (
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: '#2d5a27', margin: 0 }}>Ticket #{selectedTicket.ticket_number}</h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {['open', 'in_progress', 'resolved', 'closed'].map(status => (
                      <button
                        key={status}
                        onClick={() => updateTicketStatus(selectedTicket.id, status)}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '3px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          backgroundColor: selectedTicket.status === status ? getStatusColor(status) : '#f5f5f5',
                          color: selectedTicket.status === status ? 'white' : '#666'
                        }}
                      >
                        {status.replace('_', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>{selectedTicket.subject}</h4>
                  <p style={{ margin: '0 0 10px 0', whiteSpace: 'pre-wrap' }}>{selectedTicket.description}</p>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Par {selectedTicket.contact_name} • {new Date(selectedTicket.created_at).toLocaleString('fr-FR')}
                  </div>
                </div>

                {/* Messages */}
                <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                  {ticketMessages.map(message => (
                    <div 
                      key={message.id} 
                      style={{ 
                        marginBottom: '15px', 
                        padding: '10px', 
                        borderRadius: '5px',
                        backgroundColor: message.is_from_staff ? '#e3f2fd' : '#f3e5f5',
                        marginLeft: message.is_from_staff ? '20px' : '0',
                        marginRight: message.is_from_staff ? '0' : '20px'
                      }}
                    >
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        {message.is_from_staff ? '👨‍💼 Support' : '👤 Client'} • 
                        {new Date(message.created_at).toLocaleString('fr-FR')}
                      </div>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.message}</p>
                    </div>
                  ))}
                </div>

                {/* Répondre */}
                <div>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre réponse..."
                    style={{ 
                      width: '100%', 
                      height: '100px', 
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '5px',
                      marginBottom: '10px'
                    }}
                  />
                  <button
                    onClick={addTicketMessage}
                    disabled={!newMessage.trim()}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#2d5a27',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: !newMessage.trim() ? 'not-allowed' : 'pointer',
                      opacity: !newMessage.trim() ? 0.6 : 1
                    }}
                  >
                    📤 Envoyer Réponse
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Emails */}
      {activeTab === 'emails' && (
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2d5a27', marginBottom: '20px' }}>📧 Gestion des Emails</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '5px' }}>
                <h4 style={{ color: '#2d5a27' }}>✉️ Email de Bienvenue</h4>
                <p>Envoyé automatiquement lors de l'inscription d'un nouvel utilisateur.</p>
                <button 
                  onClick={() => alert('Fonctionnalité intégrée au processus d\'inscription')}
                  style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                  ℹ️ Automatique
                </button>
              </div>

              <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '5px' }}>
                <h4 style={{ color: '#2d5a27' }}>💳 Confirmation de Paiement</h4>
                <p>Envoyé automatiquement après un paiement réussi avec facture.</p>
                <button 
                  onClick={() => alert('Fonctionnalité intégrée au processus de paiement')}
                  style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                  ℹ️ Automatique
                </button>
              </div>

              <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '5px' }}>
                <h4 style={{ color: '#2d5a27' }}>📦 Notification d'Expédition</h4>
                <p>Envoyé automatiquement lors de l'expédition d'une commande.</p>
                <button 
                  onClick={() => alert('Fonctionnalité intégrée au système d\'expédition')}
                  style={{ padding: '8px 16px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                  ℹ️ Automatique
                </button>
              </div>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f8f0', borderRadius: '5px' }}>
              <h4 style={{ color: '#2d5a27', marginBottom: '15px' }}>📊 Statistiques des Emails</h4>
              {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d5a27' }}>
                      {stats.emails.sent_today}
                    </div>
                    <div style={{ color: '#666' }}>Aujourd'hui</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d5a27' }}>
                      {stats.emails.sent_this_week}
                    </div>
                    <div style={{ color: '#666' }}>Cette semaine</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationDashboard;

