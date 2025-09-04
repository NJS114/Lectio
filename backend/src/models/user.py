from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100))
    
    # Type d'utilisateur
    user_type = db.Column(db.String(20), default='individual')  # individual, bookstore, admin
    
    # Informations libraire
    bookstore_name = db.Column(db.String(200))
    bookstore_address = db.Column(db.String(300))
    bookstore_phone = db.Column(db.String(20))
    bookstore_description = db.Column(db.Text)
    
    # Authentification
    password_hash = db.Column(db.String(255))
    google_id = db.Column(db.String(100), unique=True)
    
    # Statut
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    
    # Affiliation
    affiliate_code = db.Column(db.String(20), unique=True)
    referrer_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Statistiques
    total_sales = db.Column(db.Float, default=0.0)
    total_purchases = db.Column(db.Float, default=0.0)
    commission_earned = db.Column(db.Float, default=0.0)
    
    # Métadonnées
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relations
    referrer = db.relationship('User', remote_side=[id], backref='referrals')

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'user_type': self.user_type,
            'bookstore_name': self.bookstore_name,
            'bookstore_address': self.bookstore_address,
            'bookstore_phone': self.bookstore_phone,
            'bookstore_description': self.bookstore_description,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'affiliate_code': self.affiliate_code,
            'referrer_id': self.referrer_id,
            'total_sales': self.total_sales,
            'total_purchases': self.total_purchases,
            'commission_earned': self.commission_earned,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
