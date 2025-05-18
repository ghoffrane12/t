const mongoose = require('mongoose');
const app = require('./app');

// Configuration MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flesk-wallet', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  socketTimeoutMS: 30000
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB:', err);
  process.exit(1); // Arrêt de l'application en cas d'échec
});

// Vérification des variables critiques
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ Avertissement: JWT_SECRET non défini');
}

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

// Gestion propre des arrêts
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Arrêt du serveur...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Serveur et connexion MongoDB fermés');
      process.exit(0);
    });
  });
});