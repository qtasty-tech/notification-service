const notificationService = require('../services/notificationService');

const sendNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const notification = await notificationService.sendNotification(userId, message);
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendNotification };
