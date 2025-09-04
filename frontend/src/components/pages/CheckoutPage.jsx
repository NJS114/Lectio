import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { usePayment } from '../../hooks/usePayment';
import { useShipping } from '../../hooks/useShipping';
import {
  ArrowLeft, CreditCard, Wallet, Smartphone, Building2, Package,
  Zap, MapPin, Store, HandHeart, Check, AlertCircle, Lock,
  Plus, Edit, Trash2, Star, Clock, Shield
} from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { paymentMethods, savedCards, processPayment, calculateFees } = usePayment();
  const { 
    shippingMethods, 
    savedAddresses, 
    pickupPoints,
    calculateShippingCost, 
    estimateDeliveryDate 
  } = useShipping();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses.find(addr => addr.isDefault)?.id || '');
  const [selectedPickupPoint, setSelectedPickupPoint] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = getTotalPrice();
  const shippingCost = calculateShippingCost(cartItems, selectedShipping, selectedAddress);
  const paymentFees = calculateFees(subtotal, selectedPayment);
  const total = subtotal + shippingCost + paymentFees;

  const steps = [
    { id: 1, name: 'Livraison', icon: Package },
    { id: 2, name: 'Paiement', icon: CreditCard },
    { id: 3, name: 'Confirmation', icon: Check }
  ];

  const getPaymentIcon = (methodId) => {
    const icons = {
      card: CreditCard,
      paypal: Wallet,
      apple_pay: Smartphone,
      google_pay: Smartphone,
      bank_transfer: Building2
    };
    return icons[methodId] || CreditCard;
  };

  const getShippingIcon = (methodId) => {
    const icons = {
      standard: Package,
      express: Zap,
      pickup_point: MapPin,
      bookstore_pickup: Store,
      hand_delivery: HandHeart
    };
    return icons[methodId] || Package;
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      const orderData = {
        items: cartItems,
        shipping: {
          method: selectedShipping,
          address: selectedAddress,
          pickupPoint: selectedPickupPoint,
          cost: shippingCost
        },
        payment: {
          method: selectedPayment,
          fees: paymentFees
        },
        amounts: {
          subtotal,
          shipping: shippingCost,
          fees: paymentFees,
          total
        }
      };

      const payment = await processPayment({
        orderId: `order_${Date.now()}`,
        amount: total,
        method: selectedPayment,
        description: `Commande de ${cartItems.length} livre(s)`
      });

      setOrderNumber(payment.id);
      setOrderComplete(true);
      clearCart();
      
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="checkout-login-required">
        <div className="container">
          <div className="login-prompt">
            <Lock size={48} />
            <h2>Connexion requise</h2>
            <p>Vous devez être connecté pour finaliser votre commande.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="container">
          <div className="empty-cart">
            <Package size={48} />
            <h2>Votre panier est vide</h2>
            <p>Ajoutez des livres à votre panier pour continuer.</p>
            <button onClick={() => navigate('/catalogue')} className="btn btn-primary">
              Parcourir le catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="checkout-success">
        <div className="container">
          <div className="success-message">
            <div className="success-icon">
              <Check size={48} />
            </div>
            <h1>Commande confirmée !</h1>
            <p>Votre commande #{orderNumber} a été traitée avec succès.</p>
            
            <div className="order-summary">
              <h3>Récapitulatif</h3>
              <div className="summary-row">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="summary-row">
                <span>Livraison</span>
                <span>{shippingCost.toFixed(2)}€</span>
              </div>
              {paymentFees > 0 && (
                <div className="summary-row">
                  <span>Frais de paiement</span>
                  <span>{paymentFees.toFixed(2)}€</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>

            <div className="next-steps">
              <h3>Prochaines étapes</h3>
              <div className="step">
                <Check size={20} />
                <span>Confirmation par email envoyée</span>
              </div>
              <div className="step">
                <Package size={20} />
                <span>Préparation de votre commande</span>
              </div>
              <div className="step">
                <Clock size={20} />
                <span>Livraison estimée: {estimateDeliveryDate(selectedShipping)}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                Suivre ma commande
              </button>
              <button onClick={() => navigate('/catalogue')} className="btn btn-secondary">
                Continuer mes achats
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <button onClick={() => navigate('/panier')} className="back-button">
            <ArrowLeft size={20} />
            Retour au panier
          </button>
          
          <div className="checkout-steps">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.id} 
                  className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                >
                  <div className="step-icon">
                    <Icon size={20} />
                  </div>
                  <span>{step.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            {/* Étape 1: Livraison */}
            {currentStep === 1 && (
              <div className="shipping-section">
                <h2>Choisir le mode de livraison</h2>
                
                <div className="shipping-methods">
                  {shippingMethods.map((method) => {
                    const Icon = getShippingIcon(method.id);
                    const cost = calculateShippingCost(cartItems, method.id, selectedAddress);
                    const delivery = estimateDeliveryDate(method.id);
                    
                    return (
                      <div 
                        key={method.id}
                        className={`shipping-method ${selectedShipping === method.id ? 'selected' : ''}`}
                        onClick={() => setSelectedShipping(method.id)}
                      >
                        <div className="method-icon">
                          <Icon size={24} />
                        </div>
                        <div className="method-info">
                          <h3>{method.name}</h3>
                          <p>{method.description}</p>
                          <div className="method-features">
                            {method.trackingIncluded && (
                              <span className="feature">
                                <Package size={16} />
                                Suivi inclus
                              </span>
                            )}
                            {method.insuranceIncluded && (
                              <span className="feature">
                                <Shield size={16} />
                                Assurance incluse
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="method-details">
                          <div className="price">
                            {cost === 0 ? 'Gratuit' : `${cost.toFixed(2)}€`}
                          </div>
                          <div className="delivery-time">{delivery}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedShipping === 'pickup_point' && (
                  <div className="pickup-points">
                    <h3>Choisir un point relais</h3>
                    {pickupPoints.map((point) => (
                      <div 
                        key={point.id}
                        className={`pickup-point ${selectedPickupPoint === point.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPickupPoint(point.id)}
                      >
                        <div className="point-info">
                          <h4>{point.name}</h4>
                          <p>{point.address}</p>
                          <div className="point-details">
                            <span>{point.hours}</span>
                            <span>{point.distance}</span>
                            <span>
                              <Star size={14} />
                              {point.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(selectedShipping === 'standard' || selectedShipping === 'express') && (
                  <div className="delivery-addresses">
                    <h3>Adresse de livraison</h3>
                    {savedAddresses.map((address) => (
                      <div 
                        key={address.id}
                        className={`address ${selectedAddress === address.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAddress(address.id)}
                      >
                        <div className="address-info">
                          <h4>{address.name}</h4>
                          <p>{address.firstName} {address.lastName}</p>
                          <p>{address.street}</p>
                          <p>{address.postalCode} {address.city}</p>
                          <p>{address.phone}</p>
                        </div>
                        {address.isDefault && (
                          <span className="default-badge">Par défaut</span>
                        )}
                      </div>
                    ))}
                    
                    <button className="add-address-btn">
                      <Plus size={20} />
                      Ajouter une nouvelle adresse
                    </button>
                  </div>
                )}

                <div className="step-actions">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="btn btn-primary"
                    disabled={selectedShipping === 'pickup_point' && !selectedPickupPoint}
                  >
                    Continuer vers le paiement
                  </button>
                </div>
              </div>
            )}

            {/* Étape 2: Paiement */}
            {currentStep === 2 && (
              <div className="payment-section">
                <h2>Choisir le mode de paiement</h2>
                
                <div className="payment-methods">
                  {paymentMethods.map((method) => {
                    const Icon = getPaymentIcon(method.id);
                    const fees = calculateFees(subtotal, method.id);
                    
                    return (
                      <div 
                        key={method.id}
                        className={`payment-method ${selectedPayment === method.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <div className="method-icon">
                          <Icon size={24} />
                        </div>
                        <div className="method-info">
                          <h3>{method.name}</h3>
                          <p>{method.description}</p>
                          <div className="method-details">
                            <span>Traitement: {method.processingTime}</span>
                            {fees > 0 && <span>Frais: {fees.toFixed(2)}€</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedPayment === 'card' && (
                  <div className="saved-cards">
                    <h3>Cartes enregistrées</h3>
                    {savedCards.map((card) => (
                      <div key={card.id} className="saved-card">
                        <div className="card-info">
                          <CreditCard size={20} />
                          <span>**** **** **** {card.last4}</span>
                          <span className="card-brand">{card.brand.toUpperCase()}</span>
                          <span>{card.expiryMonth}/{card.expiryYear}</span>
                        </div>
                        {card.isDefault && (
                          <span className="default-badge">Par défaut</span>
                        )}
                      </div>
                    ))}
                    
                    <button className="add-card-btn">
                      <Plus size={20} />
                      Ajouter une nouvelle carte
                    </button>
                  </div>
                )}

                <div className="step-actions">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="btn btn-secondary"
                  >
                    Retour
                  </button>
                  <button 
                    onClick={() => setCurrentStep(3)}
                    className="btn btn-primary"
                  >
                    Continuer vers la confirmation
                  </button>
                </div>
              </div>
            )}

            {/* Étape 3: Confirmation */}
            {currentStep === 3 && (
              <div className="confirmation-section">
                <h2>Confirmer votre commande</h2>
                
                <div className="order-review">
                  <div className="review-section">
                    <h3>Articles commandés</h3>
                    {cartItems.map((item) => (
                      <div key={item.id} className="order-item">
                        <img src={item.image} alt={item.title} />
                        <div className="item-info">
                          <h4>{item.title}</h4>
                          <p>{item.author}</p>
                          <span className="condition">{item.condition}</span>
                        </div>
                        <div className="item-price">
                          {item.price.toFixed(2)}€
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="review-section">
                    <h3>Livraison</h3>
                    <div className="shipping-summary">
                      <div className="method">
                        {shippingMethods.find(m => m.id === selectedShipping)?.name}
                      </div>
                      <div className="delivery-info">
                        Livraison estimée: {estimateDeliveryDate(selectedShipping)}
                      </div>
                      {selectedAddress && (
                        <div className="address-summary">
                          {savedAddresses.find(a => a.id === selectedAddress)?.street}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="review-section">
                    <h3>Paiement</h3>
                    <div className="payment-summary">
                      {paymentMethods.find(m => m.id === selectedPayment)?.name}
                    </div>
                  </div>
                </div>

                <div className="step-actions">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="btn btn-secondary"
                  >
                    Retour
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    className="btn btn-primary"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Traitement...' : `Payer ${total.toFixed(2)}€`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Résumé de commande */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Résumé de la commande</h3>
              
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <span>{item.title}</span>
                    <span>{item.price.toFixed(2)}€</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className="summary-row">
                  <span>Livraison</span>
                  <span>{shippingCost.toFixed(2)}€</span>
                </div>
                {paymentFees > 0 && (
                  <div className="summary-row">
                    <span>Frais de paiement</span>
                    <span>{paymentFees.toFixed(2)}€</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>

              <div className="security-info">
                <Lock size={16} />
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          background: var(--color-background);
          padding: 2rem 0;
        }

        .checkout-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: 0.9rem;
        }

        .checkout-steps {
          display: flex;
          gap: 2rem;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-secondary);
          transition: color 0.3s ease;
        }

        .step.active {
          color: var(--color-primary);
        }

        .step.completed {
          color: var(--color-success);
        }

        .step-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: var(--color-background-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .step.active .step-icon {
          background: var(--color-primary);
          color: white;
        }

        .step.completed .step-icon {
          background: var(--color-success);
          color: white;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }

        .shipping-methods,
        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .shipping-method,
        .payment-method {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border: 2px solid var(--color-border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .shipping-method:hover,
        .payment-method:hover {
          border-color: var(--color-primary-light);
          background: var(--color-primary-light);
        }

        .shipping-method.selected,
        .payment-method.selected {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }

        .method-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 8px;
          background: var(--color-background);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
        }

        .method-info {
          flex: 1;
        }

        .method-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .method-info p {
          margin: 0 0 0.5rem 0;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .method-features {
          display: flex;
          gap: 1rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--color-success);
        }

        .method-details {
          text-align: right;
        }

        .price {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .delivery-time {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .pickup-points {
          margin-top: 1rem;
        }

        .pickup-point {
          padding: 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pickup-point:hover {
          border-color: var(--color-primary-light);
        }

        .pickup-point.selected {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }

        .point-details {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .delivery-addresses {
          margin-top: 1rem;
        }

        .address {
          padding: 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .address:hover {
          border-color: var(--color-primary-light);
        }

        .address.selected {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }

        .default-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: var(--color-primary);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
        }

        .add-address-btn,
        .add-card-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 1rem;
          border: 2px dashed var(--color-border);
          border-radius: 8px;
          background: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-address-btn:hover,
        .add-card-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .saved-cards {
          margin-top: 1rem;
        }

        .saved-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .card-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .card-brand {
          background: var(--color-background-secondary);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .order-review {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .review-section h3 {
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--color-border);
        }

        .order-item img {
          width: 60px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
        }

        .item-info {
          flex: 1;
        }

        .item-info h4 {
          margin: 0 0 0.25rem 0;
        }

        .item-info p {
          margin: 0 0 0.25rem 0;
          color: var(--color-text-secondary);
        }

        .condition {
          background: var(--color-success-light);
          color: var(--color-success);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .item-price {
          font-weight: 600;
          color: var(--color-primary);
        }

        .step-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
        }

        .order-summary {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
          position: sticky;
          top: 2rem;
        }

        .summary-items {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .summary-totals {
          margin-bottom: 1rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .summary-row.total {
          font-weight: 600;
          font-size: 1.1rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--color-border);
          color: var(--color-primary);
        }

        .security-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-success);
          font-size: 0.9rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
        }

        .checkout-success,
        .checkout-empty,
        .checkout-login-required {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-message,
        .empty-cart,
        .login-prompt {
          text-align: center;
          max-width: 500px;
        }

        .success-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background: var(--color-success);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .order-summary {
          background: var(--color-background-secondary);
          border-radius: 8px;
          padding: 1rem;
          margin: 2rem 0;
        }

        .next-steps {
          margin: 2rem 0;
          text-align: left;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--color-success);
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .checkout-content {
            grid-template-columns: 1fr;
          }
          
          .checkout-steps {
            flex-direction: column;
            gap: 1rem;
          }
          
          .step {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;

