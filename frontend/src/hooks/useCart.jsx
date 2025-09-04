import { useState, useEffect, createContext, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('lectio-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('lectio-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, type = 'purchase', rentalDays = null) => {
    const cartItem = {
      id: `${item.id}-${type}-${rentalDays || 'purchase'}`,
      bookId: item.id,
      title: item.title,
      author: item.author,
      price: type === 'rental' ? item.rentalPrice * rentalDays : item.price,
      originalPrice: type === 'rental' ? item.rentalPrice : item.price,
      image: item.image,
      seller: item.seller,
      city: item.city,
      condition: item.condition,
      type: type, // 'purchase' ou 'rental'
      rentalDays: rentalDays,
      deposit: type === 'rental' ? item.deposit || item.price * 0.6 : 0,
      quantity: 1,
      addedAt: new Date().toISOString()
    };

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(i => i.id === cartItem.id);
      if (existingItemIndex >= 0) {
        // Augmenter la quantité si l'item existe déjà
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Ajouter le nouvel item
        return [...prev, cartItem];
      }
    });

    // Ouvrir le panier après ajout
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const depositTotal = item.deposit * item.quantity;
      return total + itemTotal + depositTotal;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getShippingCost = () => {
    // Simulation des frais de port
    const totalWeight = cartItems.length * 0.3; // 300g par livre en moyenne
    if (totalWeight <= 0.5) return 3.90;
    if (totalWeight <= 1) return 4.90;
    return 6.90;
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getShippingCost
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

