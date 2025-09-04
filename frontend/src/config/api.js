// Configuration des API endpoints pour le backend complet Lectio
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    // Authentification et utilisateurs
    AUTH: {
      LOGIN: '/api/users/login',
      REGISTER: '/api/users/register',
      LOGOUT: '/api/users/logout',
      PROFILE: '/api/users/profile',
      UPDATE_PROFILE: '/api/users/profile'
    },
    
    // Livres physiques
    BOOKS: {
      LIST: '/api/books',
      DETAIL: '/api/books/:id',
      CREATE: '/api/books',
      UPDATE: '/api/books/:id',
      DELETE: '/api/books/:id',
      PURCHASE: '/api/books/:id/purchase',
      PRICE_COMPARISON: '/api/books/price-comparison'
    },
    
    // Ebooks
    EBOOKS: {
      LIST: '/api/ebooks',
      DETAIL: '/api/ebooks/:id',
      CREATE: '/api/ebooks',
      UPDATE: '/api/ebooks/:id',
      DELETE: '/api/ebooks/:id',
      MODERATE: '/api/ebooks/:id/moderate'
    },
    
    // Analytics et métriques
    ANALYTICS: {
      DASHBOARD: '/api/analytics/dashboard/:userId',
      EXPORT_PDF: '/api/analytics/export/pdf/:userId',
      EXPORT_EXCEL: '/api/analytics/export/excel/:userId',
      EXPORT_CSV: '/api/analytics/export/csv/:userId',
      TOP_BOOKS: '/api/analytics/top-books/:userId',
      METRICS: '/api/analytics/metrics/:userId'
    },
    
    // Marketing et promotions
    MARKETING: {
      PROMOTIONS: '/api/marketing/promotions',
      CREATE_PROMOTION: '/api/marketing/promotions',
      UPDATE_PROMOTION: '/api/marketing/promotions/:id',
      DELETE_PROMOTION: '/api/marketing/promotions/:id',
      TOGGLE_PROMOTION: '/api/marketing/promotions/:id/toggle',
      NEWSLETTER: '/api/marketing/newsletter',
      SEND_NEWSLETTER: '/api/marketing/newsletter/send',
      STATS: '/api/marketing/stats/:userId'
    },
    
    // Événements
    EVENTS: {
      LIST: '/api/events',
      DETAIL: '/api/events/:id',
      CREATE: '/api/events',
      UPDATE: '/api/events/:id',
      DELETE: '/api/events/:id',
      REGISTER: '/api/events/:id/register',
      UNREGISTER: '/api/events/:id/unregister',
      MY_EVENTS: '/api/events/my-events/:userId'
    },
    
    // Écosystème et pricing
    ECOSYSTEM: {
      CALCULATE_PRICING: '/api/ecosystem/pricing/calculate',
      COMMISSION_RATES: '/api/ecosystem/commission/rates/:sellerId',
      REVENUE_BREAKDOWN: '/api/ecosystem/revenue/breakdown/:sellerId',
      AFFILIATE_GENERATE: '/api/ecosystem/affiliate/generate-code/:userId',
      AFFILIATE_STATS: '/api/ecosystem/affiliate/stats/:userId',
      PLATFORM_STATS: '/api/ecosystem/platform/stats'
    },
    
    // Librairies (compatibilité)
    BOOKSHOPS: {
      LIST: '/api/events',  // Les événements sont liés aux librairies
      DETAIL: '/api/events',
      EVENTS: '/api/events'
    },
    
    // Administration
    ADMIN: {
      DASHBOARD: '/api/analytics/dashboard/:userId',
      USERS: '/api/users',
      BOOKS: '/api/books',
      EBOOKS: '/api/ebooks',
      EVENTS: '/api/events',
      ANALYTICS: '/api/analytics/dashboard/:userId'
    }
  }
};

// Fonction utilitaire pour construire les URLs
export const buildApiUrl = (endpoint, params = {}) => {
  let url = API_CONFIG.BASE_URL + endpoint;
  
  // Remplacer les paramètres dans l'URL
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// Configuration des headers par défaut
export const getDefaultHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Fonction utilitaire pour les requêtes API
export const apiRequest = async (endpoint, options = {}) => {
  const url = typeof endpoint === 'string' ? buildApiUrl(endpoint) : endpoint;
  
  const config = {
    headers: getDefaultHeaders(),
    ...options
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default API_CONFIG;

