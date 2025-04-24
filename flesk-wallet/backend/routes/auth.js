const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    console.log('Début de l\'inscription');
    console.log("Contenu reçu dans le body :", req.body); // 👉 AJOUTE CETTE LIGNE ICI

    const { email, password, firstName, lastName } = req.body;

    // Validation des champs requis
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

    // Validation du format d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    // Validation de la force du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Créer un nouvel utilisateur
    user = new User({
      email,
      password,
      firstName,
      lastName
    });

    console.log('Tentative de sauvegarde utilisateur');
    await user.save();
    console.log('Utilisateur sauvegardé avec succès');

    // Créer et retourner le token JWT
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

    // Validation des champs requis
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

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est bloqué
    if (user.loginAttempts >= 5 && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(403).json({
        success: false,
        message: 'Compte temporairement bloqué',
        remainingTime: `${remainingTime} minutes`
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Incrémenter les tentatives de connexion
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000; // Blocage pendant 30 minutes
      }
      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
        attemptsLeft: 5 - user.loginAttempts
      });
    }

    // Réinitialiser les tentatives de connexion en cas de succès
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Créer et retourner le token JWT
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

module.exports = router; 