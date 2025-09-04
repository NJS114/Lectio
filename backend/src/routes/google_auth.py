"""
Routes pour l'authentification Google OAuth - Version Améliorée
"""
from flask import Blueprint, request, redirect, url_for, session, jsonify, render_template_string
import requests
import os
from urllib.parse import urlencode
import secrets
import string

google_auth_bp = Blueprint('google_auth', __name__)

# Configuration Google OAuth
OAUTH_MODE = os.getenv('OAUTH_MODE', 'development')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', 'lectio-dev-client-id-2025')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', 'lectio-dev-secret-key-secure-2025')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:5000/api/auth/google/callback')

# URLs Google OAuth
GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/auth'
GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

# Utilisateurs Google de démonstration
GOOGLE_DEMO_USERS = [
    {
        'id': 'google_demo_001',
        'email': 'demo.user@gmail.com',
        'name': 'Utilisateur Google Demo',
        'picture': 'https://via.placeholder.com/150/4285f4/ffffff?text=GU',
        'type': 'individual',
        'provider': 'google',
        'verified_email': True
    },
    {
        'id': 'google_demo_002', 
        'email': 'libraire.demo@gmail.com',
        'name': 'Librairie Google Demo',
        'picture': 'https://via.placeholder.com/150/34a853/ffffff?text=LG',
        'type': 'bookshop',
        'provider': 'google',
        'verified_email': True
    },
    {
        'id': 'google_demo_003',
        'email': 'admin.demo@gmail.com', 
        'name': 'Admin Google Demo',
        'picture': 'https://via.placeholder.com/150/ea4335/ffffff?text=AG',
        'type': 'admin',
        'provider': 'google',
        'verified_email': True
    }
]

def generate_state():
    """Génère un état aléatoire pour la sécurité OAuth"""
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))

def is_development_mode():
    """Vérifie si on est en mode développement"""
    return OAUTH_MODE == 'development' or GOOGLE_CLIENT_ID.startswith('lectio-dev')

# Template HTML pour la sélection d'utilisateur en mode développement
GOOGLE_USER_SELECTOR_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Sélection Utilisateur Google - Lectio Dev</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container { 
            max-width: 500px; 
            width: 100%;
            background: white; 
            padding: 40px 30px; 
            border-radius: 20px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .dev-notice { 
            background: #fff3cd; 
            color: #856404;
            padding: 15px; 
            border-radius: 10px; 
            margin-bottom: 30px;
            border-left: 4px solid #ffc107;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .header h2 { color: #333; margin-bottom: 10px; }
        .header p { color: #666; }
        .user-card { 
            border: 2px solid #e9ecef; 
            padding: 20px; 
            margin: 15px 0; 
            border-radius: 15px; 
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
        }
        .user-card:hover { 
            background: #f8f9fa; 
            border-color: #4285f4;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(66, 133, 244, 0.2);
        }
        .user-avatar { 
            width: 60px; 
            height: 60px; 
            border-radius: 50%; 
            margin-right: 20px;
            border: 3px solid #e9ecef;
        }
        .user-info h3 { 
            margin: 0 0 5px 0; 
            color: #333; 
            font-size: 18px;
        }
        .user-info p { 
            margin: 2px 0; 
            color: #666; 
            font-size: 14px;
        }
        .user-type { 
            background: #e9ecef; 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 12px;
            color: #495057;
            display: inline-block;
            margin-top: 5px;
        }
        .google-logo {
            width: 24px;
            height: 24px;
            margin-right: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="dev-notice">
            <strong>🔧 Mode Développement</strong><br>
            Sélectionnez un utilisateur Google de démonstration pour tester l'authentification.
        </div>
        
        <div class="header">
            <h2>
                <svg class="google-logo" viewBox="0 0 24 24" style="display: inline-block; vertical-align: middle;">
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Connexion avec Google
            </h2>
            <p>Choisissez un compte pour continuer vers Lectio</p>
        </div>
        
        {% for user in demo_users %}
        <div class="user-card" onclick="selectUser('{{ user.id }}')">
            <img src="{{ user.picture }}" alt="Avatar" class="user-avatar">
            <div class="user-info">
                <h3>{{ user.name }}</h3>
                <p>{{ user.email }}</p>
                <span class="user-type">{{ user.type }}</span>
            </div>
        </div>
        {% endfor %}
        
        <div class="footer">
            Lectio - Plateforme de livres • Mode développement
        </div>
    </div>
    
    <script>
        function selectUser(userId) {
            // Animation de sélection
            event.target.closest('.user-card').style.background = '#4285f4';
            event.target.closest('.user-card').style.color = 'white';
            
            // Redirection après animation
            setTimeout(() => {
                window.location.href = '/api/auth/google/demo-callback?user_id=' + userId;
            }, 300);
        }
    </script>
</body>
</html>
"""

@google_auth_bp.route('/login')
def google_login():
    """Initie la connexion Google OAuth"""
    try:
        # Mode développement - Affichage du sélecteur d'utilisateur
        if is_development_mode():
            return render_template_string(GOOGLE_USER_SELECTOR_TEMPLATE, demo_users=GOOGLE_DEMO_USERS)
        
        # Mode production - Vraie authentification Google
        # Génération de l'état pour la sécurité
        state = generate_state()
        session['oauth_state'] = state
        
        # Paramètres pour l'autorisation Google
        params = {
            'client_id': GOOGLE_CLIENT_ID,
            'redirect_uri': GOOGLE_REDIRECT_URI,
            'scope': 'openid email profile',
            'response_type': 'code',
            'state': state,
            'access_type': 'offline',
            'prompt': 'consent'
        }
        
        # URL d'autorisation Google
        auth_url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
        return redirect(auth_url)
        
    except Exception as e:
        print(f"Erreur lors de l'initiation Google OAuth: {e}")
        return redirect('http://localhost:5173/?auth=error&message=oauth_init_failed')

@google_auth_bp.route('/demo-callback')
def google_demo_callback():
    """Callback pour la simulation Google OAuth en mode développement"""
    try:
        user_id = request.args.get('user_id')
        demo_user = next((u for u in GOOGLE_DEMO_USERS if u['id'] == user_id), None)
        
        if not demo_user:
            return redirect('http://localhost:5173/?auth=error&message=invalid_demo_user')
        
        # Conversion au format Lectio
        lectio_user = {
            'id': demo_user['id'],
            'email': demo_user['email'],
            'display_name': demo_user['name'],
            'role': demo_user['type'],
            'avatar': demo_user['picture'],
            'provider': 'google',
            'is_verified': demo_user['verified_email'],
            'city': 'Paris' if demo_user['type'] != 'bookshop' else 'Bordeaux'
        }
        
        # Stockage en session
        session['user'] = lectio_user
        session['authenticated'] = True
        session['auth_provider'] = 'google'
        
        return redirect('http://localhost:5173/?auth=success&provider=google')
        
    except Exception as e:
        print(f"Erreur lors du callback démo Google OAuth: {e}")
        return redirect('http://localhost:5173/?auth=error&message=demo_callback_failed')

@google_auth_bp.route('/callback')
def google_callback():
    """Gère le callback de Google OAuth en mode production"""
    try:
        # Vérification de l'état pour la sécurité
        state = request.args.get('state')
        if state != session.get('oauth_state'):
            return redirect('http://localhost:5173/?auth=error&message=invalid_state')
        
        # Récupération du code d'autorisation
        code = request.args.get('code')
        if not code:
            return redirect('http://localhost:5173/?auth=error&message=no_code')
        
        # Échange du code contre un token d'accès
        token_data = {
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': GOOGLE_REDIRECT_URI
        }
        
        # Requête pour obtenir le token
        token_response = requests.post(GOOGLE_TOKEN_URL, data=token_data)
        token_json = token_response.json()
        
        if 'access_token' not in token_json:
            return redirect('http://localhost:5173/?auth=error&message=token_failed')
        
        # Récupération des informations utilisateur
        headers = {'Authorization': f"Bearer {token_json['access_token']}"}
        user_response = requests.get(GOOGLE_USER_INFO_URL, headers=headers)
        user_data = user_response.json()
        
        # Création de l'utilisateur Lectio
        lectio_user = {
            'id': f"google_{user_data['id']}",
            'email': user_data['email'],
            'display_name': user_data['name'],
            'role': 'user',  # Par défaut, les utilisateurs Google sont des particuliers
            'avatar': user_data.get('picture', ''),
            'provider': 'google',
            'is_verified': user_data.get('verified_email', False),
            'city': 'Non spécifiée'
        }
        
        # Stockage en session
        session['user'] = lectio_user
        session['authenticated'] = True
        session['auth_provider'] = 'google'
        
        # Nettoyage de l'état OAuth
        session.pop('oauth_state', None)
        
        # Redirection vers le frontend avec succès
        return redirect('http://localhost:5173/?auth=success&provider=google')
        
    except Exception as e:
        print(f"Erreur lors du callback Google OAuth: {e}")
        return redirect('http://localhost:5173/?auth=error&message=callback_failed')

@google_auth_bp.route('/user')
def get_google_user():
    """Récupère les informations de l'utilisateur Google connecté"""
    try:
        if not session.get('authenticated'):
            return jsonify({'success': False, 'error': 'Non authentifié'}), 401
        
        user = session.get('user')
        if not user:
            return jsonify({'success': False, 'error': 'Utilisateur non trouvé'}), 404
        
        return jsonify({
            'success': True,
            'user': user,
            'provider': session.get('auth_provider', 'unknown')
        })
        
    except Exception as e:
        print(f"Erreur lors de la récupération utilisateur Google: {e}")
        return jsonify({'success': False, 'error': 'Erreur serveur'}), 500

@google_auth_bp.route('/logout', methods=['POST'])
def google_logout():
    """Déconnecte l'utilisateur Google"""
    try:
        # Nettoyage de la session
        session.pop('user', None)
        session.pop('authenticated', None)
        session.pop('auth_provider', None)
        session.pop('oauth_state', None)
        
        return jsonify({
            'success': True,
            'message': 'Déconnexion réussie'
        })
        
    except Exception as e:
        print(f"Erreur lors de la déconnexion Google: {e}")
        return jsonify({'success': False, 'error': 'Erreur lors de la déconnexion'}), 500

@google_auth_bp.route('/status')
def google_auth_status():
    """Retourne le statut de l'authentification Google"""
    try:
        return jsonify({
            'success': True,
            'mode': OAUTH_MODE,
            'is_development': is_development_mode(),
            'authenticated': session.get('authenticated', False),
            'provider': session.get('auth_provider'),
            'demo_users_available': len(GOOGLE_DEMO_USERS) if is_development_mode() else 0
        })
    except Exception as e:
        print(f"Erreur lors de la vérification du statut: {e}")
        return jsonify({'success': False, 'error': 'Erreur serveur'}), 500

