from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from .user import db

class Book(db.Model):
    __tablename__ = 'books'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    isbn = db.Column(db.String(20), unique=True)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    condition = db.Column(db.String(20))  # Neuf, Très Bon, Bon, Correct
    
    # Prix
    sale_price = db.Column(db.Float)
    rental_price_2weeks = db.Column(db.Float)  # Prix pour 2 semaines
    
    # Disponibilité
    is_for_sale = db.Column(db.Boolean, default=True)
    is_for_rent = db.Column(db.Boolean, default=False)
    stock_quantity = db.Column(db.Integer, default=1)
    
    # Métadonnées
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    seller = db.relationship('User', backref='books_for_sale')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'isbn': self.isbn,
            'description': self.description,
            'category': self.category,
            'condition': self.condition,
            'sale_price': self.sale_price,
            'rental_price_2weeks': self.rental_price_2weeks,
            'is_for_sale': self.is_for_sale,
            'is_for_rent': self.is_for_rent,
            'stock_quantity': self.stock_quantity,
            'seller_id': self.seller_id,
            'seller_name': self.seller.name if self.seller else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Ebook(db.Model):
    __tablename__ = 'ebooks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    
    # Métadonnées ebook
    pages = db.Column(db.Integer)
    file_size_mb = db.Column(db.Float)
    formats = db.Column(db.String(100))  # PDF,EPUB,MOBI
    language = db.Column(db.String(10), default='fr')
    
    # Prix et disponibilité
    price = db.Column(db.Float, nullable=False)
    is_free_preview = db.Column(db.Boolean, default=False)
    download_count = db.Column(db.Integer, default=0)
    
    # Modération
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    
    # Métadonnées
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    creator = db.relationship('User', backref='ebooks_created')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'category': self.category,
            'pages': self.pages,
            'file_size_mb': self.file_size_mb,
            'formats': self.formats.split(',') if self.formats else [],
            'language': self.language,
            'price': self.price,
            'is_free_preview': self.is_free_preview,
            'download_count': self.download_count,
            'status': self.status,
            'creator_id': self.creator_id,
            'creator_name': self.creator.name if self.creator else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

