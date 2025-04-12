# FLESK WALLET

Une application web progressive (PWA) de gestion financière personnelle avec intégration d'intelligence artificielle.

## Fonctionnalités

- 👤 Authentification et gestion des utilisateurs
- 💰 Suivi des transactions (dépenses et revenus)
- 📊 Visualisation des données financières
- 📅 Gestion des budgets par catégorie
- 🔔 Notifications et alertes
- 📍 Intégration de la localisation
- 🤖 Analyse prédictive des dépenses
- 📱 Interface responsive et moderne

## Technologies utilisées

- **Frontend:**
  - React.js
  - Material-UI
  - Chart.js
  - React Router
  - PWA capabilities

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## Installation

1. Cloner le repository:
```bash
git clone https://github.com/votre-username/flesk-wallet.git
cd flesk-wallet
```

2. Installer les dépendances:
```bash
npm install
```

3. Créer un fichier `.env` à la racine du projet:
```env
MONGODB_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
PORT=5000
```

4. Démarrer l'application en mode développement:
```bash
# Démarrer le serveur backend
npm run dev

# Dans un autre terminal, démarrer le client
npm run client
```

## Structure du projet

```
flesk-wallet/
├── src/
│   ├── client/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   └── server/
│       ├── routes/
│       ├── models/
│       ├── controllers/
│       ├── middleware/
│       └── config/
├── public/
├── package.json
└── README.md
```

## Fonctionnalités principales

### Gestion des finances
- Enregistrement manuel/automatique des transactions
- Catégorisation des dépenses
- Visualisation via graphiques

### Analyse des habitudes
- Identification des tendances de dépenses
- Catégories fréquentes
- Prédictions basées sur l'historique

### Budgétisation
- Création de budgets par catégorie
- Suivi des écarts
- Alertes en cas de dépassement

### Abonnements
- Détection des prélèvements récurrents
- Alertes pour renouvellement
- Suggestions d'optimisation

### Localisation
- Intégration avec Google Maps
- Suggestions de lieux pour des offres avantageuses
- Historique des dépenses par lieu

## Sécurité

- Authentification JWT
- Cryptage des données sensibles
- Validation des entrées
- Protection contre les injections

## Performance

- Chargement rapide
- Optimisation des images
- Mise en cache
- Utilisation optimisée des ressources

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## Licence

ISC 