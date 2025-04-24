const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

// Protection de toutes les routes
router.use(protect);

// Obtenir toutes les transactions
router.get('/', transactionController.getTransactions);

// Obtenir les statistiques des transactions
router.get('/stats', transactionController.getTransactionStats);

// Créer une nouvelle transaction
router.post('/', transactionController.createTransaction);

// Mettre à jour une transaction
router.put('/:id', transactionController.updateTransaction);

// Supprimer une transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router; 