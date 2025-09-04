import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';

const LibrairesPage = () => {
  const navigate = useNavigate();
  const { getEventsByLibrary, getUpcomingEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');

  // Données de démonstration des libraires
  const libraires = [
    {
      id: 'mollat',
      name: 'Librairie Mollat',
      description: 'La plus grande librairie indépendante de France, située au cœur de Bordeaux depuis 1896.',
      address: '15 Rue Vital Carles, 33000 Bordeaux',
      phone: '05 56 56 40 40',
      email: 'contact@mollat.com',
      website: 'www.mollat.com',
      image: '/api/placeholder/400/300',
      specialties: ['Littérature', 'Sciences Humaines', 'Jeunesse', 'BD'],
      rating: 4.8,
      reviews: 1247,
      openHours: 'Lun-Sam: 9h30-19h30, Dim: 14h-19h',
      services: ['Click & Collect', 'Livraison', 'Événements', 'Conseils personnalisés']
    },
    {
      id: 'gibert',
      name: 'Gibert Joseph',
      description: 'Librairie emblématique du Quartier Latin, spécialisée dans les livres neufs et d\'occasion.',
      address: '26-30 Boulevard Saint-Michel, 75006 Paris',
      phone: '01 44 41 88 88',
      email: 'contact@gibertjoseph.com',
      website: 'www.gibertjoseph.com',
      image: '/api/placeholder/400/300',
      specialties: ['Occasion', 'Universitaire', 'Littérature', 'Histoire'],
      rating: 4.6,
      reviews: 892,
      openHours: 'Lun-Sam: 10h-19h30, Dim: 14h-18h',
      services: ['Rachat de livres', 'Livraison', 'Recherche de livres rares']
    },
    {
      id: 'shakespeare',
      name: 'Shakespeare and Company',
      description: 'Librairie anglophone mythique de Paris, lieu de rencontre des écrivains du monde entier.',
      address: '37 Rue de la Bûcherie, 75005 Paris',
      phone: '01 43 25 40 93',
      email: 'info@shakespeareandcompany.com',
      website: 'www.shakespeareandcompany.com',
      image: '/api/placeholder/400/300',
      specialties: ['Littérature anglophone', 'Poésie', 'Classiques', 'Nouveautés'],
      rating: 4.9,
      reviews: 2156,
      openHours: 'Lun-Dim: 10h-22h',
      services: ['Événements littéraires', 'Café', 'Résidence d\'écrivains']
    }
  ];

  // Filtrer les libraires selon la recherche
  const filteredLibraires = libraires.filter(libraire =>
    libraire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    libraire.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    libraire.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const LibraireCard = ({ libraire }) => {
    const libraryEvents = getEventsByLibrary(libraire.id);
    const upcomingEvents = libraryEvents.filter(event => event.status === 'upcoming').slice(0, 2);

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
        {/* Image de la librairie */}
        <div style={{
          height: '200px',
          background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          {libraire.name}
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* Header avec nom et rating */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46', fontSize: '1.25rem' }}>
                {libraire.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', color: '#fbbf24' }}>
                  {'★'.repeat(Math.floor(libraire.rating))}
                  {'☆'.repeat(5 - Math.floor(libraire.rating))}
                </div>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {libraire.rating} ({libraire.reviews} avis)
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p style={{ 
            margin: '0 0 1rem 0', 
            color: '#6b7280', 
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}>
            {libraire.description}
          </p>

          {/* Spécialités */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {libraire.specialties.map(specialty => (
                <span key={specialty} style={{
                  background: '#d1fae5',
                  color: '#065f46',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Informations pratiques */}
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <div style={{ marginBottom: '0.25rem' }}>📍 {libraire.address}</div>
            <div style={{ marginBottom: '0.25rem' }}>📞 {libraire.phone}</div>
            <div>🕒 {libraire.openHours}</div>
          </div>

          {/* Services */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46', fontSize: '0.875rem', fontWeight: 'bold' }}>
              Services
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {libraire.services.map(service => (
                <span key={service} style={{
                  background: '#f0fdf4',
                  color: '#047857',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  border: '1px solid #d1fae5'
                }}>
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Section Événements */}
          {upcomingEvents.length > 0 && (
            <div style={{ 
              background: '#f0fdf4', 
              padding: '1rem', 
              borderRadius: '8px',
              border: '1px solid #d1fae5',
              marginBottom: '1rem'
            }}>
              <h4 style={{ 
                margin: '0 0 0.75rem 0', 
                color: '#065f46', 
                fontSize: '0.875rem', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🎭 Événements à venir ({libraryEvents.length})
              </h4>
              
              {upcomingEvents.map(event => (
                <div key={event.id} style={{
                  background: 'white',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  border: '1px solid #d1fae5'
                }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: '#065f46', 
                    fontSize: '0.875rem',
                    marginBottom: '0.25rem'
                  }}>
                    {event.title}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#047857'
                  }}>
                    {event.currentParticipants}/{event.maxParticipants} inscrits • {event.price === 0 ? 'Gratuit' : `${event.price}€`}
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => navigate('/events')}
                style={{
                  background: '#047857',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  width: '100%',
                  fontWeight: 'bold'
                }}
              >
                Voir tous les événements
              </button>
            </div>
          )}

          {/* Boutons d'action */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => window.open(`https://${libraire.website}`, '_blank')}
              style={{
                flex: 1,
                background: '#047857',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
            >
              Visiter le site
            </button>
            <button
              onClick={() => navigate('/catalogue')}
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
              Voir les livres
            </button>
          </div>
        </div>
      </div>
    );
  };

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
          Nos Libraires Partenaires
        </h1>
        <p style={{ margin: '0 0 2rem 0', fontSize: '1.125rem', opacity: 0.9 }}>
          Découvrez les meilleures librairies et leurs événements exclusifs
        </p>
        
        {/* Barre de recherche */}
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Rechercher une librairie, spécialité..."
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
              {filteredLibraires.length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Libraires partenaires
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
              Événements à venir
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
              15+
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Villes couvertes
            </div>
          </div>
        </div>

        {/* Grille des libraires */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {filteredLibraires.map(libraire => (
            <LibraireCard key={libraire.id} libraire={libraire} />
          ))}
        </div>

        {filteredLibraires.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Aucune librairie trouvée</h3>
            <p style={{ margin: 0 }}>
              Essayez de modifier votre recherche ou explorez toutes nos librairies partenaires.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrairesPage;

