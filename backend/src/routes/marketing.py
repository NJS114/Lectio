from flask import Blueprint, request, jsonify
from datetime import datetime, date, timedelta
from src.models.user import db, User
from src.models.analytics import Promotion
import random
import string

marketing_bp = Blueprint('marketing', __name__)

@marketing_bp.route('/marketing/promotions/<int:bookstore_id>', methods=['GET'])
def get_promotions(bookstore_id):
    """Récupère les promotions d'un libraire"""
    try:
        promotions = Promotion.query.filter_by(creator_id=bookstore_id).all()
        
        return jsonify({
            'success': True,
            'data': [promo.to_dict() for promo in promotions]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@marketing_bp.route('/marketing/promotions', methods=['POST'])
def create_promotion():
    """Crée une nouvelle promotion"""
    try:
        data = request.get_json()
        
        # Génération automatique du code promo si non fourni
        promo_code = data.get('promo_code')
        if not promo_code:
            promo_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
        promotion = Promotion(
            title=data['title'],
            description=data.get('description', ''),
            promotion_type=data['promotion_type'],
            discount_value=float(data['discount_value']),
            promo_code=promo_code,
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date(),
            max_uses=data.get('max_uses'),
            min_order_amount=data.get('min_order_amount'),
            creator_id=data['creator_id']
        )
        
        db.session.add(promotion)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': promotion.to_dict(),
            'message': 'Promotion créée avec succès'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@marketing_bp.route('/marketing/promotions/<int:promotion_id>', methods=['PUT'])
def update_promotion(promotion_id):
    """Met à jour une promotion"""
    try:
        promotion = Promotion.query.get_or_404(promotion_id)
        data = request.get_json()
        
        # Mise à jour des champs
        if 'title' in data:
            promotion.title = data['title']
        if 'description' in data:
            promotion.description = data['description']
        if 'discount_value' in data:
            promotion.discount_value = float(data['discount_value'])
        if 'is_active' in data:
            promotion.is_active = data['is_active']
        if 'max_uses' in data:
            promotion.max_uses = data['max_uses']
        if 'min_order_amount' in data:
            promotion.min_order_amount = data['min_order_amount']
        
        promotion.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': promotion.to_dict(),
            'message': 'Promotion mise à jour'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@marketing_bp.route('/marketing/promotions/<int:promotion_id>', methods=['DELETE'])
def delete_promotion(promotion_id):
    """Supprime une promotion"""
    try:
        promotion = Promotion.query.get_or_404(promotion_id)
        
        db.session.delete(promotion)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Promotion supprimée'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@marketing_bp.route('/marketing/stats/<int:bookstore_id>', methods=['GET'])
def get_marketing_stats(bookstore_id):
    """Statistiques marketing pour un libraire"""
    try:
        # Promotions actives
        active_promotions = Promotion.query.filter(
            Promotion.creator_id == bookstore_id,
            Promotion.is_active == True,
            Promotion.start_date <= date.today(),
            Promotion.end_date >= date.today()
        ).count()
        
        # Total des promotions
        total_promotions = Promotion.query.filter_by(creator_id=bookstore_id).count()
        
        # Utilisations des promotions (simulé)
        total_promo_sales = random.randint(100, 500)
        promo_revenue = random.randint(1000, 5000)
        
        # Statistiques newsletter (simulées)
        newsletter_subscribers = random.randint(500, 2000)
        open_rate = round(random.uniform(20, 35), 1)
        click_rate = round(random.uniform(2, 8), 1)
        
        return jsonify({
            'success': True,
            'data': {
                'promotions': {
                    'active': active_promotions,
                    'total': total_promotions,
                    'sales_from_promos': total_promo_sales,
                    'revenue_from_promos': promo_revenue
                },
                'newsletter': {
                    'subscribers': newsletter_subscribers,
                    'open_rate': open_rate,
                    'click_rate': click_rate,
                    'last_campaign_sent': (datetime.now() - timedelta(days=random.randint(1, 7))).isoformat()
                }
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@marketing_bp.route('/marketing/newsletter/send', methods=['POST'])
def send_newsletter():
    """Envoie une newsletter"""
    try:
        data = request.get_json()
        
        # Simulation de l'envoi
        template_type = data.get('template', 'custom')
        subject = data.get('subject', 'Newsletter Lectio')
        content = data.get('content', '')
        
        # Simulation des statistiques d'envoi
        sent_count = random.randint(800, 1500)
        
        return jsonify({
            'success': True,
            'data': {
                'sent_count': sent_count,
                'template_used': template_type,
                'subject': subject,
                'sent_at': datetime.now().isoformat()
            },
            'message': f'Newsletter envoyée à {sent_count} abonnés'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@marketing_bp.route('/marketing/campaigns/<int:bookstore_id>', methods=['GET'])
def get_campaigns(bookstore_id):
    """Récupère les campagnes marketing d'un libraire"""
    try:
        # Simulation de campagnes
        campaigns = [
            {
                'id': 1,
                'name': 'Rentrée Littéraire 2024',
                'type': 'email',
                'status': 'active',
                'start_date': (date.today() - timedelta(days=10)).isoformat(),
                'end_date': (date.today() + timedelta(days=20)).isoformat(),
                'budget': 500,
                'spent': 245,
                'impressions': 12500,
                'clicks': 340,
                'conversions': 23
            },
            {
                'id': 2,
                'name': 'Promotion Été',
                'type': 'social',
                'status': 'completed',
                'start_date': (date.today() - timedelta(days=60)).isoformat(),
                'end_date': (date.today() - timedelta(days=30)).isoformat(),
                'budget': 300,
                'spent': 300,
                'impressions': 8900,
                'clicks': 180,
                'conversions': 15
            }
        ]
        
        return jsonify({
            'success': True,
            'data': campaigns
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@marketing_bp.route('/marketing/recommendations/<int:bookstore_id>', methods=['GET'])
def get_marketing_recommendations(bookstore_id):
    """Recommandations marketing IA pour un libraire"""
    try:
        # Simulation de recommandations IA
        recommendations = [
            {
                'type': 'promotion',
                'title': 'Créer une promotion pour les romans',
                'description': 'Les romans représentent 45% de vos ventes. Une promotion de 15% pourrait augmenter les ventes de 25%.',
                'priority': 'high',
                'estimated_impact': '+25% de ventes',
                'action': 'create_promotion'
            },
            {
                'type': 'newsletter',
                'title': 'Envoyer une newsletter sur les nouveautés',
                'description': 'Vos abonnés n\'ont pas reçu de newsletter depuis 8 jours. Le taux d\'ouverture optimal est atteint avec un envoi hebdomadaire.',
                'priority': 'medium',
                'estimated_impact': '+12% d\'engagement',
                'action': 'send_newsletter'
            },
            {
                'type': 'event',
                'title': 'Organiser un événement littéraire',
                'description': 'Les événements génèrent en moyenne 15% de ventes supplémentaires. Considérez une rencontre d\'auteur.',
                'priority': 'medium',
                'estimated_impact': '+15% de ventes',
                'action': 'create_event'
            }
        ]
        
        return jsonify({
            'success': True,
            'data': recommendations
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

