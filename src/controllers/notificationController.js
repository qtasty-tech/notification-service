const notificationService = require('../services/notificationService');

const sendNotification = async (req, res) => {
  try {
    const { userEmail, message } = req.body;
    const result = await notificationService.sendNotification(userEmail, message);
    res.status(200).json(result);
  } catch (error) {
    console.error('Email send failed:', error.message);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

module.exports = { sendNotification };
