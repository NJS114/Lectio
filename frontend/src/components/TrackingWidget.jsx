import React, { useState, useEffect } from 'react';
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle, Search, ExternalLink } from 'lucide-react';

const TrackingWidget = ({ trackingNumber, orderId, compact = false }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (trackingNumber) {
      fetchTrackingData(trackingNumber);
    }
  }, [trackingNumber]);

  const fetchTrackingData = async (number) => {
    setLoading(true);
    setError('');
    try {
      // Simuler des données de suivi pour la démonstration
      // En production, cela ferait appel à l'API SendCloud
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai API
      
      const mockData = {
        tracking_number: number,
        status: 'En transit',
        carrier: 'Colissimo',
        estimated_delivery: '2025-09-05',
        current_location: 'Centre de tri Paris',
        tracking_url: `https://www.laposte.fr/outils/suivre-vos-envois?code=${number}`,
        events: [
          {
            date: '2025-09-02T10:00:00Z',
            status: 'Colis créé',
            location: 'Expéditeur',
            description: 'Étiquette d\'expédition créée'
          },
          {
            date: '2025-09-02T14:30:00Z',
            status: 'Pris en charge',
            location: 'Bureau de poste Paris 15e',
            description: 'Colis pris en charge par le transporteur'
          },
          {
            date: '2025-09-03T08:15:00Z',
            status: 'En transit',
            location: 'Centre de tri Paris',
            description: 'Colis en cours d\'acheminement'
          },
          {
            date: '2025-09-03T16:45:00Z',
            status: 'En transit',
            location: 'Centre de tri Lyon',
            description: 'Colis transféré vers le centre de destination'
          }
        ]
      };
      
      setTrackingData(mockData);
    } catch (err) {
      setError('Impossible de récupérer les informations de suivi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'livré':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'en transit':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'pris en charge':
        return <Package className="h-5 w-5 text-orange-500" />;
      case 'colis créé':
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'livré':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'en transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pris en charge':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'colis créé':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (compact && trackingData) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {getStatusIcon(trackingData.status)}
            <span className="ml-2 font-medium text-gray-900">{trackingData.status}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(trackingData.status)}`}>
            {trackingData.carrier}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 inline mr-1" />
          {trackingData.current_location}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Livraison prévue: {new Date(trackingData.estimated_delivery).toLocaleDateString('fr-FR')}
          </span>
          <button
            onClick={() => window.open(trackingData.tracking_url, '_blank')}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            Suivre <ExternalLink className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Suivi de Colis</h3>
        {trackingNumber && (
          <p className="text-sm text-gray-600">
            Numéro de suivi: <span className="font-mono font-medium">{trackingNumber}</span>
          </p>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Récupération des informations...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {trackingData && !loading && (
        <div>
          {/* Statut actuel */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                {getStatusIcon(trackingData.status)}
                <span className="ml-3 text-lg font-medium text-gray-900">{trackingData.status}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(trackingData.status)}`}>
                {trackingData.carrier}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                Position actuelle: {trackingData.current_location}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                Livraison prévue: {new Date(trackingData.estimated_delivery).toLocaleDateString('fr-FR')}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => window.open(trackingData.tracking_url, '_blank')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center text-sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Suivre sur le site du transporteur
              </button>
            </div>
          </div>

          {/* Historique des événements */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Historique de livraison</h4>
            <div className="space-y-4">
              {trackingData.events.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {getStatusIcon(event.status)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{event.status}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!trackingNumber && !loading && (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun numéro de suivi disponible</p>
        </div>
      )}
    </div>
  );
};

// Composant de recherche de suivi
export const TrackingSearch = () => {
  const [searchNumber, setSearchNumber] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchNumber.trim()) {
      setShowResults(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Suivre mon colis</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-grow">
            <input
              type="text"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              placeholder="Entrez votre numéro de suivi..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={!searchNumber.trim()}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Suivre
          </button>
        </form>
      </div>

      {showResults && (
        <TrackingWidget trackingNumber={searchNumber} />
      )}
    </div>
  );
};

export default TrackingWidget;

