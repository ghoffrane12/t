const connectDB = require('./db');
const User = require('./models/User');
const mongoose = require('mongoose');
async function main() {
  // Connexion à la base
  await connectDB();
  
  // Création d'un premier document
  try {
    const newUser = await User.create({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      age: 30
    });
    
    console.log('Utilisateur créé:', newUser);
    
    // Pour voir tous les utilisateurs
    const users = await User.find();
    console.log('Tous les utilisateurs:', users);
    
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    // Fermer la connexion
    mongoose.connection.close();
  }
}

main();
