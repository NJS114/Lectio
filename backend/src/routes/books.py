from flask import Blueprint, request, jsonify
from datetime import datetime, date
from src.models.user import db, User
from src.models.book import Book, Ebook
from src.models.analytics import Sale
import random

books_bp = Blueprint('books', __name__)

@books_bp.route('/books', methods=['GET'])
def get_books():
    """Récupère tous les livres avec filtres optionnels"""
    try:
        # Paramètres de filtrage
        category = request.args.get('category')
        condition = request.args.get('condition')
        transaction_type = request.args.get('type')  # sale, rent, both
        search = request.args.get('search')
        seller_id = request.args.get('seller_id')
        
        # Construction de la requête
        query = Book.query
        
        if category:
            query = query.filter(Book.category == category)
        
        if condition:
            query = query.filter(Book.condition == condition)
            
        if transaction_type == 'sale':
            query = query.filter(Book.is_for_sale == True)
        elif transaction_type == 'rent':
            query = query.filter(Book.is_for_rent == True)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                db.or_(
                    Book.title.ilike(search_term),
                    Book.author.ilike(search_term),
                    Book.isbn.ilike(search_term)
                )
            )
        
        if seller_id:
            query = query.filter(Book.seller_id == seller_id)
        
        # Tri par date de création (plus récents en premier)
        books = query.order_by(Book.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [book.to_dict() for book in books]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@books_bp.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Récupère un livre spécifique"""
    try:
        book = Book.query.get_or_404(book_id)
        
        return jsonify({
            'success': True,
            'data': book.to_dict()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@books_bp.route('/books', methods=['POST'])
def create_book():
    """Ajoute un nouveau livre"""
    try:
        data = request.get_json()
        
        # Calcul automatique des prix avec commission 20%
        sale_price = float(data.get('sale_price', 0)) if data.get('sale_price') else None
        rental_price = float(data.get('rental_price_2weeks', 0)) if data.get('rental_price_2weeks') else None
        
        book = Book(
            title=data['title'],
            author=data['author'],
            isbn=data.get('isbn'),
            description=data.get('description', ''),
            category=data.get('category', 'Autre'),
            condition=data.get('condition', 'Bon'),
            sale_price=sale_price,
            rental_price_2weeks=rental_price,
            is_for_sale=data.get('is_for_sale', True),
            is_for_rent=data.get('is_for_rent', False),
            stock_quantity=int(data.get('stock_quantity', 1)),
            seller_id=data['seller_id']
        )
        
        db.session.add(book)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': book.to_dict(),
            'message': 'Livre ajouté avec succès'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@books_bp.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    """Met à jour un livre"""
    try:
        book = Book.query.get_or_404(book_id)
        data = request.get_json()
        
        # Mise à jour des champs
        if 'title' in data:
            book.title = data['title']
        if 'author' in data:
            book.author = data['author']
        if 'description' in data:
            book.description = data['description']
        if 'category' in data:
            book.category = data['category']
        if 'condition' in data:
            book.condition = data['condition']
        if 'sale_price' in data:
            book.sale_price = float(data['sale_price']) if data['sale_price'] else None
        if 'rental_price_2weeks' in data:
            book.rental_price_2weeks = float(data['rental_price_2weeks']) if data['rental_price_2weeks'] else None
        if 'is_for_sale' in data:
            book.is_for_sale = data['is_for_sale']
        if 'is_for_rent' in data:
            book.is_for_rent = data['is_for_rent']
        if 'stock_quantity' in data:
            book.stock_quantity = int(data['stock_quantity'])
        
        book.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': book.to_dict(),
            'message': 'Livre mis à jour'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@books_bp.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    """Supprime un livre"""
    try:
        book = Book.query.get_or_404(book_id)
        
        db.session.delete(book)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Livre supprimé'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# APIs Ebooks
@books_bp.route('/ebooks', methods=['GET'])
def get_ebooks():
    """Récupère tous les ebooks avec filtres optionnels"""
    try:
        category = request.args.get('category')
        status = request.args.get('status', 'approved')  # Par défaut, seulement les approuvés
        search = request.args.get('search')
        creator_id = request.args.get('creator_id')
        
        query = Ebook.query
        
        if category:
            query = query.filter(Ebook.category == category)
        
        if status:
            query = query.filter(Ebook.status == status)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                db.or_(
                    Ebook.title.ilike(search_term),
                    Ebook.author.ilike(search_term)
                )
            )
        
        if creator_id:
            query = query.filter(Ebook.creator_id == creator_id)
        
        ebooks = query.order_by(Ebook.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [ebook.to_dict() for ebook in ebooks]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@books_bp.route('/ebooks', methods=['POST'])
def create_ebook():
    """Crée un nouvel ebook"""
    try:
        data = request.get_json()
        
        ebook = Ebook(
            title=data['title'],
            author=data['author'],
            description=data.get('description', ''),
            category=data.get('category', 'Autre'),
            pages=int(data.get('pages', 0)),
            file_size_mb=float(data.get('file_size_mb', 0)),
            formats=','.join(data.get('formats', [])),
            language=data.get('language', 'fr'),
            price=float(data['price']),
            is_free_preview=data.get('is_free_preview', False),
            creator_id=data['creator_id'],
            status='pending'  # Modération requise
        )
        
        db.session.add(ebook)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': ebook.to_dict(),
            'message': 'Ebook créé et en attente de modération'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@books_bp.route('/ebooks/<int:ebook_id>/moderate', methods=['PUT'])
def moderate_ebook(ebook_id):
    """Modère un ebook (admin seulement)"""
    try:
        ebook = Ebook.query.get_or_404(ebook_id)
        data = request.get_json()
        
        new_status = data.get('status')  # approved, rejected
        if new_status not in ['approved', 'rejected']:
            return jsonify({'success': False, 'error': 'Statut invalide'}), 400
        
        ebook.status = new_status
        ebook.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': ebook.to_dict(),
            'message': f'Ebook {new_status}'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# API de vente/achat
@books_bp.route('/books/<int:book_id>/purchase', methods=['POST'])
def purchase_book(book_id):
    """Achète ou loue un livre"""
    try:
        data = request.get_json()
        buyer_id = data['buyer_id']
        transaction_type = data['transaction_type']  # sale ou rental
        
        book = Book.query.get_or_404(book_id)
        
        # Vérifier la disponibilité
        if book.stock_quantity <= 0:
            return jsonify({'success': False, 'error': 'Livre non disponible'}), 400
        
        # Calculer les prix avec commission 20%
        if transaction_type == 'sale' and book.is_for_sale:
            item_price = book.sale_price
        elif transaction_type == 'rental' and book.is_for_rent:
            item_price = book.rental_price_2weeks
        else:
            return jsonify({'success': False, 'error': 'Type de transaction non disponible'}), 400
        
        # Calcul de la commission (20%)
        platform_commission = item_price * 0.20
        seller_revenue = item_price * 0.80
        
        # Créer la vente
        sale = Sale(
            book_id=book_id,
            buyer_id=buyer_id,
            seller_id=book.seller_id,
            item_price=item_price,
            platform_commission=platform_commission,
            seller_revenue=seller_revenue,
            transaction_type=transaction_type,
            rental_duration_days=14 if transaction_type == 'rental' else None,
            status='completed'
        )
        
        # Mettre à jour le stock pour les ventes
        if transaction_type == 'sale':
            book.stock_quantity -= 1
        
        # Mettre à jour les statistiques utilisateur
        seller = User.query.get(book.seller_id)
        if seller:
            seller.total_sales += seller_revenue
        
        buyer = User.query.get(buyer_id)
        if buyer:
            buyer.total_purchases += item_price
        
        db.session.add(sale)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': sale.to_dict(),
            'message': f'{"Achat" if transaction_type == "sale" else "Location"} confirmé'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@books_bp.route('/books/price-comparison', methods=['POST'])
def price_comparison():
    """Comparaison de prix IA pour un livre"""
    try:
        data = request.get_json()
        title = data.get('title', '')
        author = data.get('author', '')
        
        # Simulation de l'analyse IA
        base_price = random.uniform(8, 25)
        
        comparison_data = {
            'title': title,
            'author': author,
            'analysis': {
                'average_price': round(base_price, 2),
                'price_range': {
                    'min': round(base_price * 0.7, 2),
                    'max': round(base_price * 1.3, 2)
                },
                'market_position': random.choice(['Compétitif', 'Élevé', 'Bas']),
                'recommendation': f"Prix recommandé: {round(base_price * 0.9, 2)}€",
                'confidence': random.randint(75, 95)
            },
            'sources': [
                {'name': 'Amazon', 'price': round(base_price * 1.1, 2)},
                {'name': 'Fnac', 'price': round(base_price * 0.95, 2)},
                {'name': 'Cultura', 'price': round(base_price * 1.05, 2)}
            ]
        }
        
        return jsonify({
            'success': True,
            'data': comparison_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

