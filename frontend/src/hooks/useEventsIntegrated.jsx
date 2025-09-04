import { useState, useEffect } from 'react';
import { buildApiUrl, apiRequest } from '../config/api';

export const useEventsIntegrated = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer tous les événements
  const fetchEvents = async (organizerId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/events';
      if (organizerId) {
        url += `?organizer_id=${organizerId}`;
      }
      
      const response = await apiRequest(url);
      
      if (response.success) {
        setEvents(response.data);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des événements');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des événements:', err);
      setError(err.message);
      
      // Fallback avec données de démonstration
      setEvents([
        {
          id: 1,
          title: 'Dédicace - Nouveautés de la rentrée',
          description: 'Rencontrez nos auteurs préférés et découvrez les nouveautés littéraires de cette rentrée.',
          date: '2024-09-15',
          time: '14:00',
          location: 'Librairie Mollat, Bordeaux',
          price: 0,
          max_participants: 100,
          current_participants: 87,
          category: 'Dédicace',
          organizer_id: 2,
          organizer_name: 'Librairie Mollat',
          status: 'available'
        },
        {
          id: 2,
          title: 'Rencontre avec Albert Camus',
          description: 'Une soirée exceptionnelle dédiée à l\'œuvre d\'Albert Camus.',
          date: '2024-09-20',
          time: '19:00',
          location: 'Librairie Mollat, Bordeaux',
          price: 0,
          max_participants: 50,
          current_participants: 23,
          category: 'Rencontre d\'auteur',
          organizer_id: 2,
          organizer_name: 'Librairie Mollat',
          status: 'available'
        },
        {
          id: 3,
          title: 'Club de lecture - Science-Fiction',
          description: 'Rejoignez notre club de lecture mensuel dédié à la science-fiction.',
          date: '2024-09-25',
          time: '18:30',
          location: 'Librairie Mollat, Bordeaux',
          price: 5,
          max_participants: 20,
          current_participants: 12,
          category: 'Club de lecture',
          organizer_id: 2,
          organizer_name: 'Librairie Mollat',
          status: 'available'
        },
        {
          id: 4,
          title: 'Atelier d\'écriture créative',
          description: 'Développez votre créativité littéraire dans cet atelier pratique.',
          date: '2024-09-30',
          time: '10:00',
          location: 'Librairie Mollat, Bordeaux',
          price: 25,
          max_participants: 15,
          current_participants: 8,
          category: 'Atelier',
          organizer_id: 2,
          organizer_name: 'Librairie Mollat',
          status: 'available'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouvel événement
  const createEvent = async (eventData) => {
    try {
      const response = await apiRequest('/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
      });
      
      if (response.success) {
        setEvents(prevEvents => [...prevEvents, response.data]);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Erreur lors de la création de l\'événement');
      }
    } catch (err) {
      console.error('Erreur lors de la création de l\'événement:', err);
      return { success: false, error: err.message };
    }
  };

  // Mettre à jour un événement
  const updateEvent = async (eventId, eventData) => {
    try {
      const url = buildApiUrl('/api/events/:id', { id: eventId });
      const response = await apiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(eventData)
      });
      
      if (response.success) {
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId ? { ...event, ...response.data } : event
          )
        );
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour de l\'événement');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'événement:', err);
      return { success: false, error: err.message };
    }
  };

  // Supprimer un événement
  const deleteEvent = async (eventId) => {
    try {
      const url = buildApiUrl('/api/events/:id', { id: eventId });
      const response = await apiRequest(url, {
        method: 'DELETE'
      });
      
      if (response.success) {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        return { success: true };
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression de l\'événement');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'événement:', err);
      return { success: false, error: err.message };
    }
  };

  // S'inscrire à un événement
  const registerForEvent = async (eventId, userId) => {
    try {
      const url = buildApiUrl('/api/events/:id/register', { id: eventId });
      const response = await apiRequest(url, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId })
      });
      
      if (response.success) {
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, current_participants: event.current_participants + 1 }
              : event
          )
        );
        return { success: true, message: 'Inscription réussie !' };
      } else {
        throw new Error(response.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      return { success: false, error: err.message };
    }
  };

  // Se désinscrire d'un événement
  const unregisterFromEvent = async (eventId, userId) => {
    try {
      const url = buildApiUrl('/api/events/:id/unregister', { id: eventId });
      const response = await apiRequest(url, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId })
      });
      
      if (response.success) {
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, current_participants: Math.max(0, event.current_participants - 1) }
              : event
          )
        );
        return { success: true, message: 'Désinscription réussie !' };
      } else {
        throw new Error(response.message || 'Erreur lors de la désinscription');
      }
    } catch (err) {
      console.error('Erreur lors de la désinscription:', err);
      return { success: false, error: err.message };
    }
  };

  // Récupérer les événements d'un utilisateur
  const getUserEvents = async (userId) => {
    try {
      const url = buildApiUrl('/api/events/my-events/:userId', { userId });
      const response = await apiRequest(url);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des événements utilisateur');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des événements utilisateur:', err);
      return { success: false, error: err.message };
    }
  };

  // Filtrer les événements
  const filterEvents = (category = 'all', searchTerm = '') => {
    return events.filter(event => {
      const matchesCategory = category === 'all' || event.category === category;
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  };

  // Charger les événements au montage du hook
  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    getUserEvents,
    filterEvents
  };
};

