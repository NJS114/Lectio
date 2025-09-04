import React, { createContext, useContext, useState, useEffect } from 'react';

const EbooksContext = createContext();

export const useEbooks = () => {
  const context = useContext(EbooksContext);
  if (!context) {
    throw new Error('useEbooks must be used within an EbooksProvider');
  }
  return context;
};

export const EbooksProvider = ({ children }) => {
  const [ebooks, setEbooks] = useState([]);
  const [userEbooks, setUserEbooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Données d'exemple d'ebooks
  const sampleEbooks = [
    {
      id: 'ebook-1',
      title: 'Guide du Marketing Digital',
      author: 'Sophie Martin',
      description: 'Un guide complet pour maîtriser le marketing digital en 2024. Stratégies, outils et techniques pour développer votre présence en ligne.',
      category: 'Business',
      price: 19.99,
      originalPrice: 29.99,
      discount: 33,
      format: 'PDF + EPUB',
      pages: 250,
      language: 'Français',
      publishDate: new Date('2024-01-15'),
      rating: 4.8,
      reviews: 127,
      cover: '/api/placeholder/300/400',
      preview: '/api/placeholder/600/800',
      fileSize: '15.2 MB',
      isbn: '978-2-123456-78-9',
      tags: ['Marketing', 'Digital', 'Business', 'Stratégie'],
      tableOfContents: [
        'Introduction au Marketing Digital',
        'Stratégies de Contenu',
        'SEO et Référencement',
        'Réseaux Sociaux',
        'Email Marketing',
        'Analytics et Mesure'
      ],
      author_info: {
        name: 'Sophie Martin',
        bio: 'Experte en marketing digital avec 10 ans d\'expérience',
        avatar: '/api/placeholder/100/100',
        social: {
          linkedin: 'https://linkedin.com/in/sophiemartin',
          twitter: 'https://twitter.com/sophiemartin'
        }
      },
      affiliate_links: [
        {
          platform: 'Amazon Kindle',
          url: 'https://amazon.fr/dp/B123456789',
          commission: 7,
          price: 19.99
        },
        {
          platform: 'Kobo',
          url: 'https://kobo.com/ebook/guide-marketing-digital',
          commission: 10,
          price: 19.99
        }
      ],
      sales_stats: {
        total_sales: 1247,
        monthly_sales: 89,
        revenue: 24953.53,
        affiliate_earnings: 1746.75
      }
    },
    {
      id: 'ebook-2',
      title: 'Développement Web Moderne',
      author: 'Thomas Dubois',
      description: 'Apprenez React, Node.js et les technologies modernes du développement web. De débutant à expert en 300 pages.',
      category: 'Informatique',
      price: 24.99,
      originalPrice: 34.99,
      discount: 29,
      format: 'PDF + Code source',
      pages: 320,
      language: 'Français',
      publishDate: new Date('2024-02-20'),
      rating: 4.9,
      reviews: 203,
      cover: '/api/placeholder/300/400',
      preview: '/api/placeholder/600/800',
      fileSize: '28.7 MB',
      isbn: '978-2-987654-32-1',
      tags: ['React', 'Node.js', 'JavaScript', 'Web Development'],
      tableOfContents: [
        'Fondamentaux du Web',
        'HTML5 et CSS3 Avancés',
        'JavaScript ES6+',
        'React et Hooks',
        'Node.js et Express',
        'Bases de données',
        'Déploiement'
      ],
      author_info: {
        name: 'Thomas Dubois',
        bio: 'Développeur Full-Stack et formateur',
        avatar: '/api/placeholder/100/100',
        social: {
          github: 'https://github.com/thomasdubois',
          linkedin: 'https://linkedin.com/in/thomasdubois'
        }
      },
      affiliate_links: [
        {
          platform: 'Gumroad',
          url: 'https://gumroad.com/l/dev-web-moderne',
          commission: 15,
          price: 24.99
        },
        {
          platform: 'Udemy',
          url: 'https://udemy.com/course/dev-web-moderne',
          commission: 50,
          price: 49.99
        }
      ],
      sales_stats: {
        total_sales: 892,
        monthly_sales: 67,
        revenue: 22279.08,
        affiliate_earnings: 3341.86
      }
    },
    {
      id: 'ebook-3',
      title: 'Python pour les Débutants - Guide Complet 2024',
      author: 'Jean-Pierre Dubois',
      description: 'Apprenez Python de zéro avec ce guide complet et pratique. 200 pages d\'exercices, projets concrets et explications détaillées pour maîtriser la programmation Python. Parfait pour les débutants qui veulent apprendre efficacement.',
      category: 'Informatique',
      price: 18.99,
      originalPrice: 26.99,
      discount: 30,
      format: 'PDF + Code source',
      pages: 200,
      language: 'Français',
      publishDate: new Date('2024-03-01'),
      rating: 4.7,
      reviews: 89,
      cover: '/api/placeholder/300/400',
      preview: '/api/placeholder/600/800',
      fileSize: '22.1 MB',
      isbn: '978-2-456789-12-3',
      tags: ['Python', 'Programmation', 'Débutant', 'Exercices', 'Projets'],
      tableOfContents: [
        'Introduction à Python',
        'Variables et Types de Données',
        'Structures de Contrôle',
        'Fonctions et Modules',
        'Programmation Orientée Objet',
        'Gestion des Fichiers',
        'Projets Pratiques'
      ],
      author_info: {
        name: 'Jean-Pierre Dubois',
        bio: 'Développeur Python avec 12 ans d\'expérience et formateur passionné',
        avatar: '/api/placeholder/100/100',
        social: {
          github: 'https://github.com/jpdubois',
          linkedin: 'https://linkedin.com/in/jpdubois'
        }
      },
      affiliate_links: [
        {
          platform: 'Gumroad',
          url: 'https://gumroad.com/l/python-debutants-2024',
          commission: 15,
          price: 18.99
        },
        {
          platform: 'Udemy',
          url: 'https://udemy.com/course/python-debutants-complet',
          commission: 50,
          price: 39.99
        }
      ],
      sales_stats: {
        total_sales: 234,
        monthly_sales: 45,
        revenue: 4444.66,
        affiliate_earnings: 666.70
      }
    },
    {
      id: 'ebook-4',
      title: 'Maîtriser React et Next.js',
      author: 'Sophie Moreau',
      description: 'Guide avancé pour développer des applications web modernes avec React et Next.js. Hooks, SSR, optimisation des performances et déploiement.',
      category: 'Informatique',
      price: 22.99,
      originalPrice: 32.99,
      discount: 30,
      format: 'PDF + EPUB + Code',
      pages: 280,
      language: 'Français',
      publishDate: new Date('2024-02-15'),
      rating: 4.9,
      reviews: 156,
      cover: '/api/placeholder/300/400',
      preview: '/api/placeholder/600/800',
      fileSize: '31.5 MB',
      isbn: '978-2-789123-45-6',
      tags: ['React', 'Next.js', 'JavaScript', 'Frontend', 'SSR'],
      tableOfContents: [
        'Fondamentaux de React',
        'Hooks Avancés',
        'Introduction à Next.js',
        'Server-Side Rendering',
        'Optimisation des Performances',
        'Déploiement et Production'
      ],
      author_info: {
        name: 'Sophie Moreau',
        bio: 'Lead Developer Frontend et experte React/Next.js',
        avatar: '/api/placeholder/100/100',
        social: {
          github: 'https://github.com/sophiemoreau',
          twitter: 'https://twitter.com/sophiemoreau'
        }
      },
      affiliate_links: [
        {
          platform: 'Amazon Kindle',
          url: 'https://amazon.fr/dp/B987654321',
          commission: 7,
          price: 22.99
        }
      ],
      sales_stats: {
        total_sales: 567,
        monthly_sales: 78,
        revenue: 13024.33,
        affiliate_earnings: 912.70
      }
    }
  ];

  useEffect(() => {
    // Simulation de chargement des ebooks
    setIsLoading(true);
    setTimeout(() => {
      setEbooks(sampleEbooks);
      setIsLoading(false);
    }, 1000);
  }, []);

  const createEbook = async (ebookData) => {
    setIsLoading(true);
    
    // Simulation de création d'ebook
    const newEbook = {
      id: `ebook-${Date.now()}`,
      ...ebookData,
      publishDate: new Date(),
      rating: 0,
      reviews: 0,
      sales_stats: {
        total_sales: 0,
        monthly_sales: 0,
        revenue: 0,
        affiliate_earnings: 0
      }
    };

    setTimeout(() => {
      setEbooks(prev => [newEbook, ...prev]);
      setUserEbooks(prev => [newEbook, ...prev]);
      setIsLoading(false);
    }, 2000);

    return newEbook;
  };

  const updateEbook = async (ebookId, updates) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setEbooks(prev => prev.map(ebook => 
        ebook.id === ebookId ? { ...ebook, ...updates } : ebook
      ));
      setUserEbooks(prev => prev.map(ebook => 
        ebook.id === ebookId ? { ...ebook, ...updates } : ebook
      ));
      setIsLoading(false);
    }, 1000);
  };

  const deleteEbook = async (ebookId) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setEbooks(prev => prev.filter(ebook => ebook.id !== ebookId));
      setUserEbooks(prev => prev.filter(ebook => ebook.id !== ebookId));
      setIsLoading(false);
    }, 1000);
  };

  const getEbookById = (id) => {
    return ebooks.find(ebook => ebook.id === id);
  };

  const searchEbooks = (query, filters = {}) => {
    let filtered = ebooks;

    // Recherche par titre/auteur
    if (query) {
      filtered = filtered.filter(ebook => 
        ebook.title.toLowerCase().includes(query.toLowerCase()) ||
        ebook.author.toLowerCase().includes(query.toLowerCase()) ||
        ebook.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Filtres par catégorie
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(ebook => ebook.category === filters.category);
    }

    // Filtres par prix
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(ebook => ebook.price >= min && ebook.price <= max);
    }

    // Tri
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
          break;
        case 'popular':
          filtered.sort((a, b) => b.sales_stats.total_sales - a.sales_stats.total_sales);
          break;
        default:
          break;
      }
    }

    return filtered;
  };

  const generateAffiliateLink = (ebookId, platform, userId) => {
    // Génération d'un lien d'affiliation unique
    const baseUrl = window.location.origin;
    const affiliateCode = `${userId}-${ebookId}-${platform}`.replace(/[^a-zA-Z0-9]/g, '');
    return `${baseUrl}/affiliate/${affiliateCode}`;
  };

  const trackAffiliateClick = (affiliateCode) => {
    // Simulation de tracking des clics d'affiliation
    console.log(`Affiliate click tracked: ${affiliateCode}`);
    
    // Ici on pourrait envoyer les données à un service d'analytics
    return {
      success: true,
      clickId: `click-${Date.now()}`,
      timestamp: new Date()
    };
  };

  const getAffiliateStats = (userId) => {
    // Simulation de statistiques d'affiliation
    return {
      total_clicks: 1247,
      total_conversions: 89,
      conversion_rate: 7.14,
      total_earnings: 1746.75,
      monthly_earnings: 234.50,
      top_performing_ebooks: [
        { id: 'ebook-1', title: 'Guide du Marketing Digital', earnings: 892.30 },
        { id: 'ebook-2', title: 'Développement Web Moderne', earnings: 654.20 }
      ]
    };
  };

  const value = {
    ebooks,
    userEbooks,
    isLoading,
    createEbook,
    updateEbook,
    deleteEbook,
    getEbookById,
    searchEbooks,
    generateAffiliateLink,
    trackAffiliateClick,
    getAffiliateStats
  };

  return (
    <EbooksContext.Provider value={value}>
      {children}
    </EbooksContext.Provider>
  );
};

export default EbooksProvider;

