import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const User = sequelize.define('User', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('customer', 'admin'), defaultValue: 'customer' }
});

export const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING(160), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  stock: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
  imageUrl: { type: DataTypes.STRING(700), allowNull: false },
  category: { type: DataTypes.STRING(80), allowNull: false },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false }
});

export const CartItem = sequelize.define('CartItem', {
  quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 }
});

export const Address = sequelize.define('Address', {
  recipient: { type: DataTypes.STRING(100), allowNull: false },
  phone: { type: DataTypes.STRING(30), allowNull: false },
  street: { type: DataTypes.TEXT, allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
  postalCode: { type: DataTypes.STRING(20), allowNull: false }
});

export const Order = sequelize.define('Order', {
  orderNumber: { type: DataTypes.STRING(40), unique: true, allowNull: false },
  total: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled', 'failed'), defaultValue: 'pending' },
  shippingAddress: { type: DataTypes.JSON, allowNull: false }
});

export const OrderItem = sequelize.define('OrderItem', {
  productName: { type: DataTypes.STRING(160), allowNull: false },
  productImage: { type: DataTypes.STRING(700), allowNull: false },
  unitPrice: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
});

export const Payment = sequelize.define('Payment', {
  provider: { type: DataTypes.STRING(30), defaultValue: 'midtrans' },
  transactionId: { type: DataTypes.STRING(100), allowNull: true },
  snapToken: { type: DataTypes.STRING(200), allowNull: true },
  status: { type: DataTypes.STRING(40), defaultValue: 'pending' },
  rawResponse: { type: DataTypes.JSON, allowNull: true }
});

User.hasMany(CartItem, { onDelete: 'CASCADE' });
CartItem.belongsTo(User);
Product.hasMany(CartItem, { onDelete: 'CASCADE' });
CartItem.belongsTo(Product);
User.hasMany(Address, { onDelete: 'CASCADE' });
Address.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
Order.hasMany(OrderItem, { onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);
Order.hasOne(Payment, { onDelete: 'CASCADE' });
Payment.belongsTo(Order);

export { sequelize };
