import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeaderWithAuth from './HeaderWithAuth';
import HomePage from './HomePage';

// Pages simplifiées pour éviter les erreurs
const CatalogPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📖 Catalogue des Livres</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      {[
        { id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', price: 8.50, condition: 'Très bon état' },
        { id: 2, title: '1984', author: 'George Orwell', price: 12.00, condition: 'Bon état' },
        { id: 3, title: 'L\'Étranger', author: 'Albert Camus', price: 9.75, condition: 'Excellent état' },
        { id: 4, title: 'Harry Potter à l\'école des sorciers', author: 'J.K. Rowling', price: 15.00, condition: 'Très bon état' }
      ].map(book => (
        <div key={book.id} style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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

const EbooksPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📱 Ebooks</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      {[
        { id: 1, title: 'Sapiens (Numérique)', author: 'Yuval Noah Harari', price: 9.99, format: 'PDF, EPUB' },
        { id: 2, title: 'L\'Art de la guerre (Numérique)', author: 'Sun Tzu', price: 4.99, format: 'PDF, EPUB' }
      ].map(ebook => (
        <div key={ebook.id} style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2d5a27', marginBottom: '0.5rem' }}>{ebook.title}</h3>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>par {ebook.author}</p>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>Format: {ebook.format}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d5a27' }}>{ebook.price}€</span>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Télécharger
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LibrairesPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>🏪 Nos Libraires Partenaires</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minWidth(300px, 1fr))', gap: '2rem' }}>
      {[
        { id: 1, name: 'Librairie Mollat', city: 'Bordeaux', specialty: 'Littérature générale', rating: 4.9 },
        { id: 2, name: 'Librairie Charlemagne', city: 'Paris', specialty: 'Sciences humaines', rating: 4.8 },
        { id: 3, name: 'Librairie Sauramps', city: 'Montpellier', specialty: 'Beaux-arts', rating: 4.7 }
      ].map(libraire => (
        <div key={libraire.id} style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2d5a27', marginBottom: '0.5rem' }}>{libraire.name}</h3>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>{libraire.city}</p>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>{libraire.specialty}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#2d5a27' }}>⭐ {libraire.rating}/5</span>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Visiter
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TrackingPage = () => (
  <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📍 Suivi de Colis</h1>
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Numéro de suivi (ex: SC123456789)"
          style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} 
        />
        <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Suivre
        </button>
      </div>
      <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📦 Exemple: SC123456789</h3>
        <p><strong>Statut:</strong> En transit - Colissimo</p>
        <p><strong>Position:</strong> Centre de tri Paris</p>
        <p><strong>Livraison prévue:</strong> 05/09/2025</p>
      </div>
    </div>
  </div>
);

const SupportPage = () => (
  <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>🎧 Support Client</h1>
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <form>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Sujet</label>
          <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message</label>
          <textarea rows="5" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}></textarea>
        </div>
        <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem' }}>
          Envoyer le message
        </button>
      </form>
    </div>
  </div>
);

const SellPage = () => (
  <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>💰 Vendre un Livre</h1>
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <form>
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
        <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem' }}>
          Publier l'annonce
        </button>
      </form>
    </div>
  </div>
);

const AdminPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>👑 Administration Lectio</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minWidth(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27' }}>👥 Utilisateurs</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d5a27' }}>2,847</p>
        <p style={{ color: '#666' }}>+156 ce mois</p>
      </div>
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27' }}>📚 Livres</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d5a27' }}>12,456</p>
        <p style={{ color: '#666' }}>+12.5% ce mois</p>
      </div>
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27' }}>💰 CA</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d5a27' }}>€45,678</p>
        <p style={{ color: '#666' }}>+12.5% ce mois</p>
      </div>
    </div>
  </div>
);

const DashboardPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📊 Dashboard Libraire</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minWidth(200px, 1fr))', gap: '2rem' }}>
      <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27' }}>📚 Mes Livres</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a27' }}>156</p>
      </div>
      <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27' }}>💰 Ventes</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a27' }}>234</p>
      </div>
    </div>
  </div>
);

const InvoicesPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📄 Gestion des Factures</h1>
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>Factures Récentes</h3>
      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <strong>FACT-20250903152521</strong> - Client Test - 22.30€ - 03/09/2025
      </div>
      <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Générer Nouvelle Facture
      </button>
    </div>
  </div>
);

const CommunicationPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📧 Communication</h1>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📰 Newsletter</h3>
        <p>0 abonnés</p>
        <button style={{ padding: '0.75rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Créer Newsletter
        </button>
      </div>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>🎧 Support</h3>
        <p>1 ticket ouvert</p>
        <button style={{ padding: '0.75rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Gérer Tickets
        </button>
      </div>
    </div>
  </div>
);

function RouterSimple() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <HeaderWithAuth />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CatalogPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/ebooks" element={<EbooksPage />} />
          <Route path="/libraires" element={<LibrairesPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/suivi" element={<TrackingPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/vendre" element={<SellPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/factures" element={<InvoicesPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default RouterSimple;

