import mongoose from 'mongoose';

import Product from '../models/products.js';
import Order from '../models/orders.js';
import { BASE_DOMAIN } from '../../utils/constants.js';

const getAllOrders = async (_req, res) => {
  try {
    const order = await Order.find()
      .select('product quantity _id')
      .populate('product', 'name');
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }
    res.status(200).json({
      count: order.length,
      orders: order.map((element) => {
        return {
          _id: element._id,
          product: element.product,
          quantity: element.quantity,
          request: {
            type: 'GET',
            url: `${BASE_DOMAIN}/orders` + element._id,
          },
        };
      }),
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const productId = req.body.productId;
    if (!productId) {
      return res.status(404).json({
        message: 'Product id not found',
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }
    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId,
    });
    const result = await order.save();
    res.status(201).json({
      message: 'Order stored',
      createOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity,
      },
      request: {
        type: 'GET',
        url: `${BASE_DOMAIN}/orders` + result._id,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(404).json({
        message: 'Order id not found',
      });
    }
    const order = await Order.findById(orderId).populate('product');
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }
    res.status(200).json({
      order: order,
      request: {
        type: 'GET',
        url: `${BASE_DOMAIN}/orders`,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const getOneOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(404).json({
        message: 'Order id not found',
      });
    }
    const order = await Order.findById(orderId).populate('product');
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }
    res.status(200).json({
      order: order,
      request: {
        type: 'GET',
        url: `${BASE_DOMAIN}/orders`,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const deleteOneOrder = async (req, res) => {
  try {
    const order = await Order.deleteOne({ _id: req.params.orderId });
    if (order.deleteCount === 0) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    res.status(200).json({
      message: 'Order deleted',
      request: {
        type: 'POST',
        url: `${BASE_DOMAIN}/orders`,
        body: { productId: 'ID', quantity: 'Number' },
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

export default { getAllOrders, getOneOrder, deleteOneOrder, createOrder };
