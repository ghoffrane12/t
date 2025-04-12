const Subscription = require('../models/Subscription');

// Check for upcoming subscriptions
exports.checkSubscriptions = async (userId) => {
  const now = new Date();
  const upcomingSubs = await Subscription.find({
    userId,
    renewalDate: { $lte: new Date(now.setDate(now.getDate() + 3)) }, // 3 jours avant renouvellement
  });
  return upcomingSubs.map(sub => ({
    message: `Renouvellement de ${sub.name} prévu le ${sub.renewalDate.toLocaleDateString()}`,
    amount: sub.amount,
  }));
};