# Rapport Final - Intégration SendCloud dans Lectio

## 1. Introduction

Ce rapport détaille l'intégration réussie de l'API SendCloud dans la plateforme Lectio, offrant une solution d'expédition complète et professionnelle. Cette nouvelle fonctionnalité permet aux vendeurs de générer des étiquettes, de calculer les frais de port et de suivre les colis, tandis que les acheteurs bénéficient d'un suivi en temps réel de leurs commandes.

## 2. Fonctionnalités Implémentées

### 2.1. Backend (Flask)

- **Intégration de l'API SendCloud** : Le backend a été enrichi avec un service dédié à la communication avec l'API SendCloud, utilisant les clés fournies.
- **Routes d'Expédition** : De nouvelles routes ont été créées pour gérer la création de colis, le calcul des frais de port, la récupération des méthodes d'expédition et le suivi des colis.
- **Sécurité** : Les clés d'API sont stockées de manière sécurisée dans des variables d'environnement.

### 2.2. Frontend (React)

- **Interface de Gestion des Expéditions** : Une page dédiée (`/shipping`) a été créée pour les vendeurs, accessible depuis leur tableau de bord. Elle comprend :
    - Un formulaire complet pour la création de colis.
    - Un onglet pour le calcul des frais de port.
    - Un onglet pour visualiser et gérer les colis créés.
- **Interface de Suivi pour les Acheteurs** : Une page publique (`/tracking`) permet aux acheteurs de suivre leurs commandes en utilisant leur numéro de suivi. Elle affiche :
    - Le statut actuel du colis.
    - La position géographique en temps réel.
    - L'historique complet des événements de livraison.
- **Navigation Intuitive** : Un lien "Suivi" a été ajouté au header principal pour un accès facile.

## 3. Instructions de Déploiement et Configuration

### 3.1. Backend

1.  **Variables d'Environnement** : Assurez-vous que les variables d'environnement suivantes sont définies dans le fichier `.env` à la racine du projet backend :
    ```
    SENDCLOUD_API_KEY=votreclépublique
    SENDCLOUD_API_SECRET=votreclésecrète
    ```
2.  **Dépendances** : Installez les dépendances Python avec `pip install -r requirements.txt`.
3.  **Lancement** : Démarrez le serveur Flask avec `python src/main.py`.

### 3.2. Frontend

1.  **Dépendances** : Installez les dépendances Node.js avec `npm install`.
2.  **Lancement** : Démarrez le serveur de développement avec `npm run dev`.
3.  **Build pour la Production** : Pour créer une version optimisée pour la production, utilisez `npm run build`.

## 4. Guide d'Utilisation

### 4.1. Pour les Vendeurs (Libraires)

1.  **Accès** : Connectez-vous en tant que libraire et accédez à la page "Gestion Expéditions" depuis votre tableau de bord.
2.  **Création de Colis** : Remplissez le formulaire avec les informations du destinataire et les détails du colis, puis cliquez sur "Créer le Colis".
3.  **Gestion des Colis** : Consultez la liste de vos colis dans l'onglet "Mes Colis" pour télécharger les étiquettes et suivre leur statut.

### 4.2. Pour les Acheteurs

1.  **Accès** : Cliquez sur le lien "Suivi" dans le menu principal.
2.  **Suivi** : Entrez votre numéro de suivi dans le champ de recherche et cliquez sur "Suivre" pour voir les détails de votre livraison.

## 5. Conclusion

L'intégration de SendCloud transforme Lectio en une plateforme e-commerce complète, offrant une expérience professionnelle tant pour les vendeurs que pour les acheteurs. Le système est robuste, sécurisé et prêt à être utilisé en production. Les prochaines étapes pourraient inclure l'automatisation de la création de colis lors de la validation d'une commande et l'envoi de notifications par email aux clients.


