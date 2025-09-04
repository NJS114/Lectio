"""
Service SendCloud pour la gestion des expéditions
"""
import os
import requests
import base64
from typing import Dict, List, Optional, Any
import json

class SendCloudService:
    def __init__(self):
        self.public_key = os.getenv('SENDCLOUD_PUBLIC_KEY')
        self.secret_key = os.getenv('SENDCLOUD_SECRET_KEY')
        self.api_url = os.getenv('SENDCLOUD_API_URL', 'https://panel.sendcloud.sc/api/v2')
        
        if not self.public_key or not self.secret_key:
            raise ValueError("SendCloud API keys not configured")
        
        # Créer l'authentification Basic Auth
        credentials = f"{self.public_key}:{self.secret_key}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        self.headers = {
            'Authorization': f'Basic {encoded_credentials}',
            'Content-Type': 'application/json'
        }
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """Effectue une requête à l'API SendCloud"""
        url = f"{self.api_url}/{endpoint}"
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=self.headers, params=data)
            elif method.upper() == 'POST':
                response = requests.post(url, headers=self.headers, json=data)
            elif method.upper() == 'PUT':
                response = requests.put(url, headers=self.headers, json=data)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=self.headers)
            else:
                raise ValueError(f"Méthode HTTP non supportée: {method}")
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Erreur API SendCloud: {e}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    print(f"Détails de l'erreur: {error_data}")
                except:
                    print(f"Réponse d'erreur: {e.response.text}")
            raise
    
    def get_shipping_methods(self) -> List[Dict]:
        """Récupère les méthodes d'expédition disponibles"""
        try:
            response = self._make_request('GET', 'shipping-methods')
            return response.get('shipping_methods', [])
        except Exception as e:
            print(f"Erreur lors de la récupération des méthodes d'expédition: {e}")
            return []
    
    def calculate_shipping_cost(self, 
                              from_country: str,
                              to_country: str, 
                              to_postal_code: str,
                              weight: float,
                              shipping_method_id: Optional[int] = None) -> Dict:
        """Calcule le coût d'expédition"""
        try:
            data = {
                'from_country': from_country,
                'to_country': to_country,
                'to_postal_code': to_postal_code,
                'weight': str(weight),  # Poids en kg
            }
            
            if shipping_method_id:
                data['shipping_method'] = shipping_method_id
            
            response = self._make_request('POST', 'shipping-price', data)
            return response
        except Exception as e:
            print(f"Erreur lors du calcul des frais d'expédition: {e}")
            return {'error': str(e)}
    
    def create_parcel(self, parcel_data: Dict) -> Dict:
        """Crée un colis dans SendCloud"""
        try:
            # Validation des données requises
            required_fields = ['name', 'address', 'city', 'postal_code', 'country']
            for field in required_fields:
                if field not in parcel_data:
                    raise ValueError(f"Champ requis manquant: {field}")
            
            # Structure des données pour SendCloud
            sendcloud_data = {
                'parcel': {
                    'name': parcel_data['name'],
                    'company_name': parcel_data.get('company_name', ''),
                    'address': parcel_data['address'],
                    'address_2': parcel_data.get('address_2', ''),
                    'city': parcel_data['city'],
                    'postal_code': parcel_data['postal_code'],
                    'country': parcel_data['country'],
                    'telephone': parcel_data.get('telephone', ''),
                    'email': parcel_data.get('email', ''),
                    'weight': str(parcel_data.get('weight', 0.5)),  # Poids par défaut 500g
                    'order_number': parcel_data.get('order_number', ''),
                    'insured_value': parcel_data.get('insured_value', 0),
                    'shipping_method': parcel_data.get('shipping_method_id'),
                    'request_label': True,  # Demander l'étiquette automatiquement
                }
            }
            
            response = self._make_request('POST', 'parcels', sendcloud_data)
            return response
        except Exception as e:
            print(f"Erreur lors de la création du colis: {e}")
            return {'error': str(e)}
    
    def get_parcel(self, parcel_id: int) -> Dict:
        """Récupère les informations d'un colis"""
        try:
            response = self._make_request('GET', f'parcels/{parcel_id}')
            return response
        except Exception as e:
            print(f"Erreur lors de la récupération du colis {parcel_id}: {e}")
            return {'error': str(e)}
    
    def get_parcel_status(self, parcel_id: int) -> Dict:
        """Récupère le statut d'un colis"""
        try:
            parcel = self.get_parcel(parcel_id)
            if 'error' in parcel:
                return parcel
            
            parcel_data = parcel.get('parcel', {})
            return {
                'id': parcel_data.get('id'),
                'status': parcel_data.get('status', {}).get('message', 'Inconnu'),
                'tracking_number': parcel_data.get('tracking_number'),
                'tracking_url': parcel_data.get('tracking_url'),
                'carrier': parcel_data.get('carrier', {}).get('name', 'Inconnu'),
                'created_at': parcel_data.get('date_created'),
                'updated_at': parcel_data.get('date_updated')
            }
        except Exception as e:
            print(f"Erreur lors de la récupération du statut du colis {parcel_id}: {e}")
            return {'error': str(e)}
    
    def get_label_pdf(self, parcel_id: int) -> Optional[str]:
        """Récupère l'URL du PDF de l'étiquette"""
        try:
            parcel = self.get_parcel(parcel_id)
            if 'error' in parcel:
                return None
            
            parcel_data = parcel.get('parcel', {})
            return parcel_data.get('label', {}).get('label_printer')
        except Exception as e:
            print(f"Erreur lors de la récupération de l'étiquette du colis {parcel_id}: {e}")
            return None
    
    def cancel_parcel(self, parcel_id: int) -> Dict:
        """Annule un colis"""
        try:
            response = self._make_request('POST', f'parcels/{parcel_id}/cancel')
            return response
        except Exception as e:
            print(f"Erreur lors de l'annulation du colis {parcel_id}: {e}")
            return {'error': str(e)}
    
    def get_user_info(self) -> Dict:
        """Récupère les informations de l'utilisateur SendCloud"""
        try:
            response = self._make_request('GET', 'user')
            return response
        except Exception as e:
            print(f"Erreur lors de la récupération des informations utilisateur: {e}")
            return {'error': str(e)}
    
    def test_connection(self) -> Dict:
        """Teste la connexion à l'API SendCloud"""
        try:
            user_info = self.get_user_info()
            if 'error' in user_info:
                return {
                    'success': False,
                    'error': user_info['error']
                }
            
            return {
                'success': True,
                'message': 'Connexion SendCloud réussie',
                'user': user_info.get('user', {}).get('username', 'Inconnu')
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# Instance globale du service
sendcloud_service = SendCloudService()

