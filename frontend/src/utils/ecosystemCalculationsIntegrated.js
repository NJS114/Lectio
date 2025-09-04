// Calculs de l'écosystème Lectio avec intégration API
import { buildApiUrl, apiRequest } from '../config/api';

// Calculs locaux (fallback)
const calculateLocalPricing = (basePrice, type = 'sale') => {
  const price = parseFloat(basePrice) || 0;
  
  // Commission plateforme : 20%
  const platformCommission = price * 0.20;
  
  // Frais fixes
  const shippingFee = 3.50;
  const handlingFee = 1.50;
  
  // Prix final pour l'acheteur
  const finalPrice = price + platformCommission + shippingFee + handlingFee;
  
  // Revenus pour le vendeur (prix de base)
  const sellerRevenue = price;
  
  // Revenus pour Lectio
  const lectioRevenue = platformCommission + shippingFee + handlingFee;
  
  return {
    basePrice: price,
    platformCommission,
    shippingFee,
    handlingFee,
    finalPrice,
    sellerRevenue,
    lectioRevenue,
    breakdown: {
      'Prix de base': `${price.toFixed(2)}€`,
      'Commission (20%)': `${platformCommission.toFixed(2)}€`,
      'Frais d\'expédition': `${shippingFee.toFixed(2)}€`,
      'Frais de gestion': `${handlingFee.toFixed(2)}€`,
      'Total acheteur': `${finalPrice.toFixed(2)}€`,
      'Revenu vendeur': `${sellerRevenue.toFixed(2)}€`,
      'Revenu Lectio': `${lectioRevenue.toFixed(2)}€`
    }
  };
};

// Calculs avec API backend
export const calculateEcosystemPricing = async (basePrice, type = 'sale') => {
  try {
    const response = await apiRequest('/api/ecosystem/calculate-pricing', {
      method: 'POST',
      body: JSON.stringify({
        base_price: basePrice,
        type: type
      })
    });
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error('Erreur API');
    }
  } catch (error) {
    console.error('Erreur lors du calcul des prix, utilisation du fallback:', error);
    return calculateLocalPricing(basePrice, type);
  }
};

const calculateLocalRentalPricing = (basePricePerDay, weeks = 2) => {
  const dailyPrice = parseFloat(basePricePerDay) || 0;
  const days = weeks * 7;
  const baseRentalPrice = dailyPrice * days;
  
  // Commission plateforme : 20%
  const platformCommission = baseRentalPrice * 0.20;
  
  // Frais fixes pour location
  const shippingFee = 3.50; // Aller
  const returnShippingFee = 3.50; // Retour
  const handlingFee = 2.00; // Gestion location
  
  const totalFees = shippingFee + returnShippingFee + handlingFee;
  
  // Prix final pour le locataire
  const finalPrice = baseRentalPrice + platformCommission + totalFees;
  
  // Revenus pour le propriétaire
  const ownerRevenue = baseRentalPrice;
  
  // Revenus pour Lectio
  const lectioRevenue = platformCommission + totalFees;
  
  return {
    baseRentalPrice,
    weeks,
    days,
    platformCommission,
    shippingFee,
    returnShippingFee,
    handlingFee,
    finalPrice,
    ownerRevenue,
    lectioRevenue,
    breakdown: {
      'Prix location base': `${baseRentalPrice.toFixed(2)}€`,
      'Commission (20%)': `${platformCommission.toFixed(2)}€`,
      'Expédition aller': `${shippingFee.toFixed(2)}€`,
      'Expédition retour': `${returnShippingFee.toFixed(2)}€`,
      'Frais de gestion': `${handlingFee.toFixed(2)}€`,
      'Total locataire': `${finalPrice.toFixed(2)}€`,
      'Revenu propriétaire': `${ownerRevenue.toFixed(2)}€`,
      'Revenu Lectio': `${lectioRevenue.toFixed(2)}€`
    }
  };
};

export const calculateRentalPricing = async (basePricePerDay, weeks = 2) => {
  try {
    const response = await apiRequest('/api/ecosystem/calculate-rental', {
      method: 'POST',
      body: JSON.stringify({
        base_price_per_day: basePricePerDay,
        weeks: weeks
      })
    });
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error('Erreur API');
    }
  } catch (error) {
    console.error('Erreur lors du calcul de location, utilisation du fallback:', error);
    return calculateLocalRentalPricing(basePricePerDay, weeks);
  }
};

const calculateLocalAffiliateCommission = (saleAmount, affiliateRate = 0.05) => {
  const amount = parseFloat(saleAmount) || 0;
  const commission = amount * affiliateRate;
  
  return {
    saleAmount: amount,
    affiliateRate: affiliateRate * 100, // En pourcentage
    commission,
    breakdown: {
      'Montant de la vente': `${amount.toFixed(2)}€`,
      'Taux d\'affiliation': `${(affiliateRate * 100).toFixed(1)}%`,
      'Commission affilié': `${commission.toFixed(2)}€`
    }
  };
};

export const calculateAffiliateCommission = async (saleAmount, affiliateRate = 0.05) => {
  try {
    const response = await apiRequest('/api/ecosystem/calculate-affiliate', {
      method: 'POST',
      body: JSON.stringify({
        sale_amount: saleAmount,
        affiliate_rate: affiliateRate
      })
    });
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error('Erreur API');
    }
  } catch (error) {
    console.error('Erreur lors du calcul d\'affiliation, utilisation du fallback:', error);
    return calculateLocalAffiliateCommission(saleAmount, affiliateRate);
  }
};

// Fonction pour générer un lien d'affiliation
export const generateAffiliateLink = async (userId, productId, productType = 'book') => {
  try {
    const response = await apiRequest('/api/ecosystem/generate-affiliate-link', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
        product_type: productType
      })
    });
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error('Erreur lors de la génération du lien d\'affiliation');
    }
  } catch (error) {
    console.error('Erreur lors de la génération du lien d\'affiliation:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour tracker une vente d'affiliation
export const trackAffiliateSale = async (affiliateCode, saleData) => {
  try {
    const response = await apiRequest('/api/ecosystem/track-affiliate-sale', {
      method: 'POST',
      body: JSON.stringify({
        affiliate_code: affiliateCode,
        ...saleData
      })
    });
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error('Erreur lors du tracking de la vente d\'affiliation');
    }
  } catch (error) {
    console.error('Erreur lors du tracking de la vente d\'affiliation:', error);
    return { success: false, error: error.message };
  }
};

