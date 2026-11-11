import { Router } from 'express';
import multer from 'multer';
import { register, login, me } from '../controllers/authController.js';
import * as products from '../controllers/productController.js';
import * as cart from '../controllers/cartController.js';
import * as orders from '../controllers/orderController.js';
import { createSnapToken, midtransNotification } from '../controllers/paymentController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/')) });

router.get('/health', (req, res) => res.json({ status: 'ok', service: 'ElectroMart API' }));
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', auth, me);

router.get('/products', products.listProducts);
router.get('/products/:id', products.getProduct);
router.post('/products', auth, adminOnly, products.createProduct);
router.put('/products/:id', auth, adminOnly, products.updateProduct);
router.delete('/products/:id', auth, adminOnly, products.deleteProduct);
router.post('/products/:id/image', auth, adminOnly, upload.single('image'), products.uploadProductImage);

router.get('/cart', auth, cart.getCart);
router.post('/cart/items', auth, cart.addCartItem);
router.put('/cart/items/:id', auth, cart.updateCartItem);
router.delete('/cart/items/:id', auth, cart.deleteCartItem);

router.post('/orders', auth, orders.createOrder);
router.get('/orders', auth, orders.listOrders);
router.get('/orders/:id', auth, orders.getOrder);

router.post('/payments/:orderId/snap-token', auth, createSnapToken);
router.post('/payments/notification', midtransNotification);

export default router;
