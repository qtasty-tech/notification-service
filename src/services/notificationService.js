const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN); // mewa arn dpn

const sendNotification = async (userId, message) => {
  
  const user = await User.findById(userId); 

  const response = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: user.phone, 
  });

  return { success: true, message: 'Notification sent successfully', response };
};

module.exports = { sendNotification };
