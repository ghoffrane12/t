const Budget = require('../models/Budget');
const { createBudgetExceededNotification } = require('../services/notificationService');

// Obtenir tous les budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des budgets',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
    });
  }
};

// Créer un nouveau budget
exports.createBudget = async (req, res) => {
  try {
    console.log('1. Début de création du budget');
    console.log('2. Données reçues:', req.body);
    console.log('3. User ID:', req.user.id);

    const budget = new Budget({
      ...req.body,
      userId: req.user.id
    });

    console.log('4. Budget avant sauvegarde:', budget);

    const savedBudget = await budget.save();
    console.log('5. Budget sauvegardé:', savedBudget);
    console.log('6. ID du budget sauvegardé:', savedBudget._id);

    // Vérification immédiate
    const verif = await Budget.findById(savedBudget._id);
    console.log('7. Vérification après sauvegarde:', verif);

    res.status(201).json({
      success: true,
      data: savedBudget
    });
  } catch (error) {
    console.error('ERREUR DÉTAILLÉE:', error);
    
    // Si c'est une erreur de validation Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du budget',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
    });
  }
};

// Mettre à jour un budget
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget non trouvé'
      });
    }

    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du budget',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
    });
  }
};

// Supprimer un budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Budget supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du budget',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
    });
  }
};

// Obtenir les statistiques des budgets
exports.getBudgetStats = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    const stats = {
      totalBudgets: budgets.length,
      totalAllocated: budgets.reduce((sum, budget) => sum + budget.amount, 0),
      totalSpent: budgets.reduce((sum, budget) => sum + budget.currentSpending, 0)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
    });
  }
};

// Déduire un montant du budget
exports.deductFromBudget = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Le montant à déduire doit être positif'
      });
    }

    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.id });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget non trouvé'
      });
    }

    // Mettre à jour le montant dépensé et le montant restant
    budget.currentSpending += amount;
    budget.remainingAmount = Math.max(0, budget.remainingAmount - amount);
    
    // Mettre à jour le statut si nécessaire
    if (budget.remainingAmount === 0) {
      budget.status = 'COMPLETED';
    }

    // Vérifier si le budget est dépassé (plus de 90% utilisé)
    if (budget.currentSpending / budget.amount >= 0.9) {
      await createBudgetExceededNotification(req.user.id, budget);
    }

    await budget.save();

    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déduction du montant',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
    });
  }
};

// Obtenir le budget actif pour une catégorie donnée
exports.getBudgetByCategory = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      userId: req.user.id,
      category: req.params.category,
      status: 'ACTIVE'
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Aucun budget trouvé pour cette catégorie'
      });
    }

    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche du budget',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
    });
  }
};
