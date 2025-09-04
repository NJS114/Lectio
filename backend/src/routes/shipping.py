"""
Routes pour la gestion des expéditions avec SendCloud
"""
from flask import Blueprint, request, jsonify
from ..services.sendcloud_service import sendcloud_service
import traceback

shipping_bp = Blueprint('shipping', __name__)

@shipping_bp.route('/test', methods=['GET'])
def test_sendcloud():
    """Test de la connexion SendCloud"""
    try:
        result = sendcloud_service.test_connection()
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erreur lors du test SendCloud: {str(e)}'
        }), 500

@shipping_bp.route('/methods', methods=['GET'])
def get_shipping_methods():
    """Récupère les méthodes d'expédition disponibles"""
    try:
        methods = sendcloud_service.get_shipping_methods()
        
        # Formater les méthodes pour le frontend
        formatted_methods = []
        for method in methods:
            formatted_methods.append({
                'id': method.get('id'),
                'name': method.get('name'),
                'carrier': method.get('carrier'),
                'min_weight': method.get('min_weight'),
                'max_weight': method.get('max_weight'),
                'price': method.get('price'),
                'countries': method.get('countries', [])
            })
        
        return jsonify({
            'success': True,
            'methods': formatted_methods
        })
    except Exception as e:
        print(f"Erreur lors de la récupération des méthodes d'expédition: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shipping_bp.route('/calculate-cost', methods=['POST'])
def calculate_shipping_cost():
    """Calcule le coût d'expédition"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        required_fields = ['from_country', 'to_country', 'to_postal_code', 'weight']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Champ requis manquant: {field}'
                }), 400
        
        result = sendcloud_service.calculate_shipping_cost(
            from_country=data['from_country'],
            to_country=data['to_country'],
            to_postal_code=data['to_postal_code'],
            weight=float(data['weight']),
            shipping_method_id=data.get('shipping_method_id')
        )
        
        if 'error' in result:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
        
        return jsonify({
            'success': True,
            'cost': result
        })
    except Exception as e:
        print(f"Erreur lors du calcul des frais d'expédition: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shipping_bp.route('/create-parcel', methods=['POST'])
def create_parcel():
    """Crée un nouveau colis"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        required_fields = ['name', 'address', 'city', 'postal_code', 'country']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Champ requis manquant: {field}'
                }), 400
        
        result = sendcloud_service.create_parcel(data)
        
        if 'error' in result:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
        
        # Extraire les informations importantes du colis créé
        parcel_data = result.get('parcel', {})
        
        return jsonify({
            'success': True,
            'parcel': {
                'id': parcel_data.get('id'),
                'tracking_number': parcel_data.get('tracking_number'),
                'tracking_url': parcel_data.get('tracking_url'),
                'status': parcel_data.get('status', {}).get('message', 'Créé'),
                'carrier': parcel_data.get('carrier', {}).get('name', 'Inconnu'),
                'label_url': parcel_data.get('label', {}).get('label_printer'),
                'created_at': parcel_data.get('date_created')
            }
        })
    except Exception as e:
        print(f"Erreur lors de la création du colis: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shipping_bp.route('/parcel/<int:parcel_id>', methods=['GET'])
def get_parcel(parcel_id):
    """Récupère les informations d'un colis"""
    try:
        result = sendcloud_service.get_parcel(parcel_id)
        
        if 'error' in result:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 404
        
        parcel_data = result.get('parcel', {})
        
        return jsonify({
            'success': True,
            'parcel': {
                'id': parcel_data.get('id'),
                'name': parcel_data.get('name'),
                'address': parcel_data.get('address'),
                'city': parcel_data.get('city'),
                'postal_code': parcel_data.get('postal_code'),
                'country': parcel_data.get('country'),
                'tracking_number': parcel_data.get('tracking_number'),
                'tracking_url': parcel_data.get('tracking_url'),
                'status': parcel_data.get('status', {}).get('message', 'Inconnu'),
                'carrier': parcel_data.get('carrier', {}).get('name', 'Inconnu'),
                'weight': parcel_data.get('weight'),
                'label_url': parcel_data.get('label', {}).get('label_printer'),
                'created_at': parcel_data.get('date_created'),
                'updated_at': parcel_data.get('date_updated')
            }
        })
    except Exception as e:
        print(f"Erreur lors de la récupération du colis {parcel_id}: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shipping_bp.route('/parcel/<int:parcel_id>/status', methods=['GET'])
def get_parcel_status(parcel_id):
    """Récupère le statut d'un colis"""
    try:
        result = sendcloud_service.get_parcel_status(parcel_id)
        
        if 'error' in result:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 404
        
        return jsonify({
            'success': True,
            'status': result
        })
    except Exception as e:
        print(f"Erreur lors de la récupération du statut du colis {parcel_id}: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shipping_bp.route('/parcel/<int:parcel_id>/label', methods=['GET'])
def get_parcel_label(parcel_id):
    """Récupère l'URL de l'étiquette d'un colis"""
    try:
        label_url = sendcloud_service.get_label_pdf(parcel_id)
        
        if not label_url:
            return jsonify({
                'success': False,
                'error': 'Étiquette non disponible'
            }), 404
        
        return jsonify({
            'success': True,
            'label_url': label_url
        })
    except Exception as e:
        print(f"Erreur lors de la récupération de l'étiquette du colis {parcel_id}: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shipping_bp.route('/parcel/<int:parcel_id>/cancel', methods=['POST'])
def cancel_parcel(parcel_id):
    """Annule un colis"""
    try:
        result = sendcloud_service.cancel_parcel(parcel_id)
        
        if 'error' in result:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
        
        return jsonify({
            'success': True,
            'message': 'Colis annulé avec succès'
        })
    except Exception as e:
        print(f"Erreur lors de l'annulation du colis {parcel_id}: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@shipping_bp.route('/user-info', methods=['GET'])
def get_user_info():
    """Récupère les informations de l'utilisateur SendCloud"""
    try:
        result = sendcloud_service.get_user_info()
        
        if 'error' in result:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
        
        user_data = result.get('user', {})
        
        return jsonify({
            'success': True,
            'user': {
                'username': user_data.get('username'),
                'email': user_data.get('email'),
                'company_name': user_data.get('company_name'),
                'address': user_data.get('address'),
                'city': user_data.get('city'),
                'postal_code': user_data.get('postal_code'),
                'country': user_data.get('country')
            }
        })
    except Exception as e:
        print(f"Erreur lors de la récupération des informations utilisateur: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

