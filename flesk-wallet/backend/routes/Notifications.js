const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// Récupérer toutes les notifications de l'utilisateur connecté
router.get('/', protect, async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(notifications);
});

// Marquer comme lue
router.put('/:id/read', protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
});

// Supprimer
router.delete('/:id', protect, async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 