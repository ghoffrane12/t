const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Revenue = require('../models/Revenue');
const Budget = require('../models/Budget');
const { protect } = require('../middleware/auth');

// Utilitaire pour normaliser la question
function normalize(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Calcul pour les simulations financières
function calculateMonthlySavings(targetAmount, months) {
  return (targetAmount / months).toFixed(2);
}

router.post('/', protect, async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;
  const q = normalize(message);

  try {
    // Salutations
    if (/(bonjour|salut|coucou|hello|bonsoir)/.test(q)) {
      return res.json({ response: "Bonjour ! Je suis ton assistant financier. Pose-moi une question sur tes dépenses, revenus, budgets, ou objectifs 😊" });
    }

    // Dépenses par catégorie
    if (/depens[ée].*alimentation.*mois/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const total = await Expense.aggregate([
        { $match: { user: userId, category: 'alimentation', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Tu as dépensé ${sum.toFixed(2)} DT en alimentation ce mois-ci.` });
    }
    if (/depens[ée].*transport.*semaine derniere/.test(q)) {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay() - 7);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      const total = await Expense.aggregate([
        { $match: { user: userId, category: 'transport', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Tu as dépensé ${sum.toFixed(2)} DT en transport la semaine dernière.` });
    }
    if (/depens[ée].*loisir.*avril/.test(q)) {
      const year = new Date().getFullYear();
      const start = new Date(year, 3, 1);
      const end = new Date(year, 4, 0, 23, 59, 59, 999);
      const total = await Expense.aggregate([
        { $match: { user: userId, category: 'loisir', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Tu as dépensé ${sum.toFixed(2)} DT en loisirs en avril.` });
    }
    if (/depens[ée].*abonnement/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const total = await Expense.aggregate([
        { $match: { user: userId, category: 'abonnement', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Tu as dépensé ${sum.toFixed(2)} DT pour les abonnements ce mois-ci.` });
    }
    if (/depens[ée].*shopping/.test(q)) {
      const total = await Expense.aggregate([
        { $match: { user: userId, category: 'shopping' } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Tu as dépensé ${sum.toFixed(2)} DT dans la catégorie shopping depuis toujours.` });
    }

    // Dépenses par période
    if (/depens[ée].*aujourd'hui/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const total = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Aujourd'hui, tu as dépensé ${sum.toFixed(2)} DT.` });
    }
    if (/depens[ée].*cette.*semaine/.test(q)) {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const total = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Cette semaine, tu as dépensé ${sum.toFixed(2)} DT.` });
    }
    if (/depens[ée].*mois dernier/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      const total = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Le mois dernier, tu as dépensé ${sum.toFixed(2)} DT.` });
    }
    if (/depens[ée].*debut.*annee/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date();
      const total = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Depuis le début de l'année, tu as dépensé ${sum.toFixed(2)} DT.` });
    }
    if (/depens[ée].*3 derniers mois/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const end = new Date();
      const total = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Sur les 3 derniers mois, tu as dépensé ${sum.toFixed(2)} DT.` });
    }

    // Dépenses globales
    if (/total.*depens[ée]/.test(q)) {
      const total = await Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Ton total de dépenses est de ${sum.toFixed(2)} DT.` });
    }
    if (/ou.*depens[ée].*plus/.test(q)) {
      const agg = await Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', sum: { $sum: '$amount' } } },
        { $sort: { sum: -1 } },
        { $limit: 1 }
      ]);
      const cat = agg[0]?._id || 'aucune catégorie';
      const sum = agg[0]?.sum || 0;
      return res.json({ response: `Tu dépenses le plus en ${cat} (${sum.toFixed(2)} DT).` });
    }
    if (/plus grosse depense/.test(q)) {
      const agg = await Expense.find({ user: userId }).sort({ amount: -1 }).limit(1);
      if (agg.length === 0) return res.json({ response: "Aucune dépense trouvée." });
      return res.json({ response: `Ta plus grosse dépense est de ${agg[0].amount.toFixed(2)} DT en ${agg[0].category} le ${new Date(agg[0].date).toLocaleDateString('fr-FR')}.` });
    }
    if (/5 dernieres depens[ée]/.test(q)) {
      const agg = await Expense.find({ user: userId }).sort({ date: -1 }).limit(5);
      if (agg.length === 0) return res.json({ response: "Aucune dépense trouvée." });
      const list = agg.map(e => `${e.amount.toFixed(2)} DT (${e.category}, ${new Date(e.date).toLocaleDateString('fr-FR')})`).join(', ');
      return res.json({ response: `Voici tes 5 dernières dépenses : ${list}.` });
    }

    // Revenus
    if (/revenu.*mois/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const total = await Revenue.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Tes revenus ce mois-ci sont de ${sum.toFixed(2)} DT.` });
    }
    if (/gagn[ée].*mois dernier/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      const total = await Revenue.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Le mois dernier, tu as gagné ${sum.toFixed(2)} DT.` });
    }
    if (/source principale.*revenu/.test(q)) {
      const agg = await Revenue.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', sum: { $sum: '$amount' } } },
        { $sort: { sum: -1 } },
        { $limit: 1 }
      ]);
      const cat = agg[0]?._id || 'aucune source';
      const sum = agg[0]?.sum || 0;
      return res.json({ response: `Ta source principale de revenus est ${cat} (${sum.toFixed(2)} DT).` });
    }
    if (/recu.*cette semaine/.test(q)) {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const total = await Revenue.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: `Cette semaine, tu as reçu ${sum.toFixed(2)} DT.` });
    }
    if (/entrees.*argent.*2025/.test(q)) {
      const start = new Date(2025, 0, 1);
      const end = new Date(2025, 11, 31, 23, 59, 59, 999);
      const total = await Revenue.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: '$category', sum: { $sum: '$amount' } } }
      ]);
      if (!total.length) return res.json({ response: "Aucun revenu enregistré pour 2025." });
      const totalSum = total.reduce((acc, curr) => acc + curr.sum, 0);
      const breakdown = total.map(t => `${t._id}: ${t.sum.toFixed(2)} DT`).join(', ');
      return res.json({ response: `En 2025, tes entrées d'argent s'élèvent à ${totalSum.toFixed(2)} DT. Répartition : ${breakdown}.` });
    }

    // Soldes / budgets
    if (/solde actuel/.test(q)) {
      const totalRevenues = await Revenue.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const totalExpenses = await Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const solde = (totalRevenues[0]?.sum || 0) - (totalExpenses[0]?.sum || 0) ;
      return res.json({ response: `Ton solde actuel est de ${solde.toFixed(2)} DT.` });
    }
    if (/reste.*budget.*alimentation/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const budget = await Budget.findOne({ user: userId, category: 'alimentation' });
      if (!budget) return res.json({ response: "Tu n'as pas de budget alimentation défini." });
      const totalExpenses = await Expense.aggregate([
        { $match: { user: userId, category: 'alimentation', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const reste = budget.amount - (totalExpenses[0]?.sum || 0);
      return res.json({ response: `Il te reste ${reste.toFixed(2)} DT sur ton budget alimentation ce mois-ci.` });
    }
    if (/dans.*budget.*mois/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const budget = await Budget.findOne({ user: userId });
      if (!budget) return res.json({ response: "Tu n'as pas de budget défini pour ce mois." });
      const totalExpenses = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const spent = totalExpenses[0]?.sum || 0;
      const percentage = (spent / budget.amount) * 100;
      return res.json({ response: spent <= budget.amount 
        ? `Oui, tu es dans ton budget ce mois-ci (${percentage.toFixed(1)}% utilisé).` 
        : `Non, tu as dépassé ton budget de ${(spent - budget.amount).toFixed(2)} DT.` });
    }
    if (/budget.*mois/.test(q)) {
      const budget = await Budget.findOne({ user: userId });
      if (!budget) return res.json({ response: "Tu n'as pas de budget défini pour ce mois." });
      return res.json({ response: `Ton budget pour ce mois est de ${budget.amount.toFixed(2)} DT.` });
    }
    if (/depass[ée].*budget/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const budget = await Budget.findOne({ user: userId });
      if (!budget) return res.json({ response: "Tu n'as pas de budget défini." });
      const totalExpenses = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const spent = totalExpenses[0]?.sum || 0;
      return res.json({ response: spent > budget.amount 
        ? `Oui, tu as dépassé ton budget de ${(spent - budget.amount).toFixed(2)} DT.` 
        : `Non, tu es dans ton budget (reste ${(budget.amount - spent).toFixed(2)} DT).` });
    }

    // Simulations / objectifs financiers
    if (/voiture.*20000.*2026/.test(q)) {
      const target = 20000;
      const months = (new Date(2026, 11, 31) - new Date()) / (1000 * 60 * 60 * 24 * 30);
      const monthly = calculateMonthlySavings(target, months);
      return res.json({ response: `Pour acheter une voiture à 20 000 DT d'ici fin 2026, tu dois économiser environ ${monthly} DT par mois.` });
    }
    if (/economiser.*10000.*2 ans/.test(q)) {
      const target = 10000;
      const months = 24;
      const monthly = calculateMonthlySavings(target, months);
      return res.json({ response: `Pour économiser 10 000 DT en 2 ans, tu dois mettre de côté ${monthly} DT par mois.` });
    }
    if (/voyage.*juillet.*2025.*3000/.test(q)) {
      const target = 3000;
      const months = (new Date(2025, 6, 1) - new Date()) / (1000 * 60 * 60 * 24 * 30);
      const monthly = calculateMonthlySavings(target, months);
      return res.json({ response: `Pour ton voyage à 3 000 DT en juillet 2025, économise ${monthly} DT par mois. Commence par réduire tes dépenses non essentielles, comme les loisirs.` });
    }
    if (/ordinateur.*1500.*6 mois/.test(q)) {
      const target = 1500;
      const months = 6;
      const monthly = calculateMonthlySavings(target, months);
      return res.json({ response: `Pour acheter un ordinateur à 1 500 DT en 6 mois, mets de côté ${monthly} DT par mois.` });
    }
    if (/economiser.*5000.*an/.test(q)) {
      const target = 5000;
      const months = 12;
      const monthly = calculateMonthlySavings(target, months);
      return res.json({ response: `Pour économiser 5 000 DT en un an, tu dois mettre de côté ${monthly} DT par mois. Essaie d'automatiser une épargne mensuelle.` });
    }

    // Habitudes
    if (/depense moyenne par mois/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date();
      const agg = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: { $month: '$date' }, sum: { $sum: '$amount' } } }
      ]);
      if (!agg.length) return res.json({ response: "Pas assez de données pour calculer la moyenne." });
      const moyenne = agg.reduce((acc, cur) => acc + cur.sum, 0) / agg.length;
      return res.json({ response: `Ta dépense moyenne par mois est de ${moyenne.toFixed(2)} DT.` });
    }
    if (/depens[ée].*plus.*mois dernier/.test(q)) {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      const current = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: currentMonthStart, $lte: now } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const last = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const currentSum = current[0]?.sum || 0;
      const lastSum = last[0]?.sum || 0;
      return res.json({ response: currentSum > lastSum 
        ? `Oui, tu dépenses plus ce mois-ci (${currentSum.toFixed(2)} DT) que le mois dernier (${lastSum.toFixed(2)} DT).` 
        : `Non, tu dépenses moins ce mois-ci (${currentSum.toFixed(2)} DT) que le mois dernier (${lastSum.toFixed(2)} DT).` });
    }
    if (/depens[ée].*trop.*nourriture/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const budget = await Budget.findOne({ user: userId, category: 'alimentation' });
      const total = await Expense.aggregate([
        { $match: { user: userId, category: 'alimentation', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      if (!budget) return res.json({ response: `Tu as dépensé ${sum.toFixed(2)} DT en alimentation, mais aucun budget n'est défini pour comparer.` });
      return res.json({ response: sum > budget.amount 
        ? `Oui, tu dépenses trop en alimentation (${sum.toFixed(2)} DT, dépassement de ${(sum - budget.amount).toFixed(2)} DT).` 
        : `Non, tu es dans ton budget alimentation (${sum.toFixed(2)} DT sur ${budget.amount.toFixed(2)} DT).` });
    }
    if (/trop depens[ée]/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const budget = await Budget.findOne({ user: userId });
      if (!budget) return res.json({ response: "Aucun budget défini pour comparer." });
      const total = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sum = total[0]?.sum || 0;
      return res.json({ response: sum > budget.amount 
        ? `Oui, tu dépenses trop ce mois-ci (${sum.toFixed(2)} DT, dépassement de ${(sum - budget.amount).toFixed(2)} DT).` 
        : `Non, tu es dans ton budget (${sum.toFixed(2)} DT sur ${budget.amount.toFixed(2)} DT).` });
    }
    if (/depens[ée].*augmentent/.test(q)) {
      const now = new Date();
      const thisMonth = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: new Date(now.getFullYear(), now.getMonth(), 1), $lte: now } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const lastMonth = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1), $lte: new Date(now.getFullYear(), now.getMonth(), 0) } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const thisSum = thisMonth[0]?.sum || 0;
      const lastSum = lastMonth[0]?.sum || 0;
      return res.json({ response: thisSum > lastSum 
        ? `Oui, tes dépenses augmentent ce mois-ci (${thisSum.toFixed(2)} DT contre ${lastSum.toFixed(2)} DT le mois dernier).` 
        : `Non, tes dépenses n'augmentent pas (${thisSum.toFixed(2)} DT ce mois-ci, contre ${lastSum.toFixed(2)} DT le mois dernier).` });
    }

    // Aide / général
    if (/comment ajouter une depense/.test(q)) {
      return res.json({ response: "Pour ajouter une dépense, clique sur '+ Dépense' dans l'app, saisis le montant, la catégorie (ex. alimentation) et la date, puis valide." });
    }
    if (/comment supprimer une transaction/.test(q)) {
      return res.json({ response: "Pour supprimer une transaction, va dans l'onglet 'Transactions', sélectionne la dépense ou le revenu à supprimer, et clique sur l'icône de suppression." });
    }
    if (/comment creer.*objectif.*epargne/.test(q)) {
      return res.json({ response: "Pour créer un objectif d'épargne, va dans 'Objectifs', clique sur 'Nouveau', saisis le montant cible, la date butoir, et active les rappels si besoin." });
    }
    if (/comment fonctionne.*budget mensuel/.test(q)) {
      return res.json({ response: "Le budget mensuel te permet de définir une limite de dépenses par catégorie. Va dans 'Budgets', ajoute un budget pour une catégorie (ex. alimentation), et suis tes dépenses pour rester dans la limite." });
    }
    if (/fonctionnalites.*application/.test(q)) {
      return res.json({ response: "L'application permet de : suivre tes dépenses et revenus, gérer des budgets par catégorie, définir des objectifs d'épargne, voir des rapports sur tes habitudes, et interagir avec moi pour des analyses rapides !" });
    }

    // Commandes
    if (/ajoute.*depense.*(\d+\.?\d*).*(alimentation|transport|loisir|abonnement|shopping)/.test(q)) {
      const match = q.match(/(\d+\.?\d*).*(alimentation|transport|loisir|abonnement|shopping)/);
      const amount = parseFloat(match[1]);
      const category = match[2];
      const expense = new Expense({ user: userId, amount, category, date: new Date() });
      await expense.save();
      return res.json({ response: `Dépense de ${amount.toFixed(2)} DT en ${category} ajoutée avec succès.` });
    }
    if (/note.*entree.*(\d+\.?\d*).*(salaire|freelance|autre)/.test(q)) {
      const match = q.match(/(\d+\.?\d*).*(salaire|freelance|autre)/);
      const amount = parseFloat(match[1]);
      const category = match[2];
      const revenue = new Revenue({ user: userId, amount, category, date: new Date() });
      await revenue.save();
      return res.json({ response: `Entrée de ${amount.toFixed(2)} DT pour ${category} notée avec succès.` });
    }
    if (/supprime.*derniere.*depense/.test(q)) {
      const expense = await Expense.findOne({ user: userId }).sort({ date: -1 });
      if (!expense) return res.json({ response: "Aucune dépense à supprimer." });
      await Expense.deleteOne({ _id: expense._id });
      return res.json({ response: `Dernière dépense de ${expense.amount.toFixed(2)} DT (${expense.category}) supprimée.` });
    }
    if (/affiche.*transactions recentes/.test(q)) {
      const expenses = await Expense.find({ user: userId }).sort({ date: -1 }).limit(5);
      const revenues = await Revenue.find({ user: userId }).sort({ date: -1 }).limit(5);
      const transactions = [...expenses, ...revenues].sort((a, b) => b.date - a.date).slice(0, 5);
      if (!transactions.length) return res.json({ response: "Aucune transaction récente." });
      const list = transactions.map(t => `${t.amount.toFixed(2)} DT (${t.category}, ${t instanceof Expense ? 'dépense' : 'revenu'}, ${new Date(t.date).toLocaleDateString('fr-FR')})`).join(', ');
      return res.json({ response: `Voici tes transactions récentes : ${list}.` });
    }
    if (/rappelle.*comptes.*semaine/.test(q)) {
      return res.json({ response: "Rappel activé ! Je te rappellerai chaque semaine de vérifier tes comptes. Va dans les paramètres pour personnaliser les notifications." });
    }

    // Catégorie la plus dépensée
    if (/cat(é|e)gorie.*(plus|max)/.test(q)) {
      const agg = await Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', sum: { $sum: '$amount' } } },
        { $sort: { sum: -1 } },
        { $limit: 1 }
      ]);
      const cat = agg[0]?._id || 'aucune catégorie';
      const sum = agg[0]?.sum || 0;
      return res.json({ response: `Tu dépenses le plus en ${cat} (${sum.toFixed(2)} DT).` });
    }

    // Catégorie la moins dépensée ce mois-ci
    if (/cat(é|e)gorie.*(moins|min).*mois/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const agg = await Expense.aggregate([
        { $match: { user: userId, date: { $gte: start, $lte: end } } },
        { $group: { _id: '$category', sum: { $sum: '$amount' } } },
        { $sort: { sum: 1 } },
        { $limit: 1 }
      ]);
      const cat = agg[0]?._id || 'aucune catégorie';
      const sum = agg[0]?.sum || 0;
      return res.json({ response: `Ce mois-ci, tu as le moins dépensé en ${cat} (${sum.toFixed(2)} DT).` });
    }

    // Classement des dépenses par catégorie
    if (/classement.*d(é|e)penses.*cat(é|e)gorie/.test(q)) {
      const agg = await Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', sum: { $sum: '$amount' } } },
        { $sort: { sum: -1 } }
      ]);
      if (!agg.length) return res.json({ response: "Aucune dépense trouvée." });
      const list = agg.map((e, i) => `${i + 1}. ${e._id}: ${e.sum.toFixed(2)} DT`).join('\n');
      return res.json({ response: `Classement de tes dépenses par catégorie :\n${list}` });
    }

    // Revenus en hausse/baisse par rapport au mois précédent
    if (/revenu.*(augment|baisse|diminu|hausse).*mois pr(é|e)c(é|e)dent/.test(q)) {
      const now = new Date();
      const startThis = new Date(now.getFullYear(), now.getMonth(), 1);
      const endThis = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const startPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endPrev = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      const totalThis = await Revenue.aggregate([
        { $match: { user: userId, date: { $gte: startThis, $lte: endThis } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const totalPrev = await Revenue.aggregate([
        { $match: { user: userId, date: { $gte: startPrev, $lte: endPrev } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const sumThis = totalThis[0]?.sum || 0;
      const sumPrev = totalPrev[0]?.sum || 0;
      const diff = sumThis - sumPrev;
      let msg = diff > 0 ? `Tes revenus ont augmenté de ${diff.toFixed(2)} DT par rapport au mois précédent.` :
        diff < 0 ? `Tes revenus ont diminué de ${Math.abs(diff).toFixed(2)} DT par rapport au mois précédent.` :
        "Tes revenus sont stables par rapport au mois précédent.";
      return res.json({ response: msg });
    }

    // Tendance des revenus cette année
    if (/tendance.*revenu.*(cette|de l')ann(é|e)e/.test(q)) {
      const year = new Date().getFullYear();
      const agg = await Revenue.aggregate([
        { $match: { user: userId, date: { $gte: new Date(year, 0, 1) } } },
        { $group: { _id: { $month: '$date' }, sum: { $sum: '$amount' } } },
        { $sort: { '_id': 1 } }
      ]);
      if (!agg.length) return res.json({ response: "Aucun revenu trouvé cette année." });
      const list = agg.map(e => `Mois ${e._id}: ${e.sum.toFixed(2)} DT`).join(', ');
      return res.json({ response: `Tendance de tes revenus cette année : ${list}` });
    }

    // Solde début de mois (placeholder)
    if (/solde.*d(é|e)but.*mois/.test(q)) {
      return res.json({ response: `(À implémenter) Ton solde en début de mois était de ... DT.` });
    }

    // Utilisation du budget shopping
    if (/budget.*shopping.*utilis(é|e)/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const budget = await Budget.findOne({ user: userId, category: 'shopping' });
      const depenses = await Expense.aggregate([
        { $match: { user: userId, category: 'shopping', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const used = depenses[0]?.sum || 0;
      return res.json({ response: `Tu as utilisé ${used.toFixed(2)} DT de ton budget shopping ce mois-ci.` });
    }

    // Budget mensuel total
    if (/budget.*mensuel.*total/.test(q)) {
      const budgets = await Budget.find({ user: userId });
      const total = budgets.reduce((sum, b) => sum + b.amount, 0);
      return res.json({ response: `Ton budget mensuel total est de ${total.toFixed(2)} DT.` });
    }

    // Découvert (placeholder)
    if (/d(é|e)couvert/.test(q)) {
      return res.json({ response: `(À implémenter) Tu n'es pas à découvert.` });
    }

    // Reste pour les loisirs
    if (/reste.*loisir/.test(q)) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      const budget = await Budget.findOne({ user: userId, category: 'loisirs' });
      const depenses = await Expense.aggregate([
        { $match: { user: userId, category: 'loisirs', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ]);
      const used = depenses[0]?.sum || 0;
      const reste = budget ? budget.amount - used : 0;
      return res.json({ response: `Il te reste ${reste.toFixed(2)} DT pour les loisirs ce mois-ci.` });
    }

    // Conseils pour réduire les dépenses
    if (/conseil.*(r(é|e)duire|diminuer).*d(é|e)pens(es|e|er)/.test(q)) {
      return res.json({ response: "Voici quelques conseils :\n- Fixe-toi un budget par catégorie\n- Suis tes dépenses chaque semaine\n- Privilégie les achats utiles\n- Mets de côté dès le début du mois\n- Compare les prix avant d'acheter\n- Limite les abonnements non essentiels" });
    }

    // Lister toutes les catégories de dépenses
    if (/liste.*cat(é|e)gorie.*d(é|e)pens(es|e|er)/.test(q)) {
      const categories = await Expense.distinct('category', { user: userId });
      if (!categories.length) return res.json({ response: "Aucune catégorie trouvée." });
      return res.json({ response: `Voici tes catégories de dépenses : ${categories.join(', ')}` });
    }

    // 1. Je veux économiser mais je n'y arrive pas. Aide-moi.
    if (/je veux (é|e)conomiser.*(pas|difficile|n'y arrive|j'y arrive pas|j'arrive pas)/.test(q)) {
      return res.json({ response: `💡 Ce n'est pas toujours facile, mais c'est possible avec quelques habitudes simples :\n\n- Note chaque dépense, même les petites.\n- Fixe-toi un objectif précis (ex : "économiser 100dt par mois").\n- Supprime les achats impulsifs (attends 24h avant d'acheter).\n- Essaie la méthode 50/30/20 (50% besoins, 30% envies, 20% épargne).\n\nTu veux que je t'aide à créer un plan d'épargne personnalisé ? 😊` });
    }

    // 2. Donne-moi un conseil pour mieux gérer mon argent.
    if (/(conseil|astuce).*mieux.*g(é|e)rer.*argent/.test(q)) {
      return res.json({ response: `📊 Bien sûr ! Un conseil simple mais puissant :\nFais un budget mensuel et respecte-le.\n\n- Classe tes dépenses en catégories\n- Donne une limite à chaque catégorie\n- Vérifie chaque semaine si tu respectes ton plan\n\nTu peux aussi consulter ton solde et tes dépenses ici à tout moment 🧮` });
    }

    // 3. Quels sont tes conseils pour réduire mes dépenses ?
    if (/(conseil|id(é|e)e|astuce).*r(é|e)duire.*d(é|e)pens(es|e|er)/.test(q)) {
      return res.json({ response: `🛍️ Voici quelques idées concrètes pour réduire tes dépenses :\n\n- Planifie tes repas pour éviter les achats inutiles\n- Annule les abonnements que tu n'utilises plus\n- Compare toujours les prix avant d'acheter\n- Privilégie les achats d'occasion quand c'est possible\n- Fixe-toi une limite de dépenses hebdomadaire\n\nTu veux que je t'aide à repérer tes catégories les plus coûteuses ?` });
    }

    // 4. Est-ce que je suis bon(ne) en gestion de budget ?
    if (/suis[- ]?je.*bon(ne)?.*gestion.*budget/.test(q)) {
      return res.json({ response: `🤔 Voyons voir… Tu veux que je vérifie ton budget, ton solde et ta régularité ?\nEn général, si tu :\n- dépenses moins que ce que tu gagnes\n- respectes ton budget\n- arrives à épargner un peu chaque mois\nAlors tu es sur la bonne voie ! Bravo 👏\nTu veux un petit bilan de ton mois pour voir ça ensemble ?` });
    }

    // 5. As-tu une astuce pour économiser au quotidien ?
    if (/(astuce|conseil).*économiser.*quotidien/.test(q)) {
      return res.json({ response: `💸 Une astuce simple et efficace :\nPaye en espèces pour certaines catégories (ex: loisirs, shopping).\nQuand tu vois l'argent sortir physiquement, tu dépenses moins !\n\nAutre astuce : chaque fois que tu évites un achat inutile, transfère ce montant dans une "cagnotte épargne". Tu seras surpris(e) du résultat à la fin du mois ! 😄\nTu veux que je suive ça pour toi ?` });
    }

    // Par défaut
    return res.json({ response: "Désolé, je n'ai pas compris ta question. Essaie de reformuler ou tape 'fonctionnalités' pour découvrir ce que je peux faire !" });
  } catch (err) {
    console.error('Erreur chatbot:', err);
    return res.status(500).json({ response: "Erreur interne du serveur. Réessaie plus tard." });
  }
});

module.exports = router;