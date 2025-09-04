"""
Modèles pour le système de communication (Newsletter, Support, Notifications)
"""
from datetime import datetime
from src.models.user import db

class Newsletter(db.Model):
    """Modèle pour les newsletters"""
    __tablename__ = 'newsletters'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    html_content = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='draft')  # draft, sent, scheduled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sent_at = db.Column(db.DateTime, nullable=True)
    scheduled_for = db.Column(db.DateTime, nullable=True)
    recipients_count = db.Column(db.Integer, default=0)
    opened_count = db.Column(db.Integer, default=0)
    clicked_count = db.Column(db.Integer, default=0)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'subject': self.subject,
            'content': self.content,
            'html_content': self.html_content,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'scheduled_for': self.scheduled_for.isoformat() if self.scheduled_for else None,
            'recipients_count': self.recipients_count,
            'opened_count': self.opened_count,
            'clicked_count': self.clicked_count,
            'created_by': self.created_by
        }

class NewsletterSubscriber(db.Model):
    """Modèle pour les abonnés à la newsletter"""
    __tablename__ = 'newsletter_subscribers'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), default='active')  # active, unsubscribed, bounced
    subscribed_at = db.Column(db.DateTime, default=datetime.utcnow)
    unsubscribed_at = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    preferences = db.Column(db.Text, nullable=True)  # JSON des préférences
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'status': self.status,
            'subscribed_at': self.subscribed_at.isoformat() if self.subscribed_at else None,
            'unsubscribed_at': self.unsubscribed_at.isoformat() if self.unsubscribed_at else None,
            'user_id': self.user_id,
            'preferences': self.preferences
        }

class SupportTicket(db.Model):
    """Modèle pour les tickets de support"""
    __tablename__ = 'support_tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    ticket_number = db.Column(db.String(20), unique=True, nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='open')  # open, in_progress, resolved, closed
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, urgent
    category = db.Column(db.String(50), nullable=False)  # order, payment, technical, other
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)
    
    # Relations
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Informations de contact
    contact_email = db.Column(db.String(120), nullable=False)
    contact_name = db.Column(db.String(100), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'ticket_number': self.ticket_number,
            'subject': self.subject,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'category': self.category,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
            'user_id': self.user_id,
            'assigned_to': self.assigned_to,
            'contact_email': self.contact_email,
            'contact_name': self.contact_name
        }

class SupportMessage(db.Model):
    """Modèle pour les messages des tickets de support"""
    __tablename__ = 'support_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('support_tickets.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_from_staff = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    attachments = db.Column(db.Text, nullable=True)  # JSON des pièces jointes
    
    def to_dict(self):
        return {
            'id': self.id,
            'ticket_id': self.ticket_id,
            'message': self.message,
            'is_from_staff': self.is_from_staff,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'created_by': self.created_by,
            'attachments': self.attachments
        }

class EmailTemplate(db.Model):
    """Modèle pour les templates d'emails"""
    __tablename__ = 'email_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    subject = db.Column(db.String(200), nullable=False)
    html_content = db.Column(db.Text, nullable=False)
    text_content = db.Column(db.Text, nullable=True)
    template_type = db.Column(db.String(50), nullable=False)  # welcome, order_confirmation, newsletter, etc.
    variables = db.Column(db.Text, nullable=True)  # JSON des variables disponibles
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'subject': self.subject,
            'html_content': self.html_content,
            'text_content': self.text_content,
            'template_type': self.template_type,
            'variables': self.variables,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class EmailLog(db.Model):
    """Modèle pour les logs d'emails envoyés"""
    __tablename__ = 'email_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    to_email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    template_name = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), default='sent')  # sent, failed, bounced, opened, clicked
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)
    opened_at = db.Column(db.DateTime, nullable=True)
    clicked_at = db.Column(db.DateTime, nullable=True)
    error_message = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'to_email': self.to_email,
            'subject': self.subject,
            'template_name': self.template_name,
            'status': self.status,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'opened_at': self.opened_at.isoformat() if self.opened_at else None,
            'clicked_at': self.clicked_at.isoformat() if self.clicked_at else None,
            'error_message': self.error_message,
            'user_id': self.user_id
        }

class NotificationPreference(db.Model):
    """Modèle pour les préférences de notification des utilisateurs"""
    __tablename__ = 'notification_preferences'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # Préférences email
    email_newsletter = db.Column(db.Boolean, default=True)
    email_order_updates = db.Column(db.Boolean, default=True)
    email_promotions = db.Column(db.Boolean, default=True)
    email_new_books = db.Column(db.Boolean, default=False)
    email_support_updates = db.Column(db.Boolean, default=True)
    
    # Préférences de fréquence
    newsletter_frequency = db.Column(db.String(20), default='weekly')  # daily, weekly, monthly
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'email_newsletter': self.email_newsletter,
            'email_order_updates': self.email_order_updates,
            'email_promotions': self.email_promotions,
            'email_new_books': self.email_new_books,
            'email_support_updates': self.email_support_updates,
            'newsletter_frequency': self.newsletter_frequency,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

