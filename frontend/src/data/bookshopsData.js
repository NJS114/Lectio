// Données enrichies des libraires partenaires
export const bookshopsData = [
  {
    id: 1,
    name: "Librairie Mollat",
    slug: "mollat-bordeaux",
    type: "Librairie généraliste",
    specialties: ["Littérature générale", "Sciences humaines", "Beaux-arts", "Jeunesse"],
    city: "Bordeaux",
    address: "15 rue Vital Carles, 33000 Bordeaux",
    phone: "05 56 56 40 40",
    email: "contact@mollat.com",
    website: "https://www.mollat.com",
    description: "Fondée en 1896, la Librairie Mollat est la plus grande librairie indépendante de France. Véritable institution bordelaise, elle propose plus de 100 000 références dans un espace de 2 500 m² répartis sur 4 étages.",
    story: "Depuis plus de 125 ans, la famille Mollat perpétue la tradition de la librairie indépendante. De génération en génération, nous cultivons l'art du conseil et de la découverte littéraire, faisant de notre librairie un lieu de rencontre incontournable pour les amoureux des livres.",
    stats: {
      booksCount: 2847,
      salesCount: 15420,
      rating: 4.9,
      reviewsCount: 1247,
      yearsOfExperience: 127,
      employeesCount: 45
    },
    images: {
      logo: "/images/bookshops/mollat-logo.jpg",
      storefront: "/images/bookshops/mollat-storefront.jpg",
      interior: "/images/bookshops/mollat-interior.jpg",
      team: "/images/bookshops/mollat-team.jpg"
    },
    socialMedia: {
      facebook: "https://facebook.com/LibrairieMollat",
      instagram: "@librairie_mollat",
      twitter: "@mollat"
    },
    openingHours: {
      monday: "10h00 - 19h30",
      tuesday: "10h00 - 19h30",
      wednesday: "10h00 - 19h30",
      thursday: "10h00 - 19h30",
      friday: "10h00 - 19h30",
      saturday: "10h00 - 19h30",
      sunday: "Fermé"
    },
    services: [
      "Commandes spéciales",
      "Dédicaces d'auteurs",
      "Clubs de lecture",
      "Conseils personnalisés",
      "Livraison à domicile",
      "Cartes cadeaux"
    ],
    events: [
      {
        title: "Rencontre avec Leïla Slimani",
        date: "2024-09-15",
        time: "18h30",
        description: "L'autrice viendra présenter son nouveau roman"
      },
      {
        title: "Club de lecture - Romans contemporains",
        date: "2024-09-20",
        time: "19h00",
        description: "Discussion autour des dernières parutions"
      }
    ],
    badges: ["Vérifiée", "Partenaire Premium", "Éco-responsable"],
    verified: true,
    premium: true,
    featured: true
  },
  {
    id: 2,
    name: "Librairie Charlemagne",
    slug: "charlemagne-paris",
    type: "Librairie spécialisée",
    specialties: ["Sciences humaines", "Philosophie", "Histoire", "Sociologie"],
    city: "Paris",
    address: "57 rue de Charlemagne, 75004 Paris",
    phone: "01 42 77 87 87",
    email: "info@charlemagne-livres.fr",
    website: "https://www.charlemagne-livres.fr",
    description: "Située au cœur du Marais, la Librairie Charlemagne est spécialisée dans les sciences humaines depuis 1982. Un lieu de référence pour les étudiants, chercheurs et passionnés de philosophie et d'histoire.",
    story: "Créée par deux anciens professeurs de philosophie, notre librairie s'est imposée comme une référence dans le domaine des sciences humaines. Nous privilégions la qualité du conseil et l'accompagnement de nos lecteurs dans leurs recherches intellectuelles.",
    stats: {
      booksCount: 1245,
      salesCount: 8934,
      rating: 4.7,
      reviewsCount: 456,
      yearsOfExperience: 42,
      employeesCount: 8
    },
    images: {
      logo: "/images/bookshops/charlemagne-logo.jpg",
      storefront: "/images/bookshops/charlemagne-storefront.jpg",
      interior: "/images/bookshops/charlemagne-interior.jpg",
      team: "/images/bookshops/charlemagne-team.jpg"
    },
    socialMedia: {
      facebook: "https://facebook.com/LibrairieCharlemagne",
      instagram: "@charlemagne_livres",
      twitter: "@charlemagne_lib"
    },
    openingHours: {
      monday: "Fermé",
      tuesday: "10h00 - 19h00",
      wednesday: "10h00 - 19h00",
      thursday: "10h00 - 20h00",
      friday: "10h00 - 19h00",
      saturday: "10h00 - 19h00",
      sunday: "14h00 - 18h00"
    },
    services: [
      "Recherches bibliographiques",
      "Commandes universitaires",
      "Conseils académiques",
      "Conférences",
      "Ateliers d'écriture"
    ],
    events: [
      {
        title: "Conférence - L'avenir de la démocratie",
        date: "2024-09-18",
        time: "19h00",
        description: "Débat avec des politologues renommés"
      }
    ],
    badges: ["Vérifiée", "Spécialisée"],
    verified: true,
    premium: false,
    featured: true
  },
  {
    id: 3,
    name: "Librairie Sauramps",
    slug: "sauramps-montpellier",
    type: "Librairie généraliste",
    specialties: ["Beaux-arts", "Architecture", "Design", "Photographie"],
    city: "Montpellier",
    address: "Le Triangle, 34000 Montpellier",
    phone: "04 67 06 78 78",
    email: "contact@sauramps.com",
    website: "https://www.sauramps.com",
    description: "Librairie emblématique de Montpellier depuis 1981, Sauramps propose une sélection exceptionnelle dans les domaines artistiques et culturels, avec un espace dédié aux beaux-arts unique dans la région.",
    story: "Née de la passion de ses fondateurs pour l'art et la culture, Sauramps s'est développée en gardant son âme de librairie de quartier tout en devenant une référence régionale pour les arts visuels et l'architecture.",
    stats: {
      booksCount: 1876,
      salesCount: 12340,
      rating: 4.8,
      reviewsCount: 789,
      yearsOfExperience: 43,
      employeesCount: 22
    },
    images: {
      logo: "/images/bookshops/sauramps-logo.jpg",
      storefront: "/images/bookshops/sauramps-storefront.jpg",
      interior: "/images/bookshops/sauramps-interior.jpg",
      team: "/images/bookshops/sauramps-team.jpg"
    },
    socialMedia: {
      facebook: "https://facebook.com/LibrairieSauramps",
      instagram: "@sauramps_librairie",
      twitter: "@sauramps"
    },
    openingHours: {
      monday: "14h00 - 19h00",
      tuesday: "10h00 - 19h00",
      wednesday: "10h00 - 19h00",
      thursday: "10h00 - 19h00",
      friday: "10h00 - 19h00",
      saturday: "10h00 - 19h00",
      sunday: "Fermé"
    },
    services: [
      "Expositions d'art",
      "Vernissages",
      "Ateliers créatifs",
      "Conseils artistiques",
      "Encadrement sur mesure"
    ],
    events: [
      {
        title: "Exposition - Photographies contemporaines",
        date: "2024-09-25",
        time: "18h00",
        description: "Vernissage de l'exposition collective"
      }
    ],
    badges: ["Vérifiée", "Arts & Culture"],
    verified: true,
    premium: false,
    featured: true
  },
  {
    id: 4,
    name: "Librairie du Port",
    slug: "port-nice",
    type: "Librairie de quartier",
    specialties: ["Littérature méditerranéenne", "Guides de voyage", "Romans policiers"],
    city: "Nice",
    address: "12 cours Saleya, 06300 Nice",
    phone: "04 93 80 63 52",
    email: "hello@librairie-port.fr",
    website: "https://www.librairie-port.fr",
    description: "Au cœur du Vieux-Nice, notre librairie familiale cultive l'art de vivre méditerranéen à travers une sélection de livres qui célèbrent notre région et ses auteurs.",
    story: "Transmise de mère en fille depuis trois générations, notre librairie est un véritable trésor niçois. Nous mettons un point d'honneur à faire découvrir les auteurs locaux et les récits qui racontent la beauté de la Côte d'Azur.",
    stats: {
      booksCount: 892,
      salesCount: 5670,
      rating: 4.6,
      reviewsCount: 234,
      yearsOfExperience: 35,
      employeesCount: 4
    },
    images: {
      logo: "/images/bookshops/port-logo.jpg",
      storefront: "/images/bookshops/port-storefront.jpg",
      interior: "/images/bookshops/port-interior.jpg",
      team: "/images/bookshops/port-team.jpg"
    },
    socialMedia: {
      facebook: "https://facebook.com/LibrairiePort",
      instagram: "@librairie_port_nice"
    },
    openingHours: {
      monday: "Fermé",
      tuesday: "09h30 - 18h30",
      wednesday: "09h30 - 18h30",
      thursday: "09h30 - 18h30",
      friday: "09h30 - 18h30",
      saturday: "09h30 - 19h00",
      sunday: "10h00 - 17h00"
    },
    services: [
      "Sélections estivales",
      "Conseils voyage",
      "Livres dédicacés",
      "Commandes spéciales"
    ],
    events: [
      {
        title: "Lecture sous les étoiles",
        date: "2024-09-22",
        time: "20h30",
        description: "Soirée lecture en terrasse"
      }
    ],
    badges: ["Vérifiée", "Familiale"],
    verified: true,
    premium: false,
    featured: false
  },
  {
    id: 5,
    name: "Librairie Ombres Blanches",
    slug: "ombres-blanches-toulouse",
    type: "Librairie généraliste",
    specialties: ["Littérature contemporaine", "Poésie", "Théâtre", "Essais"],
    city: "Toulouse",
    address: "50 rue Gambetta, 31000 Toulouse",
    phone: "05 34 45 53 33",
    email: "contact@ombres-blanches.fr",
    website: "https://www.ombres-blanches.fr",
    description: "Librairie indépendante toulousaine reconnue pour sa programmation culturelle exceptionnelle et son engagement pour la littérature contemporaine. Un lieu de vie littéraire au cœur de la Ville Rose.",
    story: "Depuis 1975, Ombres Blanches anime la vie littéraire toulousaine. Notre engagement pour la création contemporaine et notre programmation d'événements font de nous un acteur majeur de la scène culturelle régionale.",
    stats: {
      booksCount: 2156,
      salesCount: 11890,
      rating: 4.8,
      reviewsCount: 567,
      yearsOfExperience: 49,
      employeesCount: 18
    },
    images: {
      logo: "/images/bookshops/ombres-logo.jpg",
      storefront: "/images/bookshops/ombres-storefront.jpg",
      interior: "/images/bookshops/ombres-interior.jpg",
      team: "/images/bookshops/ombres-team.jpg"
    },
    socialMedia: {
      facebook: "https://facebook.com/OmbresBlanches",
      instagram: "@ombres_blanches",
      twitter: "@ombresblanches"
    },
    openingHours: {
      monday: "14h00 - 19h00",
      tuesday: "10h00 - 19h00",
      wednesday: "10h00 - 19h00",
      thursday: "10h00 - 19h00",
      friday: "10h00 - 19h00",
      saturday: "10h00 - 19h00",
      sunday: "Fermé"
    },
    services: [
      "Rencontres d'auteurs",
      "Prix littéraires",
      "Ateliers d'écriture",
      "Lectures publiques",
      "Résidences d'écrivains"
    ],
    events: [
      {
        title: "Rentrée littéraire 2024",
        date: "2024-09-12",
        time: "18h30",
        description: "Présentation des coups de cœur de la rentrée"
      },
      {
        title: "Nuit de la poésie",
        date: "2024-09-28",
        time: "20h00",
        description: "Soirée dédiée à la poésie contemporaine"
      }
    ],
    badges: ["Vérifiée", "Partenaire Premium", "Événements"],
    verified: true,
    premium: true,
    featured: true
  },
  {
    id: 6,
    name: "Librairie Kléber",
    slug: "kleber-strasbourg",
    type: "Librairie généraliste",
    specialties: ["Littérature européenne", "Langues étrangères", "Guides pratiques"],
    city: "Strasbourg",
    address: "1 rue des Francs-Bourgeois, 67000 Strasbourg",
    phone: "03 88 15 78 88",
    email: "info@librairie-kleber.fr",
    website: "https://www.librairie-kleber.fr",
    description: "Située au cœur de Strasbourg, la Librairie Kléber propose une large sélection multilingue reflétant l'identité européenne de la ville. Un pont culturel entre les littératures française, allemande et européenne.",
    story: "Héritière de la tradition livresque strasbourgeoise, notre librairie cultive depuis 1985 l'ouverture sur l'Europe. Nous sommes fiers de proposer des ouvrages dans de nombreuses langues et de faire découvrir la richesse de la littérature européenne.",
    stats: {
      booksCount: 1654,
      salesCount: 9876,
      rating: 4.7,
      reviewsCount: 432,
      yearsOfExperience: 39,
      employeesCount: 12
    },
    images: {
      logo: "/images/bookshops/kleber-logo.jpg",
      storefront: "/images/bookshops/kleber-storefront.jpg",
      interior: "/images/bookshops/kleber-interior.jpg",
      team: "/images/bookshops/kleber-team.jpg"
    },
    socialMedia: {
      facebook: "https://facebook.com/LibrairieKleber",
      instagram: "@kleber_strasbourg"
    },
    openingHours: {
      monday: "14h00 - 18h30",
      tuesday: "09h30 - 18h30",
      wednesday: "09h30 - 18h30",
      thursday: "09h30 - 18h30",
      friday: "09h30 - 18h30",
      saturday: "09h30 - 18h30",
      sunday: "Fermé"
    },
    services: [
      "Traductions spécialisées",
      "Méthodes de langues",
      "Littérature bilingue",
      "Échanges culturels"
    ],
    events: [
      {
        title: "Café polyglotte",
        date: "2024-09-14",
        time: "15h00",
        description: "Rencontre multilingue autour des livres"
      }
    ],
    badges: ["Vérifiée", "Multilingue"],
    verified: true,
    premium: false,
    featured: false
  }
];

// Fonction pour obtenir les libraires par ville
export const getBookshopsByCity = (city) => {
  return bookshopsData.filter(bookshop => 
    bookshop.city.toLowerCase().includes(city.toLowerCase())
  );
};

// Fonction pour obtenir les libraires par spécialité
export const getBookshopsBySpecialty = (specialty) => {
  return bookshopsData.filter(bookshop => 
    bookshop.specialties.some(s => 
      s.toLowerCase().includes(specialty.toLowerCase())
    )
  );
};

// Fonction pour obtenir les libraires premium
export const getPremiumBookshops = () => {
  return bookshopsData.filter(bookshop => bookshop.premium);
};

// Fonction pour obtenir les libraires en vedette
export const getFeaturedBookshops = () => {
  return bookshopsData.filter(bookshop => bookshop.featured);
};

// Fonction pour obtenir une libraire par slug
export const getBookshopBySlug = (slug) => {
  return bookshopsData.find(bookshop => bookshop.slug === slug);
};

// Fonction pour obtenir les statistiques globales
export const getBookshopsStats = () => {
  return {
    totalBookshops: bookshopsData.length,
    totalBooks: bookshopsData.reduce((sum, shop) => sum + shop.stats.booksCount, 0),
    totalSales: bookshopsData.reduce((sum, shop) => sum + shop.stats.salesCount, 0),
    averageRating: (bookshopsData.reduce((sum, shop) => sum + shop.stats.rating, 0) / bookshopsData.length).toFixed(1),
    cities: [...new Set(bookshopsData.map(shop => shop.city))],
    specialties: [...new Set(bookshopsData.flatMap(shop => shop.specialties))]
  };
};

