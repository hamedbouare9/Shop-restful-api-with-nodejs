import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../../utils/constants.js';

const verifyAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(404).json({
        message: 'token is undefined',
      });
    }
    const decoded = jwt.verify(token, JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};

export default verifyAuth;
