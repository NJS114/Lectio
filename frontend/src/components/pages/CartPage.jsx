import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getShippingCost } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingCart size={64} />
            <h2>Votre panier est vide</h2>
            <p>Découvrez notre catalogue de livres d'occasion</p>
            <button 
              className="btn btn--primary"
              onClick={() => navigate('/catalogue')}
            >
              Parcourir le catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={16} />
          Retour
        </button>
        
        <h1>Mon Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p>{item.author}</p>
                  <span className="price">{item.price}€</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Résumé</h3>
            <div className="summary-line">
              <span>Sous-total</span>
              <span>{getCartTotal().toFixed(2)}€</span>
            </div>
            <div className="summary-line">
              <span>Frais de port</span>
              <span>{getShippingCost().toFixed(2)}€</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>{(getCartTotal() + getShippingCost()).toFixed(2)}€</span>
            </div>
            <button 
              className="btn btn--primary btn--full"
              onClick={() => navigate('/commande')}
            >
              Finaliser la commande
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

