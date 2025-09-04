import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';

const EventsPage = () => {
  const navigate = useNavigate();
  const { 
    events, 
    getUpcomingEvents, 
    getEventsByCategory, 
    searchEvents, 
    registerForEvent, 
    unregisterFromEvent 
  } = useEvents();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());

  const categories = [
    'all',
    'Rencontre d\'auteur',
    'Club de lecture',
    'Atelier',
    'Dédicace',
    'Conférence',
    'Présentation',
    'Discussion',
    'Formation'
  ];

  // Filtrer les événements
  const getFilteredEvents = () => {
    let filteredEvents = events;

    // Filtrer par recherche
    if (searchTerm) {
      filteredEvents = searchEvents(searchTerm);
    }

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.category === selectedCategory);
    }

    // Trier par date
    return filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handleRegister = async (eventId) => {
    const result = await registerForEvent(eventId);
    if (result.success) {
      setRegisteredEvents(prev => new Set([...prev, eventId]));
      alert('Inscription réussie !');
    }
  };

  const handleUnregister = async (eventId) => {
    const result = await unregisterFromEvent(eventId);
    if (result.success) {
      setRegisteredEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      alert('Désinscription réussie !');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isEventFull = (event) => {
    return event.currentParticipants >= event.maxParticipants;
  };

  const isEventPast = (event) => {
    const today = new Date().toISOString().split('T')[0];
    return event.date < today;
  };

  const EventCard = ({ event }) => {
    const isRegistered = registeredEvents.has(event.id);
    const isFull = isEventFull(event);
    const isPast = isEventPast(event);

    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}>
        {/* Image de l'événement */}
        <div style={{
          height: '200px',
          background: isPast 
            ? 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
            : 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {event.category}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              {event.libraryName}
            </div>
          </div>
          
          {/* Badge de statut */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: isPast ? '#6b7280' : isFull ? '#dc2626' : '#059669',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {isPast ? 'Terminé' : isFull ? 'Complet' : 'Disponible'}
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Titre et prix */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#065f46', fontSize: '1.25rem', flex: 1 }}>
              {event.title}
            </h3>
            <div style={{
              background: event.price === 0 ? '#d1fae5' : '#fef3c7',
              color: event.price === 0 ? '#065f46' : '#92400e',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              marginLeft: '1rem'
            }}>
              {event.price === 0 ? 'Gratuit' : `${event.price}€`}
            </div>
          </div>

          {/* Description */}
          <p style={{ 
            margin: '0 0 1rem 0', 
            color: '#6b7280', 
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}>
            {event.description}
          </p>

          {/* Informations pratiques */}
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#047857' }}>
              <span>📅</span>
              <span>{formatDate(event.date)} à {event.time}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#047857' }}>
              <span>📍</span>
              <span>{event.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857' }}>
              <span>👥</span>
              <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
            </div>
          </div>

          {/* Barre de progression */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              background: '#f3f4f6',
              borderRadius: '8px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#047857',
                height: '100%',
                width: `${(event.currentParticipants / event.maxParticipants) * 100}%`,
                transition: 'width 0.3s'
              }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {Math.round((event.currentParticipants / event.maxParticipants) * 100)}% de remplissage
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {event.tags.map(tag => (
                <span key={tag} style={{
                  background: '#f0fdf4',
                  color: '#047857',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  border: '1px solid #d1fae5'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setSelectedEvent(event)}
              style={{
                flex: 1,
                background: 'white',
                color: '#047857',
                border: '2px solid #047857',
                padding: '0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
            >
              Voir détails
            </button>
            
            {!isPast && (
              <button
                onClick={() => isRegistered ? handleUnregister(event.id) : handleRegister(event.id)}
                disabled={!isRegistered && isFull}
                style={{
                  flex: 1,
                  background: isRegistered ? '#dc2626' : isFull ? '#9ca3af' : '#047857',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  cursor: (!isRegistered && isFull) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  opacity: (!isRegistered && isFull) ? 0.6 : 1
                }}
              >
                {isRegistered ? 'Se désinscrire' : isFull ? 'Complet' : 'S\'inscrire'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '16px 16px 0 0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                  {event.title}
                </h2>
                <p style={{ margin: 0, opacity: 0.9 }}>
                  {event.libraryName}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Description</h3>
              <p style={{ margin: 0, color: '#6b7280', lineHeight: '1.6' }}>
                {event.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Date et heure</h4>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  {formatDate(event.date)}<br />
                  {event.time}
                </p>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Lieu</h4>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  {event.location}
                </p>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Participants</h4>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  {event.currentParticipants}/{event.maxParticipants}
                </p>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Prix</h4>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  {event.price === 0 ? 'Gratuit' : `${event.price}€`}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Catégories</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {event.tags.map(tag => (
                  <span key={tag} style={{
                    background: '#d1fae5',
                    color: '#065f46',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  background: 'white',
                  color: '#047857',
                  border: '2px solid #047857',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Fermer
              </button>
              
              {!isEventPast(event) && (
                <button
                  onClick={() => {
                    const isRegistered = registeredEvents.has(event.id);
                    if (isRegistered) {
                      handleUnregister(event.id);
                    } else {
                      handleRegister(event.id);
                    }
                    onClose();
                  }}
                  disabled={!registeredEvents.has(event.id) && isEventFull(event)}
                  style={{
                    flex: 1,
                    background: registeredEvents.has(event.id) ? '#dc2626' : isEventFull(event) ? '#9ca3af' : '#047857',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    cursor: (!registeredEvents.has(event.id) && isEventFull(event)) ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    opacity: (!registeredEvents.has(event.id) && isEventFull(event)) ? 0.6 : 1
                  }}
                >
                  {registeredEvents.has(event.id) ? 'Se désinscrire' : isEventFull(event) ? 'Complet' : 'S\'inscrire'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem', fontWeight: 'bold' }}>
          Événements Littéraires
        </h1>
        <p style={{ margin: '0 0 2rem 0', fontSize: '1.125rem', opacity: 0.9 }}>
          Découvrez les événements organisés par nos libraires partenaires
        </p>
        
        {/* Barre de recherche */}
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Rechercher un événement, auteur, thème..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{ padding: '2rem' }}>
        {/* Filtres */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  background: selectedCategory === category ? '#047857' : 'white',
                  color: selectedCategory === category ? 'white' : '#047857',
                  border: '2px solid #047857',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                {category === 'all' ? 'Tous' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #d1fae5'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
              {filteredEvents.length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Événements trouvés
            </div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #d1fae5'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
              {getUpcomingEvents().length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              À venir
            </div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #d1fae5'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
              {registeredEvents.size}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Mes inscriptions
            </div>
          </div>
        </div>

        {/* Grille des événements */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Aucun événement trouvé</h3>
            <p style={{ margin: 0 }}>
              Essayez de modifier votre recherche ou explorez toutes les catégories.
            </p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      <EventModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
};

export default EventsPage;

