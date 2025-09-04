import React, { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'card',
      name: 'Carte bancaire',
      icon: 'CreditCard',
      description: 'Visa, Mastercard, American Express',
      fees: 0,
      processingTime: 'Immédiat'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'Wallet',
      description: 'Paiement sécurisé via PayPal',
      fees: 0.35,
      processingTime: 'Immédiat'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: 'Smartphone',
      description: 'Paiement rapide avec Touch ID',
      fees: 0,
      processingTime: 'Immédiat'
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: 'Smartphone',
      description: 'Paiement rapide avec Android',
      fees: 0,
      processingTime: 'Immédiat'
    },
    {
      id: 'bank_transfer',
      name: 'Virement bancaire',
      icon: 'Building2',
      description: 'Virement SEPA gratuit',
      fees: 0,
      processingTime: '1-2 jours ouvrés'
    }
  ]);

  const [savedCards, setSavedCards] = useState([
    {
      id: 'card_1',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true
    },
    {
      id: 'card_2',
      last4: '5555',
      brand: 'mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ]);

  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: 'pay_1',
      orderId: 'order_123',
      amount: 25.50,
      method: 'card',
      status: 'completed',
      date: new Date('2024-08-15'),
      description: 'Achat de 3 livres'
    },
    {
      id: 'pay_2',
      orderId: 'order_124',
      amount: 12.00,
      method: 'paypal',
      status: 'completed',
      date: new Date('2024-08-14'),
      description: 'Location de "Sapiens"'
    }
  ]);

  const processPayment = async (paymentData) => {
    // Simulation du traitement de paiement
    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = {
          id: `pay_${Date.now()}`,
          ...paymentData,
          status: 'completed',
          date: new Date(),
          transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`
        };
        
        setPaymentHistory(prev => [payment, ...prev]);
        resolve(payment);
      }, 2000);
    });
  };

  const addPaymentMethod = (method) => {
    setSavedCards(prev => [...prev, { ...method, id: `card_${Date.now()}` }]);
  };

  const removePaymentMethod = (methodId) => {
    setSavedCards(prev => prev.filter(card => card.id !== methodId));
  };

  const setDefaultPaymentMethod = (methodId) => {
    setSavedCards(prev => prev.map(card => ({
      ...card,
      isDefault: card.id === methodId
    })));
  };

  const calculateFees = (amount, methodId) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method) return 0;
    
    if (method.fees === 0) return 0;
    return Math.round((amount * method.fees / 100) * 100) / 100;
  };

  const value = {
    paymentMethods,
    savedCards,
    paymentHistory,
    processPayment,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    calculateFees
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

