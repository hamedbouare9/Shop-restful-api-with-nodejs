import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import { JWT_KEY } from '../../utils/constants.js';

const userSignUp = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res.status(404).json({
        message: 'email or password is undefined',
      });
    }
    const existingUser = await User.find({
      email: email,
    });
    if (existingUser.length >= 1) {
      return res.status(409).json({
        message: 'Mail exists',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      message: 'User created',
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res.status(404).json({
        message: 'email or password is undefined',
      });
    }
    const existingUser = await User.find({
      email: email,
    });
    if (existingUser.length < 1) {
      return res.status(401).json({
        message: 'Auth failed',
      });
    }
    const isAuth = await bcrypt.compare(password, existingUser[0].password);
    if (isAuth) {
      const payload = {
        email: existingUser[0].email,
        userId: existingUser[0]._id,
      };
      const option = { expiresIn: '1h' };
      const token = jwt.sign(payload, JWT_KEY, option);
      res.status(200).json({
        message: 'Auth successful',
        token: token,
      });
    } else {
      res.status(401).json({
        message: 'Auth failed',
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(404).json({
        message: 'userId is undefined',
      });
    }
    await User.remove({ _id: userId });
    res.status(200).json({
      message: 'User deleted',
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
export default { userSignUp, userLogin, deleteUser };
