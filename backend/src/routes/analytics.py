from flask import Blueprint, request, jsonify
from datetime import datetime, date, timedelta
from src.models.user import db, User
from src.models.analytics import Sale, DailyAnalytics, Promotion
from src.models.book import Book, Ebook
import random
from io import StringIO
import csv

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics/dashboard/<int:bookstore_id>', methods=['GET'])
def get_bookstore_analytics(bookstore_id):
    """Récupère les analytics pour un libraire spécifique"""
    try:
        # Période par défaut : 30 derniers jours
        period = request.args.get('period', '30')
        
        # Calcul des dates
        end_date = date.today()
        if period == '7':
            start_date = end_date - timedelta(days=7)
        elif period == '30':
            start_date = end_date - timedelta(days=30)
        elif period == '90':
            start_date = end_date - timedelta(days=90)
        elif period == '180':
            start_date = end_date - timedelta(days=180)
        elif period == '365':
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)
        
        # Récupération des ventes
        sales = Sale.query.filter(
            Sale.seller_id == bookstore_id,
            Sale.sale_date >= start_date,
            Sale.sale_date <= end_date
        ).all()
        
        # Calcul des métriques
        total_revenue = sum(sale.seller_revenue for sale in sales)
        total_sales = len(sales)
        total_commission = sum(sale.platform_commission for sale in sales)
        
        # Visiteurs simulés (à remplacer par vraies données)
        total_visitors = random.randint(1000, 5000)
        conversion_rate = (total_sales / total_visitors * 100) if total_visitors > 0 else 0
        
        # Panier moyen
        average_order = total_revenue / total_sales if total_sales > 0 else 0
        
        # Évolution quotidienne
        daily_sales = {}
        current_date = start_date
        while current_date <= end_date:
            daily_sales[current_date.isoformat()] = {
                'revenue': 0,
                'orders': 0
            }
            current_date += timedelta(days=1)
        
        for sale in sales:
            date_key = sale.sale_date.isoformat()
            if date_key in daily_sales:
                daily_sales[date_key]['revenue'] += sale.seller_revenue
                daily_sales[date_key]['orders'] += 1
        
        # Top livres
        book_sales = {}
        for sale in sales:
            if sale.book:
                title = sale.book.title
                if title not in book_sales:
                    book_sales[title] = {'sales': 0, 'revenue': 0}
                book_sales[title]['sales'] += 1
                book_sales[title]['revenue'] += sale.seller_revenue
        
        top_books = sorted(book_sales.items(), key=lambda x: x[1]['sales'], reverse=True)[:5]
        
        return jsonify({
            'success': True,
            'data': {
                'period': period,
                'metrics': {
                    'total_revenue': round(total_revenue, 2),
                    'total_sales': total_sales,
                    'total_visitors': total_visitors,
                    'conversion_rate': round(conversion_rate, 2),
                    'average_order': round(average_order, 2),
                    'total_commission': round(total_commission, 2)
                },
                'daily_evolution': [
                    {
                        'date': date_str,
                        'revenue': round(data['revenue'], 2),
                        'orders': data['orders']
                    }
                    for date_str, data in daily_sales.items()
                ],
                'top_books': [
                    {
                        'title': title,
                        'sales': data['sales'],
                        'revenue': round(data['revenue'], 2)
                    }
                    for title, data in top_books
                ]
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/analytics/export/<int:bookstore_id>', methods=['POST'])
def export_analytics(bookstore_id):
    """Exporte les données analytics en différents formats"""
    try:
        data = request.get_json()
        export_format = data.get('format', 'csv')  # csv, pdf, excel
        period = data.get('period', '30')
        
        # Récupération des données
        end_date = date.today()
        if period == '7':
            start_date = end_date - timedelta(days=7)
        else:
            start_date = end_date - timedelta(days=30)
        
        sales = Sale.query.filter(
            Sale.seller_id == bookstore_id,
            Sale.sale_date >= start_date,
            Sale.sale_date <= end_date
        ).all()
        
        if export_format == 'csv':
            # Export CSV
            output = StringIO()
            writer = csv.writer(output)
            
            # Headers
            writer.writerow(['Date', 'Chiffre d\'affaires', 'Nombre de commandes'])
            
            # Données quotidiennes
            daily_data = {}
            for sale in sales:
                date_key = sale.sale_date.isoformat()
                if date_key not in daily_data:
                    daily_data[date_key] = {'revenue': 0, 'orders': 0}
                daily_data[date_key]['revenue'] += sale.seller_revenue
                daily_data[date_key]['orders'] += 1
            
            for date_str, data in sorted(daily_data.items()):
                writer.writerow([date_str, data['revenue'], data['orders']])
            
            csv_content = output.getvalue()
            output.close()
            
            return jsonify({
                'success': True,
                'data': {
                    'content': csv_content,
                    'filename': f'ventes-quotidiennes-{period}j-{datetime.now().strftime("%Y%m%d")}.csv',
                    'format': 'csv'
                }
            })
        
        elif export_format == 'pdf':
            # Export PDF (simulé avec du texte)
            total_revenue = sum(sale.seller_revenue for sale in sales)
            total_sales = len(sales)
            
            pdf_content = f"""RAPPORT ANALYTICS - PÉRIODE {period} JOURS
Date de génération: {datetime.now().strftime('%d/%m/%Y %H:%M')}

MÉTRIQUES PRINCIPALES
- Chiffre d'affaires: {total_revenue:.2f}€
- Nombre de commandes: {total_sales}
- Panier moyen: {(total_revenue/total_sales if total_sales > 0 else 0):.2f}€

TOP LIVRES VENDUS
"""
            
            # Top livres
            book_sales = {}
            for sale in sales:
                if sale.book:
                    title = sale.book.title
                    if title not in book_sales:
                        book_sales[title] = 0
                    book_sales[title] += 1
            
            for i, (title, count) in enumerate(sorted(book_sales.items(), key=lambda x: x[1], reverse=True)[:5], 1):
                pdf_content += f"{i}. {title} - {count} ventes\n"
            
            return jsonify({
                'success': True,
                'data': {
                    'content': pdf_content,
                    'filename': f'rapport-analytics-{period}j-{datetime.now().strftime("%Y%m%d")}.txt',
                    'format': 'pdf'
                }
            })
        
        else:
            return jsonify({'success': False, 'error': 'Format non supporté'}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/analytics/global', methods=['GET'])
def get_global_analytics():
    """Analytics globales de la plateforme"""
    try:
        # Métriques globales
        total_users = User.query.count()
        total_bookstores = User.query.filter_by(user_type='bookstore').count()
        total_books = Book.query.count()
        total_ebooks = Ebook.query.count()
        
        # Ventes récentes
        recent_sales = Sale.query.filter(
            Sale.sale_date >= date.today() - timedelta(days=30)
        ).all()
        
        total_revenue = sum(sale.item_price for sale in recent_sales)
        platform_commission = sum(sale.platform_commission for sale in recent_sales)
        
        return jsonify({
            'success': True,
            'data': {
                'users': total_users,
                'bookstores': total_bookstores,
                'books': total_books,
                'ebooks': total_ebooks,
                'monthly_revenue': round(total_revenue, 2),
                'monthly_commission': round(platform_commission, 2),
                'monthly_sales': len(recent_sales)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

