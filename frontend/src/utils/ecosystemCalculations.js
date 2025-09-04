// Configuration de l'écosystème Lectio
export const ECOSYSTEM_CONFIG = {
  COMMISSION_RATE: 0.20, // 20% de commission
  RENTAL_PERIOD_DAYS: 14, // Location par périodes de 2 semaines
  SHIPPING_COST: 3.50, // Coût d'expédition estimé
  HANDLING_FEE: 1.50, // Frais de gestion
  MIN_RENTAL_PRICE: 5.00, // Prix minimum de location pour 2 semaines
  MIN_SALE_PRICE: 2.00, // Prix minimum de vente
  AFFILIATE_COMMISSION_RATE: 0.05, // 5% de commission d'affiliation
  PLATFORM_FEE: 0.50 // Frais de plateforme fixe
};

/**
 * Calcule les prix et commissions pour l'écosystème Lectio
 * @param {number} userSalePrice - Prix de vente souhaité par l'utilisateur
 * @param {number} userRentalPrice - Prix de location souhaité par l'utilisateur (2 semaines)
 * @param {boolean} hasAffiliate - Si la vente provient d'un lien d'affiliation
 * @returns {Object} Calculs détaillés pour vente et location
 */
export const calculateEcosystemPricing = (userSalePrice = 0, userRentalPrice = 0, hasAffiliate = false) => {
  const salePrice = parseFloat(userSalePrice) || 0;
  const rentalPrice = parseFloat(userRentalPrice) || 0;
  
  // Calculs pour la vente
  const saleCommission = salePrice * ECOSYSTEM_CONFIG.COMMISSION_RATE;
  const affiliateCommission = hasAffiliate ? salePrice * ECOSYSTEM_CONFIG.AFFILIATE_COMMISSION_RATE : 0;
  const saleTotalCosts = saleCommission + ECOSYSTEM_CONFIG.SHIPPING_COST + ECOSYSTEM_CONFIG.HANDLING_FEE + ECOSYSTEM_CONFIG.PLATFORM_FEE + affiliateCommission;
  const saleUserReceives = Math.max(0, salePrice - saleTotalCosts);
  const saleFinalPrice = salePrice + saleTotalCosts; // Prix affiché à l'acheteur
  
  // Calculs pour la location (2 semaines)
  const rentalCommission = rentalPrice * ECOSYSTEM_CONFIG.COMMISSION_RATE;
  const rentalAffiliateCommission = hasAffiliate ? rentalPrice * ECOSYSTEM_CONFIG.AFFILIATE_COMMISSION_RATE : 0;
  const rentalShippingCost = ECOSYSTEM_CONFIG.SHIPPING_COST * 2; // Aller-retour
  const rentalTotalCosts = rentalCommission + rentalShippingCost + ECOSYSTEM_CONFIG.HANDLING_FEE + ECOSYSTEM_CONFIG.PLATFORM_FEE + rentalAffiliateCommission;
  const rentalUserReceives = Math.max(0, rentalPrice - rentalTotalCosts);
  const rentalFinalPrice = rentalPrice + rentalTotalCosts; // Prix affiché au locataire
  
  return {
    sale: {
      userPrice: salePrice,
      commission: saleCommission,
      affiliateCommission: affiliateCommission,
      shipping: ECOSYSTEM_CONFIG.SHIPPING_COST,
      handling: ECOSYSTEM_CONFIG.HANDLING_FEE,
      platformFee: ECOSYSTEM_CONFIG.PLATFORM_FEE,
      totalCosts: saleTotalCosts,
      userReceives: saleUserReceives,
      finalPrice: saleFinalPrice,
      profitMargin: salePrice > 0 ? (saleUserReceives / salePrice) * 100 : 0
    },
    rental: {
      userPrice: rentalPrice,
      commission: rentalCommission,
      affiliateCommission: rentalAffiliateCommission,
      shipping: rentalShippingCost,
      handling: ECOSYSTEM_CONFIG.HANDLING_FEE,
      platformFee: ECOSYSTEM_CONFIG.PLATFORM_FEE,
      totalCosts: rentalTotalCosts,
      userReceives: rentalUserReceives,
      finalPrice: rentalFinalPrice,
      profitMargin: rentalPrice > 0 ? (rentalUserReceives / rentalPrice) * 100 : 0,
      periodDays: ECOSYSTEM_CONFIG.RENTAL_PERIOD_DAYS
    },
    ecosystem: {
      totalRevenue: saleTotalCosts + rentalTotalCosts,
      commissionRevenue: saleCommission + rentalCommission,
      affiliateRevenue: affiliateCommission + rentalAffiliateCommission,
      shippingRevenue: ECOSYSTEM_CONFIG.SHIPPING_COST + rentalShippingCost,
      handlingRevenue: ECOSYSTEM_CONFIG.HANDLING_FEE * 2,
      platformRevenue: ECOSYSTEM_CONFIG.PLATFORM_FEE * 2
    }
  };
};

/**
 * Calcule le prix recommandé basé sur l'état du livre et la catégorie
 * @param {string} condition - État du livre (new, very_good, good, fair)
 * @param {string} category - Catégorie du livre
 * @param {number} originalPrice - Prix original du livre (optionnel)
 * @returns {Object} Prix recommandés pour vente et location
 */
export const calculateRecommendedPricing = (condition, category, originalPrice = null) => {
  // Facteurs de dépréciation selon l'état
  const conditionFactors = {
    new: 0.85,
    very_good: 0.70,
    good: 0.55,
    fair: 0.40
  };
  
  // Facteurs selon la catégorie
  const categoryFactors = {
    'Roman': 0.8,
    'Science-Fiction': 0.85,
    'Fantasy': 0.85,
    'Thriller': 0.8,
    'Informatique': 0.9,
    'Sciences': 0.9,
    'Développement personnel': 0.85,
    'Économie': 0.85,
    'Art': 0.9,
    'Jeunesse': 0.7,
    'Bande dessinée': 0.75,
    'Manga': 0.8
  };
  
  const conditionFactor = conditionFactors[condition] || 0.6;
  const categoryFactor = categoryFactors[category] || 0.75;
  
  // Prix de base estimé si pas de prix original fourni
  const basePrice = originalPrice || 15; // Prix moyen d'un livre
  
  const recommendedSalePrice = Math.max(
    ECOSYSTEM_CONFIG.MIN_SALE_PRICE,
    Math.round((basePrice * conditionFactor * categoryFactor) * 100) / 100
  );
  
  const recommendedRentalPrice = Math.max(
    ECOSYSTEM_CONFIG.MIN_RENTAL_PRICE,
    Math.round((recommendedSalePrice * 0.3) * 100) / 100 // 30% du prix de vente pour 2 semaines
  );
  
  return {
    sale: recommendedSalePrice,
    rental: recommendedRentalPrice,
    factors: {
      condition: conditionFactor,
      category: categoryFactor,
      basePrice: basePrice
    }
  };
};

/**
 * Valide les prix selon les règles de l'écosystème
 * @param {number} salePrice - Prix de vente
 * @param {number} rentalPrice - Prix de location
 * @returns {Object} Résultat de validation avec erreurs éventuelles
 */
export const validateEcosystemPricing = (salePrice, rentalPrice) => {
  const errors = {};
  const warnings = [];
  
  if (salePrice && salePrice < ECOSYSTEM_CONFIG.MIN_SALE_PRICE) {
    errors.salePrice = `Le prix de vente doit être d'au moins ${ECOSYSTEM_CONFIG.MIN_SALE_PRICE}€`;
  }
  
  if (rentalPrice && rentalPrice < ECOSYSTEM_CONFIG.MIN_RENTAL_PRICE) {
    errors.rentalPrice = `Le prix de location doit être d'au moins ${ECOSYSTEM_CONFIG.MIN_RENTAL_PRICE}€ pour 2 semaines`;
  }
  
  // Vérifications de cohérence
  if (salePrice && rentalPrice) {
    const rentalToSaleRatio = rentalPrice / salePrice;
    
    if (rentalToSaleRatio > 0.5) {
      warnings.push('Le prix de location semble élevé par rapport au prix de vente');
    }
    
    if (rentalToSaleRatio < 0.1) {
      warnings.push('Le prix de location semble très bas par rapport au prix de vente');
    }
  }
  
  // Vérifier la rentabilité pour l'utilisateur
  const calculations = calculateEcosystemPricing(salePrice, rentalPrice);
  
  if (calculations.sale.userReceives < 1 && salePrice > 0) {
    warnings.push('Avec ce prix de vente, vos revenus nets seront très faibles');
  }
  
  if (calculations.rental.userReceives < 1 && rentalPrice > 0) {
    warnings.push('Avec ce prix de location, vos revenus nets seront très faibles');
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    calculations
  };
};

/**
 * Formate un prix pour l'affichage
 * @param {number} price - Prix à formater
 * @param {string} currency - Devise (par défaut €)
 * @returns {string} Prix formaté
 */
export const formatPrice = (price, currency = '€') => {
  if (typeof price !== 'number' || isNaN(price)) {
    return `0.00${currency}`;
  }
  return `${price.toFixed(2)}${currency}`;
};

/**
 * Calcule les revenus mensuels estimés pour un livre
 * @param {Object} calculations - Calculs de l'écosystème
 * @param {number} estimatedSalesPerMonth - Ventes estimées par mois
 * @param {number} estimatedRentalsPerMonth - Locations estimées par mois
 * @returns {Object} Revenus mensuels estimés
 */
export const calculateMonthlyRevenue = (calculations, estimatedSalesPerMonth = 1, estimatedRentalsPerMonth = 2) => {
  const saleRevenue = calculations.sale.userReceives * estimatedSalesPerMonth;
  const rentalRevenue = calculations.rental.userReceives * estimatedRentalsPerMonth;
  const totalRevenue = saleRevenue + rentalRevenue;
  
  return {
    sale: saleRevenue,
    rental: rentalRevenue,
    total: totalRevenue,
    estimates: {
      sales: estimatedSalesPerMonth,
      rentals: estimatedRentalsPerMonth
    }
  };
};

export default {
  ECOSYSTEM_CONFIG,
  calculateEcosystemPricing,
  calculateRecommendedPricing,
  validateEcosystemPricing,
  formatPrice,
  calculateMonthlyRevenue
};

