import { CartItem, Product } from '../models/index.js';

export async function getCart(req, res, next) {
  try {
    const items = await CartItem.findAll({ where: { UserId: req.user.id }, include: [{ model: Product }] });
    res.json(items);
  } catch (e) { next(e); }
}
export async function addCartItem(req, res, next) {
  try {
    const product = await Product.findByPk(req.body.productId);
    const quantity = Math.max(1, Number(req.body.quantity || 1));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Not enough stock' });
    const [item, created] = await CartItem.findOrCreate({ where: { UserId: req.user.id, ProductId: product.id }, defaults: { quantity } });
    if (!created) {
      if (item.quantity + quantity > product.stock) return res.status(400).json({ message: 'Not enough stock' });
      await item.update({ quantity: item.quantity + quantity });
    }
    res.status(201).json(item);
  } catch (e) { next(e); }
}
export async function updateCartItem(req, res, next) {
  try {
    const item = await CartItem.findOne({ where: { id: req.params.id, UserId: req.user.id }, include: [Product] });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > item.Product.stock) return res.status(400).json({ message: 'Invalid quantity or insufficient stock' });
    await item.update({ quantity });
    res.json(item);
  } catch (e) { next(e); }
}
export async function deleteCartItem(req, res, next) {
  try {
    const count = await CartItem.destroy({ where: { id: req.params.id, UserId: req.user.id } });
    if (!count) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Item removed' });
  } catch (e) { next(e); }
}
