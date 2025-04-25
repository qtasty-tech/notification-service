const express = require('express');
const mongoose = require('mongoose');
const notificationRoutes = require('./routes/notificationRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json()); // To parse JSON bodies

// Use notification routes
app.use('/api/notifications', notificationRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected for notification service');
    app.listen(PORT, () => {
      console.log(`Notification Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
