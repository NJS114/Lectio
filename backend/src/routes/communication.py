"""
Routes pour le système de communication (Newsletter, Support, Emails automatiques)
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import logging
import json
import uuid

from ..services.email_service import email_service
from ..models.user import db, User
from ..models.communication import (
    Newsletter, NewsletterSubscriber, SupportTicket, SupportMessage,
    EmailTemplate, EmailLog, NotificationPreference
)

logger = logging.getLogger(__name__)

communication_bp = Blueprint('communication', __name__)

# ===== ROUTES NEWSLETTER =====

@communication_bp.route('/api/newsletter/subscribe', methods=['POST'])
def subscribe_newsletter():
    """
    Abonnement à la newsletter
    """
    try:
        data = request.get_json()
        email = data.get('email')
        name = data.get('name', '')
        user_id = data.get('user_id')
        
        if not email:
            return jsonify({'success': False, 'error': 'Email requis'}), 400
        
        # Vérifier si déjà abonné
        existing = NewsletterSubscriber.query.filter_by(email=email).first()
        if existing:
            if existing.status == 'active':
                return jsonify({'success': False, 'error': 'Déjà abonné à la newsletter'}), 400
            else:
                # Réactiver l'abonnement
                existing.status = 'active'
                existing.subscribed_at = datetime.utcnow()
                existing.unsubscribed_at = None
        else:
            # Créer nouvel abonné
            subscriber = NewsletterSubscriber(
                email=email,
                name=name,
                user_id=user_id,
                status='active'
            )
            db.session.add(subscriber)
        
        db.session.commit()
        
        # Envoyer email de bienvenue newsletter
        email_service.send_welcome_email(email, name or 'Cher lecteur')
        
        return jsonify({
            'success': True,
            'message': 'Abonnement à la newsletter confirmé'
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de l'abonnement newsletter : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@communication_bp.route('/api/newsletter/unsubscribe', methods=['POST'])
def unsubscribe_newsletter():
    """
    Désabonnement de la newsletter
    """
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'success': False, 'error': 'Email requis'}), 400
        
        subscriber = NewsletterSubscriber.query.filter_by(email=email).first()
        if not subscriber:
            return jsonify({'success': False, 'error': 'Email non trouvé'}), 404
        
        subscriber.status = 'unsubscribed'
        subscriber.unsubscribed_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Désabonnement effectué avec succès'
        })
        
    except Exception as e:
        logger.error(f"Erreur lors du désabonnement : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@communication_bp.route('/api/newsletter/create', methods=['POST'])
def create_newsletter():
    """
    Créer une nouvelle newsletter (admin seulement)
    """
    try:
        data = request.get_json()
        
        newsletter = Newsletter(
            title=data.get('title'),
            subject=data.get('subject'),
            content=data.get('content'),
            html_content=data.get('html_content'),
            created_by=data.get('created_by', 1)  # ID admin par défaut
        )
        
        db.session.add(newsletter)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Newsletter créée avec succès',
            'newsletter_id': newsletter.id
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la création de newsletter : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@communication_bp.route('/api/newsletter/send/<int:newsletter_id>', methods=['POST'])
def send_newsletter(newsletter_id):
    """
    Envoyer une newsletter à tous les abonnés actifs
    """
    try:
        newsletter = Newsletter.query.get(newsletter_id)
        if not newsletter:
            return jsonify({'success': False, 'error': 'Newsletter non trouvée'}), 404
        
        # Récupérer tous les abonnés actifs
        subscribers = NewsletterSubscriber.query.filter_by(status='active').all()
        
        if not subscribers:
            return jsonify({'success': False, 'error': 'Aucun abonné actif'}), 400
        
        # Préparer les données pour l'envoi
        subscriber_list = [{'email': s.email, 'name': s.name} for s in subscribers]
        newsletter_data = {
            'subject': newsletter.subject,
            'html_content': newsletter.html_content or newsletter.content
        }
        
        # Envoyer la newsletter
        result = email_service.send_newsletter(subscriber_list, newsletter_data)
        
        # Mettre à jour les statistiques
        newsletter.status = 'sent'
        newsletter.sent_at = datetime.utcnow()
        newsletter.recipients_count = result['success_count']
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Newsletter envoyée à {result["success_count"]} abonnés',
            'stats': result
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de newsletter : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@communication_bp.route('/api/newsletter/list', methods=['GET'])
def list_newsletters():
    """
    Lister toutes les newsletters
    """
    try:
        newsletters = Newsletter.query.order_by(Newsletter.created_at.desc()).all()
        return jsonify({
            'success': True,
            'newsletters': [n.to_dict() for n in newsletters]
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des newsletters : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@communication_bp.route('/api/newsletter/subscribers', methods=['GET'])
def list_subscribers():
    """
    Lister tous les abonnés à la newsletter
    """
    try:
        subscribers = NewsletterSubscriber.query.order_by(NewsletterSubscriber.subscribed_at.desc()).all()
        return jsonify({
            'success': True,
            'subscribers': [s.to_dict() for s in subscribers],
            'total': len(subscribers),
            'active': len([s for s in subscribers if s.status == 'active'])
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des abonnés : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ===== ROUTES SUPPORT =====

@communication_bp.route('/api/support/ticket/create', methods=['POST'])
def create_support_ticket():
    """
    Créer un nouveau ticket de support
    """
    try:
        data = request.get_json()
        
        # Générer un numéro de ticket unique
        ticket_number = f"SUP-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        ticket = SupportTicket(
            ticket_number=ticket_number,
            subject=data.get('subject'),
            description=data.get('description'),
            category=data.get('category', 'other'),
            priority=data.get('priority', 'medium'),
            user_id=data.get('user_id', 1),
            contact_email=data.get('contact_email'),
            contact_name=data.get('contact_name')
        )
        
        db.session.add(ticket)
        db.session.commit()
        
        # Envoyer email de confirmation
        email_service.send_support_ticket_confirmation(
            ticket.contact_email,
            ticket.contact_name,
            ticket.to_dict()
        )
        
        return jsonify({
            'success': True,
            'message': 'Ticket de support créé avec succès',
            'ticket': ticket.to_dict()
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la création du ticket : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@communication_bp.route('/api/support/tickets', methods=['GET'])
def list_support_tickets():
    """
    Lister tous les tickets de support
    """
    try:
        status_filter = request.args.get('status')
        priority_filter = request.args.get('priority')
        category_filter = request.args.get('category')
        
        query = SupportTicket.query
        
        if status_filter:
            query = query.filter_by(status=status_filter)
        if priority_filter:
            query = query.filter_by(priority=priority_filter)
        if category_filter:
            query = query.filter_by(category=category_filter)
        
        tickets = query.order_by(SupportTicket.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'tickets': [t.to_dict() for t in tickets],
            'total': len(tickets)
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des tickets : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@communication_bp.route('/api/support/ticket/<int:ticket_id>/update', methods=['PUT'])
def update_support_ticket(ticket_id):
    """
    Mettre à jour un ticket de support
    """
    try:
        data = request.get_json()
        
        ticket = SupportTicket.query.get(ticket_id)
        if not ticket:
            return jsonify({'success': False, 'error': 'Ticket non trouvé'}), 404
        
        # Mettre à jour les champs
        if 'status' in data:
            ticket.status = data['status']
            if data['status'] == 'resolved':
                ticket.resolved_at = datetime.utcnow()
        
        if 'priority' in data:
            ticket.priority = data['priority']
        
        if 'assigned_to' in data:
            ticket.assigned_to = data['assigned_to']
        
        ticket.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Ticket mis à jour avec succès',
            'ticket': ticket.to_dict()
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la mise à jour du ticket : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@communication_bp.route('/api/support/ticket/<int:ticket_id>/message', methods=['POST'])
def add_support_message(ticket_id):
    """
    Ajouter un message à un ticket de support
    """
    try:
        data = request.get_json()
        
        ticket = SupportTicket.query.get(ticket_id)
        if not ticket:
            return jsonify({'success': False, 'error': 'Ticket non trouvé'}), 404
        
        message = SupportMessage(
            ticket_id=ticket_id,
            message=data.get('message'),
            is_from_staff=data.get('is_from_staff', False),
            created_by=data.get('created_by', 1)
        )
        
        db.session.add(message)
        
        # Mettre à jour le statut du ticket si nécessaire
        if not data.get('is_from_staff') and ticket.status == 'resolved':
            ticket.status = 'open'
        elif data.get('is_from_staff') and ticket.status == 'open':
            ticket.status = 'in_progress'
        
        ticket.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Message ajouté avec succès',
            'support_message': message.to_dict()
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de l'ajout du message : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@communication_bp.route('/api/support/ticket/<int:ticket_id>/messages', methods=['GET'])
def get_support_messages(ticket_id):
    """
    Récupérer tous les messages d'un ticket
    """
    try:
        messages = SupportMessage.query.filter_by(ticket_id=ticket_id).order_by(SupportMessage.created_at.asc()).all()
        
        return jsonify({
            'success': True,
            'messages': [m.to_dict() for m in messages]
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des messages : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ===== ROUTES EMAILS AUTOMATIQUES =====

@communication_bp.route('/api/email/welcome', methods=['POST'])
def send_welcome_email():
    """
    Envoyer un email de bienvenue (appelé lors de l'inscription)
    """
    try:
        data = request.get_json()
        
        success = email_service.send_welcome_email(
            data.get('email'),
            data.get('name'),
            data.get('verification_token')
        )
        
        if success:
            # Enregistrer dans les logs
            log = EmailLog(
                to_email=data.get('email'),
                subject="Bienvenue sur Lectio",
                template_name="welcome",
                status="sent",
                user_id=data.get('user_id')
            )
            db.session.add(log)
            db.session.commit()
        
        return jsonify({
            'success': success,
            'message': 'Email de bienvenue envoyé' if success else 'Erreur lors de l\'envoi'
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de l'email de bienvenue : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@communication_bp.route('/api/email/payment-success', methods=['POST'])
def send_payment_success_email():
    """
    Envoyer un email de confirmation de paiement avec facture
    """
    try:
        data = request.get_json()
        
        success = email_service.send_payment_success_email(
            data.get('email'),
            data.get('name'),
            data.get('payment_data'),
            data.get('invoice_path')
        )
        
        if success:
            # Enregistrer dans les logs
            log = EmailLog(
                to_email=data.get('email'),
                subject=f"Paiement confirmé - Facture #{data.get('payment_data', {}).get('invoice_number', '')}",
                template_name="payment_success",
                status="sent",
                user_id=data.get('user_id')
            )
            db.session.add(log)
            db.session.commit()
        
        return jsonify({
            'success': success,
            'message': 'Email de confirmation de paiement envoyé' if success else 'Erreur lors de l\'envoi'
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de l'email de paiement : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ===== ROUTES STATISTIQUES =====

@communication_bp.route('/api/communication/stats', methods=['GET'])
def get_communication_stats():
    """
    Récupérer les statistiques du système de communication
    """
    try:
        # Statistiques newsletter
        total_subscribers = NewsletterSubscriber.query.count()
        active_subscribers = NewsletterSubscriber.query.filter_by(status='active').count()
        newsletters_sent = Newsletter.query.filter_by(status='sent').count()
        
        # Statistiques support
        total_tickets = SupportTicket.query.count()
        open_tickets = SupportTicket.query.filter_by(status='open').count()
        resolved_tickets = SupportTicket.query.filter_by(status='resolved').count()
        
        # Statistiques emails
        emails_sent_today = EmailLog.query.filter(
            EmailLog.sent_at >= datetime.utcnow().date()
        ).count()
        
        emails_sent_week = EmailLog.query.filter(
            EmailLog.sent_at >= datetime.utcnow() - timedelta(days=7)
        ).count()
        
        return jsonify({
            'success': True,
            'stats': {
                'newsletter': {
                    'total_subscribers': total_subscribers,
                    'active_subscribers': active_subscribers,
                    'newsletters_sent': newsletters_sent
                },
                'support': {
                    'total_tickets': total_tickets,
                    'open_tickets': open_tickets,
                    'resolved_tickets': resolved_tickets,
                    'resolution_rate': round((resolved_tickets / total_tickets * 100) if total_tickets > 0 else 0, 1)
                },
                'emails': {
                    'sent_today': emails_sent_today,
                    'sent_this_week': emails_sent_week
                }
            }
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des statistiques : {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

