import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';
import { notFound, errorHandler } from './middleware/errors.js';

const app = express();
app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(','), credentials: false }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
async function start() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(port, '0.0.0.0', () => console.log(`ElectroMart API running on ${port}`));
}
start().catch(err => { console.error('Startup failed:', err); process.exit(1); });
