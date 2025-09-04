# Diagnostic des Problèmes d'Authentification - Lectio

## Problèmes Identifiés

### 1. **Boutons de Démonstration Non Fonctionnels**
- **Problème** : Les boutons "Marie (Particulier)" et "Mollat (Libraire)" ne déclenchent pas la connexion
- **Cause** : La fonction `loginWithDemo` du hook useAuth n'est pas appelée dans le modal
- **Impact** : Impossible de se connecter avec les comptes de démonstration
- **Fichier** : `/src/components/modals/LoginModalFixed.jsx`

### 2. **Import React manquant**
- **Problème** : `useState` n'est pas importé dans LoginModalFixed.jsx
- **Cause** : Import manquant en haut du fichier
- **Impact** : Le composant ne peut pas gérer son état local
- **Fichier** : `/src/components/modals/LoginModalFixed.jsx` ligne 1

### 3. **Gestion des Comptes de Démonstration**
- **Problème** : Les boutons de démonstration remplissent les champs mais ne connectent pas
- **Cause** : Logique de connexion automatique manquante
- **Impact** : L'utilisateur doit cliquer sur "Se connecter" après avoir cliqué sur un compte de démo
- **Fichier** : `/src/components/modals/LoginModalFixed.jsx` fonction `fillDemoAccount`

### 4. **Configuration Google OAuth**
- **Problème** : URL Google OAuth pointe vers un serveur externe non configuré
- **Cause** : URL hardcodée vers un serveur de développement temporaire
- **Impact** : Bouton Google OAuth non fonctionnel
- **Fichier** : `/src/components/modals/LoginModalFixed.jsx` fonction `handleGoogleLogin`

### 5. **Backend API Non Démarré**
- **Problème** : Tentatives de connexion email/mot de passe échouent
- **Cause** : Le serveur Flask backend n'est pas démarré
- **Impact** : Connexion traditionnelle impossible
- **Solution** : Utiliser les comptes de démonstration en local

## Architecture Actuelle

### Hook useAuth.jsx ✅
- Fonction `loginWithDemo` présente et fonctionnelle
- Comptes de démonstration bien définis
- Gestion du localStorage correcte
- État d'authentification géré

### Modal LoginModalFixed.jsx ❌
- Import useState manquant
- Fonction `fillDemoAccount` ne connecte pas automatiquement
- Boutons de démonstration non reliés à `loginWithDemo`
- URL Google OAuth incorrecte

## Plan de Correction

### Phase 1 : Correction des Imports
1. Ajouter `import React, { useState } from 'react';`
2. Vérifier tous les imports nécessaires

### Phase 2 : Correction des Boutons de Démonstration
1. Modifier `fillDemoAccount` pour appeler `loginWithDemo`
2. Connecter automatiquement l'utilisateur
3. Fermer le modal après connexion

### Phase 3 : Tests de Validation
1. Tester la connexion avec Marie (Particulier)
2. Tester la connexion avec Mollat (Libraire)
3. Vérifier la persistance de session
4. Tester la déconnexion

### Phase 4 : Optimisations
1. Améliorer l'UX des boutons de démonstration
2. Ajouter des indicateurs de chargement
3. Gérer les erreurs de connexion

## Comptes de Démonstration Disponibles

```javascript
const demoUsers = [
  {
    id: 1,
    email: 'admin@lectio.fr',
    password: 'demo123',
    display_name: 'Admin',
    role: 'admin',
    avatar: null,
    city: 'Paris',
    is_verified: true
  },
  {
    id: 2,
    email: 'marie@lectio.fr',
    password: 'demo123',
    display_name: 'Marie L.',
    role: 'user',
    avatar: null,
    city: 'Paris',
    is_verified: true
  },
  {
    id: 3,
    email: 'mollat@libraire.fr',
    password: 'demo123',
    display_name: 'Librairie Mollat',
    role: 'bookshop',
    avatar: null,
    city: 'Bordeaux',
    is_verified: true
  }
];
```

## Priorité de Correction

1. **URGENT** : Corriger les imports React
2. **URGENT** : Connecter les boutons de démonstration
3. **MOYEN** : Améliorer l'UX
4. **FAIBLE** : Configurer Google OAuth (pour plus tard)

---

**Date** : 2 septembre 2025  
**Statut** : Diagnostic terminé - Prêt pour correction

