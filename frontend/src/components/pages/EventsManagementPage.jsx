import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';

const EventsManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, createEvent, updateEvent, deleteEvent, getEventsByLibrary } = useEvents();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Rencontre d\'auteur',
    maxParticipants: 50,
    price: 0,
    tags: []
  });

  // Événements de la librairie connectée
  const libraryEvents = getEventsByLibrary('mollat');

  const categories = [
    'Rencontre d\'auteur',
    'Club de lecture',
    'Atelier',
    'Dédicace',
    'Conférence',
    'Présentation',
    'Discussion',
    'Formation'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingEvent) {
      const result = await updateEvent(editingEvent.id, formData);
      if (result.success) {
        alert('Événement modifié avec succès !');
        setEditingEvent(null);
      }
    } else {
      const result = await createEvent(formData);
      if (result.success) {
        alert('Événement créé avec succès !');
        setShowCreateForm(false);
      }
    }
    
    // Réinitialiser le formulaire
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'Rencontre d\'auteur',
      maxParticipants: 50,
      price: 0,
      tags: []
    });
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      maxParticipants: event.maxParticipants,
      price: event.price,
      tags: event.tags
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      const result = await deleteEvent(eventId);
      if (result.success) {
        alert('Événement supprimé avec succès !');
      }
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

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        color: 'white',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
              Gestion des Événements
            </h1>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Créez et gérez vos événements - {user?.display_name || 'Librairie'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {showCreateForm ? 'Annuler' : 'Créer un Événement'}
            </button>
            <button 
              onClick={() => navigate('/dashboard-pro')}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Retour Dashboard
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 2rem' }}>
        {/* Formulaire de création/modification */}
        {showCreateForm && (
          <div style={{
            background: 'white',
            border: '2px solid #d1fae5',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#065f46' }}>
              {editingEvent ? 'Modifier l\'Événement' : 'Créer un Nouvel Événement'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#065f46', fontWeight: 'bold' }}>
                    Titre de l'événement
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1fae5',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                    placeholder="Ex: Rencontre avec l'auteur"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#065f46', fontWeight: 'bold' }}>
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1fae5',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#065f46', fontWeight: 'bold' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #d1fae5',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  placeholder="Décrivez votre événement..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#065f46', fontWeight: 'bold' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1fae5',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#065f46', fontWeight: 'bold' }}>
                    Heure
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1fae5',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#065f46', fontWeight: 'bold' }}>
                    Lieu
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1fae5',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                    placeholder="Adresse de l'événement"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#065f46', fontWeight: 'bold' }}>
                    Nombre max de participants
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1fae5',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#065f46', fontWeight: 'bold' }}>
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #d1fae5',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#065f46', fontWeight: 'bold' }}>
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #d1fae5',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                  placeholder="Ex: Littérature, Philosophie, Gratuit"
                />
              </div>

              <button
                type="submit"
                style={{
                  background: '#047857',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {editingEvent ? 'Modifier l\'Événement' : 'Créer l\'Événement'}
              </button>
            </form>
          </div>
        )}

        {/* Liste des événements */}
        <div>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#065f46' }}>
            Mes Événements ({libraryEvents.length})
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {libraryEvents.map(event => (
              <div key={event.id} style={{
                background: 'white',
                border: '2px solid #d1fae5',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: '#065f46' }}>{event.title}</h3>
                    <span style={{
                      background: event.status === 'upcoming' ? '#d1fae5' : '#f3f4f6',
                      color: event.status === 'upcoming' ? '#065f46' : '#6b7280',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}>
                      {event.status === 'upcoming' ? 'À venir' : 'Terminé'}
                    </span>
                  </div>
                  
                  <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                    {event.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: '#047857' }}>
                    <span>📅 {formatDate(event.date)} à {event.time}</span>
                    <span>📍 {event.location}</span>
                    <span>👥 {event.currentParticipants}/{event.maxParticipants}</span>
                    <span>💰 {event.price === 0 ? 'Gratuit' : `${event.price}€`}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(event)}
                    style={{
                      background: '#059669',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsManagementPage;

