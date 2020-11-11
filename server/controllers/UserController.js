/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable require-jsdoc */
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import t from 'typy'; // ES6 style import
import User from '../models/Users';
import Token from '../models/Token';
import responses from '../utils/responses';
import tracelogger from '../logger/tracelogger';
import { signToken } from '../utils/storeToken';
import Wallet from '../models/Wallet';

const sgMail = require('@sendgrid/mail');
const rp = require('request-promise');
const axios = require('axios').default;

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

    if (!email || !phone || first_name || last_name || password) {
      return res
        .status(400)
        .json(responses.error(400, 'Please fill in all details'));
    }

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

        const userObject = {
          first_name,
          last_name,
          email,
          phone,
          password,
          tempt: password,
        };

        const createdUser = await User.create(userObject);

        const msg = {
          to: createdUser.email,
          from: 'support@ningotv.com',
          subject: 'Email Verification',
          text: `Kindly use this ${code} to verify your account`,
        };

        const tokenObject = {
          token: code,
          user: createdUser.email,
        };

        const tokenRegistration = await Token.create(tokenObject);

        sgMail.send(msg);

        if (tokenRegistration) {
          return res
            .status(201)
            .json(responses.success(201, 'Email sent successfully'));
        } else {
          return res.status(500).json(responses.success(500, 'Email not sent'));
        }
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
          'https://api.nomics.com/v1/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&ids=BTC,XRP,USDT,LINK,BCH,BNB,DOT,LTC&interval=1d,30d&convert=ETH&per-page=100&page=1'
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
  static async bitcoinMobileMarketXRP(req, res) {
    console.log('here');
    const time = '1d';
    try {
      axios
        .get(
          // eslint-disable-next-line max-len
          'https://api.nomics.com/v1/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&ids=ETH,XRP,USDT,LINK,BCH,BNB,DOT,LTC&interval=1d,30d&convert=BTC&per-page=100&page=1'
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
  static async bitcoinMobileMarketUSDT(req, res) {
    console.log('here');
    const time = '1d';
    try {
      axios
        .get(
          // eslint-disable-next-line max-len
          'https://api.nomics.com/v1/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&ids=ETH,XRP,USDT,LINK,BCH,BNB,DOT,LTC&interval=1d,30d&convert=BTC&per-page=100&page=1'
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
  static async bitcoinMobileMarketBTC(req, res) {
    console.log('here');
    const time = '1d';
    try {
      axios
        .get(
          // eslint-disable-next-line max-len
          'https://api.nomics.com/v1/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&ids=ETH,XRP,USDT,LINK,BCH,BNB,DOT,LTC&interval=1d,30d&convert=BTC&per-page=100&page=1'
        )
        .then((response) => {
          const dataGotten = response.data;
          const result = dataGotten.map(coin => ({
            currency: coin.currency,
            price: parseFloat(coin.price).toFixed(2),
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
          'https://api.nomics.com/v1/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&ids=BTC,ETH,XRP,USDT,LINK,BCH,BNB,DOT,LTC&interval=1d,30d&convert=NGN&per-page=100&page=1'
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
          'https://api.nomics.com/v1/currencies/ticker?key=demo-26240835858194712a4f8cc0dc635c7a&ids=BTC,ETH,XRP,USDT,LINK,BCH,BNB,DOT,LTC&interval=1d,30d&convert=USD&per-page=100&page=1'
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
          'https://api.nomics.com/v1/currencies/sparkline?key=8d7600c7d7d88daca311a502525c5063&ids=BTC,ETH,XRP,USDT&start=2020-01-01T00%3A00%3A00Z'
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
        uri:
          'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
          start: '1',
          limit: '1',
          convert: 'NGN',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
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
        uri:
          'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
          start: '1',
          limit: '4',
          convert: 'NGN',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
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
  static async getUser(req, res) {
    try {
      const oldEmail = req.query.email;
      const updatedUser = await User.findOne({ email: oldEmail }).select([
        '-password',
      ]);
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
        uri:
          'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
          start: '1',
          limit: '10',
          convert: 'NGN',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
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
      return res.status(401).json(responses.error(401, erroresponse));
    }
    if (user.regstatus === false) {
      return res
        .status(422)
        .json(responses.error(422, { msg: 'Kindly verify your account' }));
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json(responses.error(401, erroresponse));
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

  static async verify(req, res) {
    const { code } = req.body;
    let tokenUser;
    let saveChanges;
    let user;
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
      };

      const tokenize = await signToken(TokenData);

      const userData = {
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        id: user._id,
        tokenize,
      };

      const TemptPassword = user.tempt;

      //  Generate Token

      if (user) {
        try {
          const response = await axios.post(
            'https://cosuss.herokuapp.com/api/v2/create',
            {
              api_code: '54a36981-7b31-4cdb-af4b-b69bd0fc4ea9',
              password: TemptPassword,
            }
          );
          console.log(response.data);
          const address = response.data.address;
          const guid = response.data.guid;

          const user = {
            address,
            guid,
            regstatus: true,
          };

          await User.findOneAndUpdate(
            { email: tokenUser.user },
            user,
            {
              new: true,
            },
            (err, doc) => {
              if (err) {
                console.log('Something wrong when updating data!');
              }

              console.log(doc);
            }
          );

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
            return res.status(500).json(responses.error(500, 'Server Error'));
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        return res
          .status(404)
          .json(
            responses.error(404, 'Account verification Failed, Invalid token')
          );
      }
    } catch (error) {
      return res.status(500).json(responses.error(500, 'Server Error'));
    }

    // MmFmM2UzZTk1OWM1NGZiM2E3MzAyNjkwODY5NDUwZGI
  }
}

export default UserController;
