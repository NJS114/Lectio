import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// Header avec navigation complète
const HeaderFinal = () => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (userType) => {
    const users = {
      marie: { name: 'Marie Dubois', type: 'particulier', email: 'marie@example.com' },
      mollat: { name: 'Librairie Mollat', type: 'libraire', email: 'contact@mollat.com' },
      admin: { name: 'Administrateur', type: 'admin', email: 'admin@lectio.fr' }
    };
    setUser(users[userType]);
    setShowLoginModal(false);
    if (userType === 'admin') navigate('/admin');
    else if (userType === 'mollat') navigate('/dashboard');
  };

  return (
    <header style={{ backgroundColor: '#2d5a27', color: 'white', padding: '1rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          📚 LECTIO
        </Link>
        
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/catalogue" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', transition: 'background-color 0.2s' }}>Catalogue</Link>
          <Link to="/ebooks" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>Ebooks</Link>
          <Link to="/libraires" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>Libraires</Link>
          <Link to="/vendre" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>Vendre</Link>
          <Link to="/suivi" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>Suivi</Link>
          <Link to="/support" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>Support</Link>
          
          {user && user.type === 'libraire' && (
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.2)' }}>Dashboard</Link>
          )}
          
          {user && user.type === 'admin' && (
            <>
              <Link to="/admin" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.2)' }}>Admin</Link>
              <Link to="/factures" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.2)' }}>Factures</Link>
              <Link to="/communication" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.2)' }}>Communication</Link>
            </>
          )}
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem' }}>👋 {user.name}</span>
              <button onClick={() => setUser(null)} style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Déconnexion
              </button>
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} style={{ padding: '0.5rem 1rem', backgroundColor: 'white', color: '#2d5a27', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Connexion
            </button>
          )}
        </nav>
      </div>
      
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ color: '#2d5a27', marginBottom: '1.5rem', textAlign: 'center' }}>Connexion Lectio</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#666', marginBottom: '1rem' }}>Comptes de démonstration :</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button onClick={() => handleLogin('marie')} style={{ padding: '0.75rem', backgroundColor: '#e8f5e8', color: '#2d5a27', border: '1px solid #2d5a27', borderRadius: '4px', cursor: 'pointer' }}>
                  👤 Marie Dubois (Particulier)
                </button>
                <button onClick={() => handleLogin('mollat')} style={{ padding: '0.75rem', backgroundColor: '#e8f5e8', color: '#2d5a27', border: '1px solid #2d5a27', borderRadius: '4px', cursor: 'pointer' }}>
                  🏪 Librairie Mollat (Libraire)
                </button>
                <button onClick={() => handleLogin('admin')} style={{ padding: '0.75rem', backgroundColor: '#e8f5e8', color: '#2d5a27', border: '1px solid #2d5a27', borderRadius: '4px', cursor: 'pointer' }}>
                  👑 Administrateur (Admin)
                </button>
              </div>
            </div>
            
            <button onClick={() => setShowLoginModal(false)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#ccc', color: '#666', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// Pages complètes
const HomePage = () => (
  <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <h1 style={{ fontSize: '3rem', color: '#2d5a27', marginBottom: '1rem' }}>
        Donnez une seconde vie à vos livres
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
        Vendez, achetez, louez entre passionnés. Soutenez vos libraires locaux.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/vendre" style={{ padding: '1rem 2rem', backgroundColor: '#2d5a27', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          Commencer à vendre
        </Link>
        <Link to="/catalogue" style={{ padding: '1rem 2rem', backgroundColor: 'white', color: '#2d5a27', textDecoration: 'none', borderRadius: '8px', border: '2px solid #2d5a27', fontWeight: 'bold' }}>
          Explorer le catalogue
        </Link>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📖 Catalogue</h3>
        <p style={{ color: '#666' }}>Découvrez des milliers de livres d'occasion</p>
      </div>
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>💰 Vendre</h3>
        <p style={{ color: '#666' }}>Vendez vos livres facilement</p>
      </div>
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📦 Expédition</h3>
        <p style={{ color: '#666' }}>Gestion complète avec SendCloud</p>
      </div>
    </div>

    <div style={{ backgroundColor: '#e8f5e8', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
      <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>🧪 Tests des APIs Backend</h3>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => window.open('http://localhost:5000/api/email/test', '_blank')} style={{ padding: '0.75rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📧 Test Email
        </button>
        <button onClick={() => window.open('http://localhost:5000/api/invoice/generate', '_blank')} style={{ padding: '0.75rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📄 Test Facture
        </button>
        <button onClick={() => window.open('http://localhost:5000/api/shipping/test', '_blank')} style={{ padding: '0.75rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📦 Test SendCloud
        </button>
        <button onClick={() => window.open('http://localhost:5000/api/communication/stats', '_blank')} style={{ padding: '0.75rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          📊 Test Stats
        </button>
      </div>
    </div>
  </div>
);

const CataloguePage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📖 Catalogue des Livres</h1>
    
    <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <input type="text" placeholder="Rechercher un livre..." style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
      <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Rechercher
      </button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      {[
        { id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', price: 8.50, condition: 'Très bon état', seller: 'Marie L. • Paris' },
        { id: 2, title: '1984', author: 'George Orwell', price: 12.00, condition: 'Bon état', seller: 'Librairie Mollat • Bordeaux' },
        { id: 3, title: 'L\'Étranger', author: 'Albert Camus', price: 9.75, condition: 'Excellent état', seller: 'Pierre M. • Lyon' },
        { id: 4, title: 'Harry Potter à l\'école des sorciers', author: 'J.K. Rowling', price: 15.00, condition: 'Très bon état', seller: 'Librairie du Centre • Toulouse' },
        { id: 5, title: 'Sapiens', author: 'Yuval Noah Harari', price: 18.00, condition: 'Neuf', seller: 'Librairie Mollat • Bordeaux' },
        { id: 6, title: 'L\'Art de la guerre', author: 'Sun Tzu', price: 7.50, condition: 'Bon état', seller: 'Marie L. • Paris' }
      ].map(book => (
        <div key={book.id} style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2d5a27', marginBottom: '0.5rem' }}>{book.title}</h3>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>par {book.author}</p>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{book.condition}</p>
          <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '1rem' }}>{book.seller}</p>
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
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📱 Ebooks & Livres Numériques</h1>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      {[
        { id: 1, title: 'Sapiens (Numérique)', author: 'Yuval Noah Harari', price: 9.99, format: 'PDF, EPUB', size: '2.5 MB' },
        { id: 2, title: 'L\'Art de la guerre (Numérique)', author: 'Sun Tzu', price: 4.99, format: 'PDF, EPUB', size: '1.2 MB' },
        { id: 3, title: 'Atomic Habits (Numérique)', author: 'James Clear', price: 12.99, format: 'PDF, EPUB, MOBI', size: '3.1 MB' }
      ].map(ebook => (
        <div key={ebook.id} style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2d5a27', marginBottom: '0.5rem' }}>{ebook.title}</h3>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>par {ebook.author}</p>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Format: {ebook.format}</p>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>Taille: {ebook.size}</p>
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
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      {[
        { id: 1, name: 'Librairie Mollat', city: 'Bordeaux', specialty: 'Littérature générale', rating: 4.9, books: 156, sales: 234 },
        { id: 2, name: 'Librairie Charlemagne', city: 'Paris', specialty: 'Sciences humaines', rating: 4.8, books: 89, sales: 145 },
        { id: 3, name: 'Librairie Sauramps', city: 'Montpellier', specialty: 'Beaux-arts', rating: 4.7, books: 67, sales: 98 },
        { id: 4, name: 'Librairie du Centre', city: 'Toulouse', specialty: 'Science-fiction', rating: 4.6, books: 45, sales: 76 }
      ].map(libraire => (
        <div key={libraire.id} style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2d5a27', marginBottom: '0.5rem' }}>{libraire.name}</h3>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>{libraire.city}</p>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>{libraire.specialty}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>{libraire.books} livres</span>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>{libraire.sales} ventes</span>
          </div>
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

const VendrePage = () => (
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
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>État du livre</label>
          <select style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option>Neuf</option>
            <option>Très bon état</option>
            <option>Bon état</option>
            <option>État correct</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Prix souhaité (€)</label>
          <input type="number" step="0.01" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        
        <div style={{ backgroundColor: '#f0f8f0', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#2d5a27', marginBottom: '0.5rem' }}>💡 Calcul automatique des frais</h4>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Commission Lectio: 20% • Frais d'expédition: Calculés automatiquement</p>
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem' }}>
          Publier l'annonce
        </button>
      </form>
    </div>
  </div>
);

const SuiviPage = () => (
  <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📍 Suivi de Colis</h1>
    
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
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
        <p style={{ marginBottom: '0.5rem' }}><strong>Statut:</strong> En transit - Colissimo</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>Position:</strong> Centre de tri Paris</p>
        <p style={{ marginBottom: '1rem' }}><strong>Livraison prévue:</strong> 05/09/2025</p>
        
        <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
          <h4 style={{ color: '#2d5a27', marginBottom: '0.5rem' }}>Historique:</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>✅ 02/09 10:00 - Colis créé</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ 02/09 14:30 - Pris en charge</li>
            <li style={{ marginBottom: '0.5rem' }}>🚛 03/09 08:15 - En transit</li>
            <li style={{ marginBottom: '0.5rem' }}>📍 Aujourd'hui - Centre de tri Paris</li>
          </ul>
        </div>
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
          <select style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option>Problème de commande</option>
            <option>Question sur l'expédition</option>
            <option>Problème de paiement</option>
            <option>Autre</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message</label>
          <textarea rows="5" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="Décrivez votre problème ou votre question..."></textarea>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email de contact</label>
          <input type="email" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem' }}>
          Envoyer le message
        </button>
      </form>
      
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <h4 style={{ color: '#2d5a27', marginBottom: '0.5rem' }}>📞 Autres moyens de contact</h4>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Email: support@lectio.fr</p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Téléphone: 01 23 45 67 89</p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Horaires: Lun-Ven 9h-18h</p>
      </div>
    </div>
  </div>
);

const DashboardPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📊 Dashboard Libraire - Librairie Mollat</h1>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
      <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27' }}>📚 Mes Livres</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a27' }}>156</p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>+12 ce mois</p>
      </div>
      <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27' }}>💰 Ventes</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a27' }}>234</p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>+18 ce mois</p>
      </div>
      <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27' }}>📈 CA</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a27' }}>€2,847</p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>+15% ce mois</p>
      </div>
      <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27' }}>⭐ Note</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d5a27' }}>4.9/5</p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>67 avis</p>
      </div>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>🚀 Actions Rapides</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/vendre" style={{ padding: '0.75rem', backgroundColor: '#e8f5e8', color: '#2d5a27', textDecoration: 'none', borderRadius: '4px', textAlign: 'center' }}>
            Ajouter un livre
          </Link>
          <Link to="/suivi" style={{ padding: '0.75rem', backgroundColor: '#e8f5e8', color: '#2d5a27', textDecoration: 'none', borderRadius: '4px', textAlign: 'center' }}>
            Gérer les expéditions
          </Link>
          <button onClick={() => window.open('http://localhost:5000/api/invoice/generate', '_blank')} style={{ padding: '0.75rem', backgroundColor: '#e8f5e8', color: '#2d5a27', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Générer une facture
          </button>
        </div>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📦 Commandes Récentes</h3>
        <div style={{ fontSize: '0.9rem' }}>
          <div style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
            <strong>CMD-001</strong> - Le Petit Prince - 8.50€
          </div>
          <div style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
            <strong>CMD-002</strong> - 1984 - 12.00€
          </div>
          <div style={{ padding: '0.5rem' }}>
            <strong>CMD-003</strong> - Sapiens - 18.00€
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>👑 Administration Lectio</h1>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
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
        <h3 style={{ color: '#2d5a27' }}>💰 CA Total</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d5a27' }}>€45,678</p>
        <p style={{ color: '#666' }}>+12.5% ce mois</p>
      </div>
      <div style={{ backgroundColor: '#f0f8f0', padding: '2rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27' }}>🏪 Libraires</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d5a27' }}>47</p>
        <p style={{ color: '#666' }}>+3 ce mois</p>
      </div>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>🚨 Alertes</h3>
        <div style={{ fontSize: '0.9rem' }}>
          <div style={{ padding: '0.5rem', backgroundColor: '#ffe6e6', borderRadius: '4px', marginBottom: '0.5rem' }}>
            🔴 8 signalements en attente
          </div>
          <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '0.5rem' }}>
            🟡 12 demandes de vérification libraire
          </div>
          <div style={{ padding: '0.5rem', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
            🔴 3 paiements échoués
          </div>
        </div>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>⚡ Actions Rapides</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={() => window.open('http://localhost:5000/api/communication/stats', '_blank')} style={{ padding: '0.75rem', backgroundColor: '#e8f5e8', color: '#2d5a27', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Statistiques Avancées
          </button>
          <button onClick={() => window.open('http://localhost:5000/api/email/test', '_blank')} style={{ padding: '0.75rem', backgroundColor: '#e8f5e8', color: '#2d5a27', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Envoyer Newsletter
          </button>
          <Link to="/factures" style={{ padding: '0.75rem', backgroundColor: '#e8f5e8', color: '#2d5a27', textDecoration: 'none', borderRadius: '4px', textAlign: 'center' }}>
            Gérer les Factures
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const FacturesPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📄 Gestion des Factures</h1>
    
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: '#2d5a27' }}>Factures Récentes</h3>
        <button onClick={() => window.open('http://localhost:5000/api/invoice/generate', '_blank')} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Générer Nouvelle Facture
        </button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Numéro</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Client</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Montant</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>FACT-20250903152521</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Client Test</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>22.30€</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>03/09/2025</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                <button onClick={() => window.open('http://localhost:5000/api/invoice/download/facture_FACT-20250903152521.pdf', '_blank')} style={{ padding: '0.5rem 1rem', backgroundColor: '#e8f5e8', color: '#2d5a27', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Télécharger
                </button>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>FACT-20250902143012</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Marie Dubois</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>15.60€</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>02/09/2025</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                <button style={{ padding: '0.5rem 1rem', backgroundColor: '#e8f5e8', color: '#2d5a27', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Télécharger
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div style={{ backgroundColor: '#f0f8f0', padding: '1.5rem', borderRadius: '8px' }}>
      <h4 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📊 Statistiques</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d5a27' }}>47</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Factures ce mois</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d5a27' }}>€1,247</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Total facturé</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d5a27' }}>€249</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Commissions</p>
        </div>
      </div>
    </div>
  </div>
);

const CommunicationPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1 style={{ color: '#2d5a27', marginBottom: '2rem' }}>📧 Communication & Marketing</h1>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📰 Newsletter</h3>
        <p style={{ marginBottom: '1rem' }}>0 abonnés</p>
        <button onClick={() => window.open('http://localhost:5000/api/email/test', '_blank')} style={{ padding: '0.75rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
          Envoyer Test
        </button>
        <button style={{ padding: '0.75rem 1rem', backgroundColor: '#e8f5e8', color: '#2d5a27', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Créer Newsletter
        </button>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>🎧 Support</h3>
        <p style={{ marginBottom: '1rem' }}>1 ticket ouvert</p>
        <button onClick={() => window.open('http://localhost:5000/api/communication/stats', '_blank')} style={{ padding: '0.75rem 1rem', backgroundColor: '#2d5a27', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
          Voir Stats
        </button>
        <button style={{ padding: '0.75rem 1rem', backgroundColor: '#e8f5e8', color: '#2d5a27', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Gérer Tickets
        </button>
      </div>
    </div>
    
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>📊 Statistiques de Communication</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d5a27' }}>0</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Emails envoyés aujourd'hui</p>
        </div>
        <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d5a27' }}>0</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Abonnés newsletter</p>
        </div>
        <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d5a27' }}>1</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Tickets support</p>
        </div>
      </div>
    </div>
  </div>
);

function RouterFinal() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <HeaderFinal />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/ebooks" element={<EbooksPage />} />
          <Route path="/libraires" element={<LibrairesPage />} />
          <Route path="/vendre" element={<VendrePage />} />
          <Route path="/suivi" element={<SuiviPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/factures" element={<FacturesPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default RouterFinal;

