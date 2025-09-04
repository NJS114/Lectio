# Guide Complet - Ajouter des Ebooks à Lectio

## 🎯 Deux Méthodes Disponibles

### **Méthode 1 : Interface Utilisateur (Recommandée)**
### **Méthode 2 : Données de Démonstration (Développement)**

---

## 📱 **Méthode 1 : Via l'Interface Utilisateur**

### Étapes pour Ajouter un Ebook

#### 1. **Connexion Requise**
- Connectez-vous avec un compte (Marie ou Mollat)
- Allez sur http://localhost:5173/ebooks
- Cliquez sur **"Créer un ebook"**

#### 2. **Formulaire de Création - Étape 1 : Informations de Base**

**Champs Obligatoires (\*)**
- **Titre de l'ebook** : Ex: "Guide complet du Marketing Digital"
- **Auteur** : Votre nom ou nom de plume
- **Description** : Description détaillée du contenu
- **Catégorie** : Sélectionner parmi :
  - Business, Informatique, Marketing, Design
  - Développement Personnel, Fiction, Non-Fiction
  - Éducation, Santé, Cuisine, Voyage, Art

**Champs Optionnels**
- **Langue** : Français (par défaut), Anglais, Espagnol, Italien, Allemand
- **Nombre de pages** : Ex: 250
- **Format** : PDF, EPUB, MOBI, PDF + EPUB, Tous formats
- **Tags** : Mots-clés pour la recherche

#### 3. **Étapes Suivantes du Formulaire**
- **Étape 2** : Contenu et fichiers (upload PDF/EPUB)
- **Étape 3** : Prix et distribution
- **Étape 4** : Aperçu et publication

### Exemple Concret d'Ajout

```
Titre: "Maîtriser React en 2024"
Auteur: "Marie Dupont"
Description: "Un guide pratique pour apprendre React avec des exemples concrets et des projets réels."
Catégorie: Informatique
Langue: Français
Pages: 180
Format: PDF + EPUB
Tags: React, JavaScript, Frontend, Web Development
```

---

## 💻 **Méthode 2 : Ajouter des Données de Démonstration**

### Localisation du Fichier
**Fichier** : `/src/hooks/useEbooks.jsx`  
**Section** : `sampleEbooks` (ligne ~15)

### Structure d'un Ebook

```javascript
{
  id: 'ebook-3', // ID unique
  title: 'Titre de votre ebook',
  author: 'Nom de l\'auteur',
  description: 'Description complète...',
  category: 'Catégorie', // Business, Informatique, etc.
  price: 19.99,
  originalPrice: 29.99,
  discount: 33, // Pourcentage de réduction
  format: 'PDF + EPUB',
  pages: 250,
  language: 'Français',
  publishDate: new Date('2024-03-01'),
  rating: 4.7,
  reviews: 85,
  cover: '/api/placeholder/300/400', // Image de couverture
  preview: '/api/placeholder/600/800', // Aperçu
  fileSize: '12.5 MB',
  isbn: '978-2-123456-78-9',
  tags: ['Tag1', 'Tag2', 'Tag3'],
  tableOfContents: [
    'Chapitre 1: Introduction',
    'Chapitre 2: Concepts de base',
    'Chapitre 3: Pratique avancée'
  ],
  author_info: {
    name: 'Nom Auteur',
    bio: 'Biographie de l\'auteur',
    avatar: '/api/placeholder/100/100',
    social: {
      linkedin: 'https://linkedin.com/in/auteur',
      twitter: 'https://twitter.com/auteur'
    }
  },
  affiliate_links: [
    {
      platform: 'Amazon Kindle',
      url: 'https://amazon.fr/dp/B123456789',
      commission: 7,
      price: 19.99
    }
  ],
  sales_stats: {
    total_sales: 0,
    monthly_sales: 0,
    revenue: 0,
    affiliate_earnings: 0
  }
}
```

### Exemple d'Ajout dans le Code

```javascript
// Dans useEbooks.jsx, ajouter à sampleEbooks :
{
  id: 'ebook-3',
  title: 'Python pour les Débutants',
  author: 'Jean Martin',
  description: 'Apprenez Python de zéro avec des exercices pratiques et des projets concrets.',
  category: 'Informatique',
  price: 16.99,
  originalPrice: 24.99,
  discount: 32,
  format: 'PDF + Code source',
  pages: 200,
  language: 'Français',
  publishDate: new Date('2024-03-15'),
  rating: 4.6,
  reviews: 142,
  cover: '/api/placeholder/300/400',
  preview: '/api/placeholder/600/800',
  fileSize: '18.3 MB',
  isbn: '978-2-456789-12-3',
  tags: ['Python', 'Programmation', 'Débutant', 'Exercices'],
  tableOfContents: [
    'Introduction à Python',
    'Variables et Types de Données',
    'Structures de Contrôle',
    'Fonctions et Modules',
    'Programmation Orientée Objet',
    'Projets Pratiques'
  ],
  author_info: {
    name: 'Jean Martin',
    bio: 'Développeur Python avec 8 ans d\'expérience',
    avatar: '/api/placeholder/100/100',
    social: {
      github: 'https://github.com/jeanmartin',
      linkedin: 'https://linkedin.com/in/jeanmartin'
    }
  },
  affiliate_links: [
    {
      platform: 'Gumroad',
      url: 'https://gumroad.com/l/python-debutants',
      commission: 15,
      price: 16.99
    }
  ],
  sales_stats: {
    total_sales: 0,
    monthly_sales: 0,
    revenue: 0,
    affiliate_earnings: 0
  }
}
```

---

## 🔧 **Fonctionnalités Disponibles**

### Interface Ebooks Actuelle
- ✅ **Page de liste** : `/ebooks` (2 ebooks de démo visibles)
- ✅ **Formulaire de création** : `/creer-ebook` (complet)
- ✅ **Recherche** : Barre de recherche fonctionnelle
- ✅ **Filtres** : Par catégorie, prix, etc.
- ✅ **Aperçu** : Boutons d'aperçu sur chaque ebook

### Fonctionnalités Backend
- ✅ **Création d'ebook** : `createEbook()`
- ✅ **Mise à jour** : `updateEbook()`
- ✅ **Suppression** : `deleteEbook()`
- ✅ **Recherche** : `searchEbooks()` avec filtres
- ✅ **Statistiques** : Ventes et affiliations

---

## 📋 **Processus Recommandé**

### Pour Tester Rapidement
1. **Méthode 2** : Ajouter des ebooks dans le code
2. Redémarrer le serveur frontend
3. Voir les nouveaux ebooks sur `/ebooks`

### Pour Utilisation Réelle
1. **Méthode 1** : Utiliser l'interface utilisateur
2. Remplir le formulaire complet
3. Upload des fichiers PDF/EPUB
4. Configuration des prix et distribution

---

## 🎨 **Catégories Disponibles**

- **Business** : Marketing, Management, Entrepreneuriat
- **Informatique** : Programmation, Web, IA
- **Marketing** : Digital, Stratégie, Réseaux sociaux
- **Design** : UI/UX, Graphisme, Créativité
- **Développement Personnel** : Productivité, Leadership
- **Fiction** : Romans, Nouvelles
- **Non-Fiction** : Biographies, Histoire
- **Éducation** : Cours, Tutoriels
- **Santé** : Bien-être, Nutrition
- **Cuisine** : Recettes, Techniques
- **Voyage** : Guides, Récits
- **Art** : Peinture, Photographie

---

## 🚀 **Prochaines Étapes**

### Fonctionnalités à Implémenter
1. **Upload de fichiers** : Intégration réelle PDF/EPUB
2. **Système de paiement** : Achat d'ebooks
3. **Lecteur intégré** : Lecture en ligne
4. **Système d'affiliation** : Liens et commissions
5. **Analytics** : Statistiques de vente

### Améliorations Interface
1. **Prévisualisation** : Aperçu des pages
2. **Notation** : Système d'évaluation
3. **Commentaires** : Avis des lecteurs
4. **Recommandations** : Ebooks similaires

---

## 💡 **Conseils Pratiques**

### Pour de Bons Ebooks
- **Titre accrocheur** : Clair et descriptif
- **Description détaillée** : Contenu, public cible, bénéfices
- **Tags pertinents** : Pour la recherche
- **Couverture attractive** : Image professionnelle
- **Prix compétitif** : Recherche de marché

### Optimisation SEO
- **Mots-clés** dans le titre et la description
- **Tags populaires** pour la découverte
- **Catégorie appropriée** pour le classement
- **Description riche** avec bénéfices clairs

---

**Voulez-vous que je vous montre comment ajouter un ebook spécifique ou que je vous aide avec l'une des deux méthodes ?** 🤔

