import express from 'express';

import UserController from '../controllers/user.js';
import checkAuth from '../middleware/check-auth.js';
const router = express.Router();

router.post('/signup', UserController.userSignUp);

router.post('/login', UserController.userLogin);

router.delete('/:userId', checkAuth, UserController.deleteUser);

export default router;
