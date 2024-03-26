import mongoose from 'mongoose';
import logger from './logger.js';

export default async function connectToDataBase(url, databaseName) {
  try {
    await mongoose.connect(`${url}/${databaseName}`);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
  }
}
