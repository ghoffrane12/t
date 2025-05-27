const mongoose = require('mongoose');
const generateExpenses = require('./expensesByUser'); // ou le chemin vers ton fichier

const userId = '60a7b8f92f8fb814c8e4b3c9'; // Remplace par un ObjectId valide dans ta base

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ta_base_de_donnees', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à la base');

    await generateExpenses(userId);

    console.log('✅ Génération terminée');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté');
  }
}

main();
