const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const expenseController = require('../controllers/expenseController');
const Expense = require('../models/Expense');  // Ajout de cette ligne
// Routes protégées par authentification
router.use(protect);

// Créer une nouvelle dépense
router.post('/', expenseController.createExpense);

// Obtenir toutes les dépenses
router.get('/', expenseController.getExpenses);
// Route pour vérifier les données générées
router.get('/check-data', async (req, res) => {
    try {
      console.log('Vérification des données pour userId:', req.user.id);
      const expenses = await Expense.find({ user: req.user.id });
      console.log('Nombre de dépenses trouvées:', expenses.length);
      
      const totalExpenses = await Expense.countDocuments({ user: req.user.id });
      console.log('Total des dépenses:', totalExpenses);
      
      const categories = [...new Set(expenses.map(e => e.category))];
      console.log('Catégories trouvées:', categories);
      
      res.json({
        totalExpenses,
        sampleExpenses: expenses.slice(0, 5),
        categories,
        dateRange: {
          first: expenses.length > 0 ? expenses[0].date : null,
          last: expenses.length > 0 ? expenses[expenses.length - 1].date : null
        }
      });
    } catch (error) {
      console.error('Erreur détaillée:', error);
      res.status(500).json({ 
        message: 'Erreur lors de la vérification des données',
        error: error.message 
      });
    }
  });
// Route pour supprimer toutes les dépenses
router.delete('/clear-all', protect, async (req, res) => {
  try {
    await Expense.deleteMany({ user: req.user.id });
    res.json({ message: 'Toutes les dépenses ont été supprimées' });
    console.log('Toutes les dépenses ont été supprimées');
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression des dépenses' });
  }
});
// Obtenir une dépense spécifique
router.get('/:id', expenseController.getExpense);

// Route pour générer des dépenses factices
router.post('/generate-fake', protect, async (req, res) => {
  try {
    const generateExpenses = require('../scripts/expensesByUser');
    await generateExpenses(req.user.id);
    res.json({ message: 'Dépenses factices générées avec succès' });
  } catch (error) {
    console.error('Erreur lors de la génération des dépenses:', error);
    res.status(500).json({ message: 'Erreur lors de la génération des dépenses' });
  }
});

// Mettre à jour une dépense
router.put('/:id', expenseController.updateExpense);

// Supprimer une dépense
router.delete('/:id', expenseController.deleteExpense);


module.exports = router; 