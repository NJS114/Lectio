from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from .user import db

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))  # Rencontre d'auteur, Club de lecture, etc.
    
    # Date et lieu
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(10), nullable=False)  # Format HH:MM
    location = db.Column(db.String(200))
    
    # Capacité et prix
    max_participants = db.Column(db.Integer, default=50)
    current_participants = db.Column(db.Integer, default=0)
    price = db.Column(db.Float, default=0.0)
    
    # Statut
    status = db.Column(db.String(20), default='upcoming')  # upcoming, ongoing, completed, cancelled
    
    # Organisateur (libraire)
    organizer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    library_name = db.Column(db.String(100))
    
    # Tags
    tags = db.Column(db.String(200))  # Séparés par des virgules
    
    # Métadonnées
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    organizer = db.relationship('User', backref='organized_events')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time,
            'location': self.location,
            'max_participants': self.max_participants,
            'current_participants': self.current_participants,
            'price': self.price,
            'status': self.status,
            'organizer_id': self.organizer_id,
            'library_name': self.library_name,
            'libraryName': self.library_name,  # Alias pour le frontend
            'tags': self.tags.split(',') if self.tags else [],
            'organizer_name': self.organizer.name if self.organizer else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class EventRegistration(db.Model):
    __tablename__ = 'event_registrations'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Statut de l'inscription
    status = db.Column(db.String(20), default='confirmed')  # confirmed, cancelled, waitlist
    
    # Métadonnées
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    event = db.relationship('Event', backref='registrations')
    user = db.relationship('User', backref='event_registrations')
    
    # Contrainte d'unicité
    __table_args__ = (db.UniqueConstraint('event_id', 'user_id', name='unique_event_user'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'user_id': self.user_id,
            'status': self.status,
            'registered_at': self.registered_at.isoformat() if self.registered_at else None,
            'event_title': self.event.title if self.event else None,
            'user_name': self.user.name if self.user else None
        }

