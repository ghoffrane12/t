const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

// Get all subscriptions for a user
router.get('/', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user.id })
      .sort({ nextPaymentDate: 1 });
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des abonnements' });
  }
});

// Get subscription statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ 
      userId: req.user.id,
      status: 'ACTIVE'
    });

    const totalMonthly = subscriptions.reduce((sum, sub) => {
      if (sub.frequency === 'MONTHLY') return sum + sub.amount;
      if (sub.frequency === 'YEARLY') return sum + (sub.amount / 12);
      if (sub.frequency === 'QUARTERLY') return sum + (sub.amount / 3);
      return sum;
    }, 0);

    const categoryStats = subscriptions.reduce((stats, sub) => {
      if (!stats[sub.category]) {
        stats[sub.category] = 0;
      }
      if (sub.frequency === 'MONTHLY') stats[sub.category] += sub.amount;
      if (sub.frequency === 'YEARLY') stats[sub.category] += (sub.amount / 12);
      if (sub.frequency === 'QUARTERLY') stats[sub.category] += (sub.amount / 3);
      return stats;
    }, {});

    res.json({
      totalMonthly,
      categoryStats,
      upcomingPayments: subscriptions
        .filter(sub => sub.status === 'ACTIVE')
        .sort((a, b) => a.nextPaymentDate - b.nextPaymentDate)
        .slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

// Create a new subscription
router.post('/', auth, async (req, res) => {
  try {
    const subscription = new Subscription({
      ...req.body,
      userId: req.user.id
    });
    const savedSubscription = await subscription.save();
    res.status(201).json(savedSubscription);
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la création de l\'abonnement' });
  }
});

// Update a subscription
router.put('/:id', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    Object.assign(subscription, req.body);
    const updatedSubscription = await subscription.save();
    res.json(updatedSubscription);
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'abonnement' });
  }
});

// Delete a subscription
router.delete('/:id', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    await subscription.remove();
    res.json({ message: 'Abonnement supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'abonnement' });
  }
});

// Update last used date
router.patch('/:id/used', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    subscription.lastUsed = new Date();
    await subscription.save();
    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la date d\'utilisation' });
  }
});

module.exports = router; 