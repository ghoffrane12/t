const mongoose = require('mongoose');

async function getMongoClient() {
  // Utilise la connexion existante de Mongoose
  return mongoose.connection.getClient();
}

module.exports = { getMongoClient }; 