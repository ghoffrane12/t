// server.js - Version complète et corrigée
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
process.removeAllListeners('warning');
// Chargement des variables d'environnement avec chemin absolu
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Vérification des variables d'environnement
console.log('Environnement:', process.env.NODE_ENV || 'development');
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Initialisation de l'application Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à MongoDB avec gestion d'erreur améliorée
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flesk-wallet', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout après 5s
  socketTimeoutMS: 45000 // Fermeture après 45s d'inactivité
})
.then(() => console.log('✅ Connecté à MongoDB avec succès'))
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB:', err.message);
  process.exit(1); // Quitte l'application si la connexion échoue
});

// Routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Une erreur est survenue',
    message: err.message 
  });
});

// Gestion des ports
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

// Gestion propre des arrêts
process.on('SIGINT', () => {
  server.close(() => {
    console.log('🛑 Serveur arrêté proprement');
    mongoose.connection.close(false, () => {
      console.log('📦 Connexion MongoDB fermée');
      process.exit(0);
    });
  });
});

// Vérification de la connexion MongoDB
mongoose.connection.on('connected', () => {
  console.log('📦 Connecté à la base de données');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur de connexion MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Déconnecté de MongoDB');
});