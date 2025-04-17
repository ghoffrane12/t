const Transaction = require('../models/Transaction');
const { validateTransaction } = require('../utils/validators');

// Obtenir toutes les transactions d'un utilisateur
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(100);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions' });
  }
};

// Obtenir les statistiques des transactions
exports.getTransactionStats = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    const formattedStats = {
      labels: [],
      expenses: [],
      incomes: []
    };

    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    stats.forEach(stat => {
      const monthLabel = months[stat._id.month - 1];
      if (!formattedStats.labels.includes(monthLabel)) {
        formattedStats.labels.push(monthLabel);
      }
      
      const monthIndex = formattedStats.labels.indexOf(monthLabel);
      if (stat._id.type === 'EXPENSE') {
        formattedStats.expenses[monthIndex] = stat.total;
      } else {
        formattedStats.incomes[monthIndex] = stat.total;
      }
    });

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

// Créer une nouvelle transaction
exports.createTransaction = async (req, res) => {
  try {
    const validation = validateTransaction(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.errors.join(', ') });
    }

    const transaction = new Transaction({
      ...req.body,
      userId: req.user.id
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la transaction' });
  }
};

// Mettre à jour une transaction
exports.updateTransaction = async (req, res) => {
  try {
    const validation = validateTransaction(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.errors.join(', ') });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la transaction' });
  }
};

// Supprimer une transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }

    res.json({ message: 'Transaction supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la transaction' });
  }
}; 