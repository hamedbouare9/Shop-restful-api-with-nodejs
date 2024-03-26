import express from 'express';

import checkAuth from '../middleware/check-auth.js';
import OrdersController from '../controllers/orders.js';

const router = express.Router();

router.get('/', checkAuth, OrdersController.getAllOrders);

router.post('/', checkAuth, OrdersController.createOrder);

router.get('/:orderId', checkAuth, OrdersController.deleteOneOrder);

router.delete('/:orderId', checkAuth, OrdersController.deleteOneOrder);

export default router;
