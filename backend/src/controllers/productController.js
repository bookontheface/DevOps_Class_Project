import { Product } from '../models/index.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function listProducts(req, res, next) {
  try {
    const { q, category } = req.query;
    const where = {};
    const { Op } = await import('sequelize');
    if (q) where.name = { [Op.like]: `%${q}%` };
    if (category && category !== 'All') where.category = category;
    res.json(await Product.findAll({ where, order: [['featured', 'DESC'], ['createdAt', 'DESC']] }));
  } catch (e) { next(e); }
}
export async function getProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) { next(e); }
}
export async function createProduct(req, res, next) {
  try { res.status(201).json(await Product.create(req.body)); } catch (e) { next(e); }
}
export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    res.json(product);
  } catch (e) { next(e); }
}
export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (e) { next(e); }
}
export async function uploadProductImage(req, res, next) {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) return res.status(503).json({ message: 'Cloudinary is not configured' });
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, { folder: 'electromart/products', resource_type: 'image' });
    await product.update({ imageUrl: result.secure_url });
    res.json(product);
  } catch (e) { next(e); }
}
