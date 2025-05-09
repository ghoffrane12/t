const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');  // Modèle User
const Expense = require('../models/Expense');  // Modèle Expense
const Revenue = require('../models/Revenue');  // Modèle Revenue
const Transaction = require('../models/Transaction');  // Modèle Transaction

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/flesk-wallet', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connexion à MongoDB réussie !");
}).catch((err) => {
  console.log("Erreur de connexion à MongoDB :", err);
});

// Générer des utilisateurs
async function generateUsers(numUsers) {
  for (let i = 0; i < numUsers; i++) {
    const plainPassword = faker.internet.password();  // mot de passe généré
    const hashedPassword = await bcrypt.hash(plainPassword, 10);  // hashé

    const user = new User({
      email: faker.internet.email(),
      password: hashedPassword,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    });

    await user.save();
    console.log(`Utilisateur généré : ${user.email} | Mot de passe : ${plainPassword}`);
  }
  console.log(`${numUsers} utilisateurs générés.`);
}

// Générer des dépenses
async function generateExpenses(numExpenses) {
  const users = await User.find();  // Récupère tous les utilisateurs

  for (let i = 0; i < numExpenses; i++) {
    const expense = new Expense({
      nom: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      amount: faker.finance.amount(10, 1000, 2),
      category: faker.commerce.department(),
      date: faker.date.past(),
      user: users[Math.floor(Math.random() * users.length)]._id
    });
    await expense.save();
  }
  console.log(`${numExpenses} dépenses générées.`);
}

// Générer des revenus
async function generateRevenues(numRevenues) {
  const users = await User.find();  // Récupère tous les utilisateurs

  for (let i = 0; i < numRevenues; i++) {
    const revenue = new Revenue({
      nom: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      amount: faker.finance.amount(1000, 5000, 2),
      category: faker.commerce.department(),
      date: faker.date.past(),
      user: users[Math.floor(Math.random() * users.length)]._id
    });
    await revenue.save();
  }
  console.log(`${numRevenues} revenus générés.`);
}

// Générer des transactions
async function generateTransactions(numTransactions) {
  const users = await User.find();  // Récupère tous les utilisateurs

  for (let i = 0; i < numTransactions; i++) {
    const transaction = new Transaction({
      userId: users[Math.floor(Math.random() * users.length)]._id,
      type: Math.random() > 0.5 ? 'EXPENSE' : 'INCOME',
      amount: faker.finance.amount(1, 1000, 2),
      category: faker.commerce.department(),
      description: faker.lorem.sentence(),
      date: faker.date.past(),
      recurring: Math.random() > 0.5,
      recurringPeriod: Math.random() > 0.5 ? 'MONTHLY' : 'YEARLY'
    });
    await transaction.save();
  }
  console.log(`${numTransactions} transactions générées.`);
}

/*async function clearDatabase() {
  await User.deleteMany({});
  await Expense.deleteMany({});
  await Revenue.deleteMany({});
  await Transaction.deleteMany({});
  console.log("Toutes les données existantes ont été supprimées.");
}*/

// Fonction pour exécuter la génération de données
async function generateData() {
  //await clearDatabase();  // Supprime les anciennes données
  await generateUsers(100);  // Génère 100 utilisateurs
  await generateExpenses(500);  // Génère 500 dépenses
  await generateRevenues(300);  // Génère 300 revenus
  await generateTransactions(1000);  // Génère 1000 transactions
}

// Exécution de la génération des données
generateData().then(() => {
  console.log('Données générées avec succès !');
  mongoose.connection.close();  // Ferme la connexion à MongoDB
}).catch((err) => {
  console.error('Erreur lors de la génération des données :', err);
});
