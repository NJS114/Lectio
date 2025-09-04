# Configuration Google OAuth Améliorée - Lectio

## Système de Simulation Amélioré

### Objectifs
1. **Simulation réaliste** de l'authentification Google
2. **Interface utilisateur cohérente** avec le système d'auth existant
3. **Préparation pour vrais credentials** Google
4. **Expérience de développement optimisée**

## Configuration des Credentials de Développement

### Variables d'Environnement Améliorées
```bash
# Configuration Google OAuth - Mode Développement
GOOGLE_CLIENT_ID=lectio-dev-client-id-2025
GOOGLE_CLIENT_SECRET=lectio-dev-secret-key-secure-2025
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Mode de fonctionnement
OAUTH_MODE=development  # development | production
```

### Utilisateurs Google de Démonstration
```javascript
const googleDemoUsers = [
  {
    id: 'google_demo_001',
    email: 'demo.user@gmail.com',
    name: 'Utilisateur Google Demo',
    picture: 'https://via.placeholder.com/150/4285f4/ffffff?text=GU',
    type: 'individual',
    provider: 'google',
    verified_email: true
  },
  {
    id: 'google_demo_002', 
    email: 'libraire.demo@gmail.com',
    name: 'Librairie Google Demo',
    picture: 'https://via.placeholder.com/150/34a853/ffffff?text=LG',
    type: 'bookshop',
    provider: 'google',
    verified_email: true
  },
  {
    id: 'google_demo_003',
    email: 'admin.demo@gmail.com', 
    name: 'Admin Google Demo',
    picture: 'https://via.placeholder.com/150/ea4335/ffffff?text=AG',
    type: 'admin',
    provider: 'google',
    verified_email: true
  }
];
```

## Améliorations Backend

### 1. Gestion des Modes de Fonctionnement
```python
import os

# Configuration dynamique selon le mode
OAUTH_MODE = os.getenv('OAUTH_MODE', 'development')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', 'lectio-dev-client-id-2025')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', 'lectio-dev-secret-key-secure-2025')

def is_development_mode():
    return OAUTH_MODE == 'development' or GOOGLE_CLIENT_ID.startswith('lectio-dev')
```

### 2. Simulation Améliorée
```python
@google_auth_bp.route('/login')
def google_login():
    """Initie la connexion Google OAuth avec simulation améliorée"""
    try:
        if is_development_mode():
            # Simulation d'une sélection d'utilisateur Google
            return render_template('google_user_selector.html', 
                                 demo_users=googleDemoUsers,
                                 callback_url='/api/auth/google/demo-callback')
        
        # Mode production - vraie authentification Google
        # ... code OAuth réel
```

### 3. Endpoint de Callback Démo
```python
@google_auth_bp.route('/demo-callback')
def google_demo_callback():
    """Callback pour la simulation Google OAuth"""
    try:
        user_id = request.args.get('user_id')
        demo_user = next((u for u in googleDemoUsers if u['id'] == user_id), None)
        
        if not demo_user:
            return redirect('http://localhost:5173/?auth=error&message=invalid_demo_user')
        
        # Stockage en session
        session['user'] = demo_user
        session['authenticated'] = True
        session['auth_provider'] = 'google'
        
        return redirect('http://localhost:5173/?auth=success&provider=google')
        
    except Exception as e:
        return redirect('http://localhost:5173/?auth=error&message=demo_callback_failed')
```

## Améliorations Frontend

### 1. Gestion des Paramètres de Retour OAuth
```javascript
// Dans App.jsx ou composant principal
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const authStatus = urlParams.get('auth');
  const provider = urlParams.get('provider');
  const message = urlParams.get('message');
  
  if (authStatus === 'success' && provider === 'google') {
    // Récupérer les infos utilisateur Google
    fetchGoogleUser();
    // Nettoyer l'URL
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (authStatus === 'error') {
    console.error('Erreur OAuth:', message);
    // Afficher message d'erreur
  }
}, []);

const fetchGoogleUser = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/google/user');
    const data = await response.json();
    
    if (data.success) {
      // Intégrer avec le système d'auth existant
      setUser(data.user);
      setIsAuthenticated(true);
    }
  } catch (error) {
    console.error('Erreur récupération utilisateur Google:', error);
  }
};
```

### 2. Intégration avec useAuth Hook
```javascript
// Ajout dans useAuth.jsx
const loginWithGoogle = async (googleUser) => {
  try {
    // Convertir l'utilisateur Google au format Lectio
    const lectioUser = {
      id: googleUser.id,
      email: googleUser.email,
      display_name: googleUser.name,
      role: googleUser.type,
      avatar: googleUser.picture,
      provider: 'google',
      is_verified: googleUser.verified_email
    };
    
    // Stocker dans localStorage pour persistance
    localStorage.setItem('user', JSON.stringify(lectioUser));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authProvider', 'google');
    
    setUser(lectioUser);
    setIsAuthenticated(true);
    
    return { success: true, user: lectioUser };
  } catch (error) {
    console.error('Erreur connexion Google:', error);
    return { success: false, error: error.message };
  }
};
```

## Template HTML pour Sélection Utilisateur (Développement)

```html
<!-- templates/google_user_selector.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Sélection Utilisateur Google - Lectio Dev</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .user-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; cursor: pointer; }
        .user-card:hover { background: #f0f8ff; }
        .user-avatar { width: 50px; height: 50px; border-radius: 50%; float: left; margin-right: 15px; }
        .user-info h3 { margin: 0; color: #333; }
        .user-info p { margin: 5px 0; color: #666; }
        .dev-notice { background: #fff3cd; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="dev-notice">
            <strong>Mode Développement</strong> - Sélectionnez un utilisateur Google de démonstration
        </div>
        
        <h2>Connexion avec Google</h2>
        <p>Choisissez un compte pour continuer vers Lectio :</p>
        
        {% for user in demo_users %}
        <div class="user-card" onclick="selectUser('{{ user.id }}')">
            <img src="{{ user.picture }}" alt="Avatar" class="user-avatar">
            <div class="user-info">
                <h3>{{ user.name }}</h3>
                <p>{{ user.email }}</p>
                <p><small>Type: {{ user.type }}</small></p>
            </div>
            <div style="clear: both;"></div>
        </div>
        {% endfor %}
    </div>
    
    <script>
        function selectUser(userId) {
            window.location.href = '{{ callback_url }}?user_id=' + userId;
        }
    </script>
</body>
</html>
```

## Instructions pour Vrais Credentials Google

### Étapes de Configuration
1. **Aller sur [Google Cloud Console](https://console.cloud.google.com)**
2. **Créer un nouveau projet** ou sélectionner existant
3. **Activer les APIs nécessaires** :
   - Google+ API
   - Google OAuth2 API
4. **Configurer l'écran de consentement OAuth** :
   - Type d'application : Externe
   - Nom de l'application : Lectio
   - Email de support : votre email
   - Domaines autorisés : localhost (pour dev)
5. **Créer des identifiants OAuth 2.0** :
   - Type : Application Web
   - Nom : Lectio OAuth Client
   - URI de redirection : `http://localhost:5000/api/auth/google/callback`
6. **Copier Client ID et Client Secret**
7. **Mettre à jour .env** :
   ```bash
   OAUTH_MODE=production
   GOOGLE_CLIENT_ID=votre-client-id-reel
   GOOGLE_CLIENT_SECRET=votre-client-secret-reel
   ```

### Sécurité Production
- **Domaines autorisés** : Ajouter votre domaine de production
- **URI de redirection** : Mettre à jour pour HTTPS en production
- **Scopes minimaux** : `openid email profile`
- **Validation des tokens** : Vérifier l'audience et l'émetteur

## Tests et Validation

### Scénarios de Test
1. **Mode développement** :
   - Sélection utilisateur démo
   - Redirection correcte
   - Intégration avec auth existant
2. **Mode production** :
   - Authentification Google réelle
   - Gestion des erreurs
   - Persistance de session

### Checklist de Validation
- [ ] Redirection Google fonctionne
- [ ] Callback traité correctement
- [ ] Utilisateur stocké en session
- [ ] Intégration avec frontend
- [ ] Coexistence avec auth démo
- [ ] Gestion des erreurs
- [ ] Nettoyage des URLs

---

**Date** : 2 septembre 2025  
**Statut** : Configuration prête pour implémentation  
**Mode** : Développement avec simulation améliorée + préparation production

