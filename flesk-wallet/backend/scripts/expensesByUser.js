const Expense = require('../models/Expense');

const categories = ['alimentation', 'transport', 'loisirs', 'santé', 'shopping'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAmount(category) {
  switch (category) {
    case 'alimentation': return getRandomInt(5, 25);
    case 'transport': return getRandomInt(10, 40);
    case 'loisirs': return getRandomInt(20, 100);
    case 'santé': return getRandomInt(10, 60);
    case 'shopping': return getRandomInt(15, 120);
    default: return getRandomInt(5, 50);
  }
}

async function generateExpenses(userId, months = 12, perMonth = 6) {
  const expenses = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  for (let i = 0; i < months; i++) {
    for (let j = 0; j < perMonth; j++) {
      const currentDate = new Date(startDate);
      currentDate.setMonth(currentDate.getMonth() + i);
      currentDate.setDate(getRandomInt(1, 28)); // éviter problème de fin de mois

      categories.forEach(cat => {
        expenses.push({
          nom: `Dépense ${cat}`,
          description: `Dépense simulée dans ${cat}`,
          amount: getRandomAmount(cat),
          category: cat,
          date: currentDate,
          user: userId
        });
      });
    }
  }

  await Expense.insertMany(expenses);
  console.log(`✅ ${expenses.length} fausses dépenses générées pour ${userId}.`);
}

module.exports = generateExpenses;
