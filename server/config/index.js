import dotenv from 'dotenv';

dotenv.config();

const config = {
MONGODB_DATABASE: process.env.DB_URL_DEV || 'mongodb://wallet:wallet123@ds351455.mlab.com:51455/lotto-naija',
DB_TEST: process.env.DB_URL_TEST || 'mongodb://wallet:wallet123@ds351455.mlab.com:51455/lotto-naija'
};

export default config;

//MONGODB_DATABASE: process.env.DB_URL_DEV || 'mongodb://localhost:27017/naija-lotto',

//DB_TEST: process.env.DB_URL_TEST || 'mongodb://localhost:27017/naijalotto-test'
