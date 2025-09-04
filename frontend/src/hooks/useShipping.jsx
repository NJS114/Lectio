import React, { createContext, useContext, useState } from 'react';

const ShippingContext = createContext();

export const useShipping = () => {
  const context = useContext(ShippingContext);
  if (!context) {
    throw new Error('useShipping must be used within a ShippingProvider');
  }
  return context;
};

export const ShippingProvider = ({ children }) => {
  const [shippingMethods, setShippingMethods] = useState([
    {
      id: 'standard',
      name: 'Livraison standard',
      description: 'Colissimo - 2-3 jours ouvrés',
      price: 4.95,
      estimatedDays: '2-3',
      icon: 'Package',
      trackingIncluded: true,
      insuranceIncluded: true,
      maxWeight: 30
    },
    {
      id: 'express',
      name: 'Livraison express',
      description: 'Chronopost - 24h',
      price: 8.95,
      estimatedDays: '1',
      icon: 'Zap',
      trackingIncluded: true,
      insuranceIncluded: true,
      maxWeight: 30
    },
    {
      id: 'pickup_point',
      name: 'Point relais',
      description: 'Mondial Relay - 2-4 jours',
      price: 3.95,
      estimatedDays: '2-4',
      icon: 'MapPin',
      trackingIncluded: true,
      insuranceIncluded: false,
      maxWeight: 20
    },
    {
      id: 'bookstore_pickup',
      name: 'Retrait en librairie',
      description: 'Gratuit - Disponible sous 24h',
      price: 0,
      estimatedDays: '1',
      icon: 'Store',
      trackingIncluded: false,
      insuranceIncluded: false,
      maxWeight: null
    },
    {
      id: 'hand_delivery',
      name: 'Remise en main propre',
      description: 'Gratuit - À convenir avec le vendeur',
      price: 0,
      estimatedDays: 'À convenir',
      icon: 'HandHeart',
      trackingIncluded: false,
      insuranceIncluded: false,
      maxWeight: null
    }
  ]);

  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 'addr_1',
      name: 'Domicile',
      firstName: 'Marie',
      lastName: 'Dupont',
      street: '123 rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      phone: '06 12 34 56 78',
      isDefault: true
    },
    {
      id: 'addr_2',
      name: 'Bureau',
      firstName: 'Marie',
      lastName: 'Dupont',
      street: '45 avenue des Champs-Élysées',
      city: 'Paris',
      postalCode: '75008',
      country: 'France',
      phone: '06 12 34 56 78',
      isDefault: false
    }
  ]);

  const [pickupPoints, setPickupPoints] = useState([
    {
      id: 'pickup_1',
      name: 'Relay Tabac de la Gare',
      address: '12 place de la Gare, 75010 Paris',
      hours: 'Lun-Sam: 7h-20h, Dim: 8h-13h',
      distance: '0.3 km',
      rating: 4.2
    },
    {
      id: 'pickup_2',
      name: 'Point Relais Supermarché',
      address: '89 rue de Rivoli, 75001 Paris',
      hours: 'Lun-Sam: 8h-21h, Dim: 9h-19h',
      distance: '0.8 km',
      rating: 4.5
    },
    {
      id: 'pickup_3',
      name: 'Relay Pressing Central',
      address: '156 boulevard Saint-Germain, 75006 Paris',
      hours: 'Lun-Ven: 8h-19h, Sam: 9h-17h',
      distance: '1.2 km',
      rating: 4.0
    }
  ]);

  const [trackingHistory, setTrackingHistory] = useState({
    'order_123': [
      {
        status: 'ordered',
        date: new Date('2024-08-15T10:00:00'),
        description: 'Commande confirmée',
        location: 'Paris'
      },
      {
        status: 'picked_up',
        date: new Date('2024-08-15T14:30:00'),
        description: 'Colis récupéré par le transporteur',
        location: 'Paris - Centre de tri'
      },
      {
        status: 'in_transit',
        date: new Date('2024-08-16T08:15:00'),
        description: 'En cours de transport',
        location: 'Lyon - Centre de tri'
      },
      {
        status: 'out_for_delivery',
        date: new Date('2024-08-16T09:45:00'),
        description: 'En cours de livraison',
        location: 'Bordeaux - Tournée de livraison'
      }
    ]
  });

  const calculateShippingCost = (items, methodId, address) => {
    const method = shippingMethods.find(m => m.id === methodId);
    if (!method) return 0;

    // Livraison gratuite pour certaines méthodes
    if (method.price === 0) return 0;

    // Calcul basé sur le poids et la distance
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0.5), 0);
    let cost = method.price;

    // Supplément pour poids élevé
    if (totalWeight > 2) {
      cost += Math.ceil((totalWeight - 2) / 0.5) * 0.5;
    }

    // Réduction pour commandes importantes
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    if (totalValue > 50) {
      cost *= 0.8; // 20% de réduction
    }

    return Math.round(cost * 100) / 100;
  };

  const estimateDeliveryDate = (methodId) => {
    const method = shippingMethods.find(m => m.id === methodId);
    if (!method) return null;

    const today = new Date();
    const days = method.estimatedDays;
    
    if (days === 'À convenir') return 'À convenir';
    
    const minDays = parseInt(days.split('-')[0]);
    const maxDays = parseInt(days.split('-')[1] || days);
    
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);
    
    if (minDays === maxDays) {
      return minDate.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    }
    
    return `Entre le ${minDate.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long' 
    })} et le ${maxDate.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long' 
    })}`;
  };

  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: `addr_${Date.now()}`,
      isDefault: savedAddresses.length === 0
    };
    setSavedAddresses(prev => [...prev, newAddress]);
    return newAddress;
  };

  const updateAddress = (addressId, updates) => {
    setSavedAddresses(prev => prev.map(addr => 
      addr.id === addressId ? { ...addr, ...updates } : addr
    ));
  };

  const removeAddress = (addressId) => {
    setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
  };

  const setDefaultAddress = (addressId) => {
    setSavedAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  const trackOrder = (orderId) => {
    return trackingHistory[orderId] || [];
  };

  const updateTracking = (orderId, status, description, location) => {
    setTrackingHistory(prev => ({
      ...prev,
      [orderId]: [
        ...(prev[orderId] || []),
        {
          status,
          date: new Date(),
          description,
          location
        }
      ]
    }));
  };

  const value = {
    shippingMethods,
    savedAddresses,
    pickupPoints,
    calculateShippingCost,
    estimateDeliveryDate,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    trackOrder,
    updateTracking
  };

  return (
    <ShippingContext.Provider value={value}>
      {children}
    </ShippingContext.Provider>
  );
};

