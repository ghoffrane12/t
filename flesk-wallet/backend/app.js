const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Chargement des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Import des routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/revenues', require('./routes/revenueRoutes'));
app.use('/api/notifications', require('./routes/Notifications'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/budgets', require('./routes/Budgets'));
app.use('/api/savings', require('./routes/savings'));
//.use('/api/prediction', require('./routes/prediction')); // ✅ Route ajoutée ici
app.use('/api/predict', require('./routes/predict'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Export de l'application pour server.js
module.exports = app;
