from flask import Blueprint, request, jsonify
from datetime import datetime, date, timedelta
from src.models.user import db, User
from src.models.analytics import Sale
import random
import string

ecosystem_bp = Blueprint('ecosystem', __name__)

@ecosystem_bp.route('/ecosystem/pricing/calculate', methods=['POST'])
def calculate_pricing():
    """Calcule les prix avec commission 20% et frais écosystème"""
    try:
        data = request.get_json()
        
        base_price = float(data['base_price'])
        transaction_type = data.get('transaction_type', 'sale')  # sale ou rental
        
        # Commission plateforme : 20%
        platform_commission = base_price * 0.20
        
        # Frais additionnels écosystème
        shipping_fee = 3.50 if transaction_type == 'sale' else 0  # Pas de frais pour location
        handling_fee = 1.50
        
        # Calculs finaux
        seller_revenue = base_price * 0.80  # 80% pour le vendeur
        total_buyer_cost = base_price + shipping_fee + handling_fee
        platform_total_revenue = platform_commission + shipping_fee + handling_fee
        
        # Détail des coûts
        cost_breakdown = {
            'base_price': round(base_price, 2),
            'platform_commission': round(platform_commission, 2),
            'shipping_fee': round(shipping_fee, 2),
            'handling_fee': round(handling_fee, 2),
            'seller_revenue': round(seller_revenue, 2),
            'total_buyer_cost': round(total_buyer_cost, 2),
            'platform_total_revenue': round(platform_total_revenue, 2),
            'commission_rate': 20.0,
            'transaction_type': transaction_type
        }
        
        return jsonify({
            'success': True,
            'data': cost_breakdown
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@ecosystem_bp.route('/ecosystem/commission/rates/<int:seller_id>', methods=['GET'])
def get_commission_rates(seller_id):
    """Récupère les taux de commission pour un vendeur (dégressifs selon volume)"""
    try:
        # Calculer le volume de ventes des 30 derniers jours
        thirty_days_ago = date.today() - timedelta(days=30)
        
        monthly_sales = Sale.query.filter(
            Sale.seller_id == seller_id,
            Sale.sale_date >= thirty_days_ago
        ).all()
        
        monthly_revenue = sum(sale.item_price for sale in monthly_sales)
        monthly_count = len(monthly_sales)
        
        # Taux dégressifs selon le volume
        if monthly_revenue >= 5000:
            commission_rate = 10.0  # 10% pour gros volumes
            tier = 'premium'
        elif monthly_revenue >= 2000:
            commission_rate = 15.0  # 15% pour volumes moyens
            tier = 'advanced'
        else:
            commission_rate = 20.0  # 20% taux standard
            tier = 'standard'
        
        # Prochains paliers
        next_tier_info = {}
        if tier == 'standard':
            next_tier_info = {
                'target_revenue': 2000,
                'target_rate': 15.0,
                'remaining': max(0, 2000 - monthly_revenue)
            }
        elif tier == 'advanced':
            next_tier_info = {
                'target_revenue': 5000,
                'target_rate': 10.0,
                'remaining': max(0, 5000 - monthly_revenue)
            }
        
        return jsonify({
            'success': True,
            'data': {
                'current_rate': commission_rate,
                'tier': tier,
                'monthly_revenue': round(monthly_revenue, 2),
                'monthly_sales': monthly_count,
                'next_tier': next_tier_info,
                'rate_history': [
                    {'tier': 'standard', 'rate': 20.0, 'min_revenue': 0},
                    {'tier': 'advanced', 'rate': 15.0, 'min_revenue': 2000},
                    {'tier': 'premium', 'rate': 10.0, 'min_revenue': 5000}
                ]
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@ecosystem_bp.route('/ecosystem/revenue/breakdown/<int:seller_id>', methods=['GET'])
def get_revenue_breakdown(seller_id):
    """Analyse détaillée des revenus pour un vendeur"""
    try:
        period = request.args.get('period', '30')  # jours
        
        # Période de calcul
        end_date = date.today()
        start_date = end_date - timedelta(days=int(period))
        
        sales = Sale.query.filter(
            Sale.seller_id == seller_id,
            Sale.sale_date >= start_date,
            Sale.sale_date <= end_date
        ).all()
        
        # Calculs
        total_gross_revenue = sum(sale.item_price for sale in sales)
        total_commission_paid = sum(sale.platform_commission for sale in sales)
        total_net_revenue = sum(sale.seller_revenue for sale in sales)
        
        # Répartition par type de transaction
        sales_revenue = sum(sale.seller_revenue for sale in sales if sale.transaction_type == 'sale')
        rental_revenue = sum(sale.seller_revenue for sale in sales if sale.transaction_type == 'rental')
        
        # Évolution quotidienne
        daily_breakdown = {}
        current_date = start_date
        while current_date <= end_date:
            daily_breakdown[current_date.isoformat()] = {
                'gross': 0,
                'net': 0,
                'commission': 0,
                'sales_count': 0
            }
            current_date += timedelta(days=1)
        
        for sale in sales:
            date_key = sale.sale_date.isoformat()
            if date_key in daily_breakdown:
                daily_breakdown[date_key]['gross'] += sale.item_price
                daily_breakdown[date_key]['net'] += sale.seller_revenue
                daily_breakdown[date_key]['commission'] += sale.platform_commission
                daily_breakdown[date_key]['sales_count'] += 1
        
        return jsonify({
            'success': True,
            'data': {
                'period_days': int(period),
                'summary': {
                    'total_gross_revenue': round(total_gross_revenue, 2),
                    'total_commission_paid': round(total_commission_paid, 2),
                    'total_net_revenue': round(total_net_revenue, 2),
                    'commission_rate': round((total_commission_paid / total_gross_revenue * 100) if total_gross_revenue > 0 else 0, 1),
                    'total_transactions': len(sales)
                },
                'by_type': {
                    'sales_revenue': round(sales_revenue, 2),
                    'rental_revenue': round(rental_revenue, 2)
                },
                'daily_evolution': [
                    {
                        'date': date_str,
                        'gross_revenue': round(data['gross'], 2),
                        'net_revenue': round(data['net'], 2),
                        'commission_paid': round(data['commission'], 2),
                        'sales_count': data['sales_count']
                    }
                    for date_str, data in daily_breakdown.items()
                ]
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Système d'affiliation
@ecosystem_bp.route('/ecosystem/affiliate/generate-code/<int:user_id>', methods=['POST'])
def generate_affiliate_code(user_id):
    """Génère un code d'affiliation pour un utilisateur"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Générer un code unique si pas déjà existant
        if not user.affiliate_code:
            # Code basé sur le nom + chiffres aléatoires
            base_code = ''.join(c for c in user.username.upper() if c.isalnum())[:4]
            random_suffix = ''.join(random.choices(string.digits, k=4))
            affiliate_code = f"{base_code}{random_suffix}"
            
            # Vérifier l'unicité
            while User.query.filter_by(affiliate_code=affiliate_code).first():
                random_suffix = ''.join(random.choices(string.digits, k=4))
                affiliate_code = f"{base_code}{random_suffix}"
            
            user.affiliate_code = affiliate_code
            db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'affiliate_code': user.affiliate_code,
                'affiliate_url': f"https://lectio.fr?ref={user.affiliate_code}",
                'commission_rate': 5.0  # 5% sur les ventes générées
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@ecosystem_bp.route('/ecosystem/affiliate/stats/<int:user_id>', methods=['GET'])
def get_affiliate_stats(user_id):
    """Statistiques d'affiliation pour un utilisateur"""
    try:
        user = User.query.get_or_404(user_id)
        
        if not user.affiliate_code:
            return jsonify({
                'success': True,
                'data': {
                    'has_affiliate_program': False,
                    'message': 'Code d\'affiliation non généré'
                }
            })
        
        # Récupérer les filleuls
        referrals = User.query.filter_by(referrer_id=user_id).all()
        
        # Calculer les commissions (simulé)
        total_referrals = len(referrals)
        active_referrals = len([r for r in referrals if r.total_purchases > 0])
        
        # Commissions gagnées (5% des achats des filleuls)
        total_commission = 0
        for referral in referrals:
            total_commission += referral.total_purchases * 0.05
        
        # Statistiques mensuelles (simulées)
        monthly_clicks = random.randint(50, 300)
        monthly_conversions = random.randint(2, 15)
        conversion_rate = (monthly_conversions / monthly_clicks * 100) if monthly_clicks > 0 else 0
        
        return jsonify({
            'success': True,
            'data': {
                'has_affiliate_program': True,
                'affiliate_code': user.affiliate_code,
                'total_referrals': total_referrals,
                'active_referrals': active_referrals,
                'total_commission_earned': round(total_commission, 2),
                'monthly_stats': {
                    'clicks': monthly_clicks,
                    'conversions': monthly_conversions,
                    'conversion_rate': round(conversion_rate, 2),
                    'estimated_monthly_commission': round(total_commission / 12, 2)
                },
                'referrals_list': [
                    {
                        'id': r.id,
                        'name': r.name,
                        'joined_date': r.created_at.isoformat() if r.created_at else None,
                        'total_spent': round(r.total_purchases, 2),
                        'commission_generated': round(r.total_purchases * 0.05, 2)
                    }
                    for r in referrals[:10]  # Top 10
                ]
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@ecosystem_bp.route('/ecosystem/platform/stats', methods=['GET'])
def get_platform_stats():
    """Statistiques globales de l'écosystème Lectio"""
    try:
        # Métriques globales
        total_users = User.query.count()
        total_bookstores = User.query.filter_by(user_type='bookstore').count()
        
        # Revenus des 30 derniers jours
        thirty_days_ago = date.today() - timedelta(days=30)
        recent_sales = Sale.query.filter(Sale.sale_date >= thirty_days_ago).all()
        
        monthly_gross_revenue = sum(sale.item_price for sale in recent_sales)
        monthly_commission = sum(sale.platform_commission for sale in recent_sales)
        monthly_transactions = len(recent_sales)
        
        # Répartition par type
        sales_count = len([s for s in recent_sales if s.transaction_type == 'sale'])
        rentals_count = len([s for s in recent_sales if s.transaction_type == 'rental'])
        
        # Croissance (simulée)
        growth_rate = random.uniform(15, 35)
        
        return jsonify({
            'success': True,
            'data': {
                'ecosystem_health': {
                    'total_users': total_users,
                    'active_bookstores': total_bookstores,
                    'monthly_transactions': monthly_transactions,
                    'growth_rate': round(growth_rate, 1)
                },
                'revenue_metrics': {
                    'monthly_gross_revenue': round(monthly_gross_revenue, 2),
                    'monthly_commission': round(monthly_commission, 2),
                    'commission_rate': round((monthly_commission / monthly_gross_revenue * 100) if monthly_gross_revenue > 0 else 0, 1),
                    'average_transaction': round(monthly_gross_revenue / monthly_transactions, 2) if monthly_transactions > 0 else 0
                },
                'transaction_breakdown': {
                    'sales': sales_count,
                    'rentals': rentals_count,
                    'sales_percentage': round((sales_count / monthly_transactions * 100) if monthly_transactions > 0 else 0, 1)
                }
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

