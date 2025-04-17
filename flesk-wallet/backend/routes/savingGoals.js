const express = require('express');
const router = express.Router();
const SavingGoal = require('../models/SavingGoal');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Obtenir tous les objectifs d'épargne
router.get('/', auth, async (req, res) => {
  try {
    const goals = await SavingGoal.find({ userId: req.user.id });
    // Mettre à jour le statut de chaque objectif
    for (let goal of goals) {
      goal.checkStatus();
      await goal.save();
    }
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des objectifs d'épargne" });
  }
});

// Créer un nouvel objectif d'épargne
router.post('/', auth, async (req, res) => {
  try {
    const goal = new SavingGoal({
      ...req.body,
      userId: req.user.id,
      currentAmount: 0
    });
    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création de l'objectif d'épargne" });
  }
});

// Mettre à jour un objectif d'épargne
router.put('/:id', auth, async (req, res) => {
  try {
    const goal = await SavingGoal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: "Objectif d'épargne non trouvé" });
    }

    Object.assign(goal, req.body);
    goal.checkStatus();
    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la mise à jour de l'objectif d'épargne" });
  }
});

// Supprimer un objectif d'épargne
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await SavingGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: "Objectif d'épargne non trouvé" });
    }

    res.json({ message: "Objectif d'épargne supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'objectif d'épargne" });
  }
});

// Obtenir les analyses et prévisions
router.get('/analysis', auth, async (req, res) => {
  try {
    // Récupérer les transactions des 3 derniers mois
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: threeMonthsAgo }
    });

    // Analyser les tendances par catégorie
    const categoryTrends = {};
    const currentMonth = new Date().getMonth();

    transactions.forEach(transaction => {
      const month = new Date(transaction.date).getMonth();
      if (!categoryTrends[transaction.category]) {
        categoryTrends[transaction.category] = {
          current: 0,
          previous: 0,
          trend: 0
        };
      }

      if (month === currentMonth) {
        categoryTrends[transaction.category].current += transaction.amount;
      } else if (month === (currentMonth - 1 + 12) % 12) {
        categoryTrends[transaction.category].previous += transaction.amount;
      }
    });

    // Calculer les variations en pourcentage
    Object.keys(categoryTrends).forEach(category => {
      const { current, previous } = categoryTrends[category];
      if (previous > 0) {
        categoryTrends[category].trend = ((current - previous) / previous) * 100;
      }
    });

    // Générer des conseils basés sur les tendances
    const insights = [];
    Object.entries(categoryTrends).forEach(([category, data]) => {
      if (data.trend > 20) {
        insights.push({
          category,
          message: `Vos dépenses en ${category} ont augmenté de ${data.trend.toFixed(1)}% ce mois-ci.`,
          type: 'WARNING'
        });
      } else if (data.trend < -20) {
        insights.push({
          category,
          message: `Bravo ! Vous avez réduit vos dépenses en ${category} de ${Math.abs(data.trend).toFixed(1)}%.`,
          type: 'SUCCESS'
        });
      }
    });

    // Calculer les prévisions pour le mois prochain
    const predictions = Object.entries(categoryTrends).reduce((acc, [category, data]) => {
      acc[category] = {
        predictedAmount: data.current * (1 + data.trend / 100),
        confidence: calculateConfidence(data.trend)
      };
      return acc;
    }, {});

    res.json({
      trends: categoryTrends,
      insights,
      predictions
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'analyse des données" });
  }
});

// Fonction utilitaire pour calculer le niveau de confiance des prévisions
function calculateConfidence(trend) {
  const volatility = Math.abs(trend);
  if (volatility < 10) return 'ÉLEVÉ';
  if (volatility < 25) return 'MOYEN';
  return 'FAIBLE';
}

module.exports = router; 