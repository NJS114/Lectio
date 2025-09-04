import { useState, useEffect, createContext, useContext } from 'react';
import { API_CONFIG } from '../config/api';

const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchBooks = async (query = '', filters = {}) => {
    setIsLoading(true);
    
    try {
      const url = `${API_CONFIG.BASE_URL}/api/books`;
      console.log('Fetching books from:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Books data received:', data);
      
      setBooks(data.books || []);
    } catch (error) {
      console.error('Erreur lors de la recherche de livres:', error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    books,
    isLoading,
    searchBooks
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

