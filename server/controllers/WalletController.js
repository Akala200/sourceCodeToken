/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { id } from 'monk';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import Bank from '../models/Bank';

import responses from '../utils/responses';
import tracelogger from '../logger/tracelogger';
import User from '../models/Users';
import Commission from '../models/Commission';
import Withdraw from '../models/Withdraw';

import Rate from '../models/Rate';

const rp = require('request-promise');
const MyWallet = require('blockchain.info/MyWallet');
const bitcoinTransaction = require('bitcoin-transaction');
const convert = require('ether-converter');

const token = 'sk_live_276ea373b7eff948c77c424ea2905d965bd8e9f8';
// const token = 'sk_test_644ff7e9f679a6ecfc3152e30ad453611e0e564e';

// eslint-disable-next-line import/no-extraneous-dependencies  sk_test_644ff7e9f679a6ecfc3152e30ad453611e0e564e
const axios = require('axios').default;
const crypto = require('crypto');
const CryptoAccount = require('send-crypto');

/**
 * @description Defines the actions to for the users endpoints
 * @class UsersController
 */
class WalletController {
  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async initiate(req, res) {
    const currency = 'NGN';
    const { email, amount, bitcoin } = req.body;
    try {
      const user = await User.findOne({
        email,
      });
      if (!user) {
        return res
          .status(404)
          .json(responses.error(401, 'Sorry, this user does not exist'));
      } else {
        const data = {
          amount: amount * 100,
          currency,
          email: user.email,
          channel: 'card',
          metadata: {
            email: user.email,
            coin: bitcoin,
          },
        };

        axios
          .post('https://api.paystack.co/transaction/initialize', data, {
            headers: {
              Authorization: `Bearer ${token}`, // the token is a variable which holds the token
            },
          })
          .then((response) => {
            console.log(response);
            res.send(response.data.data);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json(error);
          });
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
  static async allWallet(req, res) {
    console.log('here');
    try {
      const { email } = req.query;
      const wallet = await Wallet.find({ email }).limit(5);
      if (!wallet) {
        return res
          .status(404)
          .json(responses.error(404, 'Wallet does not exist'));
      }

      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount: wallet.balance,
          id: '1',
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
          if (response) {
            console.log(response);
            const result = wallet.map(wall => ({
              currency: 'BTC',
              price: wall.balance,
              priceCurrency: response.data.quote.NGN,
            }));
            return res.status(200).json(responses.success(200, result));
          }
        })
        .catch((err) => {
          console.log(err.body);
          const result = wallet.map(wall => ({
            currency: 'BTC',
            price: wall.balance,
            priceCurrency: 0,
          }));
          return res.status(200).json(responses.success(200, result));
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
  static async transactionHistory(req, res) {
    try {
      const { user, coinType } = req.query;

      const transaction = await Transaction.find({ user, coinType });
      console.log(transaction);
      if (!transaction) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
      }

      return res.json(transaction);
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
  static async getWallet(req, res) {
    console.log('here');
    try {
      const { email } = req.query;
      console.log(email);

      const wallet = await Wallet.findOne({ email });
      console.log(wallet);
      if (!wallet) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
      }

      return res.json(wallet);
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
  static async createTest(req, res) {
    console.log('here');
    try {
      walleted.getBalance().then((response) => {
        console.log('My balance is %d!', response.balance);
      });

      if (!balance) {
        return res.status(404).json(responses.error(404, balance));
      }

      return res.json(balance);
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
  static async transactionHistoryAll(req, res) {
    console.log('here');
    try {
      const { user } = req.query;

      const transaction = await Transaction.find({ user }).sort({
        _id: -1,
      });

      if (!transaction) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
      }

      return res.json(transaction);
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
  static async balanceBTC(req, res) {
    try {
      const { email, coin_type } = req.query;
      let response;
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json(responses.error(404, 'Wallet does not exist'));
      }

      if (coin_type === 'DOGE' || coin_type === 'LIT') {
        const dataAge = 0.0;
        console.log(dataAge);
        console.log(dataAge);
        return res.status(200).json(responses.success(200, dataAge));
      }
      const privateKey = user.tempt;
      const account = new CryptoAccount(privateKey);
      await account
        .getBalance(coin_type)
        .then((balances) => {
          Wallet.findOneAndUpdate(
            { email },
            { balance: balances },
            { new: true }
          )
            .then((wallet) => {
              if (balances === 0) {
                const dataAge = 0.0;
                console.log(dataAge);
                console.log(dataAge);
                return res.status(200).json(responses.success(200, dataAge));
              }
              return res.status(200).json(responses.success(200, balances));
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
      /**
        response = await axios.post(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line max-len
          // eslint-disable-next-line max-len
          `https://www.coin.sourcecodexchange.com/merchant/${user.guid}/balance?password=${user.tempt}&api_code=54a36981-7b31-4cdb-af4b-b69bd0fc4ea9`
        );
        console.log(response.data.balance);
      } catch (error) {
        console.log(error);
      }

      const balance = await Wallet.findOneAndUpdate(
        { email },
        { balance: parseFloat(response.data.balance) },
        { new: true }
      );

      if (!balance) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
      }
      */
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
  static async balanceETH(req, res) {
    try {
      const { email, coin_type } = req.query;
      let response;
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
      }
      const privateKey = user.eth_tempt;
      const account = new CryptoAccount(privateKey);
      await account
        .getBalance(coin_type)
        .then((balances) => {
          Wallet.findOneAndUpdate(
            { email },
            { eth_balance: balances },
            { new: true }
          )
            .then((wallet) => {
              console.log(wallet);
              if (balances === 0) {
                const dataAge = 0.0;
                return res.status(200).json(responses.success(200, dataAge));
              }
              return res.status(200).json(responses.success(200, balances));
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
      /**
        response = await axios.post(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line max-len
          // eslint-disable-next-line max-len
          `https://www.coin.sourcecodexchange.com/merchant/${user.guid}/balance?password=${user.tempt}&api_code=54a36981-7b31-4cdb-af4b-b69bd0fc4ea9`
        );
        console.log(response.data.balance);
      } catch (error) {
        console.log(error);
      }

      const balance = await Wallet.findOneAndUpdate(
        { email },
        { balance: parseFloat(response.data.balance) },
        { new: true }
      );

      if (!balance) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
      }
      */
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
  static async balanceDoge(req, res) {
    try {
      const { email, coin_type } = req.query;
      let response;
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
      }
      const privateKey = user.dodge_tempt;
      const account = new CryptoAccount(privateKey);
      await account
        .getBalance(coin_type)
        .then((balances) => {
          Wallet.findOneAndUpdate(
            { email },
            { eth_balance: balances },
            { new: true }
          )
            .then((wallet) => {
              console.log(wallet);
              if (balances === 0) {
                const dataAge = 0.0;
                return res.status(200).json(responses.success(200, dataAge));
              }
              return res.status(200).json(responses.success(200, balances));
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
      /**
        response = await axios.post(
          // eslint-disable-next-line max-len
          // eslint-disable-next-line max-len
          // eslint-disable-next-line max-len
          `https://www.coin.sourcecodexchange.com/merchant/${user.guid}/balance?password=${user.tempt}&api_code=54a36981-7b31-4cdb-af4b-b69bd0fc4ea9`
        );
        console.log(response.data.balance);
      } catch (error) {
        console.log(error);
      }

      const balance = await Wallet.findOneAndUpdate(
        { email },
        { balance: parseFloat(response.data.balance) },
        { new: true }
      );

      if (!balance) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
      }
      */
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
  static async callback(req, res) {
    try {
      console.log(req.body);
      console.log(req.query);

      return res.json(req.body);
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
  static async nairaBalance(req, res) {
    try {
      const { email, coinType } = req.query;

      const balance = await Wallet.findOne({ email });

      if (!balance) {
        return res
          .status(404)
          .json(responses.error(404, 'Wallet does not exist'));
      }
      let dataBalance;

      if (balance.balance === 0) {
        dataBalance = 0;
        return res.status(200).json(responses.success(200, dataBalance));
      }
      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount: balance.balance,
          symbol: coinType,
          convert: 'USD',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
        },
        json: true,
        gzip: true,
      };

      // eslint-disable-next-line max-len
      rp(requestOptions).then(response => res.status(200).json(200, response.data.quote.USD));
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
  static async nairaBalanceETH(req, res) {
    try {
      const { email } = req.query;

      const balance = await Wallet.findOne({ email });

      if (!balance) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
      }
      let dataBalance;

      if (balance.eth_balance === 0) {
        dataBalance = 0;
        return res.status(200).json(responses.success(200, dataBalance));
      }
      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount: balance.eth_balance,
          symbol: 'ETH',
          convert: 'NGN',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
        },
        json: true,
        gzip: true,
      };

      // eslint-disable-next-line max-len
      rp(requestOptions).then(response => res.status(200).json(200, response.data.quote.NGN));
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
  static async nairaBalanceDOGE(req, res) {
    try {
      const { email } = req.query;

      const balance = await Wallet.findOne({ email });

      if (!balance) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
      }
      let dataBalance;

      if (balance.dodge_balance === 0) {
        dataBalance = 0;
        return res.status(200).json(responses.success(200, dataBalance));
      }
      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount: balance.dodge_balance,
          symbol: 'DOGE',
          convert: 'NGN',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
        },
        json: true,
        gzip: true,
      };

      // eslint-disable-next-line max-len
      rp(requestOptions).then(response => res.status(200).json(200, response.data.quote.NGN));
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
  static async convert(req, res) {
    try {
      const { amount, coin_type } = req.query;
      const getRate = await Rate.findOne({});
      console.log(getRate);
      const percent = getRate.variable_rate;
      const discount = (percent / 100) * amount;
      const realAmount = amount - discount;
      console.log(percent, 'percent');
      console.log(discount, 'discount amount');

      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount: realAmount,
          id: '2781',
          convert: coin_type,
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
        },
        json: true,
        gzip: true,
      };

      if (coin_type == 'BTC') {
        rp(requestOptions).then((response) => {
          console.log(response);
          const dataRes = {
            price: response.data.quote.BTC.price,
            amountAfterFee: realAmount,
            fee: discount,
          };
          res.json(dataRes);
        });
      } else if (coin_type == 'ETH') {
        rp(requestOptions).then((response) => {
          const dataRes = {
            price: response.data.quote.ETH.price,
            amountAfterFee: realAmount,
            fee: discount,
          };
          res.json(dataRes);
        });
      } else if (coin_type == 'BCH') {
        rp(requestOptions).then((response) => {
          const dataRes = {
            price: response.data.quote.BCH.price,
            amountAfterFee: realAmount,
            fee: discount,
          };
          res.json(dataRes);
        });
      } else {
        rp(requestOptions).then((response) => {
          const dataRes = {
            price: response.data.quote.DOGE.price,
            amountAfterFee: realAmount,
            fee: discount,
          };
          res.json(dataRes);
        });
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
  static async convertTransfer(req, res) {
    try {
      const { amount } = req.query;

      const getRate = await Rate.findOne({});
      const percent = getRate.variable_rate;
      const discount = (percent / 100) * amount;
      const realAmount = amount - discount - 800;

      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount: realAmount,
          id: '2781',
          convert: 'BTC',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
        },
        json: true,
        gzip: true,
      };

      rp(requestOptions).then((response) => {
        const dataRes = {
          price: response.data.quote.BTC.price,
          amountAfterFee: realAmount,
          fee: discount,
        };
        res.json(dataRes);
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
  static async convertTransferETH(req, res) {
    try {
      const { amount } = req.query;

      const getRate = await Rate.findOne({});
      const percent = getRate.variable_rate;
      const discount = (percent / 100) * amount;
      const realAmount = amount - discount - 800;

      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.npm.com/v1/tools/price-conversion',
        qs: {
          amount: realAmount,
          id: '2781',
          convert: 'ETH',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
        },
        json: true,
        gzip: true,
      };

      rp(requestOptions).then((response) => {
        console.log(response.data.quote);
        const dataRes = {
          price: response.data.quote.ETH.price,
          amountAfterFee: realAmount,
          fee: discount,
        };
        res.json(dataRes);
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
  static async convertTransferBCH(req, res) {
    try {
      const { amount } = req.query;

      const getRate = await Rate.findOne({});
      const percent = getRate.variable_rate;
      const discount = (percent / 100) * amount;
      const realAmount = amount - discount - 800;

      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount: realAmount,
          id: '2781',
          convert: 'BCH',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
        },
        json: true,
        gzip: true,
      };

      rp(requestOptions).then((response) => {
        console.log(response.data.quote);
        const dataRes = {
          price: response.data.quote.DOGE.price,
          amountAfterFee: realAmount,
          fee: discount,
        };
        res.json(dataRes);
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
  static async convertSale(req, res) {
    try {
      const { amount, coin_type } = req.query;

      const getRate = await Rate.findOne({});
      const percent = getRate.sale_rate;
      const discount = (percent / 100) * amount;
      const realAmount = amount - discount;
      console.log(realAmount, 'aftersub');
      console.log(discount, 'discount amount');

      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount: realAmount,
          id: '2781',
          convert: coin_type,
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
        },
        json: true,
        gzip: true,
      };

      if (coin_type == 'BTC') {
        rp(requestOptions).then((response) => {
          console.log(response);
          const dataRes = {
            price: response.data.quote.BTC.price,
            amountAfterFee: realAmount,
            fee: discount,
          };
          res.json(dataRes);
        });
      } else if (coin_type == 'ETH') {
        rp(requestOptions).then((response) => {
          const dataRes = {
            price: response.data.quote.ETH.price,
            amountAfterFee: realAmount,
            fee: discount,
          };
          res.json(dataRes);
        });
      } else if (coin_type == 'BCH') {
        rp(requestOptions).then((response) => {
          const dataRes = {
            price: response.data.quote.BCH.price,
            amountAfterFee: realAmount,
            fee: discount,
          };
          res.json(dataRes);
        });
      } else {
        rp(requestOptions).then((response) => {
          const dataRes = {
            price: response.data.quote.DOGE.price,
            amountAfterFee: realAmount,
            fee: discount,
          };
          res.json(dataRes);
        });
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
  static async convertSaleETH(req, res) {
    try {
      const { amount } = req.query;

      const getRate = await Rate.findOne({});
      const percent = getRate.variable_rate;
      const discount = (percent / 100) * amount;
      const realAmount = amount - discount;
      console.log(realAmount, 'aftersub');
      console.log(discount, 'discount amount');

      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount: realAmount,
          id: '2781',
          convert: 'ETH',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
        },
        json: true,
        gzip: true,
      };

      rp(requestOptions).then((response) => {
        const dataRes = {
          price: response.data.quote.BTC.price,
          amountAfterFee: realAmount,
          fee: discount,
        };
        res.json(dataRes);
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
  static async convertSaleDOGE(req, res) {
    try {
      const { amount } = req.query;

      const getRate = await Rate.findOne({});
      const percent = getRate.variable_rate;
      const discount = (percent / 100) * amount;
      const realAmount = amount - discount;
      console.log(realAmount, 'aftersub');
      console.log(discount, 'discount amount');

      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount: realAmount,
          id: '2781',
          convert: 'DOGE',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
        },
        json: true,
        gzip: true,
      };

      rp(requestOptions)
        .then((response) => {
          console.log(response);
          const dataRes = {
            price: response.data.quote.BTC.price,
            amountAfterFee: realAmount,
            fee: discount,
          };
          res.json(dataRes);
        })
        .catch(err => res.status(500).json(responses.error(500, err)));
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
  static async coinPrice(req, res) {
    try {
      const { amount } = req.query;

      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount,
          id: '2781',
          convert: 'BTC',
        },
        headers: {
          'X-CMC_PRO_API_KEY': '8122e869-48b3-42d0-9e4a-58bb526ccf6c',
        },
        json: true,
        gzip: true,
      };

      rp(requestOptions).then((response) => {
        const dataRes = {
          price: response.data.quote.BTC.price,
        };
        res.json(dataRes);
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
  static async getBank(req, res) {
    axios
      .get('https://api.paystack.co/bank', {
        headers: {
          Authorization: `Bearer ${token}`, // the token is a variable which holds the token
        },
      })
      .then((response) => {
        res.send(response.data.data);
      })
      .catch((error) => {
        res.status(500).json(error.data);
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
  static async getUserBank(req, res) {
    console.log('here');
    try {
      const { email } = req.query;

      const datails = await Bank.findOne({ email }).limit(5);

      if (!datails) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
      }

      return res.json(datails);
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
  static async addBank(req, res) {
    const {
      accountNumber, accountName, code, email
    } = req.body;
    const data = {
      type: 'nuban',
      name: accountName,
      account_number: accountNumber,
      bank_code: code,
      currency: 'NGN',
    };

    function saveBank(id1) {
      axios
        .post('https://api.paystack.co/transferrecipient', data, {
          headers: {
            Authorization: `Bearer ${token}`, // the token is a variable which holds the token
          },
        })
        .then((resp) => {
          User.findOne({ email })
            .then((user) => {
              user.bankref = resp.data.data.recipient_code;
              user.save().then((saved) => {
                console.log(saved);
                const bankDetails = {
                  accountNumber,
                  accountName,
                  email,
                };
                Bank.create(bankDetails);
                return res.status(200).json(responses.success(200, resp.data));
              });
            })
            .catch((err) => {
              res.status(500).json(err);
            });
        })
        .catch((error) => {
          res.status(500).json(error.data);
        });
    }
    axios
      .get(
        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${code}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // the token is a variable which holds the token
          },
        }
      )
      .then((response) => {
        saveBank(email);
      })
      .catch((error) => {
        res.status(500).json(error);
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
  static async send(req, res) {
    try {
      const {
        amount,
        fee,
        address,
        coin,
        coin_type,
        wallet,
        bitcoin,
        email,
        flatAmount,
      } = req.body;

      const user = await User.findOne({ email });
      const walletBalance = await Wallet.findOne({ email });


      const transactionObject = {
        amount,
        coins: bitcoin,
        type: 'debit',
        mode: 'Transfer',
        to: address,
        user: user._id,
        coinType: coin_type,
        email: user.email,
        walletId: user._id,
        status: 'successful',
      };

      const transactionObjectF = {
        amount,
        coins: bitcoin,
        type: 'debit',
        mode: 'Transfer',
        to: address,
        coinType: coin_type,
        user: user._id,
        email: user.email,
        walletId: user._id,
        status: 'failed',
      };

      const refinedBitcoin = flatAmount.toFixed(6);
      console.log(refinedBitcoin);
      const satoshi = 100000000 * refinedBitcoin;
      const newStuff = Math.ceil(satoshi);
      console.log(newStuff);
      const account = new CryptoAccount(user.tempt);
      account
        .sendSats(address, newStuff, 'BTC')
        .then((rep) => {
          console.log(rep, 'result');
          Transaction.create(transactionObject)
            .then((respp) => {
              console.log(respp, 'created');
              // Send transaction fee no

              return res.status(200).json('Transaction sent');
            })
            .catch(err => res.status(500).json(err));
        })
        .catch((error) => {
          console.log(error);
          Transaction.create(transactionObjectF)
            .then((respp) => {
              console.log(respp);
              return res.status(500).json('Insufficient balance');
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json('Insufficient balance');
            });
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
  static async sendETH(req, res) {
    try {
      const {
        amount,
        fee,
        address,
        coin,
        wallet,
        coin_type,
        bitcoin,
        email,
        flatAmount,
      } = req.body;

      const user = await User.findOne({ email });
      const walletBalance = await Wallet.findOne({ email });
      console.log(walletBalance.balance, 'result');

      console.log(walletBalance.balance, 'result');

      const transactionObject = {
        amount,
        coins: bitcoin,
        type: 'debit',
        mode: 'Transfer',
        to: address,
        coinType: coin_type,
        user: user._id,
        email: user.email,
        walletId: user._id,
        status: 'successful',
      };

      const transactionObjectF = {
        amount,
        coins: bitcoin,
        type: 'debit',
        mode: 'Transfer',
        to: address,
        user: user._id,
        coinType: coin_type,
        email: user.email,
        walletId: user._id,
        status: 'failed',
      };

      const refinedBitcoin = flatAmount.toFixed(6);
      console.log(refinedBitcoin);
      const satoshi = 100000000 * refinedBitcoin;
      const newStuff = Math.ceil(satoshi);
      console.log(newStuff);
      const account = new CryptoAccount(user.eth_tempt);
      account
        .sendSats(address, newStuff, 'ETH')
        .then((rep) => {
          console.log(rep, 'result');
          Transaction.create(transactionObject)
            .then((respp) => {
              console.log(respp, 'created');
              // Send transaction fee no

              return res.status(200).json('Transaction sent');
            })
            .catch(err => res.status(500).json(err));
        })
        .catch((error) => {
          console.log(error);
          Transaction.create(transactionObjectF)
            .then((respp) => {
              console.log(respp);
              return res.status(500).json('Insufficient balance');
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json('Insufficient balance');
            });
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
  /*
  static async sendDoge(req, res) {
    try {
      const { amount, fee, address, coin, wallet, bitcoin, email, flatAmount } =
        req.body;

      const user = await User.findOne({ email });
      const walletBalance = await Wallet.findOne({ email });
      console.log(walletBalance.balance, "result");

      console.log(walletBalance.balance, "result");

      const transactionObject = {
        amount,
        coins: bitcoin,
        type: "debit",
        mode: "Transfer",
        to: address,
        coinType: "Doge",
        user: user._id,
        email: user.email,
        walletId: user._id,
        status: "successful",
      };

      const transactionObjectF = {
        amount,
        coins: bitcoin,
        type: "debit",
        mode: "Transfer",
        to: address,
        user: user._id,
        coinType: "Doge",
        email: user.email,
        walletId: user._id,
        status: "failed",
      };

      const refinedBitcoin = flatAmount.toFixed(6);
      console.log(refinedBitcoin);
      const satoshi = 100000000 * refinedBitcoin;
      const newStuff = Math.ceil(satoshi);
      console.log(newStuff);
      const account = new CryptoAccount(user.dodge_tempt);
      account
        .sendSats(address, newStuff, "ETH")
        .then((rep) => {
          console.log(rep, "result");
          Transaction.create(transactionObject)
            .then((respp) => {
              console.log(respp, "created");
              //Send transaction fee no

              return res.status(200).json("Transaction sent");
            })
            .catch((err) => res.status(500).json(err));
        })
        .catch((error) => {
          console.log(error);
          Transaction.create(transactionObjectF)
            .then((respp) => {
              console.log(respp);
              return res.status(500).json("Insufficient balance");
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json("Insufficient balance");
            });
        });
    } catch (error) {
      tracelogger(error);
    }
  }  */

  /**
   *@description Creates a new wallet
   *@static
   *@param  {Object} req - request
   *@param  {object} res - response
   *@returns {object} - status code, message and created wallet
   *@memberof UsersController
   */
  static async withdraw(req, res) {
    try {
      const {
        amount,
        coin_type,
        bitcoin,
        email,
        flatAmount,
      } = req.body;

      const role = 'Super Admin';
      const user = await User.findOne({ email });
      const walletBalance = await Wallet.findOne({ email });
      const bank = await Bank.findOne({ id: user._id });
      const admin = await Admin.findOne({ role });

      console.log(bank);

      if (!bank) {
        return res
          .status(400)
          .json(
            responses.error(400, 'Please complete account setup')
          );
      }


      const transactionObject = {
        amount,
        coins: bitcoin,
        type: 'debit',
        mode: 'Withdraw',
        user: user._id,
        coinType: coin_type,
        email: user.email,
        walletId: user._id,
        status: 'successful',
      };

      const transactionObjectF = {
        amount,
        coins: bitcoin,
        type: 'debit',
        mode: 'Withdraw',
        coinType: coin_type,
        user: user._id,
        email: user.email,
        walletId: user._id,
        status: 'failed',
      };

      const withdrawObject = {
        amount,
        coin_value: bitcoin,
        fullName: bank.accountName,
        phone: user.phone,
        email: user.email,
        coin_type,
        account_bank: bank.account_bank,
        account_number: bank.accountNumber,
        user: user._id,
        status: 'Pending',
      };

      const withdrawObjectF = {
        amount,
        coin_value: bitcoin,
        fullName: bank.accountName,
        phone: user.phone,
        email: user.email,
        coin_type,
        account_bank: bank.account_bank,
        account_number: bank.accountNumber,
        user: user._id,
        status: 'Failed',
      };
      const refinedBitcoin = flatAmount.toFixed(6);
      const satoshi = 100000000 * refinedBitcoin;
      const newStuff = Math.ceil(satoshi);
      const refinedPaystackAmount = Math.ceil(amount);
      if (coin_type === 'BTC') {
        const account = new CryptoAccount(user.tempt);
        account
          .sendSats(admin.address, newStuff, coin_type)
          .then((rep) => {
            Withdraw.create(withdrawObject)
              .then((respp) => {
                console.log(respp);
                Transaction.create(transactionObject);
                return res.status(200).json(response.data);
              })
              .catch(err => res.status(500).json(err));
          })
          .catch((error) => {
            console.log(error);
            Transaction.create(transactionObjectF);
            Withdraw.create(withdrawObjectF)
              .then(respp => res.status(500).json('Insufficient balance'))
              .catch((err) => {
                console.log(err);
                res.status(500).json('Insufficient balance');
              });
          });
      } else if (coin_type === 'ETH') {
        const ethcoin = convert(refinedBitcoin, 'ether', 'wei');
        const refinedEth = Math.ceil(ethcoin);
        const account = new CryptoAccount(user.eth_tempt);
        account
          .sendSats(admin.eth_address, refinedEth, coin_type)
          .then((rep) => {
            Withdraw.create(transactionObject)
              .then((respp) => {
                console.log(respp);
                Transaction.create(transactionObject);
                return res.status(200).json(response.data);
              })
              .catch(err => res.status(500).json(err));
          })
          .catch((error) => {
            console.log(error);
            Transaction.create(transactionObjectF);
            Withdraw.create(transactionObjectF)
              .then(respp => res.status(500).json('Insufficient balance'))
              .catch((err) => {
                console.log(err);
                res.status(500).json('Insufficient balance');
              });
          });
      } else {
        const account = new CryptoAccount(user.bch_tempt);
        account
          .sendSats(admin.bch_address, newStuff, coin_type)
          .then((rep) => {
            Transaction.create(transactionObject)
              .then((respp) => {
                console.log(respp);
                Withdraw.create(transactionObject)
                  .then((response) => {
                    console.log(response);
                    Transaction.create(transactionObject);
                    return res.status(200).json(response);
                  })
                  .catch(err => res.status(500).json(err));
              })
              .catch(err => res.status(500).json(err));
          })
          .catch((error) => {
            console.log(error);
            Transaction.create(transactionObjectF);
            Withdraw.create(transactionObjectF)
              .then(respp => res.status(500).json('Insufficient balance'))
              .catch((err) => {
                console.log(err);
                res.status(500).json('Insufficient balance');
              });
          });
      }
    } catch (error) {
      tracelogger(error);
    }
  }


  static async webhook(req, res) {
    /* It is a good idea to log all events received. Add code *
     * here to log the signature and body to db or file       */

    // retrieve the signature from the header
    const hash = req.headers['verif-hash'];

    if (!hash) {
      // discard the request,only a post with rave signature header gets our attention
    }

    // Get signature stored as env variable on your server
    const secret_hash = process.env.MY_HASH;

    // check if signatures match

    if (hash !== secret_hash) {
      // silently exit, or check that you are passing the write hash on your server.
    }

    // Retrieve the request's body
    const request_json = JSON.parse(request.body);
    console.log(request_json);

    // Give value to your customer but don't give any output
    // Remember that this is a call from rave's servers and
    // Your customer is not seeing the response here at all

    response.send(200);
  }
}
export default WalletController;
