const mongoose = require('mongoose');
const Expense = require('../models/Expense');

async function getMonthlyCategoryTotals(userId, maxMonths = 12) {
  console.log("Récupération des dépenses pour userId:", userId);

  const objectId = new mongoose.Types.ObjectId(userId);

  // Étape 1 : récupérer les toutes premières dépenses pour connaître la date de début
  const firstExpense = await Expense.findOne({ user: objectId }).sort({ date: 1 });
  if (!firstExpense) {
    console.log("Aucune dépense trouvée pour cet utilisateur.");
    return {};
  }

  const now = new Date();
  const monthsSinceFirstExpense = Math.max(1, (now.getFullYear() - firstExpense.date.getFullYear()) * 12 + now.getMonth() - firstExpense.date.getMonth());

  const monthsToUse = Math.min(maxMonths, monthsSinceFirstExpense);

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsToUse);

  console.log(`📅 Fenêtre utilisée : ${monthsToUse} mois (depuis ${startDate.toISOString().slice(0, 10)})`);

  // Étape 2 : Récupération des dépenses filtrées
  const rawExpenses = await Expense.find({ 
    user: objectId,
    date: { $gte: startDate }
  });

  // Agrégation
  const expenses = await Expense.aggregate([
    { $match: { user: objectId, date: { $gte: startDate } } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          category: "$category"
        },
        total: { $sum: "$amount" }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Reformater
  const result = {};
  expenses.forEach(e => {
    const key = `${e._id.year}-${e._id.month}`;
    if (!result[e._id.category]) result[e._id.category] = [];
    result[e._id.category].push({ date: key, total: e.total });
  });

  return result;
}

module.exports = getMonthlyCategoryTotals;
