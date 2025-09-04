import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CatalogPageMinimal = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();

  // Extraire la requête de recherche depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/books');
        const data = await response.json();
        setBooks(data.books || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBooks();
  }, []);

  // Filtrer les livres selon la requête de recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [books, searchQuery]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Catalogue Minimal</h1>
      {searchQuery && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <strong>Recherche pour :</strong> "{searchQuery}"
          <button 
            onClick={() => setSearchQuery('')}
            style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
          >
            Effacer
          </button>
        </div>
      )}
      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <div>
          <div>
            {searchQuery ? 
              `${filteredBooks.length} résultat(s) trouvé(s) sur ${books.length} livre(s)` :
              `Nombre de livres: ${books.length}`
            }
          </div>
          {filteredBooks.length === 0 && searchQuery ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <p>Aucun livre trouvé pour "{searchQuery}"</p>
              <p>Essayez avec d'autres mots-clés ou parcourez tous les livres.</p>
            </div>
          ) : (
            filteredBooks.map(book => (
              <div key={book.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <div>Titre: {book.title}</div>
                <div>Auteur: {book.author}</div>
                <div>Prix: {book.price} euros</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CatalogPageMinimal;

