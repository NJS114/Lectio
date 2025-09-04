import { useState, useEffect } from 'react';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Données de démonstration des événements
  const demoEvents = [
    {
      id: 1,
      title: "Rencontre avec Albert Camus",
      description: "Découvrez l'univers de l'auteur de L'Étranger lors d'une soirée littéraire exceptionnelle.",
      date: "2024-03-15",
      time: "19:00",
      location: "Librairie Mollat, Bordeaux",
      libraryId: "mollat",
      libraryName: "Librairie Mollat",
      category: "Rencontre d'auteur",
      maxParticipants: 50,
      currentParticipants: 23,
      price: 0,
      image: "/api/placeholder/400/200",
      status: "upcoming",
      tags: ["Littérature", "Philosophie", "Gratuit"]
    },
    {
      id: 2,
      title: "Club de lecture - Science-Fiction",
      description: "Discussion autour des dernières parutions SF et échange entre passionnés du genre.",
      date: "2024-03-20",
      time: "18:30",
      location: "Librairie Mollat, Bordeaux",
      libraryId: "mollat",
      libraryName: "Librairie Mollat",
      category: "Club de lecture",
      maxParticipants: 20,
      currentParticipants: 12,
      price: 5,
      image: "/api/placeholder/400/200",
      status: "upcoming",
      tags: ["Science-Fiction", "Discussion", "Communauté"]
    },
    {
      id: 3,
      title: "Atelier d'écriture créative",
      description: "Libérez votre créativité lors de cet atelier d'écriture animé par un auteur professionnel.",
      date: "2024-03-25",
      time: "14:00",
      location: "Librairie Mollat, Bordeaux",
      libraryId: "mollat",
      libraryName: "Librairie Mollat",
      category: "Atelier",
      maxParticipants: 15,
      currentParticipants: 8,
      price: 25,
      image: "/api/placeholder/400/200",
      status: "upcoming",
      tags: ["Écriture", "Créativité", "Formation"]
    },
    {
      id: 4,
      title: "Dédicace - Nouveautés de la rentrée",
      description: "Venez rencontrer les auteurs des nouveautés littéraires de cette rentrée.",
      date: "2024-02-28",
      time: "16:00",
      location: "Librairie Mollat, Bordeaux",
      libraryId: "mollat",
      libraryName: "Librairie Mollat",
      category: "Dédicace",
      maxParticipants: 100,
      currentParticipants: 87,
      price: 0,
      image: "/api/placeholder/400/200",
      status: "completed",
      tags: ["Dédicace", "Nouveautés", "Gratuit"]
    }
  ];

  // Initialiser les événements
  useEffect(() => {
    setEvents(demoEvents);
  }, []);

  // Créer un nouvel événement
  const createEvent = async (eventData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newEvent = {
        id: Date.now(),
        ...eventData,
        currentParticipants: 0,
        status: 'upcoming',
        libraryId: 'mollat', // Pour la démo
        libraryName: 'Librairie Mollat'
      };
      
      setEvents(prev => [...prev, newEvent]);
      setLoading(false);
      return { success: true, event: newEvent };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Modifier un événement
  const updateEvent = async (eventId, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, ...updates } : event
      ));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Supprimer un événement
  const deleteEvent = async (eventId) => {
    setLoading(true);
    setError(null);
    
    try {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // S'inscrire à un événement
  const registerForEvent = async (eventId) => {
    setLoading(true);
    setError(null);
    
    try {
      setEvents(prev => prev.map(event => 
        event.id === eventId && event.currentParticipants < event.maxParticipants
          ? { ...event, currentParticipants: event.currentParticipants + 1 }
          : event
      ));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Se désinscrire d'un événement
  const unregisterFromEvent = async (eventId) => {
    setLoading(true);
    setError(null);
    
    try {
      setEvents(prev => prev.map(event => 
        event.id === eventId && event.currentParticipants > 0
          ? { ...event, currentParticipants: event.currentParticipants - 1 }
          : event
      ));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Obtenir les événements d'une librairie
  const getEventsByLibrary = (libraryId) => {
    return events.filter(event => event.libraryId === libraryId);
  };

  // Obtenir les événements à venir
  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date >= today && event.status === 'upcoming');
  };

  // Obtenir les événements par catégorie
  const getEventsByCategory = (category) => {
    return events.filter(event => event.category === category);
  };

  // Rechercher des événements
  const searchEvents = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery) ||
      event.category.toLowerCase().includes(lowercaseQuery) ||
      event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    getEventsByLibrary,
    getUpcomingEvents,
    getEventsByCategory,
    searchEvents
  };
};

