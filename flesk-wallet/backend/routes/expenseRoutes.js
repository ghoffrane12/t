const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const expenseController = require('../controllers/expenseController');

// Routes protégées par authentification
router.use(protect);

// Créer une nouvelle dépense
router.post('/', expenseController.createExpense);

// Obtenir toutes les dépenses
router.get('/', expenseController.getExpenses);

// Obtenir une dépense spécifique
router.get('/:id', expenseController.getExpense);

// Mettre à jour une dépense
router.put('/:id', expenseController.updateExpense);

// Supprimer une dépense
router.delete('/:id', expenseController.deleteExpense);

module.exports = router; 