import React from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const CartSidebar = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    getCartItemsCount,
    getShippingCost
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/commande');
  };

  const getItemDisplayPrice = (item) => {
    if (item.type === 'rental') {
      return `${item.originalPrice}€/j × ${item.rentalDays}j`;
    }
    return `${item.originalPrice}€`;
  };

  const getItemTotalPrice = (item) => {
    return (item.price + (item.deposit || 0)) * item.quantity;
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="cart-overlay" 
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'cart-sidebar--open' : ''}`}>
        <div className="cart-header">
          <h3>
            <ShoppingCart size={20} />
            Panier ({getCartItemsCount()})
          </h3>
          <button 
            className="close-btn"
            onClick={() => setIsCartOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={48} />
              <h4>Votre panier est vide</h4>
              <p>Ajoutez des livres pour commencer vos achats</p>
              <button 
                className="btn btn--primary"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/catalogue');
                }}
              >
                Parcourir le catalogue
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.title} />
                      {item.type === 'rental' && (
                        <div className="rental-badge">
                          <span>Location</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="item-details">
                      <h4 className="item-title">{item.title}</h4>
                      <p className="item-author">{item.author}</p>
                      <p className="item-seller">{item.seller} • {item.city}</p>
                      
                      <div className="item-pricing">
                        <div className="price-line">
                          <span>{item.type === 'rental' ? 'Location' : 'Prix'}</span>
                          <span>{getItemDisplayPrice(item)}</span>
                        </div>
                        {item.deposit > 0 && (
                          <div className="price-line deposit-line">
                            <span>Caution</span>
                            <span>{item.deposit.toFixed(2)}€</span>
                          </div>
                        )}
                        {item.type === 'rental' && (
                          <p className="rental-note">
                            Durée: {item.rentalDays} jour{item.rentalDays > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>

                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="quantity-btn"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="quantity-btn"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <div className="item-total">
                          {getItemTotalPrice(item).toFixed(2)}€
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-line">
                  <span>Sous-total</span>
                  <span>{getCartTotal().toFixed(2)}€</span>
                </div>
                <div className="summary-line">
                  <span>Frais de port</span>
                  <span>{getShippingCost().toFixed(2)}€</span>
                </div>
                <div className="summary-line summary-line--total">
                  <span>Total</span>
                  <span>{(getCartTotal() + getShippingCost()).toFixed(2)}€</span>
                </div>
                
                <button 
                  className="btn btn--primary btn--full checkout-btn"
                  onClick={handleCheckout}
                >
                  Finaliser la commande
                </button>
                
                <button 
                  className="btn btn--secondary btn--full"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/catalogue');
                  }}
                >
                  Continuer mes achats
                </button>
              </div>
            </>
          )}
        </div>

        <style jsx>{`
          .cart-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }

          .cart-sidebar {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 400px;
            max-width: 90vw;
            background: var(--color-white-off);
            box-shadow: var(--shadow-lg);
            transform: translateX(100%);
            transition: transform var(--transition-normal);
            z-index: 1000;
            display: flex;
            flex-direction: column;
          }

          .cart-sidebar--open {
            transform: translateX(0);
          }

          .cart-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--color-gray-warm-light);
          }

          .cart-header h3 {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            font-size: 18px;
            font-weight: 600;
            color: var(--color-gray-warm-dark);
          }

          .close-btn {
            padding: var(--spacing-sm);
            background: none;
            border: none;
            color: var(--color-gray-warm-medium);
            cursor: pointer;
            border-radius: var(--radius-sm);
            transition: all var(--transition-fast);
          }

          .close-btn:hover {
            background: var(--color-beige-paper);
            color: var(--color-gray-warm-dark);
          }

          .cart-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .empty-cart {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-xl);
            text-align: center;
            color: var(--color-gray-warm-medium);
          }

          .empty-cart svg {
            margin-bottom: var(--spacing-lg);
            opacity: 0.5;
          }

          .empty-cart h4 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: var(--spacing-sm);
            color: var(--color-gray-warm-dark);
          }

          .empty-cart p {
            margin-bottom: var(--spacing-lg);
          }

          .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: var(--spacing-md);
          }

          .cart-item {
            display: flex;
            gap: var(--spacing-md);
            padding: var(--spacing-md);
            border: 1px solid var(--color-gray-warm-light);
            border-radius: var(--radius-md);
            margin-bottom: var(--spacing-md);
            background: white;
          }

          .item-image {
            position: relative;
            width: 60px;
            height: 80px;
            flex-shrink: 0;
            border-radius: var(--radius-sm);
            overflow: hidden;
          }

          .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .rental-badge {
            position: absolute;
            top: 2px;
            right: 2px;
            background: var(--color-green-primary);
            color: white;
            font-size: 8px;
            padding: 2px 4px;
            border-radius: var(--radius-sm);
          }

          .item-details {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--spacing-xs);
          }

          .item-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--color-gray-warm-dark);
            line-height: 1.2;
          }

          .item-author {
            font-size: 12px;
            color: var(--color-gray-warm-medium);
          }

          .item-seller {
            font-size: 11px;
            color: var(--color-gray-warm-medium);
          }

          .item-pricing {
            margin-top: var(--spacing-xs);
          }

          .price-line {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: var(--color-gray-warm-medium);
          }

          .deposit-line {
            color: var(--color-green-dark);
          }

          .rental-note {
            font-size: 10px;
            color: var(--color-gray-warm-medium);
            margin-top: var(--spacing-xs);
          }

          .item-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: var(--spacing-sm);
          }

          .quantity-controls {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
          }

          .quantity-btn {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--color-gray-warm-light);
            background: white;
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all var(--transition-fast);
          }

          .quantity-btn:hover {
            background: var(--color-beige-paper);
          }

          .quantity {
            font-size: 12px;
            font-weight: 600;
            min-width: 20px;
            text-align: center;
          }

          .item-total {
            font-size: 14px;
            font-weight: 600;
            color: var(--color-gray-warm-dark);
          }

          .remove-btn {
            padding: var(--spacing-xs);
            background: none;
            border: none;
            color: var(--color-error);
            cursor: pointer;
            border-radius: var(--radius-sm);
            transition: all var(--transition-fast);
          }

          .remove-btn:hover {
            background: rgba(232, 168, 124, 0.1);
          }

          .cart-summary {
            padding: var(--spacing-lg);
            border-top: 1px solid var(--color-gray-warm-light);
            background: var(--color-beige-paper);
          }

          .summary-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-sm);
            font-size: 14px;
          }

          .summary-line--total {
            font-size: 16px;
            font-weight: 600;
            color: var(--color-gray-warm-dark);
            padding-top: var(--spacing-sm);
            border-top: 1px solid var(--color-gray-warm-light);
            margin-bottom: var(--spacing-lg);
          }

          .btn--full {
            width: 100%;
            margin-bottom: var(--spacing-sm);
          }

          .checkout-btn {
            font-weight: 600;
          }

          @media (max-width: 480px) {
            .cart-sidebar {
              width: 100vw;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default CartSidebar;

