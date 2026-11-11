import { randomUUID } from 'node:crypto';
import { sequelize, CartItem, Product, Order, OrderItem, Payment } from '../models/index.js';

export async function createOrder(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { recipient, phone, street, city, postalCode } = req.body;
    if (![recipient, phone, street, city, postalCode].every(v => String(v || '').trim())) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }
    const cart = await CartItem.findAll({ where: { UserId: req.user.id }, include: [Product], transaction, lock: transaction.LOCK.UPDATE });
    if (!cart.length) { await transaction.rollback(); return res.status(400).json({ message: 'Your cart is empty' }); }
    let total = 0;
    for (const item of cart) {
      if (!item.Product || item.quantity > item.Product.stock) throw Object.assign(new Error(`Insufficient stock for ${item.Product?.name || 'product'}`), { status: 400 });
      total += item.Product.price * item.quantity;
    }
    const order = await Order.create({
      orderNumber: `EM-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`,
      total, UserId: req.user.id,
      shippingAddress: { recipient, phone, street, city, postalCode }
    }, { transaction });
    for (const item of cart) {
      await OrderItem.create({ OrderId: order.id, productName: item.Product.name, productImage: item.Product.imageUrl, unitPrice: item.Product.price, quantity: item.quantity }, { transaction });
      await item.Product.decrement('stock', { by: item.quantity, transaction });
    }
    await Payment.create({ OrderId: order.id, status: 'pending' }, { transaction });
    await CartItem.destroy({ where: { UserId: req.user.id }, transaction });
    await transaction.commit();
    res.status(201).json(await Order.findByPk(order.id, { include: [OrderItem, Payment] }));
  } catch (e) { if (!transaction.finished) await transaction.rollback(); next(e); }
}
export async function listOrders(req, res, next) {
  try { res.json(await Order.findAll({ where: { UserId: req.user.id }, include: [OrderItem, Payment], order: [['createdAt', 'DESC']] })); } catch (e) { next(e); }
}
export async function getOrder(req, res, next) {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, UserId: req.user.id }, include: [OrderItem, Payment] });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (e) { next(e); }
}
