const Revenue = require('../models/Revenue');

// Créer un nouveau revenu
exports.createRevenue = async (req, res) => {
    try {
        const revenue = new Revenue({
            ...req.body,
            user: req.user._id
        });
        await revenue.save();
        res.status(201).json(revenue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir tous les revenus d'un utilisateur
exports.getRevenues = async (req, res) => {
    try {
        const revenues = await Revenue.find({ user: req.user._id });
        res.json(revenues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un revenu spécifique
exports.getRevenue = async (req, res) => {
    try {
        const revenue = await Revenue.findOne({ _id: req.params.id, user: req.user._id });
        if (!revenue) {
            return res.status(404).json({ message: "Revenu non trouvé" });
        }
        res.json(revenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un revenu
exports.updateRevenue = async (req, res) => {
    try {
        const revenue = await Revenue.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!revenue) {
            return res.status(404).json({ message: "Revenu non trouvé" });
        }
        res.json(revenue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un revenu
exports.deleteRevenue = async (req, res) => {
    try {
        const revenue = await Revenue.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!revenue) {
            return res.status(404).json({ message: "Revenu non trouvé" });
        }
        res.json({ message: "Revenu supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 