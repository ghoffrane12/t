const Expense = require('../models/Expense');

// Créer une nouvelle dépense
exports.createExpense = async (req, res) => {
    try {
        const expense = new Expense({
            ...req.body,
            user: req.user._id
        });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir toutes les dépenses d'un utilisateur
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une dépense spécifique
exports.getExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
        if (!expense) {
            return res.status(404).json({ message: "Dépense non trouvée" });
        }
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une dépense
exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!expense) {
            return res.status(404).json({ message: "Dépense non trouvée" });
        }
        res.json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une dépense
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!expense) {
            return res.status(404).json({ message: "Dépense non trouvée" });
        }
        res.json({ message: "Dépense supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 