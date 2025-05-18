const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth'); // Middleware existant


router.get('/predict', protect, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Récupérer les dépenses des 6 derniers mois pour l'utilisateur
    const expenses = await Expense.find({
      date: { $gte: sixMonthsAgo },
      user: req.user._id
    }).sort({ date: 1 });

    if (expenses.length === 0) {
      return res.json({
        globalPrediction: 0,
        categoryPredictions: {},
        message: 'Aucune dépense enregistrée pour cet utilisateur'
      });
    }

    // Regrouper les dépenses par mois et catégorie
    const monthlyTotalsByCategory = {};
    expenses.forEach(expense => {
      const month = expense.date.toISOString().slice(0, 7); // Format: YYYY-MM
      const category = expense.category;

      if (!monthlyTotalsByCategory[month]) {
        monthlyTotalsByCategory[month] = {};
      }
      monthlyTotalsByCategory[month][category] = (monthlyTotalsByCategory[month][category] || 0) + expense.amount;
    });

    // Calculer la moyenne globale
    const monthlyTotals = {};
    for (const month in monthlyTotalsByCategory) {
      const total = Object.values(monthlyTotalsByCategory[month]).reduce((sum, amount) => sum + amount, 0);
      monthlyTotals[month] = total;
    }

    const monthlyAverages = Object.values(monthlyTotals);
    const averageExpense = monthlyAverages.reduce((a, b) => a + b, 0) / monthlyAverages.length;

    // Calculer les moyennes par catégorie
    const categoryAverages = {};
    const allCategories = new Set(expenses.map(exp => exp.category));
    allCategories.forEach(category => {
      const categoryMonthlyTotals = [];
      for (const month in monthlyTotalsByCategory) {
        categoryMonthlyTotals.push(monthlyTotalsByCategory[month][category] || 0);
      }
      const avg = categoryMonthlyTotals.reduce((a, b) => a + b, 0) / categoryMonthlyTotals.length;
      if (avg > 0) { // Inclure uniquement les catégories avec des dépenses
        categoryAverages[category] = avg;
      }
    });

    // Ajouter une variation aléatoire de ±10%
    const globalVariation = averageExpense * 0.1;
    const globalPrediction = averageExpense + (Math.random() * globalVariation * 2 - globalVariation);

    const categoryPredictions = {};
    for (const category in categoryAverages) {
      const variation = categoryAverages[category] * 0.1;
      categoryPredictions[category] = categoryAverages[category] + (Math.random() * variation * 2 - variation);
    }

    res.json({
      globalPrediction,
      categoryPredictions
    });
  } catch (error) {
    console.error('Erreur de prédiction:', error);
    res.status(500).json({ error: 'Erreur lors de la prédiction des dépenses' });
  }
});

module.exports = router;