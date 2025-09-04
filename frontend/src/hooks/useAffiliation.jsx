import React, { createContext, useContext, useState, useEffect } from 'react';

const AffiliationContext = createContext();

export const useAffiliation = () => {
  const context = useContext(AffiliationContext);
  if (!context) {
    throw new Error('useAffiliation must be used within an AffiliationProvider');
  }
  return context;
};

export const AffiliationProvider = ({ children }) => {
  const [affiliatePrograms, setAffiliatePrograms] = useState([]);
  const [userAffiliateData, setUserAffiliateData] = useState(null);
  const [affiliateLinks, setAffiliateLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Programmes d'affiliation disponibles
  const availablePrograms = [
    {
      id: 'amazon',
      name: 'Amazon Associates',
      description: 'Programme d\'affiliation d\'Amazon pour les livres et ebooks',
      commission_rate: '4-8%',
      min_payout: 10,
      payment_schedule: 'Mensuel',
      logo: '/api/placeholder/100/50',
      categories: ['Livres', 'Ebooks', 'Audiobooks'],
      requirements: 'Site web actif avec du contenu de qualité',
      approval_time: '1-3 jours',
      features: [
        'Liens de produits directs',
        'Bannières publicitaires',
        'API de produits',
        'Rapports détaillés'
      ]
    },
    {
      id: 'kobo',
      name: 'Kobo Affiliates',
      description: 'Programme d\'affiliation pour les ebooks Kobo',
      commission_rate: '6-10%',
      min_payout: 25,
      payment_schedule: 'Mensuel',
      logo: '/api/placeholder/100/50',
      categories: ['Ebooks', 'Audiobooks'],
      requirements: 'Contenu lié à la lecture',
      approval_time: '2-5 jours',
      features: [
        'Liens d\'ebooks',
        'Widgets de recommandation',
        'Tracking avancé',
        'Support dédié'
      ]
    },
    {
      id: 'fnac',
      name: 'Fnac Darty Affiliés',
      description: 'Programme d\'affiliation Fnac pour livres et culture',
      commission_rate: '3-7%',
      min_payout: 20,
      payment_schedule: 'Mensuel',
      logo: '/api/placeholder/100/50',
      categories: ['Livres', 'Ebooks', 'Culture'],
      requirements: 'Site français avec trafic qualifié',
      approval_time: '3-7 jours',
      features: [
        'Catalogue complet',
        'Outils de promotion',
        'Statistiques en temps réel',
        'Support français'
      ]
    },
    {
      id: 'gumroad',
      name: 'Gumroad Affiliates',
      description: 'Plateforme pour vendre et promouvoir des produits numériques',
      commission_rate: '10-50%',
      min_payout: 10,
      payment_schedule: 'Hebdomadaire',
      logo: '/api/placeholder/100/50',
      categories: ['Ebooks', 'Cours', 'Logiciels'],
      requirements: 'Aucune restriction',
      approval_time: 'Immédiat',
      features: [
        'Commission élevée',
        'Paiement rapide',
        'Outils de marketing',
        'Analytics détaillés'
      ]
    }
  ];

  useEffect(() => {
    setAffiliatePrograms(availablePrograms);
    
    // Simulation de données utilisateur d'affiliation
    setUserAffiliateData({
      id: 'user-affiliate-123',
      status: 'active',
      join_date: new Date('2024-01-15'),
      total_earnings: 1247.85,
      monthly_earnings: 234.50,
      pending_earnings: 89.30,
      total_clicks: 5678,
      total_conversions: 234,
      conversion_rate: 4.12,
      active_programs: ['amazon', 'kobo', 'gumroad'],
      payment_info: {
        method: 'bank_transfer',
        account: 'FR76 1234 5678 9012 3456 7890 123',
        next_payment: new Date('2024-09-01')
      }
    });
  }, []);

  const joinProgram = async (programId) => {
    setIsLoading(true);
    
    // Simulation de demande d'adhésion
    setTimeout(() => {
      setUserAffiliateData(prev => ({
        ...prev,
        active_programs: [...prev.active_programs, programId]
      }));
      setIsLoading(false);
    }, 2000);

    return {
      success: true,
      message: 'Demande d\'adhésion envoyée avec succès',
      approval_time: '1-7 jours'
    };
  };

  const createAffiliateLink = async (productId, programId, customParams = {}) => {
    setIsLoading(true);
    
    const newLink = {
      id: `link-${Date.now()}`,
      product_id: productId,
      program_id: programId,
      url: generateAffiliateUrl(productId, programId, customParams),
      short_url: generateShortUrl(),
      created_date: new Date(),
      clicks: 0,
      conversions: 0,
      earnings: 0,
      status: 'active',
      custom_params: customParams
    };

    setTimeout(() => {
      setAffiliateLinks(prev => [newLink, ...prev]);
      setIsLoading(false);
    }, 1000);

    return newLink;
  };

  const generateAffiliateUrl = (productId, programId, customParams) => {
    const baseUrls = {
      amazon: 'https://amazon.fr/dp/',
      kobo: 'https://kobo.com/ebook/',
      fnac: 'https://fnac.com/livre/',
      gumroad: 'https://gumroad.com/l/'
    };

    const affiliateIds = {
      amazon: 'lectio-21',
      kobo: 'lectio',
      fnac: 'lectio',
      gumroad: 'lectio'
    };

    const baseUrl = baseUrls[programId];
    const affiliateId = affiliateIds[programId];
    
    let url = `${baseUrl}${productId}?ref=${affiliateId}`;
    
    // Ajout des paramètres personnalisés
    Object.entries(customParams).forEach(([key, value]) => {
      url += `&${key}=${encodeURIComponent(value)}`;
    });

    return url;
  };

  const generateShortUrl = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `https://lect.io/${result}`;
  };

  const trackClick = async (linkId) => {
    // Simulation de tracking de clic
    setAffiliateLinks(prev => prev.map(link => 
      link.id === linkId 
        ? { ...link, clicks: link.clicks + 1 }
        : link
    ));

    return {
      success: true,
      click_id: `click-${Date.now()}`,
      timestamp: new Date()
    };
  };

  const trackConversion = async (linkId, amount) => {
    // Simulation de tracking de conversion
    const commission_rate = 0.07; // 7% par défaut
    const earnings = amount * commission_rate;

    setAffiliateLinks(prev => prev.map(link => 
      link.id === linkId 
        ? { 
            ...link, 
            conversions: link.conversions + 1,
            earnings: link.earnings + earnings
          }
        : link
    ));

    setUserAffiliateData(prev => ({
      ...prev,
      total_earnings: prev.total_earnings + earnings,
      pending_earnings: prev.pending_earnings + earnings,
      total_conversions: prev.total_conversions + 1
    }));

    return {
      success: true,
      conversion_id: `conv-${Date.now()}`,
      earnings: earnings,
      timestamp: new Date()
    };
  };

  const getAffiliateStats = (period = 'month') => {
    // Simulation de statistiques d'affiliation
    const stats = {
      day: {
        clicks: 45,
        conversions: 3,
        earnings: 12.50,
        conversion_rate: 6.67
      },
      week: {
        clicks: 234,
        conversions: 12,
        earnings: 89.30,
        conversion_rate: 5.13
      },
      month: {
        clicks: 1247,
        conversions: 67,
        earnings: 234.50,
        conversion_rate: 5.37
      },
      year: {
        clicks: 12456,
        conversions: 567,
        earnings: 1247.85,
        conversion_rate: 4.55
      }
    };

    return stats[period] || stats.month;
  };

  const getTopPerformingLinks = (limit = 10) => {
    return affiliateLinks
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, limit);
  };

  const generatePromotionalContent = (productId, type = 'banner') => {
    // Génération de contenu promotionnel
    const content = {
      banner: {
        html: `<div class="affiliate-banner">
          <img src="/api/placeholder/300/100" alt="Promotion" />
          <a href="#" class="affiliate-link">Découvrir maintenant</a>
        </div>`,
        css: `.affiliate-banner { 
          display: flex; 
          align-items: center; 
          gap: 1rem; 
          padding: 1rem; 
          border: 1px solid #ddd; 
          border-radius: 8px; 
        }`
      },
      text: {
        content: `Découvrez ce livre exceptionnel que je recommande vivement ! 
        [Lien d'affiliation - je peux recevoir une commission]`,
        cta: 'Voir le livre'
      },
      widget: {
        html: `<div class="book-widget">
          <div class="book-cover">
            <img src="/api/placeholder/150/200" alt="Couverture" />
          </div>
          <div class="book-info">
            <h3>Titre du livre</h3>
            <p>Par Auteur</p>
            <div class="price">19.99€</div>
            <a href="#" class="buy-button">Acheter maintenant</a>
          </div>
        </div>`
      }
    };

    return content[type] || content.banner;
  };

  const value = {
    affiliatePrograms,
    userAffiliateData,
    affiliateLinks,
    isLoading,
    joinProgram,
    createAffiliateLink,
    trackClick,
    trackConversion,
    getAffiliateStats,
    getTopPerformingLinks,
    generatePromotionalContent
  };

  return (
    <AffiliationContext.Provider value={value}>
      {children}
    </AffiliationContext.Provider>
  );
};

export default AffiliationProvider;

