import { useState, useEffect } from 'react';
import { buildApiUrl, apiRequest } from '../config/api';

export const useBooksIntegrated = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer tous les livres
  const fetchBooks = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/books';
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.condition) queryParams.append('condition', filters.condition);
      if (filters.min_price) queryParams.append('min_price', filters.min_price);
      if (filters.max_price) queryParams.append('max_price', filters.max_price);
      if (filters.type) queryParams.append('type', filters.type);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      const response = await apiRequest(url);
      
      if (response.success) {
        setBooks(response.data);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des livres');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des livres:', err);
      setError(err.message);
      
      // Fallback avec données de démonstration
      setBooks([
        {
          id: 1,
          title: "L'Étranger",
          author: "Albert Camus",
          price: 15.00,
          rental_price: 3.50,
          condition: "Très bon",
          category: "Roman",
          description: "Un chef-d'œuvre de la littérature française.",
          image: "/api/placeholder/300/400",
          seller_id: 1,
          seller_name: "Marie L.",
          type: "both",
          isbn: "9782070360024",
          publication_year: 1942,
          pages: 186,
          language: "Français",
          publisher: "Gallimard"
        },
        {
          id: 2,
          title: "1984",
          author: "George Orwell",
          price: 18.50,
          rental_price: 4.00,
          condition: "Bon",
          category: "Science-Fiction",
          description: "Une dystopie prophétique sur la surveillance de masse.",
          image: "/api/placeholder/300/400",
          seller_id: 2,
          seller_name: "Librairie Mollat",
          type: "both",
          isbn: "9782070368228",
          publication_year: 1949,
          pages: 438,
          language: "Français",
          publisher: "Gallimard"
        },
        {
          id: 3,
          title: "Le Petit Prince",
          author: "Antoine de Saint-Exupéry",
          price: 12.00,
          rental_price: 2.50,
          condition: "Neuf",
          category: "Jeunesse",
          description: "Un conte poétique et philosophique intemporel.",
          image: "/api/placeholder/300/400",
          seller_id: 1,
          seller_name: "Marie L.",
          type: "sale",
          isbn: "9782070408504",
          publication_year: 1943,
          pages: 96,
          language: "Français",
          publisher: "Gallimard"
        },
        {
          id: 4,
          title: "Sapiens",
          author: "Yuval Noah Harari",
          price: 24.90,
          rental_price: 6.00,
          condition: "Très bon",
          category: "Essai",
          description: "Une brève histoire de l'humanité.",
          image: "/api/placeholder/300/400",
          seller_id: 2,
          seller_name: "Librairie Mollat",
          type: "both",
          isbn: "9782226257017",
          publication_year: 2015,
          pages: 512,
          language: "Français",
          publisher: "Albin Michel"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau livre
  const createBook = async (bookData) => {
    try {
      const response = await apiRequest('/api/books', {
        method: 'POST',
        body: JSON.stringify(bookData)
      });
      
      if (response.success) {
        setBooks(prevBooks => [...prevBooks, response.data]);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Erreur lors de la création du livre');
      }
    } catch (err) {
      console.error('Erreur lors de la création du livre:', err);
      return { success: false, error: err.message };
    }
  };

  // Mettre à jour un livre
  const updateBook = async (bookId, bookData) => {
    try {
      const url = buildApiUrl('/api/books/:id', { id: bookId });
      const response = await apiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(bookData)
      });
      
      if (response.success) {
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book.id === bookId ? { ...book, ...response.data } : book
          )
        );
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour du livre');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du livre:', err);
      return { success: false, error: err.message };
    }
  };

  // Supprimer un livre
  const deleteBook = async (bookId) => {
    try {
      const url = buildApiUrl('/api/books/:id', { id: bookId });
      const response = await apiRequest(url, {
        method: 'DELETE'
      });
      
      if (response.success) {
        setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
        return { success: true };
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression du livre');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du livre:', err);
      return { success: false, error: err.message };
    }
  };

  // Acheter un livre
  const purchaseBook = async (bookId, buyerData) => {
    try {
      const url = buildApiUrl('/api/books/:id/purchase', { id: bookId });
      const response = await apiRequest(url, {
        method: 'POST',
        body: JSON.stringify(buyerData)
      });
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Erreur lors de l\'achat du livre');
      }
    } catch (err) {
      console.error('Erreur lors de l\'achat du livre:', err);
      return { success: false, error: err.message };
    }
  };

  // Comparaison de prix
  const comparePrices = async (bookData) => {
    try {
      const response = await apiRequest('/api/books/price-comparison', {
        method: 'POST',
        body: JSON.stringify(bookData)
      });
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Erreur lors de la comparaison de prix');
      }
    } catch (err) {
      console.error('Erreur lors de la comparaison de prix:', err);
      return { success: false, error: err.message };
    }
  };

  // Rechercher des livres
  const searchBooks = (searchTerm, filters = {}) => {
    return books.filter(book => {
      const matchesSearch = searchTerm === '' || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || filters.category === 'all' || book.category === filters.category;
      const matchesCondition = !filters.condition || filters.condition === 'all' || book.condition === filters.condition;
      const matchesType = !filters.type || filters.type === 'all' || book.type === filters.type || book.type === 'both';
      
      const matchesPrice = (!filters.min_price || book.price >= filters.min_price) &&
                          (!filters.max_price || book.price <= filters.max_price);
      
      return matchesSearch && matchesCategory && matchesCondition && matchesType && matchesPrice;
    });
  };

  // Obtenir un livre par ID
  const getBookById = (bookId) => {
    return books.find(book => book.id === parseInt(bookId));
  };

  // Obtenir les livres d'un vendeur
  const getBooksBySeller = (sellerId) => {
    return books.filter(book => book.seller_id === sellerId);
  };

  // Charger les livres au montage du hook
  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    loading,
    error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    purchaseBook,
    comparePrices,
    searchBooks,
    getBookById,
    getBooksBySeller
  };
};

