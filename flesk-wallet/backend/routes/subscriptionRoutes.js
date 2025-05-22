const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    createSubscription, 
    getSubscriptions, 
    getSubscription, 
    updateSubscription, 
    deleteSubscription, 
    syncSubscriptions,
    checkRenewalSubscriptions
} = require('../controllers/subscriptionController');

// Routes protégées
router.route('/')
    .post(protect, createSubscription)
    .get(protect, getSubscriptions);

router.route('/:id')
    .get(protect, getSubscription)
    .put(protect, updateSubscription)
    .delete(protect, deleteSubscription);

// Route pour synchroniser les abonnements (crée des dépenses et met à jour la date)
router.post('/sync', protect, syncSubscriptions);

// Route pour vérifier les abonnements à renouveler (pour cron job ou test)
router.post('/check-renewals', protect, checkRenewalSubscriptions);

module.exports = router; 