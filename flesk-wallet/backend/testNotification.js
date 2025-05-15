const mongoose = require('mongoose');
const Notification = require('./models/Notification');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flesk-wallet';

async function createTestNotification() {
  await mongoose.connect(MONGODB_URI);

  const notification = new Notification({
    userId: '68023f627ad9313de112f2a4', // Remplacez par un _id utilisateur valide
    type: 'test',
    title: 'Notification de test',
    message: 'Ceci est une notification de test générée manuellement.',
    category: 'test',
    location: null,
    read: false,
    date: new Date()
  });

  await notification.save();
  console.log('Notification test créée !');
  await mongoose.disconnect();
}

createTestNotification().catch(console.error); 