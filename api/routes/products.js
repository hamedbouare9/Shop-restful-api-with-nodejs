import express from 'express';

import multer from 'multer';

import checkAuth from '../middleware/check-auth.js';
import ProductsController from '../controllers/products.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.minetype === 'image/jpeg' || file.minetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});

router.get('/', ProductsController.getAllProducts);

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  ProductsController.createProduct
);

router.get('/:productId', ProductsController.getProduct);

router.patch('/:productId', ProductsController.updateProduct);

router.delete('/:productId', ProductsController.deleteProduct);

export default router;
