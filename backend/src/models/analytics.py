from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from .user import db

class Sale(db.Model):
    __tablename__ = 'sales'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Produit vendu
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'))
    ebook_id = db.Column(db.Integer, db.ForeignKey('ebooks.id'))
    
    # Transaction
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Montants
    item_price = db.Column(db.Float, nullable=False)
    platform_commission = db.Column(db.Float, nullable=False)  # 20%
    seller_revenue = db.Column(db.Float, nullable=False)
    
    # Type de transaction
    transaction_type = db.Column(db.String(20), nullable=False)  # sale, rental
    rental_duration_days = db.Column(db.Integer)  # Pour les locations (14 jours)
    
    # Statut
    status = db.Column(db.String(20), default='completed')  # pending, completed, refunded
    
    # Métadonnées
    sale_date = db.Column(db.Date, default=date.today)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    book = db.relationship('Book', backref='sales')
    ebook = db.relationship('Ebook', backref='sales')
    buyer = db.relationship('User', foreign_keys=[buyer_id], backref='purchases')
    seller = db.relationship('User', foreign_keys=[seller_id], backref='sales_made')
    
    def to_dict(self):
        return {
            'id': self.id,
            'book_id': self.book_id,
            'ebook_id': self.ebook_id,
            'buyer_id': self.buyer_id,
            'seller_id': self.seller_id,
            'item_price': self.item_price,
            'platform_commission': self.platform_commission,
            'seller_revenue': self.seller_revenue,
            'transaction_type': self.transaction_type,
            'rental_duration_days': self.rental_duration_days,
            'status': self.status,
            'sale_date': self.sale_date.isoformat() if self.sale_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'book_title': self.book.title if self.book else None,
            'ebook_title': self.ebook.title if self.ebook else None,
            'buyer_name': self.buyer.name if self.buyer else None,
            'seller_name': self.seller.name if self.seller else None
        }

class DailyAnalytics(db.Model):
    __tablename__ = 'daily_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, unique=True)
    
    # Métriques globales
    total_revenue = db.Column(db.Float, default=0.0)
    total_sales = db.Column(db.Integer, default=0)
    total_visitors = db.Column(db.Integer, default=0)
    conversion_rate = db.Column(db.Float, default=0.0)
    
    # Métriques par libraire
    bookstore_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    bookstore_revenue = db.Column(db.Float, default=0.0)
    bookstore_sales = db.Column(db.Integer, default=0)
    
    # Métadonnées
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    bookstore = db.relationship('User', backref='daily_analytics')
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'total_revenue': self.total_revenue,
            'total_sales': self.total_sales,
            'total_visitors': self.total_visitors,
            'conversion_rate': self.conversion_rate,
            'bookstore_id': self.bookstore_id,
            'bookstore_revenue': self.bookstore_revenue,
            'bookstore_sales': self.bookstore_sales,
            'bookstore_name': self.bookstore.name if self.bookstore else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Promotion(db.Model):
    __tablename__ = 'promotions'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    
    # Type de promotion
    promotion_type = db.Column(db.String(20), nullable=False)  # percentage, fixed_amount, free_shipping
    discount_value = db.Column(db.Float, nullable=False)
    
    # Code promo
    promo_code = db.Column(db.String(20), unique=True)
    
    # Validité
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    
    # Limites
    max_uses = db.Column(db.Integer)
    current_uses = db.Column(db.Integer, default=0)
    min_order_amount = db.Column(db.Float)
    
    # Statut
    is_active = db.Column(db.Boolean, default=True)
    
    # Organisateur
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Métadonnées
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    creator = db.relationship('User', backref='promotions_created')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'promotion_type': self.promotion_type,
            'discount_value': self.discount_value,
            'promo_code': self.promo_code,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'max_uses': self.max_uses,
            'current_uses': self.current_uses,
            'min_order_amount': self.min_order_amount,
            'is_active': self.is_active,
            'creator_id': self.creator_id,
            'creator_name': self.creator.name if self.creator else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

