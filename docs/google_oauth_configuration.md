# Configuration Google OAuth 2.0 pour Lectio

## 🔑 **Informations de base**

- **Client ID** : `751049556987-806vkhi9ilvcjvb7uhndnu4p8m59i86r.apps.googleusercontent.com`
- **Google Books API Key** : `AIzaSyAh-IRWtEHsY2OQyYk3Gqa1wUaEXOCuxfE` ✅ **CONFIGURÉE**

## 🌐 **URLs de redirection autorisées à configurer dans Google Cloud Console**

### **Développement Local**
```
http://localhost:5000/api/auth/google/callback
http://localhost:5173/auth/callback
http://127.0.0.1:5000/api/auth/google/callback
http://127.0.0.1:5173/auth/callback
```

### **Production (URLs déployées)**
```
https://qjh9iec758k7.id.wasmer.app/api/auth/google/callback
https://qjh9iec758k7.manus.space/api/auth/google/callback
```

### **URLs Frontend de production (à ajouter quand publié)**
```
https://[votre-frontend-url]/auth/callback
```

## 🔧 **Configuration dans Google Cloud Console**

### **1. Accéder à la console**
- Aller sur : https://console.cloud.google.com/
- Sélectionner votre projet Lectio

### **2. Configurer OAuth 2.0**
- Aller dans : **APIs & Services** > **Credentials**
- Cliquer sur votre Client ID OAuth 2.0 : `751049556987-806v...`
- Dans **Authorized redirect URIs**, ajouter toutes les URLs ci-dessus

### **3. Origines JavaScript autorisées**
```
http://localhost:5173
http://localhost:3000
http://127.0.0.1:5173
http://127.0.0.1:3000
https://qjh9iec758k7.manus.space
https://[votre-frontend-url]
```

## 🧪 **URLs de test pour OAuth 2.0**

### **Développement Local**

#### **1. Initier l'authentification**
```bash
curl "http://localhost:5000/api/auth/google/login"
```

#### **2. Tester le statut OAuth**
```bash
curl "http://localhost:5000/api/auth/google/status"
```

#### **3. URL complète d'authentification (exemple)**
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=751049556987-806vkhi9ilvcjvb7uhndnu4p8m59i86r.apps.googleusercontent.com&redirect_uri=http://localhost:5000/api/auth/google/callback&scope=openid%20email%20profile&response_type=code&state=RANDOM_STATE&access_type=offline&prompt=consent
```

### **Production**

#### **1. Initier l'authentification**
```bash
curl "https://qjh9iec758k7.id.wasmer.app/api/auth/google/login"
```

#### **2. Tester le statut OAuth**
```bash
curl "https://qjh9iec758k7.id.wasmer.app/api/auth/google/status"
```

## 📚 **URLs de test pour Google Books API**

### **Développement Local**

#### **1. Recherche de livres**
```bash
curl "http://localhost:5000/api/books/search?q=harry+potter&max_results=5"
```

#### **2. Recherche par ISBN**
```bash
curl "http://localhost:5000/api/books/isbn/9780747532699"
```

#### **3. Suggestions d'autocomplétion**
```bash
curl "http://localhost:5000/api/books/suggestions?title=harry&max_results=5"
```

#### **4. Livres populaires**
```bash
curl "http://localhost:5000/api/books/popular?category=fiction&max_results=10"
```

#### **5. Statut de l'API**
```bash
curl "http://localhost:5000/api/books/status"
```

### **Production**

#### **1. Recherche de livres**
```bash
curl "https://qjh9iec758k7.id.wasmer.app/api/books/search?q=harry+potter&max_results=5"
```

#### **2. Recherche par ISBN**
```bash
curl "https://qjh9iec758k7.id.wasmer.app/api/books/isbn/9780747532699"
```

#### **3. Suggestions d'autocomplétion**
```bash
curl "https://qjh9iec758k7.id.wasmer.app/api/books/suggestions?title=harry&max_results=5"
```

## 🔄 **Flux d'authentification complet**

### **1. Frontend initie la connexion**
```javascript
// Appel depuis le frontend
fetch('http://localhost:5000/api/auth/google/login')
  .then(response => response.json())
  .then(data => {
    // Rediriger vers data.auth_url
    window.location.href = data.auth_url;
  });
```

### **2. Google redirige vers le callback**
```
http://localhost:5000/api/auth/google/callback?code=AUTHORIZATION_CODE&state=RANDOM_STATE
```

### **3. Backend traite et redirige vers le frontend**
```
http://localhost:5173/auth/callback?access_token=JWT_TOKEN&refresh_token=REFRESH_TOKEN&success=true
```

### **4. Frontend récupère les tokens**
```javascript
// Dans la page /auth/callback du frontend
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');
const refreshToken = urlParams.get('refresh_token');

// Stocker les tokens et rediriger
localStorage.setItem('access_token', accessToken);
localStorage.setItem('refresh_token', refreshToken);
window.location.href = '/dashboard';
```

## 🛠️ **Variables d'environnement nécessaires**

### **Développement (.env)**
```env
GOOGLE_CLIENT_ID=751049556987-806vkhi9ilvcjvb7uhndnu4p8m59i86r.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=[À_OBTENIR_DE_GOOGLE_CLOUD]
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
GOOGLE_BOOKS_API_KEY=AIzaSyAh-IRWtEHsY2OQyYk3Gqa1wUaEXOCuxfE
```

### **Production (.env)**
```env
GOOGLE_CLIENT_ID=751049556987-806vkhi9ilvcjvb7uhndnu4p8m59i86r.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=[À_OBTENIR_DE_GOOGLE_CLOUD]
GOOGLE_REDIRECT_URI=https://qjh9iec758k7.id.wasmer.app/api/auth/google/callback
GOOGLE_BOOKS_API_KEY=AIzaSyAh-IRWtEHsY2OQyYk3Gqa1wUaEXOCuxfE
```

## 🔐 **Scopes OAuth 2.0 utilisés**
- `openid` - Identification OpenID Connect
- `email` - Accès à l'adresse email
- `profile` - Accès aux informations de profil

## 📋 **Checklist de configuration**

### **Google Cloud Console**
- [ ] Ajouter toutes les URLs de redirection
- [ ] Ajouter toutes les origines JavaScript
- [ ] Obtenir le Client Secret
- [ ] Vérifier que l'API Books est activée
- [ ] Vérifier les quotas de l'API

### **Backend**
- [x] Variables d'environnement configurées
- [x] Services OAuth et Books implémentés
- [x] Routes API créées
- [x] Modèles de base de données étendus
- [x] Gestion d'erreurs implémentée

### **Frontend (à implémenter)**
- [ ] Bouton "Se connecter avec Google"
- [ ] Page de callback OAuth
- [ ] Gestion des tokens JWT
- [ ] Interface de recherche Google Books
- [ ] Autocomplétion avec suggestions

## 🚨 **Points importants**

1. **Client Secret manquant** : Il faut obtenir le Client Secret depuis Google Cloud Console
2. **HTTPS requis en production** : Google OAuth nécessite HTTPS pour les URLs de production
3. **Domaines vérifiés** : Assurez-vous que vos domaines sont vérifiés dans Google Cloud
4. **Quotas API** : Surveillez les quotas de l'API Google Books (1000 requêtes/jour par défaut)

## 🧪 **Test rapide de l'intégration**

```bash
# Test de l'API Books (fonctionne déjà)
curl "http://localhost:5000/api/books/search?q=le+petit+prince"

# Test du statut OAuth
curl "http://localhost:5000/api/auth/google/status"

# Test d'initiation OAuth (retourne l'URL d'authentification)
curl "http://localhost:5000/api/auth/google/login"
```

Une fois le Client Secret configuré, l'authentification Google sera entièrement fonctionnelle ! 🎉

