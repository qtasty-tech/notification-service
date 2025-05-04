const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendNotification = async (userEmail, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Notification',
    text: message
  };

  await transporter.sendMail(mailOptions);

  return { message: 'Email sent successfully' };
};

module.exports = { sendNotification };
