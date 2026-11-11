# ElectroMart — Full-stack Electronics E-Commerce

Stack: React + Vite + Bootstrap, Express, Sequelize, MySQL, JWT, Midtrans Snap Sandbox, Cloudinary, Docker Compose.

## 1. Requirements
- Docker Desktop with Compose, OR Node.js 20+ and MySQL 8.
- Midtrans Sandbox account for payment testing.
- Cloudinary account for optional product image uploads.

## 2. Run with Docker
1. Copy `.env.example` to `.env`.
2. Set a strong `JWT_SECRET`.
3. Add your Midtrans Sandbox server/client keys and Cloudinary credentials (optional).
4. Run:
   ```bash
   docker compose up --build
   ```
5. Open http://localhost:5173. API: http://localhost:5000/api/health.

MySQL is exposed on host port `3307` to avoid conflicts with a local MySQL service. The database volume persists between restarts.

## 3. Run without Docker
- Start MySQL and create database `electromart`.
- Copy `.env.example` to `.env`, then set `DB_HOST=localhost` and `DB_PORT=3306`.
- Backend:
  ```bash
  cd backend && npm install && npm run seed && npm run dev
  ```
- Frontend in another terminal:
  ```bash
  cd frontend && npm install && npm run dev
  ```
For local backend execution, run the seed command after configuring `.env`.

## 4. Team split (one shared React app)
- Member 1 — Login: `frontend/src/pages/auth/` and `frontend/src/context/AuthContext.jsx`.
- Member 2 — Main Menu: `frontend/src/pages/shop/` and `frontend/src/components/`.
- Member 3 — Payment: `frontend/src/pages/checkout/` and `frontend/src/pages/orders/`.
- Shared integration: `frontend/src/services/api.js`, `frontend/src/App.jsx`, `backend/`, and `database/` are coordinated together.

Use feature branches such as `feature/login`, `feature/shop`, and `feature/payment`. Agree on API contracts before merging; do not create separate backend or database instances.

## 5. Demo accounts
Seed creates:
- Admin: `admin@electromart.test` / `Admin123!`
- Customer: `customer@electromart.test` / `Customer123!`

Change these credentials and remove demo accounts before deployment.

## 6. Payment setup
The checkout creates an order on the backend and requests a Midtrans Snap token. The browser opens Snap using the public client key. Midtrans sends a webhook to:
`POST /api/payments/notification`

Configure this URL as the payment notification URL in Midtrans dashboard. For local testing, expose port 5000 with a secure tunnel and configure the resulting public URL. Never put the Midtrans Server Key in React or commit `.env`.

Payment is marked paid only after backend notification verification using Midtrans's signature key. A client-side popup callback is not treated as proof of payment.

## 7. Image uploads
Product images are stored in Cloudinary; MySQL stores their secure URL. Admin-only endpoint:
`POST /api/products/:id/image` with multipart field `image`.
Set all three Cloudinary variables. If not configured, the endpoint returns a configuration error; seeded product images use remote demo image URLs.

## 8. API overview
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/products`, `GET /api/products/:id`, `POST /api/products` (admin), `PUT /api/products/:id` (admin), `DELETE /api/products/:id` (admin), `POST /api/products/:id/image` (admin)
- `GET /api/cart`, `POST /api/cart/items`, `PUT /api/cart/items/:id`, `DELETE /api/cart/items/:id`
- `POST /api/orders` (creates pending order from cart), `GET /api/orders`, `GET /api/orders/:id`
- `POST /api/payments/:orderId/snap-token`, `POST /api/payments/notification`

## 9. Production checklist
Use HTTPS, strong secrets, restricted CORS, rate limiting, input validation, backups, webhook monitoring, and proper shipping/tax/business rules. Add idempotency and reconciliation for production payment flows. This starter is an educational MVP, not a production-audited commerce platform.
