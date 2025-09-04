import { useState, useEffect, createContext, useContext } from 'react';
import { API_CONFIG } from '../config/api';

// Configuration API directe
const API_BASE = API_CONFIG.BASE_URL;

const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    priceRange: [0, 100],
    location: '',
    mode: 'all' // 'all', 'sale', 'rental'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  // Charger les favoris au démarrage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('lectio-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    // Charger les livres au démarrage
    searchBooks('', filters);
  }, []);

  // Sauvegarder les favoris
  useEffect(() => {
    localStorage.setItem('lectio-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const searchBooks = async (query, newFilters = filters) => {
    setIsLoading(true);
    setSearchQuery(query);
    setFilters(newFilters);

    try {
      const queryParams = new URLSearchParams();
      
      if (query) queryParams.append('search', query);
      if (newFilters.category) queryParams.append('category', newFilters.category);
      if (newFilters.condition) queryParams.append('condition', newFilters.condition);
      if (newFilters.location) queryParams.append('city', newFilters.location);
      if (newFilters.mode === 'sale') queryParams.append('for_sale', 'true');
      if (newFilters.mode === 'rental') queryParams.append('for_rent', 'true');
      if (newFilters.priceRange && newFilters.priceRange[0] > 0) queryParams.append('min_price', newFilters.priceRange[0]);
      if (newFilters.priceRange && newFilters.priceRange[1] < 100) queryParams.append('max_price', newFilters.priceRange[1]);

      const url = `${API_BASE}/api/books?${queryParams.toString()}`;
      console.log('Fetching books from:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Books data received:', data);
      
      setBooks(data.books || []);
      setPagination({
        page: data.pagination?.page || 1,
        totalPages: data.pagination?.pages || 1,
        totalItems: data.pagination?.total || 0,
        itemsPerPage: data.pagination?.per_page || 12
      });
    } catch (error) {
      console.error('Erreur lors de la recherche de livres:', error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getBookById = async (id) => {
    try {
      const url = `${API_BASE}/api/books/${id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du livre:', error);
      return null;
    }
  };

  const getUserBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return [];

      const url = `${API_BASE}/api/books/my-books`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.books || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des livres utilisateur:', error);
      return [];
    }
  };

  const addToFavorites = (bookId) => {
    setFavorites(prev => [...prev, bookId]);
  };

  const removeFromFavorites = (bookId) => {
    setFavorites(prev => prev.filter(id => id !== bookId));
  };

  const isFavorite = (bookId) => {
    return favorites.includes(bookId);
  };

  const getCategories = async () => {
    try {
      const url = `${API_BASE}/api/books/categories`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return [];
    }
  };

  const getConditions = async () => {
    try {
      const url = `${API_BASE}/api/books/conditions`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.conditions || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des conditions:', error);
      return [];
    }
  };

  const createBook = async (bookData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Vous devez être connecté pour ajouter un livre' };
      }

      const url = `${API_BASE}/api/books`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.message || `Erreur ${response.status}: ${response.statusText}` 
        };
      }
      
      const result = await response.json();
      
      // Rafraîchir la liste des livres
      await searchBooks(searchQuery, filters);
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Erreur lors de la création du livre:', error);
      return { success: false, error: 'Une erreur est survenue lors de l\'ajout du livre' };
    }
  };

  const value = {
    books,
    favorites,
    searchQuery,
    filters,
    isLoading,
    pagination,
    searchBooks,
    getBookById,
    getUserBooks,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getCategories,
    getConditions,
    createBook,
    addBook: createBook // Alias pour compatibilité
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};

export default useBooks;

