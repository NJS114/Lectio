# 📚 LECTIO - Plateforme de Livres d'Occasion

Une plateforme e-commerce complète et professionnelle pour la vente de livres d'occasion, développée avec Flask (backend) et React (frontend).

## 🎯 Fonctionnalités Principales

### 🔐 Authentification
- **3 méthodes de connexion** : Email/mot de passe, Google OAuth, Comptes de démonstration
- **Gestion des rôles** : Particuliers, Libraires, Administrateurs
- **Sécurité avancée** : Sessions persistantes, validation des tokens

### 📦 Gestion des Expéditions
- **Intégration SendCloud** : Génération d'étiquettes, suivi en temps réel
- **Calcul automatique** des frais de port
- **Support multi-transporteurs** : Colissimo, Chronopost, DPD, etc.

### 📧 Système de Communication
- **Emails transactionnels** : Confirmation de commande, factures, notifications
- **Newsletter** : Gestion des abonnés, envoi de campagnes
- **Support client** : Système de tickets, chat intégré
- **Configuration Brevo** : SMTP professionnel pour l'envoi d'emails

### 🧾 Facturation Automatique
- **Génération PDF** : Factures professionnelles avec calculs automatiques
- **Gestion TVA** : Calcul automatique (20%)
- **Commission plateforme** : Système d'écosystème (20%)
- **Archivage** : Stockage et téléchargement des factures

### 📊 Administration Complète
- **Dashboard admin** : Statistiques en temps réel, gestion des utilisateurs
- **Analytics avancées** : Métriques de vente, rapports détaillés
- **Modération** : Gestion des signalements, validation des comptes
- **Marketing** : Outils promotionnels, campagnes ciblées

## 🏗️ Architecture Technique

### Backend (Flask)
```
backend/
├── src/
│   ├── main.py              # Point d'entrée principal
│   ├── models/              # Modèles de données SQLAlchemy
│   │   ├── user.py          # Utilisateurs et authentification
│   │   ├── book.py          # Livres et ebooks
│   │   ├── event.py         # Événements et inscriptions
│   │   ├── analytics.py     # Ventes et statistiques
│   │   └── communication.py # Newsletter, support, emails
│   ├── routes/              # APIs REST
│   │   ├── user.py          # Gestion des utilisateurs
│   │   ├── books.py         # Catalogue et recherche
│   │   ├── shipping.py      # Expédition SendCloud
│   │   ├── email_invoice.py # Emails et facturation
│   │   ├── communication.py # Newsletter et support
│   │   ├── analytics.py     # Statistiques et rapports
│   │   ├── marketing.py     # Outils marketing
│   │   ├── events.py        # Gestion des événements
│   │   ├── ecosystem.py     # Calculs de commission
│   │   └── google_auth.py   # Authentification Google
│   ├── services/            # Services métier
│   │   ├── email_service.py # Envoi d'emails Brevo
│   │   ├── sendcloud_service.py # Intégration SendCloud
│   │   └── invoice_service.py   # Génération PDF
│   └── utils/
│       └── seed_data.py     # Données de démonstration
├── .env                     # Configuration (voir .env.example)
└── requirements.txt         # Dépendances Python
```

### Frontend (React)
```
frontend/
├── src/
│   ├── App.jsx              # Application principale
│   ├── components/          # Composants React
│   │   ├── pages/           # Pages principales
│   │   ├── modals/          # Modales (connexion, etc.)
│   │   └── ui/              # Composants UI (Radix UI)
│   ├── hooks/               # Hooks personnalisés
│   │   ├── useAuth.jsx      # Gestion authentification
│   │   ├── useBooks.jsx     # Gestion des livres
│   │   ├── useCart.jsx      # Panier d'achat
│   │   └── useShipping.jsx  # Gestion expédition
│   ├── styles/              # Styles CSS/Tailwind
│   └── utils/               # Utilitaires
├── package.json             # Dépendances Node.js
└── vite.config.js           # Configuration Vite
```

## 🚀 Installation et Démarrage

### Prérequis
- Python 3.11+
- Node.js 20+
- Git

### 1. Cloner le repository
```bash
git clone https://github.com/NJS114/Lectio.git
cd Lectio
```

### 2. Configuration Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Configurer les variables d'environnement dans .env
python src/main.py
```

### 3. Configuration Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Accès à l'application
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000
- **Documentation API** : http://localhost:5000/api/docs

## ⚙️ Configuration

### Variables d'environnement (.env)
```env
# Configuration Brevo (Email)
MAIL_SERVER=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=votre-username@smtp-brevo.com
MAIL_PASSWORD=votre-mot-de-passe
MAIL_DEFAULT_SENDER=votre-email@domain.com

# Configuration SendCloud (Expédition)
SENDCLOUD_PUBLIC_KEY=votre-cle-publique
SENDCLOUD_SECRET_KEY=votre-cle-secrete

# Configuration Google OAuth
GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret

# Configuration Stripe (Paiement)
STRIPE_SECRET_KEY=votre-cle-stripe
STRIPE_PUBLISHABLE_KEY=votre-cle-publique-stripe
```

## 🧪 Tests et Démonstration

### Comptes de démonstration
- **Particulier** : Marie Dubois (marie@example.com)
- **Libraire** : Librairie Mollat (mollat@example.com)
- **Admin** : Administrateur (admin@lectio.fr)

### APIs de test
- **Email** : `GET /api/email/test`
- **SendCloud** : `GET /api/shipping/test`
- **Facture PDF** : `POST /api/invoice/generate`
- **Statistiques** : `GET /api/communication/stats`

## 📖 Documentation

Consultez le dossier `docs/` pour la documentation complète :
- `rapport_final_complet_lectio_v2.md` - Documentation technique complète
- `rapport_final_lectio_sendcloud.md` - Guide d'intégration SendCloud
- `rapport_final_lectio_mail_facturation.md` - Système d'emails et facturation
- `rapport_tests_google_oauth_final.md` - Tests d'authentification

## 🛠️ Technologies Utilisées

### Backend
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM pour base de données
- **Flask-CORS** - Gestion des requêtes cross-origin
- **ReportLab** - Génération de PDF
- **Flask-Mail** - Envoi d'emails
- **Requests** - Intégration APIs externes

### Frontend
- **React 19** - Framework JavaScript
- **Vite** - Build tool moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **Radix UI** - Composants UI accessibles
- **React Router** - Routage côté client
- **Framer Motion** - Animations

### Services Externes
- **Brevo** - Service d'envoi d'emails transactionnels
- **SendCloud** - Plateforme de gestion d'expéditions
- **Google OAuth** - Authentification sociale
- **Stripe** - Traitement des paiements (optionnel)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- **Email** : aouniibrahim94@gmail.com
- **Issues GitHub** : https://github.com/NJS114/Lectio/issues

---

**Développé avec ❤️ pour la communauté des amateurs de livres d'occasion**

