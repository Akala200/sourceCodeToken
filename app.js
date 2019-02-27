const express = require('express');
const volleyball = require('volleyball');
// const cors = require('cors');
var MongoDB = require('winston-mongodb').MongoDB;
const winston = require('winston');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const middlewares = require('./auth/middlewares');

// this is your stuff
const users = require('./api/users');
const wallet = require('./api/wallet')
const accountCreation = require('./auth/account-create')
const routePath = require('./routes/routePath');


const { notFound, errorHandler} = require('./middlewares')

const app = express();

app.use(volleyball); //Logs every single incoming request

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

const db = process.env.LOG_DB
const host = process.env.LOG_HOST
const username = process.env.LOG_USERNAME
const password = process.env.LOG_PASSWORD






app.use(express.json());

app.use(middlewares.checkTokenSetUser);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.get('/', (req, res) => {
  res.json({
    message: 'cms auth headers! 🌈✨🦄',
    user: req.user,
  });
});
// create customer route
app.use(routePath.walletPath,  middlewares.isLoggedIn, wallet);
// 

app.use(routePath.userPath, middlewares.isLoggedIn, users);
app.use(routePath.authAdminPath, accountCreation);

// catch 404 and forward to error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
