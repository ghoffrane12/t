const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

router.get('/predict', async (req, res) => {
  try {
    // Récupérer les 6 derniers mois de dépenses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const expenses = await Expense.find({
      date: { $gte: sixMonthsAgo }
    }).sort({ date: 1 });

    // Calculer la moyenne des dépenses mensuelles
    const monthlyTotals = {};
    expenses.forEach(expense => {
      const month = expense.date.toISOString().slice(0, 7); // Format: YYYY-MM
      monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
    });

    const monthlyAverages = Object.values(monthlyTotals);
    const averageExpense = monthlyAverages.reduce((a, b) => a + b, 0) / monthlyAverages.length;

    // Ajouter une variation aléatoire de ±10%
    const variation = averageExpense * 0.1;
    const prediction = averageExpense + (Math.random() * variation * 2 - variation);

    res.json({ prediction });
  } catch (error) {
    console.error('Erreur de prédiction:', error);
    res.status(500).json({ error: 'Erreur lors de la prédiction des dépenses' });
  }
});

module.exports = router;
