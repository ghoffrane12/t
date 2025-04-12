const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['budget_alert', 'subscription_reminder', 'spending_anomaly', 'goal_progress', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  data: {
    type: mongoose.Schema.Types.Mixed // Additional data specific to notification type
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String
  }
});

// Index for efficient querying
notificationSchema.index({ user: 1, status: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Static method to create budget alert
notificationSchema.statics.createBudgetAlert = async function(userId, category, percentage) {
  return this.create({
    user: userId,
    type: 'budget_alert',
    title: 'Budget Alert',
    message: `You have used ${percentage}% of your ${category} budget`,
    priority: percentage >= 90 ? 'high' : 'medium',
    data: {
      category,
      percentage
    }
  });
};

// Static method to create subscription reminder
notificationSchema.statics.createSubscriptionReminder = async function(userId, serviceName, dueDate) {
  return this.create({
    user: userId,
    type: 'subscription_reminder',
    title: 'Subscription Renewal',
    message: `Your ${serviceName} subscription is due for renewal on ${dueDate}`,
    priority: 'medium',
    data: {
      serviceName,
      dueDate
    },
    actionRequired: true
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 