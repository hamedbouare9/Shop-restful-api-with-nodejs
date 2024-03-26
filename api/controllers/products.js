import mongoose from 'mongoose';

import Product from '../models/products.js';
import { BASE_DOMAIN } from '../../utils/constants.js';

const getAllProducts = async (_req, res) => {
  try {
    const product = await Product.find().select('name price _id productImage');
    if (!product) {
      res.status(404).json({
        message: 'product not found',
      });
    }
    const result = {
      count: product.length,
      products: product.map((doc) => {
        return {
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          _id: doc._id,
          request: {
            type: 'GET',
            url: '/products/' + doc._id,
          },
        };
      }),
    };
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({
      error: err,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const productImage = req.file.path;
    if (!name || !price || productImage) {
      return res.status(404).json({
        message: 'name or price or product image path is undefined',
      });
    }
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      price: price,
    });
    await product.save();

    res.status(201).json({
      message: 'Created product successfully',
      createdProduct: {
        _id: product._id,
        name: product.name,
        price: product.price,
        request: {
          type: 'GET',
          url: `${BASE_DOMAIN}/products/` + product._id,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const getProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(404).json({
        message: 'Product id not found',
      });
    }
    const product = await Product.findById(productId).select(
      'name price _id productImage'
    );
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }
    res.status(200).json({
      product: product,
      request: {
        type: 'GET',
        url: `${BASE_DOMAIN}/products`,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(404).json({
        message: 'Product id not found',
      });
    }
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    await Product.updateOne({ _id: productId }, { $set: updateOps });
    res.status(200).json({
      message: 'Product updated',
      request: {
        type: 'GET',
        url: `${BASE_DOMAIN}/products/` + productId,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(404).json({
        message: 'Product id not found',
      });
    }
    await Product.deleteOne({ _id: productId });
    res.status(200).json({
      message: 'Product delete',
      request: {
        type: 'POST',
        url: `${BASE_DOMAIN}/products/`,
        body: { name: 'String', price: 'Number' },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export default {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
