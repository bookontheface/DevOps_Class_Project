import crypto from 'node:crypto';
import { Order, OrderItem, Payment } from '../models/index.js';
import { getSnap } from '../utils/midtrans.js';

export async function createSnapToken(req, res, next) {
  try {
    const order = await Order.findOne({ where: { id: req.params.orderId, UserId: req.user.id }, include: [OrderItem, Payment] });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'pending') return res.status(400).json({ message: 'Order is not payable' });
    const snap = getSnap();
    const result = await snap.createTransaction({
      transaction_details: { order_id: order.orderNumber, gross_amount: order.total },
      item_details: order.OrderItems.map(i => ({ id: String(i.id), price: i.unitPrice, quantity: i.quantity, name: i.productName.slice(0, 50) })),
      customer_details: { first_name: order.shippingAddress.recipient, phone: order.shippingAddress.phone }
    });
    await order.Payment.update({ snapToken: result.token });
    res.json({ token: result.token, redirectUrl: result.redirect_url });
  } catch (e) { next(e); }
}

export async function midtransNotification(req, res, next) {
  try {
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status, transaction_id } = req.body;
    const expected = crypto.createHash('sha512').update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex');
    if (!signature_key || expected !== signature_key) return res.status(401).json({ message: 'Invalid Midtrans signature' });
    const order = await Order.findOne({ where: { orderNumber: order_id }, include: [Payment] });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    let paymentStatus = 'pending';
    let orderStatus = 'pending';
    if (transaction_status === 'capture' && fraud_status === 'accept') { paymentStatus = 'settlement'; orderStatus = 'paid'; }
    else if (transaction_status === 'settlement') { paymentStatus = 'settlement'; orderStatus = 'paid'; }
    else if (['deny', 'cancel', 'expire'].includes(transaction_status)) { paymentStatus = transaction_status; orderStatus = 'failed'; }
    else if (transaction_status === 'pending') paymentStatus = 'pending';

    await order.Payment.update({ status: paymentStatus, transactionId: transaction_id || null, rawResponse: req.body });
    if (order.status !== 'paid' && orderStatus !== 'pending') await order.update({ status: orderStatus });
    res.json({ message: 'Notification processed' });
  } catch (e) { next(e); }
}
