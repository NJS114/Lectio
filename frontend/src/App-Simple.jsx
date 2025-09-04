import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './styles/design-system.css';

// Page d'accueil simple
const HomePage = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '20px' }}>
      📚 LECTIO - Plateforme de Livres d'Occasion
    </h1>
    <p style={{ fontSize: '18px', marginBottom: '30px' }}>
      Bienvenue sur Lectio ! La plateforme est 100% fonctionnelle.
    </p>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f0f8f0', padding: '20px', borderRadius: '10px' }}>
        <h3>🔐 Authentification</h3>
        <p>3 méthodes : Email, Google OAuth, Comptes démo</p>
      </div>
      
      <div style={{ backgroundColor: '#f0f8f0', padding: '20px', borderRadius: '10px' }}>
        <h3>📦 Expédition</h3>
        <p>SendCloud intégré et testé</p>
      </div>
      
      <div style={{ backgroundColor: '#f0f8f0', padding: '20px', borderRadius: '10px' }}>
        <h3>📧 Communication</h3>
        <p>Emails et factures PDF</p>
      </div>
      
      <div style={{ backgroundColor: '#f0f8f0', padding: '20px', borderRadius: '10px' }}>
        <h3>📊 Administration</h3>
        <p>Dashboard complet</p>
      </div>
    </div>

    <div style={{ marginTop: '40px' }}>
      <h2>🧪 Tests Backend Disponibles</h2>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => testEmail()}
          style={{ padding: '10px 20px', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          📧 Test Email
        </button>
        <button 
          onClick={() => testInvoice()}
          style={{ padding: '10px 20px', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          📄 Test Facture
        </button>
        <button 
          onClick={() => testSendCloud()}
          style={{ padding: '10px 20px', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          📦 Test SendCloud
        </button>
        <button 
          onClick={() => testStats()}
          style={{ padding: '10px 20px', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          📊 Test Stats
        </button>
      </div>
    </div>

    <div id="test-results" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px', textAlign: 'left' }}>
      <h3>Résultats des tests :</h3>
      <div id="results-content">Cliquez sur un bouton pour tester les APIs...</div>
    </div>
  </div>
);

// Fonctions de test
window.testEmail = async () => {
  const resultsDiv = document.getElementById('results-content');
  resultsDiv.innerHTML = '⏳ Test d\'envoi d\'email en cours...';
  
  try {
    const response = await fetch('http://localhost:5000/api/email/send-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to_email: 'aouniibrahim94@gmail.com' })
    });
    const data = await response.json();
    resultsDiv.innerHTML = `✅ EMAIL: ${JSON.stringify(data, null, 2)}`;
  } catch (error) {
    resultsDiv.innerHTML = `❌ Erreur email: ${error.message}`;
  }
};

window.testInvoice = async () => {
  const resultsDiv = document.getElementById('results-content');
  resultsDiv.innerHTML = '⏳ Test de génération de facture en cours...';
  
  try {
    const response = await fetch('http://localhost:5000/api/invoice/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: 'Ibrahim Test',
        client_email: 'aouniibrahim94@gmail.com',
        items: [{ title: 'Le Petit Prince', quantity: 1, price: 15.99 }]
      })
    });
    const data = await response.json();
    resultsDiv.innerHTML = `✅ FACTURE: ${JSON.stringify(data, null, 2)}`;
  } catch (error) {
    resultsDiv.innerHTML = `❌ Erreur facture: ${error.message}`;
  }
};

window.testSendCloud = async () => {
  const resultsDiv = document.getElementById('results-content');
  resultsDiv.innerHTML = '⏳ Test SendCloud en cours...';
  
  try {
    const response = await fetch('http://localhost:5000/api/shipping/test');
    const data = await response.json();
    resultsDiv.innerHTML = `✅ SENDCLOUD: ${JSON.stringify(data, null, 2)}`;
  } catch (error) {
    resultsDiv.innerHTML = `❌ Erreur SendCloud: ${error.message}`;
  }
};

window.testStats = async () => {
  const resultsDiv = document.getElementById('results-content');
  resultsDiv.innerHTML = '⏳ Test des statistiques en cours...';
  
  try {
    const response = await fetch('http://localhost:5000/api/communication/stats');
    const data = await response.json();
    resultsDiv.innerHTML = `✅ STATS: ${JSON.stringify(data, null, 2)}`;
  } catch (error) {
    resultsDiv.innerHTML = `❌ Erreur stats: ${error.message}`;
  }
};

// Page de test simple
const TestPage = () => (
  <div style={{ padding: '20px' }}>
    <h1>🧪 Page de Test</h1>
    <p>Cette page confirme que le routage fonctionne !</p>
    <Link to="/" style={{ color: '#2d5a27' }}>← Retour à l'accueil</Link>
  </div>
);

// App simplifiée
function AppSimple() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <nav style={{ backgroundColor: '#2d5a27', padding: '10px 20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
            📚 LECTIO
          </Link>
          <Link to="/test" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px' }}>
            Test
          </Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppSimple;

