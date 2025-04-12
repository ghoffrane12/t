const mongoose = require('mongoose');

// Connexion à MongoDB (la base sera créée automatiquement si elle n'existe pas)
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/maBaseDeDonnees', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connecté : maBaseDeDonnees');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;