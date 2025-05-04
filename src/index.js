const express = require('express');
const mongoose = require('mongoose');
const notificationRoutes = require('./routes/notificationRoutes');
const watchOrderStatusChanges = require('./watchOrderStatus');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8083;

app.use(express.json());

// Routes
app.use('/api/notifications', notificationRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected for Notification Service');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Notification Service running on port ${PORT}`);
    });

    // Start Change Stream
    watchOrderStatusChanges();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
