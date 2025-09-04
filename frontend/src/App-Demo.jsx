import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './styles/design-system.css';

// Composant Header avec navigation
const Header = ({ user, onLogin, onLogout }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  return (
    <header style={{ backgroundColor: '#2d5a27', color: 'white', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          📚 LECTIO
        </Link>
        
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Accueil</Link>
          <Link to="/catalog" style={{ color: 'white', textDecoration: 'none' }}>Catalogue</Link>
          <Link to="/sell" style={{ color: 'white', textDecoration: 'none' }}>Vendre</Link>
          <Link to="/shipping" style={{ color: 'white', textDecoration: 'none' }}>Expédition</Link>
          <Link to="/tracking" style={{ color: 'white', textDecoration: 'none' }}>Suivi</Link>
          
          {user ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {user.type === 'admin' && (
                <Link to="/admin" style={{ color: '#90EE90', textDecoration: 'none' }}>Admin</Link>
              )}
              {user.type === 'libraire' && (
                <Link to="/dashboard" style={{ color: '#90EE90', textDecoration: 'none' }}>Dashboard</Link>
              )}
              <span>👋 {user.name}</span>
              <button onClick={onLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#1a4019', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Déconnexion
              </button>
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} style={{ padding: '0.5rem 1rem', backgroundColor: '#1a4019', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Connexion
            </button>
          )}
        </nav>
      </div>
      
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} onLogin={onLogin} />
      )}
    </header>
  );
};

// Modal de connexion
const LoginModal = ({ onClose, onLogin }) => {
  const demoAccounts = [
    { id: 1, name: 'Marie Dubois', email: 'marie@example.com', type: 'particulier' },
    { id: 2, name: 'Librairie Mollat', email: 'mollat@example.com', type: 'libraire' },
    { id: 3, name: 'Administrateur', email: 'admin@lectio.fr', type: 'admin' }
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', minWidth: '400px' }}>
        <h2 style={{ marginBottom: '1rem', color: '#2d5a27' }}>Connexion à Lectio</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Comptes de démonstration :</h3>
          {demoAccounts.map(account => (
            <button
              key={account.id}
              onClick={() => { onLogin(account); onClose(); }}
              style={{ 
                display: 'block', 
                width: '100%', 
                padding: '0.75rem', 
                marginBottom: '0.5rem', 
                backgroundColor: '#f0f8f0', 
                border: '1px solid #2d5a27', 
                borderRadius: '4px', 
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <strong>{account.name}</strong> ({account.type})
              <br />
              <small>{account.email}</small>
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

// Page d'accueil
const HomePage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <h1 style={{ fontSize: '3rem', color: '#2d5a27', marginBottom: '1rem' }}>
        📚 Bienvenue sur Lectio
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
        La plateforme de référence pour les livres d'occasion
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>🔍 Catalogue</h3>
        <p>Découvrez des milliers de livres d'occasion</p>
        <Link to="/catalog" style={{ color: '#2d5a27', textDecoration: 'none', fontWeight: 'bold' }}>
          Explorer →
        </Link>
      </div>
      
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>💰 Vendre</h3>
        <p>Vendez vos livres facilement</p>
        <Link to="/sell" style={{ color: '#2d5a27', textDecoration: 'none', fontWeight: 'bold' }}>
          Commencer →
        </Link>
      </div>
      
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📦 Expédition</h3>
        <p>Gestion complète avec SendCloud</p>
        <Link to="/shipping" style={{ color: '#2d5a27', textDecoration: 'none', fontWeight: 'bold' }}>
          Gérer →
        </Link>
      </div>
    </div>

    <div style={{ backgroundColor: '#f9f9f9', padding: '2rem', borderRadius: '8px' }}>
      <h2 style={{ color: '#2d5a27', marginBottom: '1rem' }}>🧪 Tests des APIs Backend</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => testAPI('email')} style={{ padding: '0.5rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📧 Test Email
        </button>
        <button onClick={() => testAPI('sendcloud')} style={{ padding: '0.5rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📦 Test SendCloud
        </button>
        <button onClick={() => testAPI('invoice')} style={{ padding: '0.5rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📄 Test Facture
        </button>
        <button onClick={() => testAPI('stats')} style={{ padding: '0.5rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📊 Test Stats
        </button>
      </div>
      <div id="api-results" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '4px', minHeight: '100px' }}>
        <em>Cliquez sur un bouton pour tester les APIs...</em>
      </div>
    </div>
  </div>
);

// Page catalogue
const CatalogPage = () => {
  const books = [
    { id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', price: 8.50, condition: 'Très bon état' },
    { id: 2, title: '1984', author: 'George Orwell', price: 12.00, condition: 'Bon état' },
    { id: 3, title: 'L\'Étranger', author: 'Albert Camus', price: 9.75, condition: 'Excellent état' },
    { id: 4, title: 'Harry Potter à l\'école des sorciers', author: 'J.K. Rowling', price: 15.00, condition: 'Très bon état' }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📖 Catalogue des Livres</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {books.map(book => (
          <div key={book.id} style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ color: '#2d5a27', marginBottom: '0.5rem' }}>{book.title}</h3>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>par {book.author}</p>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>{book.condition}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d5a27' }}>{book.price}€</span>
              <button style={{ padding: '0.5rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Acheter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Page de vente
const SellPage = () => (
  <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>💰 Vendre un Livre</h1>
    
    <form style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Titre du livre</label>
        <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Auteur</label>
        <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Prix souhaité (€)</label>
        <input type="number" step="0.01" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>État du livre</label>
        <select style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <option>Excellent état</option>
          <option>Très bon état</option>
          <option>Bon état</option>
          <option>État correct</option>
        </select>
      </div>
      
      <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem' }}>
        Publier l'annonce
      </button>
    </form>
  </div>
);

// Page d'administration
const AdminPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>👑 Administration Lectio</h1>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27' }}>👥 Utilisateurs</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d5a27' }}>2,847</p>
        <p style={{ color: '#666' }}>+156 ce mois</p>
      </div>
      
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27' }}>📚 Livres</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d5a27' }}>12,456</p>
        <p style={{ color: '#666' }}>+12.5% ce mois</p>
      </div>
      
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27' }}>💰 CA</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d5a27' }}>€45,678</p>
        <p style={{ color: '#666' }}>+12.5% ce mois</p>
      </div>
      
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27' }}>📧 Emails</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d5a27' }}>1,234</p>
        <p style={{ color: '#666' }}>envoyés ce mois</p>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>🚨 Alertes</h3>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ color: 'red' }}>🔴</span> 8 signalements en attente
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ color: 'orange' }}>🟡</span> 12 demandes de vérification libraire
        </div>
        <div>
          <span style={{ color: 'green' }}>🟢</span> Sauvegarde automatique OK
        </div>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>⚡ Actions Rapides</h3>
        <button style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '0.5rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📊 Statistiques Avancées
        </button>
        <button style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '0.5rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          👥 Gérer les Utilisateurs
        </button>
        <button style={{ display: 'block', width: '100%', padding: '0.75rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📧 Envoyer Newsletter
        </button>
      </div>
    </div>
  </div>
);

// Page dashboard libraire
const DashboardPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📊 Dashboard Libraire</h1>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
      <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27' }}>📚 Mes Livres</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a27' }}>156</p>
      </div>
      
      <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27' }}>💰 Ventes</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a27' }}>234</p>
      </div>
      
      <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27' }}>⭐ Note</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a27' }}>4.9/5</p>
      </div>
      
      <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27' }}>📦 En cours</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a27' }}>12</p>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>🛠️ Outils</h3>
        <Link to="/shipping" style={{ display: 'block', padding: '0.75rem', marginBottom: '0.5rem', backgroundColor: '#2d5a27', color: 'white', textDecoration: 'none', borderRadius: '4px', textAlign: 'center' }}>
          📦 Gestion Expéditions
        </Link>
        <button style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '0.5rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📊 Analytics
        </button>
        <button style={{ display: 'block', width: '100%', padding: '0.75rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📧 Marketing
        </button>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📈 Activité Récente</h3>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Vente :</strong> "Le Petit Prince" - 8.50€
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Nouveau livre :</strong> "1984" ajouté
        </div>
        <div>
          <strong>Expédition :</strong> Colis SC123456 envoyé
        </div>
      </div>
    </div>
  </div>
);

// Page d'expédition
const ShippingPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📦 Gestion des Expéditions</h1>
    
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '2rem' }}>
      <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>🚀 SendCloud - Créer un Colis</h3>
      
      <form>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nom du destinataire</label>
            <input type="text" placeholder="Pierre Martin" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
            <input type="email" placeholder="pierre@example.com" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Adresse</label>
          <input type="text" placeholder="45 Avenue des Champs-Élysées" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Ville</label>
            <input type="text" placeholder="Paris" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Code postal</label>
            <input type="text" placeholder="75008" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Poids (kg)</label>
            <input type="number" step="0.1" placeholder="0.5" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem' }}>
          🏷️ Créer l'Étiquette SendCloud
        </button>
      </form>
    </div>

    <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px' }}>
      <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📋 Colis Récents</h3>
      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
        <strong>SC123456789</strong> - Pierre Martin - Paris (75008) - ✅ Livré
      </div>
      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
        <strong>SC987654321</strong> - Marie Dubois - Lyon (69000) - 🚚 En transit
      </div>
      <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
        <strong>SC456789123</strong> - Jean Dupont - Marseille (13000) - 📦 Préparé
      </div>
    </div>
  </div>
);

// Page de suivi
const TrackingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  const handleTrack = () => {
    // Simulation de données de suivi
    setTrackingInfo({
      number: trackingNumber || 'SC123456789',
      status: 'En transit',
      carrier: 'Colissimo',
      location: 'Centre de tri Paris',
      estimatedDelivery: '05/09/2025',
      history: [
        { date: '02 sept., 10:00', status: 'Colis créé', location: 'Expéditeur' },
        { date: '02 sept., 14:30', status: 'Pris en charge', location: 'Bureau de poste Paris 15e' },
        { date: '03 sept., 08:15', status: 'En transit', location: 'Centre de tri Paris' },
        { date: '03 sept., 16:45', status: 'En transit', location: 'Transfert vers destination' }
      ]
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📍 Suivi de Colis</h1>
      
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            placeholder="Numéro de suivi (ex: SC123456789)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
          <button 
            onClick={handleTrack}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Suivre
          </button>
        </div>

        {trackingInfo && (
          <div>
            <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📦 {trackingInfo.number}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <strong>Statut :</strong> {trackingInfo.status} - {trackingInfo.carrier}
                </div>
                <div>
                  <strong>Position :</strong> {trackingInfo.location}
                </div>
                <div>
                  <strong>Livraison prévue :</strong> {trackingInfo.estimatedDelivery}
                </div>
                <div>
                  <button style={{ padding: '0.5rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    🔗 Site transporteur
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📋 Historique</h4>
              {trackingInfo.history.map((event, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#2d5a27', borderRadius: '50%', marginRight: '1rem' }}></div>
                  <div style={{ flex: 1 }}>
                    <strong>{event.date}</strong> - {event.status}
                    <br />
                    <small style={{ color: '#666' }}>{event.location}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Fonctions de test des APIs
window.testAPI = async (type) => {
  const resultsDiv = document.getElementById('api-results');
  resultsDiv.innerHTML = `⏳ Test ${type} en cours...`;
  
  try {
    let response, data;
    
    switch(type) {
      case 'email':
        response = await fetch('http://localhost:5000/api/email/test');
        data = await response.json();
        resultsDiv.innerHTML = `✅ EMAIL: Configuration Brevo validée !<br><pre>${JSON.stringify(data, null, 2)}</pre>`;
        break;
        
      case 'sendcloud':
        response = await fetch('http://localhost:5000/api/shipping/test');
        data = await response.json();
        resultsDiv.innerHTML = `✅ SENDCLOUD: Connexion réussie !<br><pre>${JSON.stringify(data, null, 2)}</pre>`;
        break;
        
      case 'invoice':
        response = await fetch('http://localhost:5000/api/invoice/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_name: 'Test Client',
            client_email: 'test@example.com',
            items: [{ title: 'Le Petit Prince', quantity: 1, price: 15.99 }]
          })
        });
        data = await response.json();
        resultsDiv.innerHTML = `✅ FACTURE: PDF généré avec succès !<br><pre>${JSON.stringify(data, null, 2)}</pre>`;
        break;
        
      case 'stats':
        response = await fetch('http://localhost:5000/api/communication/stats');
        data = await response.json();
        resultsDiv.innerHTML = `✅ STATS: Statistiques récupérées !<br><pre>${JSON.stringify(data, null, 2)}</pre>`;
        break;
    }
  } catch (error) {
    resultsDiv.innerHTML = `❌ Erreur ${type}: ${error.message}`;
  }
};

// Application principale
function AppDemo() {
  const [user, setUser] = useState(null);

  const handleLogin = (account) => {
    setUser(account);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/admin" element={user?.type === 'admin' ? <AdminPage /> : <div style={{padding: '2rem', textAlign: 'center'}}>❌ Accès réservé aux administrateurs</div>} />
          <Route path="/dashboard" element={user?.type === 'libraire' ? <DashboardPage /> : <div style={{padding: '2rem', textAlign: 'center'}}>❌ Accès réservé aux libraires</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppDemo;

