from flask import Blueprint, request, jsonify
from datetime import datetime, date, timedelta
from src.models.user import db, User
from src.models.event import Event, EventRegistration

events_bp = Blueprint('events', __name__)

@events_bp.route('/events', methods=['GET'])
def get_events():
    """Récupère tous les événements avec filtres optionnels"""
    try:
        # Paramètres de filtrage
        category = request.args.get('category')
        status = request.args.get('status')
        bookstore_id = request.args.get('bookstore_id')
        
        # Construction de la requête
        query = Event.query
        
        if category and category != 'Tous':
            query = query.filter(Event.category == category)
        
        if status:
            query = query.filter(Event.status == status)
            
        if bookstore_id:
            query = query.filter(Event.organizer_id == bookstore_id)
        
        # Tri par date
        events = query.order_by(Event.date.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [event.to_dict() for event in events]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@events_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """Récupère un événement spécifique"""
    try:
        event = Event.query.get_or_404(event_id)
        
        # Récupération des participants
        registrations = EventRegistration.query.filter_by(
            event_id=event_id,
            status='confirmed'
        ).all()
        
        participants = [
            {
                'id': reg.user.id,
                'name': reg.user.name,
                'registered_at': reg.registered_at.isoformat()
            }
            for reg in registrations
        ]
        
        event_data = event.to_dict()
        event_data['participants'] = participants
        
        return jsonify({
            'success': True,
            'data': event_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@events_bp.route('/events', methods=['POST'])
def create_event():
    """Crée un nouvel événement"""
    try:
        data = request.get_json()
        
        event = Event(
            title=data['title'],
            description=data.get('description', ''),
            category=data['category'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            time=data['time'],
            location=data.get('location', ''),
            max_participants=int(data.get('max_participants', 50)),
            price=float(data.get('price', 0)),
            organizer_id=data['organizer_id'],
            library_name=data.get('library_name', ''),
            tags=','.join(data.get('tags', []))
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': event.to_dict(),
            'message': 'Événement créé avec succès'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@events_bp.route('/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    """Met à jour un événement"""
    try:
        event = Event.query.get_or_404(event_id)
        data = request.get_json()
        
        # Mise à jour des champs
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'category' in data:
            event.category = data['category']
        if 'date' in data:
            event.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'time' in data:
            event.time = data['time']
        if 'location' in data:
            event.location = data['location']
        if 'max_participants' in data:
            event.max_participants = int(data['max_participants'])
        if 'price' in data:
            event.price = float(data['price'])
        if 'status' in data:
            event.status = data['status']
        if 'tags' in data:
            event.tags = ','.join(data['tags'])
        
        event.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': event.to_dict(),
            'message': 'Événement mis à jour'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@events_bp.route('/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    """Supprime un événement"""
    try:
        event = Event.query.get_or_404(event_id)
        
        # Supprimer d'abord les inscriptions
        EventRegistration.query.filter_by(event_id=event_id).delete()
        
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Événement supprimé'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@events_bp.route('/events/<int:event_id>/register', methods=['POST'])
def register_to_event(event_id):
    """Inscription à un événement"""
    try:
        data = request.get_json()
        user_id = data['user_id']
        
        # Vérifier si l'événement existe
        event = Event.query.get_or_404(event_id)
        
        # Vérifier si l'utilisateur est déjà inscrit
        existing_registration = EventRegistration.query.filter_by(
            event_id=event_id,
            user_id=user_id
        ).first()
        
        if existing_registration:
            return jsonify({
                'success': False,
                'error': 'Vous êtes déjà inscrit à cet événement'
            }), 400
        
        # Vérifier la capacité
        current_registrations = EventRegistration.query.filter_by(
            event_id=event_id,
            status='confirmed'
        ).count()
        
        if current_registrations >= event.max_participants:
            return jsonify({
                'success': False,
                'error': 'Événement complet'
            }), 400
        
        # Créer l'inscription
        registration = EventRegistration(
            event_id=event_id,
            user_id=user_id,
            status='confirmed'
        )
        
        # Mettre à jour le compteur de participants
        event.current_participants = current_registrations + 1
        
        db.session.add(registration)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': registration.to_dict(),
            'message': 'Inscription confirmée'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@events_bp.route('/events/<int:event_id>/unregister', methods=['POST'])
def unregister_from_event(event_id):
    """Désinscription d'un événement"""
    try:
        data = request.get_json()
        user_id = data['user_id']
        
        # Trouver l'inscription
        registration = EventRegistration.query.filter_by(
            event_id=event_id,
            user_id=user_id
        ).first()
        
        if not registration:
            return jsonify({
                'success': False,
                'error': 'Aucune inscription trouvée'
            }), 404
        
        # Mettre à jour le compteur de participants
        event = Event.query.get(event_id)
        if event:
            event.current_participants = max(0, event.current_participants - 1)
        
        db.session.delete(registration)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Désinscription confirmée'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@events_bp.route('/events/bookstore/<int:bookstore_id>', methods=['GET'])
def get_bookstore_events(bookstore_id):
    """Récupère les événements d'une libraire spécifique"""
    try:
        events = Event.query.filter_by(organizer_id=bookstore_id).order_by(Event.date.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [event.to_dict() for event in events]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@events_bp.route('/events/user/<int:user_id>/registrations', methods=['GET'])
def get_user_registrations(user_id):
    """Récupère les inscriptions d'un utilisateur"""
    try:
        registrations = EventRegistration.query.filter_by(
            user_id=user_id,
            status='confirmed'
        ).all()
        
        events_data = []
        for reg in registrations:
            event_data = reg.event.to_dict()
            event_data['registration_date'] = reg.registered_at.isoformat()
            events_data.append(event_data)
        
        return jsonify({
            'success': True,
            'data': events_data
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@events_bp.route('/events/stats/<int:bookstore_id>', methods=['GET'])
def get_events_stats(bookstore_id):
    """Statistiques des événements pour un libraire"""
    try:
        # Événements totaux
        total_events = Event.query.filter_by(organizer_id=bookstore_id).count()
        
        # Événements à venir
        upcoming_events = Event.query.filter(
            Event.organizer_id == bookstore_id,
            Event.date >= date.today(),
            Event.status == 'upcoming'
        ).count()
        
        # Participants totaux
        total_participants = db.session.query(db.func.sum(Event.current_participants)).filter(
            Event.organizer_id == bookstore_id
        ).scalar() or 0
        
        # Revenus des événements
        events_revenue = db.session.query(db.func.sum(Event.price * Event.current_participants)).filter(
            Event.organizer_id == bookstore_id
        ).scalar() or 0
        
        return jsonify({
            'success': True,
            'data': {
                'total_events': total_events,
                'upcoming_events': upcoming_events,
                'total_participants': int(total_participants),
                'events_revenue': round(float(events_revenue), 2)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

