import React, { useState, useEffect } from 'react';
import { Package, Truck, MapPin, Weight, Calculator, Download, Eye, X } from 'lucide-react';

const ShippingManager = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [shippingMethods, setShippingMethods] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Formulaire de création de colis
  const [parcelForm, setParcelForm] = useState({
    name: '',
    company_name: '',
    address: '',
    address_2: '',
    city: '',
    postal_code: '',
    country: 'FR',
    telephone: '',
    email: '',
    weight: 0.5,
    order_number: '',
    insured_value: 0,
    shipping_method_id: null
  });

  // Formulaire de calcul des frais
  const [costForm, setCostForm] = useState({
    from_country: 'FR',
    to_country: 'FR',
    to_postal_code: '',
    weight: 0.5,
    shipping_method_id: null
  });

  const [shippingCost, setShippingCost] = useState(null);

  useEffect(() => {
    loadShippingMethods();
    loadParcels();
  }, []);

  const loadShippingMethods = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/shipping/methods');
      const data = await response.json();
      if (data.success) {
        setShippingMethods(data.methods);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des méthodes d\'expédition:', error);
    }
  };

  const loadParcels = async () => {
    // Pour l'instant, on simule des colis
    setParcels([
      {
        id: 1,
        name: 'Jean Dupont',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postal_code: '75001',
        country: 'FR',
        tracking_number: 'SC123456789',
        status: 'En transit',
        carrier: 'Colissimo',
        created_at: '2025-09-02T10:00:00Z'
      }
    ]);
  };

  const calculateShippingCost = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/shipping/calculate-cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(costForm)
      });
      const data = await response.json();
      
      if (data.success) {
        setShippingCost(data.cost);
        setSuccess('Coût calculé avec succès');
      } else {
        setError(data.error || 'Erreur lors du calcul');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const createParcel = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/shipping/create-parcel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parcelForm)
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Colis créé avec succès !');
        setParcels([...parcels, data.parcel]);
        // Réinitialiser le formulaire
        setParcelForm({
          name: '',
          company_name: '',
          address: '',
          address_2: '',
          city: '',
          postal_code: '',
          country: 'FR',
          telephone: '',
          email: '',
          weight: 0.5,
          order_number: '',
          insured_value: 0,
          shipping_method_id: null
        });
      } else {
        setError(data.error || 'Erreur lors de la création');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const downloadLabel = async (parcelId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/shipping/parcel/${parcelId}/label`);
      const data = await response.json();
      
      if (data.success && data.label_url) {
        window.open(data.label_url, '_blank');
      } else {
        setError('Étiquette non disponible');
      }
    } catch (error) {
      setError('Erreur lors du téléchargement de l\'étiquette');
    }
  };

  const trackParcel = async (parcelId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/shipping/parcel/${parcelId}/status`);
      const data = await response.json();
      
      if (data.success) {
        alert(`Statut: ${data.status.status}\nNuméro de suivi: ${data.status.tracking_number}`);
      } else {
        setError('Impossible de récupérer le statut');
      }
    } catch (error) {
      setError('Erreur lors du suivi');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Expéditions</h1>
        <p className="text-gray-600">Créez des étiquettes d'expédition et suivez vos colis avec SendCloud</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <X className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <Package className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
          <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Créer un Colis
          </button>
          <button
            onClick={() => setActiveTab('calculate')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calculate'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calculator className="h-4 w-4 inline mr-2" />
            Calculer les Frais
          </button>
          <button
            onClick={() => setActiveTab('parcels')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'parcels'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Truck className="h-4 w-4 inline mr-2" />
            Mes Colis ({parcels.length})
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations du Destinataire</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={parcelForm.name}
                    onChange={(e) => setParcelForm({...parcelForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                  <input
                    type="text"
                    value={parcelForm.company_name}
                    onChange={(e) => setParcelForm({...parcelForm, company_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Optionnel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                <input
                  type="text"
                  value={parcelForm.address}
                  onChange={(e) => setParcelForm({...parcelForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="123 Rue de la Paix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complément d'adresse</label>
                <input
                  type="text"
                  value={parcelForm.address_2}
                  onChange={(e) => setParcelForm({...parcelForm, address_2: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Appartement, étage..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                  <input
                    type="text"
                    value={parcelForm.city}
                    onChange={(e) => setParcelForm({...parcelForm, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code Postal *</label>
                  <input
                    type="text"
                    value={parcelForm.postal_code}
                    onChange={(e) => setParcelForm({...parcelForm, postal_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="75001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                  <select
                    value={parcelForm.country}
                    onChange={(e) => setParcelForm({...parcelForm, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                    <option value="DE">Allemagne</option>
                    <option value="ES">Espagne</option>
                    <option value="IT">Italie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={parcelForm.telephone}
                    onChange={(e) => setParcelForm({...parcelForm, telephone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={parcelForm.email}
                  onChange={(e) => setParcelForm({...parcelForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="jean.dupont@email.com"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Détails du Colis</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg) *</label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={parcelForm.weight}
                      onChange={(e) => setParcelForm({...parcelForm, weight: parseFloat(e.target.value)})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valeur Assurée (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={parcelForm.insured_value}
                    onChange={(e) => setParcelForm({...parcelForm, insured_value: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de Commande</label>
                <input
                  type="text"
                  value={parcelForm.order_number}
                  onChange={(e) => setParcelForm({...parcelForm, order_number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="CMD-2025-001"
                />
              </div>

              {shippingMethods.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Méthode d'Expédition</label>
                  <select
                    value={parcelForm.shipping_method_id || ''}
                    onChange={(e) => setParcelForm({...parcelForm, shipping_method_id: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sélectionner une méthode</option>
                    {shippingMethods.map(method => (
                      <option key={method.id} value={method.id}>
                        {method.name} - {method.carrier}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={createParcel}
                disabled={loading || !parcelForm.name || !parcelForm.address || !parcelForm.city || !parcelForm.postal_code}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Package className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Création en cours...' : 'Créer le Colis'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calculate' && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Calculateur de Frais d'Expédition</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pays d'origine</label>
                <select
                  value={costForm.from_country}
                  onChange={(e) => setCostForm({...costForm, from_country: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="FR">France</option>
                  <option value="BE">Belgique</option>
                  <option value="DE">Allemagne</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pays de destination</label>
                <select
                  value={costForm.to_country}
                  onChange={(e) => setCostForm({...costForm, to_country: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="FR">France</option>
                  <option value="BE">Belgique</option>
                  <option value="DE">Allemagne</option>
                  <option value="ES">Espagne</option>
                  <option value="IT">Italie</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code postal de destination</label>
                <input
                  type="text"
                  value={costForm.to_postal_code}
                  onChange={(e) => setCostForm({...costForm, to_postal_code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="75001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={costForm.weight}
                  onChange={(e) => setCostForm({...costForm, weight: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.5"
                />
              </div>
            </div>

            <button
              onClick={calculateShippingCost}
              disabled={loading || !costForm.to_postal_code}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Calculator className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Calcul en cours...' : 'Calculer les Frais'}
            </button>

            {shippingCost && (
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <h3 className="font-semibold mb-2">Résultat du Calcul</h3>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(shippingCost, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'parcels' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Mes Colis</h2>
          {parcels.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun colis créé pour le moment</p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Créer mon premier colis
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {parcels.map(parcel => (
                <div key={parcel.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{parcel.name}</h3>
                      <p className="text-gray-600">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {parcel.address}, {parcel.city} {parcel.postal_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parcel.status === 'En transit' ? 'bg-blue-100 text-blue-800' :
                        parcel.status === 'Livré' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {parcel.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Transporteur:</span>
                      <p className="font-medium">{parcel.carrier}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Numéro de suivi:</span>
                      <p className="font-medium">{parcel.tracking_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Créé le:</span>
                      <p className="font-medium">{new Date(parcel.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pays:</span>
                      <p className="font-medium">{parcel.country}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadLabel(parcel.id)}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Étiquette
                    </button>
                    <button
                      onClick={() => trackParcel(parcel.id)}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Suivre
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingManager;

