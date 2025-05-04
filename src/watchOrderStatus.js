const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

const client = new MongoClient(process.env.MONGO_URL); // must be replica-set enabled

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function watchOrderStatusChanges() {
  await client.connect();
  const db = client.db(); // default DB from connection string
  const orders = db.collection('orders');

  const changeStream = orders.watch([
    { $match: { operationType: 'update' } }
  ]);

  console.log('📡 Watching order status changes...');

  changeStream.on('change', async (change) => {
    const orderId = change.documentKey._id;
    const updatedFields = change.updateDescription.updatedFields;

    if (!updatedFields.status) return;
    const status = updatedFields.status;

    if (!['accepted', 'ready', 'completed'].includes(status)) return;

    const order = await orders.findOne({ _id: orderId });
    if (!order || !order.email) return;

    let subject, text;
    switch (status) {
      case 'accept':
        subject = 'Order Accepted';
        text = 'Your order has been accepted by the restaurant.';
        break;
      case 'ready':
        subject = 'Order Ready for Delivery';
        text = 'Your order is on the way!';
        break;
      case 'complete':
        subject = 'Order Delivered';
        text = 'Your order has been successfully delivered.';
        break;
    }

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: order.email,
        subject,
        text
      });
      console.log(`✅ Email sent to ${order.email} for status "${status}"`);
    } catch (err) {
      console.error(`❌ Failed to send email:`, err.message);
    }
  });
}

module.exports = watchOrderStatusChanges;
