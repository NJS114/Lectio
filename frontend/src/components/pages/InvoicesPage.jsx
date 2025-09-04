import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../config/api';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/invoices/list`);
      const data = await response.json();
      
      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des factures:', error);
    } finally {
      setLoading(false);
    }
  };

  const testEmailConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/email/test`);
      const data = await response.json();
      
      setTestResults(data);
    } catch (error) {
      console.error('Erreur lors du test email:', error);
      setTestResults({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/email/send-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to_email: 'aouniibrahim94@gmail.com'
        })
      });
      
      const data = await response.json();
      alert(data.success ? 'Email de test envoyé avec succès !' : `Erreur: ${data.error}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de test:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateTestInvoice = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/invoice/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_data: {
            order_number: `CMD-TEST-${Date.now()}`,
            items: [
              { title: 'L\'Étranger - Albert Camus', price: 8.50, quantity: 1 },
              { title: 'Le Petit Prince - Antoine de Saint-Exupéry', price: 6.90, quantity: 2 }
            ]
          },
          customer_data: {
            name: 'Client Test',
            email: 'aouniibrahim94@gmail.com',
            address: '45 Avenue des Champs-Élysées',
            city: '75008 Paris'
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Facture générée avec succès !');
        loadInvoices(); // Recharger la liste
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la génération de facture:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const completeTestOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/order/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_data: {
            order_number: `CMD-COMPLET-${Date.now()}`,
            date: new Date().toLocaleDateString('fr-FR'),
            total: '22.30',
            items: [
              { title: 'L\'Étranger - Albert Camus', price: 8.50, quantity: 1 },
              { title: 'Le Petit Prince - Antoine de Saint-Exupéry', price: 6.90, quantity: 2 }
            ]
          },
          customer_data: {
            name: 'Marie Dubois',
            email: 'aouniibrahim94@gmail.com',
            address: '45 Avenue des Champs-Élysées',
            city: '75008 Paris'
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Commande finalisée avec succès ! Vérifiez votre email.');
        loadInvoices(); // Recharger la liste
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la finalisation de commande:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (filename) => {
    window.open(`${API_BASE}/api/invoice/download/${filename}`, '_blank');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2d5a27', marginBottom: '30px' }}>
        📧 Gestion des Emails et Factures
      </h1>

      {/* Navigation par onglets */}
      <div style={{ marginBottom: '30px', borderBottom: '2px solid #e0e0e0' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            onClick={() => setActiveTab('list')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: activeTab === 'list' ? '#2d5a27' : 'transparent',
              color: activeTab === 'list' ? 'white' : '#2d5a27',
              borderBottom: activeTab === 'list' ? '3px solid #2d5a27' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📋 Liste des Factures
          </button>
          <button
            onClick={() => setActiveTab('test')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: activeTab === 'test' ? '#2d5a27' : 'transparent',
              color: activeTab === 'test' ? 'white' : '#2d5a27',
              borderBottom: activeTab === 'test' ? '3px solid #2d5a27' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🧪 Tests et Génération
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Factures Générées ({invoices.length})</h2>
            <button
              onClick={loadInvoices}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2d5a27',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '🔄 Chargement...' : '🔄 Actualiser'}
            </button>
          </div>

          {invoices.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#f9f9f9',
              borderRadius: '10px',
              color: '#666'
            }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>📄 Aucune facture générée</p>
              <p>Utilisez l'onglet "Tests et Génération" pour créer des factures de test.</p>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#2d5a27', color: 'white' }}>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Nom du fichier</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Taille</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Date de création</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#2d5a27' }}>
                          📄 {invoice.filename}
                        </span>
                      </td>
                      <td style={{ padding: '15px', color: '#666' }}>
                        {formatFileSize(invoice.size)}
                      </td>
                      <td style={{ padding: '15px', color: '#666' }}>
                        {invoice.created}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <button
                          onClick={() => downloadInvoice(invoice.filename)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          📥 Télécharger
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'test' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Tests et Génération</h2>

          {/* Section Configuration Email */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>📧 Configuration Email</h3>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <button
                onClick={testEmailConfig}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                🔍 Tester Configuration
              </button>
              
              <button
                onClick={sendTestEmail}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                📤 Envoyer Email Test
              </button>
            </div>

            {testResults && (
              <div style={{
                padding: '15px',
                backgroundColor: testResults.success ? '#e8f5e8' : '#ffe8e8',
                borderRadius: '5px',
                border: `1px solid ${testResults.success ? '#4CAF50' : '#f44336'}`
              }}>
                <h4 style={{ color: testResults.success ? '#2d5a27' : '#d32f2f', marginBottom: '10px' }}>
                  {testResults.success ? '✅ Configuration OK' : '❌ Erreur de Configuration'}
                </h4>
                {testResults.config && (
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <p><strong>Serveur SMTP:</strong> {testResults.config.smtp_server}:{testResults.config.smtp_port}</p>
                    <p><strong>Utilisateur:</strong> {testResults.config.username}</p>
                    <p><strong>Expéditeur:</strong> {testResults.config.default_sender}</p>
                    <p><strong>Mot de passe configuré:</strong> {testResults.config.password_configured ? '✅ Oui' : '❌ Non'}</p>
                  </div>
                )}
                {testResults.error && (
                  <p style={{ color: '#d32f2f', fontSize: '14px' }}>{testResults.error}</p>
                )}
              </div>
            )}
          </div>

          {/* Section Génération de Factures */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>🧾 Génération de Factures</h3>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <button
                onClick={generateTestInvoice}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#9C27B0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                📄 Générer Facture Test
              </button>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px', fontSize: '14px', color: '#666' }}>
              <p><strong>Cette action va :</strong></p>
              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                <li>Créer une facture PDF avec des données de test</li>
                <li>Calculer automatiquement les taxes (TVA 20%)</li>
                <li>Appliquer la commission Lectio (20%)</li>
                <li>Sauvegarder le fichier dans le système</li>
              </ul>
            </div>
          </div>

          {/* Section Test Complet */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#2d5a27', marginBottom: '15px' }}>🚀 Test Complet de Commande</h3>
            
            <button
              onClick={completeTestOrder}
              disabled={loading}
              style={{
                padding: '15px 30px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? '⏳ Traitement...' : '🎯 Finaliser Commande Test'}
            </button>

            <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '5px', marginTop: '15px', fontSize: '14px', color: '#2d5a27' }}>
              <p><strong>Cette action va exécuter le workflow complet :</strong></p>
              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                <li>✉️ Envoyer un email de confirmation de commande</li>
                <li>📄 Générer une facture PDF</li>
                <li>📧 Envoyer la facture par email</li>
                <li>📦 Envoyer une notification d'expédition</li>
              </ul>
              <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
                📧 Tous les emails seront envoyés à : aouniibrahim94@gmail.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;

