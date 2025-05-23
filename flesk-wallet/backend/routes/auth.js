const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ➕ Import de la fonction de génération de dépenses
const generateExpenses = require('../scripts/expensesByUser');

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    console.log('Début de l\'inscription');
    console.log("Contenu reçu dans le body :", req.body);

    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires',
        missingFields: {
          email: !email,
          password: !password,
          firstName: !firstName,
          lastName: !lastName
        }
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    user = new User({
      email,
      password,
      firstName,
      lastName
    });

    console.log('Tentative de sauvegarde utilisateur');
    await user.save();
    console.log('Utilisateur sauvegardé avec succès');

    // ✅ GÉNÉRATION AUTOMATIQUE DES DÉPENSES
    await generateExpenses(user._id);
    console.log('Dépenses générées automatiquement pour le nouvel utilisateur.');

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign Error:', err);
          return res.status(500).json({
            success: false,
            message: 'Erreur lors de la génération du token'
          });
        }
        res.status(201).json({
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        });
      }
    );
  } catch (err) {
    console.error('Erreur détaillée:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: Object.values(err.errors).map(error => error.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe sont obligatoires',
        missingFields: {
          email: !email,
          password: !password
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    if (user.loginAttempts >= 5 && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(403).json({
        success: false,
        message: 'Compte temporairement bloqué',
        remainingTime: `${remainingTime} minutes`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000;
      }
      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
        attemptsLeft: 5 - user.loginAttempts
      });
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign Error:', err);
          return res.status(500).json({
            success: false,
            message: 'Erreur lors de la génération du token'
          });
        }
        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        });
      }
    );
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
  }
});

// Route pour obtenir l'utilisateur courant
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Get Current User Error:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
  }
});

// Route pour mettre à jour les infos de l'utilisateur connecté
router.put('/me', protect, async (req, res) => {
  try {
    const { firstName, lastName, email, currency, language } = req.body;
    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (email) updateFields.email = email;
    if (currency) updateFields.currency = currency;
    if (language) updateFields.language = language;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Update User Error:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
  }
});

// Changement de mot de passe
router.put('/change-password', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Ancien et nouveau mot de passe requis.'
      });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.'
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Ancien mot de passe incorrect.'
      });
    }
    user.password = newPassword;
    await user.save();
    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès.'
    });
  } catch (err) {
    console.error('Change Password Error:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe.'
    });
  }
});

// Suppression du compte utilisateur connecté
router.delete('/me', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }
    res.json({
      success: true,
      message: 'Compte supprimé avec succès.'
    });
  } catch (err) {
    console.error('Delete Account Error:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du compte.'
    });
  }
});

module.exports = router;
