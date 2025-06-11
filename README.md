# GitHub User Search

Une application React TypeScript moderne pour rechercher des utilisateurs GitHub en temps réel, de les visualiser sous forme de cartes, et de les gérer avec des fonctionnalités d'édition, de duplication et de suppression. L'interface est responsive et optimisée pour tous les types d'écrans.

## Technologies utilisées

-  **React 19** - Library JavaScript pour l'interface utilisateur
-  **TypeScript** - Typage statique pour JavaScript
-  **Vite** - Build tool moderne et rapide
-  **CSS3** - Styles avec variables CSS, Grid et Flexbox

## Fonctionnalités principales

-  Recherche en temps réel avec debounce
-  Scroll infini pour charger plus de résultats
-  Gestion des états de chargement et d'erreur
-  Messages informatifs quand aucun résultat n'est trouvé
-  Mode édition pour sélectionner plusieurs utilisateurs
-  Duplication d'utilisateurs avec badge visuel
-  Suppression en lot des utilisateurs sélectionnés
-  Lien direct vers les profils GitHub

## Installation et utilisation

### Prérequis

-  Node.js version 16 ou supérieure
-  npm ou yarn

### Installation

```bash
# Cloner le projet
git clone <url-du-repository>
cd github-user-search

# Installer les dépendances
npm install

# Lancer l'application en développement
npm run dev
```

## Scripts de test

```bash
# Lancer tous les tests
npm test

# OU
npm run test:run

```
