import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import logger from './utils/logger.js';
import connectToMongoDB from './utils/connectToMongoDB.js';
import { MONGO_DB_URL, MONGO_DB_NAME, SERVER_PORT } from './utils/constants.js';

import productRoutes from './api/routes/products.js';
import orderRoutes from './api/routes/orders.js';
import userRoutes from './api/routes/user.js';

const app = express();

connectToMongoDB(MONGO_DB_URL, MONGO_DB_NAME);

// Middleware setup
app.use(morgan('dev')); // Morgan for logging (HTTP request logger middleware)
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS handling middleware
app.use((req, res, next) => {
  res.header('Acces-Control-Allow-Origin', '*');
  res.header(
    'Access-control-Allow-headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Acces-Contorl-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
    return res.status(200).json({});
  }
  next();
});

//
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Handle 404 errors
app.use((_req, _res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Global error handling middleware
app.use((error, _req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Start server
app.listen(SERVER_PORT, () => {
  logger.info(`Server is running on port ${SERVER_PORT}`);
});
