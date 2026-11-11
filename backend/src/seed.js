import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sequelize, User, Product } from './models/index.js';

const products = [
  ['iPhone 15', 'Powerful smartphone with a brilliant display and advanced camera system.', 11999000, 12, 'Smartphones', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900', true],
  ['Samsung Galaxy S24', 'Flagship Android smartphone for everyday productivity.', 10999000, 15, 'Smartphones', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900', true],
  ['MacBook Air M3', 'Lightweight laptop with excellent performance and battery life.', 18999000, 8, 'Laptops', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900', true],
  ['Sony WH-1000XM5', 'Premium wireless noise-cancelling headphones.', 4999000, 20, 'Audio', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900', false],
  ['iPad Air', 'Versatile tablet for creativity, study, and entertainment.', 9999000, 10, 'Tablets', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900', false],
  ['Apple Watch Series', 'Smart watch with fitness and health tracking features.', 5999000, 14, 'Wearables', 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=900', false],
  ['Mechanical Keyboard', 'Compact mechanical keyboard with tactile switches.', 1299000, 25, 'Accessories', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900', false],
  ['Wireless Mouse', 'Ergonomic wireless mouse for work and gaming.', 499000, 30, 'Accessories', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=900', false]
];

await sequelize.sync();
await User.findOrCreate({ where: { email: 'admin@electromart.test' }, defaults: { name: 'ElectroMart Admin', password: await bcrypt.hash('Admin123!', 12), role: 'admin' } });
await User.findOrCreate({ where: { email: 'customer@electromart.test' }, defaults: { name: 'Demo Customer', password: await bcrypt.hash('Customer123!', 12), role: 'customer' } });
for (const p of products) await Product.findOrCreate({ where: { name: p[0] }, defaults: { name: p[0], description: p[1], price: p[2], stock: p[3], category: p[4], imageUrl: p[5], featured: p[6] } });
console.log('Seed completed');
await sequelize.close();
