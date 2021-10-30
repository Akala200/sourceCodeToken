/* eslint-disable no-empty */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable require-jsdoc */
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import { sign, verify } from 'jsonwebtoken';
import User from '../models/Users';
import Token from '../models/Token';
import Bank from '../models/Bank';
import TokenUsed from '../models/Regular_Token';
import responses from '../utils/responses';
import tracelogger from '../logger/tracelogger';
import { signToken } from '../utils/storeToken';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import Admin from '../models/Admin';
import Rate from '../models/Rate';

const sgMail = require('@sendgrid/mail');
const rp = require('request-promise');
const axios = require('axios').default;
const CryptoAccount = require('send-crypto');
const cw = require('crypto-wallets');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const mailjet = require('node-mailjet').connect(
  'bd1dcb75346beb0635e30c1fb11452ec',
  '94d87e8ca6102f4c2bcb9e1ff032117c'
);
const { MyWallet } = require('blockchain.info');

const options = {
  apiCode: '54a36981-7b31-4cdb-af4b-b69bd0fc4ea9',
  apiHost: 'http://localhost:2090',
};
const wallet = new MyWallet('myIdentifier', 'myPassword123', options);
sgMail.setApiKey(
  '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'
);

const erroresponse = [
  {
    path: 'login',
    message: 'Unable to Login',
  },
];
const verifyresponce = [
  {
    path: 'verify',
    message: 'Invalid Token',
  },
];

/**
 * @description Defines the actions to for the users endpoints
 * @class UsersController
 */
class UserController {
  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async forgetPassword(req, res) {
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'swoxcrypto@gmail.com',
        pass: process.env.PASSWORD,
      },
    });
    if (!email) {
      return res
        .status(400)
        .json(responses.error(400, 'Please fill in all details'));
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json(responses.error(400, 'Sorry, the email does not exist'));
      }
      const code = randomstring.generate({
        length: 5,
        charset: 'numeric',
      });

      const uObject = {
        token: code,
        oldEmail: email,
      };

      const createdUser = await TokenUsed.create(uObject);

      const msg = {
        to: email,
        from: 'swoxcrypto@gmail.com',
        subject: 'Email Verification',
        text: `Kindly use this ${code} to verify your account`,
      };

      const mailOptions = {
        from: 'adeiyiakala91@@gmail.com',
        to: email,
        subject: 'Forgot Password',
        text: `Kindly use this ${code} to verify your account`,
      };

      /**  sgMail.send(msg);

      if (createdUser) {
        return res
          .status(200)
          .json(responses.success(200, 'Email sent successfully'));
      } else {
        return res.status(500).json(responses.success(500, 'Email not sent'));
      }


      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json(responses.success(500, error));
        } else {
          console.log(`Email sent: ${info.response}`);
          return res
            .status(201)
            .json(responses.success(201, 'Email sent successfully'));
        }
      });
       */

      const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'swoxcrypto@gmail.com',
              Name: 'Sourcecode Exchange',
            },
            To: [
              {
                Email: email,
                Name: `${user.first_name}  ${user.last_name}`,
              },
            ],
            Subject: 'Account Verification',
            TextPart: 'Verify your account',
            HTMLPart: `<h3>Kindly use this OTP code - ${code} to verify your account`,
            CustomID: 'AppGettingStartedTest',
          },
        ],
      });
      request
        .then((result) => {
          console.log(result.body);
          return res
            .status(201)
            .json(responses.success(201, 'Email sent successfully'));
        })
        .catch((err) => {
          console.log(err.statusCode);
          return res.status(500).json(responses.success(500, err));
        });
    } catch (error) {
      tracelogger(error);
    }
  }

  // sales@sourcecodexchange.com
  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async confirmPassword(req, res) {
    const { code } = req.body;
    try {
      const tokenUser = await TokenUsed.findOne({ token: code });

      if (!tokenUser) {
        return res.status(404).json(responses.error(404, 'Invalid Code'));
      }

      // Find a user from token
      User.findOne({ email: tokenUser.oldEmail }).then((user) => {
        // Save the new password

        user.password = req.body.password;
        user.save((err) => {
          if (err) {
            return res
              .status(500)
              .send({ msg: 'Error in saving the password' });
          }
          return res.send({ message: 'Success', data: 'Password changed' });
        });
      });
    } catch (error) {
      return res.status(500).send({ msg: 'Error in saving the password' });
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async checkCode(req, res) {
    const { code } = req.body;

    const tokenUser = await TokenUsed.findOne({ token: code });

    if (!tokenUser) {
      return res.status(404).json(responses.error(404, 'Invalid Code'));
    } else {
      return res.send({ message: 'Success', data: 'Valid Code' });
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async betokened(req, res) {
    const str = req.get('Authorization');

    try {
      const decoded = verify(str, process.env.ENCRYPT_ID);
      const returnValue = {
        invalid: false,
        decoded,
      };
      return res.send({ message: 'valid token' });
    } catch (err) {
      return res.send({ message: 'invalid token' });
    }
  }

  /**
   *@description Creates a new User
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created User
   *@memberof UsersController
   */
  static async newUser(req, res) {
    const {
      email, phone, first_name, last_name, password
    } = req.body;

    if (!email || !phone || !first_name || !last_name || !password) {
      return res
        .status(400)
        .json(responses.error(400, 'Please fill in all details'));
    }

    const transporter = nodemailer.createTransport({
      port: 465, // true for 465, false for other ports
      host: 'smtp.gmail.com',
      auth: {
        type: 'OAuth2',
        user: 'swoxcrypto@gmail.com',
        clientId: 'CLIENT_ID_HERE',
        clientSecret: 'CLIENT_SECRET_HERE',
        refreshToken: 'REFRESH_TOKEN_HERE',
      },
      secure: true,
    });

    try {
      const user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json(responses.error(400, 'Sorry, this user already exist'));
      }
      if (!user) {
        const code = randomstring.generate({
          length: 7,
          charset: 'numeric',
        });

        console.log(code);

        const userObject = {
          first_name,
          last_name,
          email,
          phone,
          password,
        };

        const createdUser = await User.create(userObject);

        const mailOptions = {
          from: 'swoxcrypto@gmail.com',
          to: email,
          subject: 'Account Verification',
          text: `Kindly use this ${code} to verify your account`,
        };

        const msg = {
          to: createdUser.email,
          from: 'swoxcrypto@gmail.com',
          subject: 'Email Verification',
          text: `Kindly use this ${code} to verify your account`,
        };

        const tokenObject = {
          token: code,
          user: createdUser.email,
        };

        await Token.create(tokenObject);

        const request = mailjet.post('send', { version: 'v3.1' }).request({
          Messages: [
            {
              From: {
                Email: 'swoxcrypto@gmail.com',
                Name: 'Sourcecode Exchange',
              },
              To: [
                {
                  Email: email,
                  Name: `${first_name}  ${last_name}`,
                },
              ],
              Subject: 'Account Verification',
              TextPart: 'Verify your account',
              HTMLPart: `<h3>Kindly use this OTP code - ${code} to verify your account`,
              CustomID: 'AppGettingStartedTest',
            },
          ],
        });
        request
          .then((result) => {
            console.log(result.body);
            return res
              .status(201)
              .json(responses.success(201, 'Email sent successfully'));
          })
          .catch((err) => {
            console.log(err.statusCode);
            return res.status(500).json(responses.success(500, err));
          });

        /**
        if (tokenRegistration) {
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              return res.status(500).json(responses.success(500, error));
            } else {
              console.log(`Email sent: ${info.response}`);
              return res
                .status(201)
                .json(responses.success(201, 'Email sent successfully'));
            }
          });
        }
        sgMail
          .send(msg)
          .then((resp) => {
            console.log(resp);
            if (tokenRegistration) {

              return res
                .status(201)
                .json(responses.success(201, 'Email sent successfully'));
            } else {
              return res
                .status(500)
                .json(responses.success(500, 'Email not sent'));
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json(responses.success(500, error));
          });
          */
      }
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates a new User
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created User
   *@memberof UsersController
   */
  static async changeEmail(req, res) {
    const { email } = req.body;
    const existEmail = req.query.email;

    if (!email) {
      return res
        .status(400)
        .json(responses.error(400, 'Please fill in all details'));
    }

    try {
      const user = await User.findOne({ email });

      if (user === email) {
        return res.status(400).json(responses.error(400, 'User already exist'));
      }

      const code = randomstring.generate({
        length: 5,
        charset: 'numeric',
      });

      const uObject = {
        newEmail: email,
        token: code,
        oldEmail: existEmail,
      };

      const createdUser = await TokenUsed.create(uObject);

      const msg = {
        to: email,
        from: 'swoxcrypto@gmail.com',
        subject: 'Email Verification',
        text: `Kindly use this ${code} to verify your account`,
      };

      sgMail.send(msg);

      if (createdUser) {
        return res
          .status(200)
          .json(responses.success(200, 'Email sent successfully'));
      } else {
        return res.status(500).json(responses.success(500, 'Email not sent'));
      }
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async bitcoinMobileMarketETH(req, res) {
    console.log('here');
    const time = '1d';
    try {
      axios
        .get(
          // eslint-disable-next-line max-len
          'https://api.nomics.com/v1/currencies/ticker?key=fed5d93eaee5ca50e9b9e204626df97aa02a2dba&ids=XRP,USDT,BTC,LINK,BCH,BNB,DOT,LTC,ADA,BSV,USDC,EOS,XMR,WBTC,TRX&interval=1d,30d&convert=ETH&per-page=100&page=1'
        )
        .then((response) => {
          const dataGotten = response.data;
          const result = dataGotten.map(coin => ({
            currency: coin.currency,
            price: parseFloat(coin.price),
            percentage_change: coin['1d'].price_change_pct,
            priceChange: coin['1d'].price_change,
            logo: coin.logo_url,
          }));
          // eslint-disable-next-line dot-notation

          // console.log(dataGotten['1d'].price_change_pct);
          return res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async bitcoinMobileMarketXRP(req, res) {
    console.log('here');
    const time = '1d';
    try {
      axios
        .get(
          // eslint-disable-next-line max-len
          'https://api.nomics.com/v1/currencies/ticker?key=fed5d93eaee5ca50e9b9e204626df97aa02a2dba&ids=ETH,USDT,BTC,LINK,BCH,BNB,DOT,LTC,ADA,BSV,USDC,EOS,XMR,WBTC,TRX&interval=1d,30d&convert=XRP&per-page=100&page=1'
        )
        .then((response) => {
          const dataGotten = response.data;
          const result = dataGotten.map(coin => ({
            currency: coin.currency,
            price: parseFloat(coin.price),
            percentage_change: coin['1d'].price_change_pct,
            priceChange: coin['1d'].price_change,
            logo: coin.logo_url,
          }));
          // eslint-disable-next-line dot-notation

          // console.log(dataGotten['1d'].price_change_pct);
          return res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async bitcoinMobileMarketUSDT(req, res) {
    console.log('here');
    const time = '1d';
    try {
      axios
        .get(
          // eslint-disable-next-line max-len
          'https://api.nomics.com/v1/currencies/ticker?key=fed5d93eaee5ca50e9b9e204626df97aa02a2dba&ids=ETH,XRP,BTC,LINK,BCH,BNB,DOT,LTC,ADA,BSV,USDC,EOS,XMR,WBTC,TRX&interval=1d,30d&convert=USDT&per-page=100&page=1'
        )
        .then((response) => {
          const dataGotten = response.data;
          const result = dataGotten.map(coin => ({
            currency: coin.currency,
            price: parseFloat(coin.price),
            percentage_change: coin['1d'].price_change_pct,
            priceChange: coin['1d'].price_change,
            logo: coin.logo_url,
          }));
          // eslint-disable-next-line dot-notation

          // console.log(dataGotten['1d'].price_change_pct);
          return res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async bitcoinMobileMarketBTC(req, res) {
    console.log('here');
    const time = '1d';
    try {
      axios
        .get(
          // eslint-disable-next-line max-len
          'https://api.nomics.com/v1/currencies/ticker?key=fed5d93eaee5ca50e9b9e204626df97aa02a2dba&ids=ETH,XRP,USDT,LINK,BCH,BNB,DOT,LTC,ADA,BSV,USDC,EOS,XMR,WBTC,TRX&interval=1d,30d&convert=BTC&per-page=100&page=1'
        )
        .then((response) => {
          const dataGotten = response.data;
          const result = dataGotten.map(coin => ({
            currency: coin.currency,
            price: parseFloat(coin.price),
            percentage_change: coin['1d'].price_change_pct,
            priceChange: coin['1d'].price_change,
            logo: coin.logo_url,
          }));
          // eslint-disable-next-line dot-notation
          // console.log(dataGotten['1d'].price_change_pct);
          return res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async bitcoinMobileNgn(req, res) {
    console.log('here');
    const time = '1d';
    try {
      axios
        .get(
          // eslint-disable-next-line max-len
          'https://api.nomics.com/v1/currencies/ticker?key=fed5d93eaee5ca50e9b9e204626df97aa02a2dba&ids=BTC,ETH,XRP,USDT,LINK,BCH,BNB,DOT,LTC&interval=1d,30d&convert=NGN&per-page=100&page=1'
        )
        .then((response) => {
          const dataGotten = response.data;
          const result = dataGotten.map(coin => ({
            currency: coin.currency,
            price: parseFloat(coin.price).toFixed(2),
            percentage_change: coin['1d'].price_change_pct,
          }));
          // eslint-disable-next-line dot-notation

          // console.log(dataGotten['1d'].price_change_pct);
          return res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async bitcoinMobileUsd(req, res) {
    console.log('here');
    const time = '1d';
    try {
      axios
        .get(
          // eslint-disable-next-line max-len
          'https://api.nomics.com/v1/currencies/ticker?key=fed5d93eaee5ca50e9b9e204626df97aa02a2dba&ids=BTC,ETH,XRP,USDT,LINK,BCH,BNB,DOT,LTC&interval=1d,30d&convert=USD&per-page=100&page=1'
        )
        .then((response) => {
          const dataGotten = response.data;
          const result = dataGotten.map(coin => ({
            currency: coin.currency,
            price: parseFloat(coin.price).toFixed(2),
            percentage_change: coin['1d'].price_change_pct,
          }));
          // eslint-disable-next-line dot-notation

          // console.log(dataGotten['1d'].price_change_pct);
          return res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async bitcoinMobile(req, res) {
    console.log('here');

    const date = new Date();
    const refinedDate = date.getUTCDate;
    console.log(refinedDate);
    try {
      axios
        .get(
          // eslint-disable-next-line max-len
          'https://api.nomics.com/v1/currencies/sparkline?key=fed5d93eaee5ca50e9b9e204626df97aa02a2dba&ids=BTC,ETH,XRP,USDT&start=2021-01-01T00%3A00%3A00Z'
        )
        .then((response) => {
          const dataGotten = response.data;
          const mapped = dataGotten.map(({ currency, timestamps, prices }) => ({
            currency,
            timestamps,
            prices: prices.map(parseFloat),
          }));
          return res.status(200).json(mapped);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async bitcoin(req, res) {
    console.log('here');
    try {
      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
          start: '1',
          limit: '1',
          convert: 'NGN',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '2ff45ac7-1d0b-4027-8d13-0fdfc1b7f2c3',
        },
        json: true,
        gzip: true,
      };

      rp(requestOptions)
        .then((response) => {
          console.log('API call response:', response);
          return res.status(200).json(response);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async shortlist(req, res) {
    console.log('here');
    try {
      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
          start: '1',
          limit: '6',
          convert: 'USD',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '2ff45ac7-1d0b-4027-8d13-0fdfc1b7f2c3',
        },
        json: true,
        gzip: true,
      };

      rp(requestOptions)
        .then((response) => {
          console.log('API call response:', response);
          return res.json(response);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    } catch (error) {
      tracelogger(error);
    }
  }


  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async getRate(req, res) {
    try {
      const getRate = await Rate.findOne({});
      if (getRate) {
        return res.send({ message: 'Success', data: getRate });
      } else {
        return res.send({ message: 'Failed', data: 0 });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }


  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async updateUser(req, res) {
    try {
      const oldEmail = req.query.email;
      const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        email: req.body.email,
      };
      const updatedUser = await User.findOneAndUpdate(
        { email: oldEmail },
        user,
        { new: true }
      );
      if (updatedUser) {
        return res.send({ message: 'Success', data: updatedUser });
      } else {
        return res.send({ message: 'Failed' });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async getAddress(req, res) {
    try {
      const { email, coin_type } = req.query;

      const updatedUser = await User.findOne({ email }).select([
        '-password',
        '-tempt',
        '-guid',
      ]);
      if (updatedUser) {
        if (coin_type === 'BTC') {
          return res
            .status(200)
            .json(responses.success(200, updatedUser.address));
        } else if (coin_type === 'ETH') {
          return res
            .status(200)
            .json(responses.success(200, updatedUser.eth_address));
        } else {
          return res
            .status(200)
            .json(responses.success(200, updatedUser.bch_address));
        }
      } else {
        return res.send({ message: 'Failed' });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async changePassword(req, res) {
    const email = req.body.email;
    // Find a user from token
    User.findOne({ email })
      .then((user) => {
        // Save the new password

        user.password = req.body.password;
        user
          .save((err) => {
            if (err) {
              return res
                .status(500)
                .send({ msg: 'Error in saving the password' });
            }
            return res.send({ message: 'Success', data: 'Password changed' });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async getUser(req, res) {
    try {
      const oldEmail = req.query.email;
      const updatedUser = await User.findOne({ email: oldEmail }).select([
        '-password',
        '-tempt',
      ]);
      console.log(oldEmail);
      if (updatedUser) {
        return res.send({ message: 'Success', data: updatedUser });
      } else {
        return res.send({ message: 'Failed' });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async getlist(req, res) {
    console.log('here');
    try {
      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
          start: '1',
          limit: '10',
          convert: 'USD',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '2ff45ac7-1d0b-4027-8d13-0fdfc1b7f2c3',
        },
        json: true,
        gzip: true,
      };

      rp(requestOptions)
        .then((response) => {
          console.log('API call response:', response);
          return res.json(response);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates user user
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof userController
   */

  static async login(req, res) {
    let user;
    const { email, password } = req.body;

    try {
      user = await User.findOne({ email });
    } catch (error) {
      return res
        .status(500)
        .json(responses.error(500, { msg: 'Server error' }));
    }

    if (!user) {
      return res.status(401).json(responses.error(401, 'Unable to login'));
    }
    if (user.regstatus === false) {
      return res
        .status(422)
        .json(responses.error(422, { msg: 'Kindly verify your account' }));
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json(responses.error(401, 'Unable to login'));
    }

    const TokenData = {
      id: user._id,
      email,
    };

    //  Generate Token
    const token = await signToken(TokenData);

    const userData = {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
      id: user._id,
      bvn_status: user.bvn_verified,
      token,
    };

    return res
      .status(200)
      .json(responses.success(200, 'Login successfully', userData));
  }

  /**
   *@description Creates user user
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof userController
   */

  static async verifyNew(req, res) {
    const { code } = req.body;

    const tokenUser = await TokenUsed.findOne({ token: code });

    if (!tokenUser) {
      return res.status(404).json(responses.error(404, 'Invalid Code'));
    }

    // const user = await User.findOne({ email: tokenUser.oldEmail });
    const remail = tokenUser.newEmail;

    await User.findOneAndUpdate(
      // eslint-disable-next-line no-undef
      { email: tokenUser.oldEmail },
      { email: remail },
      {
        new: true,
      },
      (err, user) => {
        if (err) {
          console.log('Something wrong when updating data!');
        } else {
          Wallet.findOneAndUpdate(
            // eslint-disable-next-line no-undef
            { email: tokenUser.oldEmail },
            { email: remail },
            {
              new: true,
            },
            (err, wallet) => {
              if (err) {
                console.log('Something wrong when updating data!');
              } else {
                // eslint-disable-next-line max-len
                Transaction.update(
                  { email: tokenUser.oldEmail },
                  { $set: { test: 'success!' } },
                  { multi: true }
                )
                  .then((transactions) => {
                    TokenUsed.findOneAndDelete({ token: code });
                    res
                      .status(200)
                      .json(
                        responses.success(
                          200,
                          'Email change successfully',
                          user
                        )
                      );
                  })
                  .catch(err => res.status(500).json(responses.error(500, err)));
              }
            }
          );
        }
      }
    );
  }

  static async completeSetUp(req, res) {
    console.log('here');
    const {
      account_number, account_name, account_bank, bvn, email
    } = req.body;
    try {
      const user = await User.findOne({ email });

      const data = {
        accountNumber: account_number,
        accountName: account_name,
        account_bank,
        id: user._id,
      };

      const bank = await Bank.create(data);
      if (bank) {
        user.bvn_verified = true;
        user
          .save()
          .then((resp) => {
            console.log(resp);
            res
              .status(200)
              .json(responses.success(200, 'Account added successfully', bank));
          })
          .catch(err => res.status(500).json(responses.error(500, 'Server error', err)));
      } else {
        return res.status(500).json(responses.error(500, 'Server error'));
      }
    } catch (error) {
      tracelogger(error);
    }
  }

  static async getBankCode(req, res) {
    try {
    } catch (error) {
      tracelogger(error);
    }
  }

  /**
   *@description Creates user user
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof userController
   */

  static async verify(req, res) {
    const { code } = req.body;
    let tokenUser;

    try {
      tokenUser = await Token.findOne({ token: code });
    } catch (error) {
      return res.json(error);
    }
    if (!tokenUser) {
      return res
        .status(404)
        .json(
          responses.success(404, 'Account verification Failed, Invalid token')
        );
    }

    try {
      const user = await User.findOne({ email: tokenUser.user });
      const TokenData = {
        id: user._id,
        email: user.email,
      };

      const walletData = {
        phone: user.phone,
        email: user.email,
        user: user._id,
      };

      const tokenize = await signToken(TokenData);

      const userData = {
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        id: user._id,
        bvn_status: user.bvn_verified,
        tokenize,
      };

      const code = randomstring.generate({
        length: 25,
        charset: 'numeric',
      });

      //  Generate Token

      if (user) {
        try {
          const privateKey = CryptoAccount.newPrivateKey();

          const ethWallet = cw.generateWallet('ETH');
          const bcash = cw.generateWallet('BCH');

          const data1 = {
            id: ethWallet.privateKey,
          };
          const data2 = {
            id: bcash.privateKey,
          };

          const data3 = {
            id: privateKey,
          };

          const account = new CryptoAccount(privateKey);
          account
            .address('BTC')
            .then((rep) => {
              const address = rep;

              const userNew = {
                address,
                tempt: privateKey,
                eth_address: ethWallet.address,
                eth_tempt: ethWallet.privateKey,
                bch_address: bcash.address,
                bch_tempt: bcash.privateKey,
                guid: code,
                regstatus: true,
              };

              User.findOneAndUpdate(
                { email: tokenUser.user },
                userNew,
                {
                  new: true,
                },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json(responses.error(500, err));
                  }

                  console.log(doc);
                }
              );
            })
            .catch((error) => {
              console.log(error);
            });

          try {
            const willet = await Wallet.create(walletData);
            console.log(willet);
            await Token.findOneAndDelete({ token: code }).then(toks => res
              .status(200)
              .json(
                responses.success(
                  200,
                  'Account verified successfully',
                  userData
                )
              ));
          } catch (error) {
            console.log(error);
            return res.status(500).json(responses.error(500, 'Whats up'));
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json(responses.error(500, error));
        }
      } else {
        return res
          .status(404)
          .json(
            responses.error(404, 'Account verification Failed, Invalid token')
          );
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(responses.error(500, error));
    }

    // MmFmM2UzZTk1OWM1NGZiM2E3MzAyNjkwODY5NDUwZGI
  }

  /**
   *@description Creates user user
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof userController
   */

  static async initiatePayment(req, res) {
    const { email, coin_type, bitcoin } = req.body;

    try {
      const user = await User.findOne({ email });
      //  Generate Token

      const dataSet = {
        payment_coin_type: coin_type,
        payment_bitcoin: bitcoin,
      };

      if (user) {
        try {
          User.findOneAndUpdate(
            { email },
            dataSet,
            {
              new: true,
            },
            (err, doc) => {
              if (err) {
                console.log(err);
                return res.status(500).json(responses.error(500, err));
              }
              res
                .status(200)
                .json(
                  responses.success(200, 'Accounts Created successfully', user)
                );
            }
          );
        } catch (error) {
          console.error(error);
          return res.status(500).json(responses.error(500, error));
        }
      } else {
        return res.status(404).json(responses.error(404, 'Initiation failed'));
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(responses.error(500, error));
    }
  }

  /**
   *@description Creates user user
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof userController
   */

  static async createOtherWallet(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      //  Generate Token

      if (user) {
        try {
          const ethWallet = cw.generateWallet('ETH');
          const bcash = cw.generateWallet('BCH');

          const userNew = {
            eth_address: ethWallet.address,
            eth_tempt: ethWallet.privateKey,
            bch_address: bcash.address,
            bch_tempt: bcash.privateKey,
          };

          User.findOneAndUpdate(
            { email },
            userNew,
            {
              new: true,
            },
            (err, doc) => {
              if (err) {
                console.log(err);
                return res.status(500).json(responses.error(500, err));
              }
              res
                .status(200)
                .json(
                  responses.success(200, 'Accounts Created successfully', user)
                );
            }
          );
        } catch (error) {
          console.error(error);
          return res.status(500).json(responses.error(500, error));
        }
      } else {
        return res
          .status(404)
          .json(responses.error(404, 'Account Already created'));
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(responses.error(500, error));
    }
  }
}

export default UserController;
