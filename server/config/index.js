/* eslint-disable max-len */
import dotenv from 'dotenv';

dotenv.config();

const config = {
  MONGODB_DATABASE: process.env.DB_URL_DEV || 'mongodb+srv://coin20:123456789@@@cluster0.y5nwu.mongodb.net/coin?retryWrites=true&w=majority',
  DB_TEST: process.env.DB_URL_TEST || 'mongodb+srv://coin20:123456789@@@cluster0.y5nwu.mongodb.net/coin?retryWrites=true&w=majority'
};

export default config;
