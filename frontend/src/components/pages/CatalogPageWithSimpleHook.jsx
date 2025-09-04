import React, { useState, useEffect } from 'react';
import { useBooks } from '../../hooks/useBooksSimple.jsx';

const CatalogPageWithSimpleHook = () => {
  const { 
    books, 
    isLoading, 
    searchBooks
  } = useBooks();

  const [localQuery, setLocalQuery] = useState('');

  useEffect(() => {
    // Recherche initiale au chargement de la page
    searchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(localQuery);
  };

  return (
    <div className="catalog-page" style={{ padding: '20px' }}>
      <div className="container">
        <h1>Catalogue des livres</h1>
        
        <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Rechercher un livre..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            style={{ padding: '10px', marginRight: '10px', width: '300px' }}
          />
          <button type="submit" style={{ padding: '10px 20px' }}>
            Rechercher
          </button>
        </form>

        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <div>
            <p>{books.length} livre(s) trouvé(s)</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {books.map(book => (
                <div key={book.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                  <h3>{book.title}</h3>
                  <p>Auteur: {book.author}</p>
                  <p>Prix: {book.price}€</p>
                  <p>État: {book.condition}</p>
                  <p>Vendeur: {book.seller} ({book.city})</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPageWithSimpleHook;

