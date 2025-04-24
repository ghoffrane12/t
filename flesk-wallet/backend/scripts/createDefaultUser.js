require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createDefaultUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flesk-wallet', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    if (existingUser) {
      console.log('L\'utilisateur par défaut existe déjà');
      process.exit(0);
    }

    // Créer l'utilisateur par défaut
    const defaultUser = new User({
      email: 'admin@example.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User'
    });

    await defaultUser.save();
    console.log('Utilisateur par défaut créé avec succès');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur par défaut:', error);
    process.exit(1);
  }
};

createDefaultUser(); 