const tf = require('@tensorflow/tfjs-node');
const Transaction = require('../models/Transaction');

// Analyze spending patterns
exports.analyzeSpending = async (userId) => {
  const transactions = await Transaction.find({ userId });
  // Exemple simplifié : calculer la moyenne des dépenses par catégorie
  const categories = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    }
  });
  return categories;
};

// Predict future expenses (simplifié)
exports.predictExpenses = async (userId) => {
  const data = await this.analyzeSpending(userId);
  return Object.keys(data).map(category => ({
    category,
    predictedAmount: data[category] * 1.1, // +10% pour l'exemple
  }));
};