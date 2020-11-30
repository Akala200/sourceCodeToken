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

const rp = require('request-promise');

// const token = 'sk_live_276ea373b7eff948c77c424ea2905d965bd8e9f8';
const token = 'sk_test_644ff7e9f679a6ecfc3152e30ad453611e0e564e';

// eslint-disable-next-line import/no-extraneous-dependencies  sk_test_644ff7e9f679a6ecfc3152e30ad453611e0e564e
const axios = require('axios').default;
const crypto = require('crypto');
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
            res.status(500).json(error.data);
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
    console.log('here');
    try {
      const { email } = req.query;

      const transaction = await Transaction.find({ email }).limit(5);

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
  static async transactionHistoryAll(req, res) {
    console.log('here');
    try {
      const { user } = req.query;

      const transaction = await Transaction.find({ user });

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
  static async balance(req, res) {
    try {
      const { email } = req.query;
      let response;
      /**   try {
        const user = await User.findOne({ email });
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
      const balance = await Wallet.findOne({ email });
      return res.status(200).json(responses.success(200, balance));
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
      const { email } = req.query;

      const balance = await Wallet.findOne({ email });

      if (!balance) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
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
          id: '1',
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
      const { amount } = req.query;

      const percent = 3;
      const discount = (percent / 100) * amount;
      const realAmount = amount - discount;
      console.log(realAmount, 'aftersub');
      console.log(discount, 'discount amount');

      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount: realAmount,
          id: '2819',
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
  static async coinPrice(req, res) {
    try {
      const { amount } = req.query;

      const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
        qs: {
          amount,
          id: '2819',
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
      console.log(id1);
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
        wallet,
        bitcoin,
        email,
        flatAmount,
      } = req.body;

      const user = await User.findOne({ email });
      const walletBalance = await Wallet.findOne({ email });
      console.log('amount', walletBalance.balance);
      if (flatAmount > walletBalance.balance) {
        return res.status(400).json(responses.error(400, 'Insufficient fund'));
      }

      const transactionObject = {
        amount,
        coins: bitcoin,
        type: 'debit',
        mode: 'transfer',
        to: address,
        email: user.email,
        walletId: user._id,
        status: 'successful',
      };

      const params = {
        password: user.tempt,
        to: address,
        amount: bitcoin,
        fee: 0.0001,
        api_code: '54a36981-7b31-4cdb-af4b-b69bd0fc4ea9',
        from: user.address,
      };

      axios
        .get(`https://www.coin.sourcecodexchange.com/merchant/${user.guid}/payment`, {
          params,
        })
        // eslint-disable-next-line no-shadow
        .then((response) => {
          console.log('amount', response);
          const newAmount = walletBalance.balance - flatAmount;
          Wallet.findOneAndUpdate(
            { email },
            {
              $set: { balance: newAmount },
            },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log('Something wrong when updating data!');
              }

              console.log(doc);
              Transaction.create(transactionObject);
              return res.status(200).json('Transaction saved');
            }
          );
        })
        .catch(error => res.status(500).json(responses.error(500, error.response.data)));
    } catch (error) {
      tracelogger(error);
    }
  }

  static async webhook(req, res) {
    const hash = crypto
      .createHmac('sha512', token)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      const currency = 'NGN';
      console.log(req.body.data.metadata);
      const event = req.body;
      const { email, coin } = event.data.metadata;
      try {
        const wallet = await Wallet.findOne({
          email,
        });
        const user = await User.findOne({ email });

        if (!user) {
          return res
            .status(404)
            .json(responses.error(404, 'Sorry, this user does not exist'));
        }
        if (event.event === 'charge.success') {
          try {
            const transactionObject = {
              amount: event.data.amount / 100,
              coins: coin,
              type: 'credit',
              mode: 'Card',
              user: user._id,
              lastFour: event.data.authorization.last4,
              cardType: event.data.authorization.card_type,
              ref: event.data.reference,
              walletId: wallet._id,
              status: 'successful',
            };
            const amountNew = coin + user.balance;
            console.log(amountNew);
            const priceReturned = event.data.amount / 100;

            Wallet.findOneAndUpdate(
              { email },
              {
                $set: { balance: parseFloat(amountNew) },
              },
              { new: true },
              (err, doc) => {
                if (err) {
                  console.log(err);
                }

                console.log(doc);
                Transaction.create(transactionObject);
              }
            );
            axios
              .post(
                // eslint-disable-next-line max-len
                'https://www.coin.sourcecodexchange.com/merchant/7b87a095-a1ed-47e8-8f4c-045b2d14c471/payment',
                {
                  to: user.address,
                  amount: coin,
                  password: 'Crypto2020',
                  api_code: '54a36981-7b31-4cdb-af4b-b69bd0fc4ea9',
                }
              )
              // eslint-disable-next-line no-shadow
              .then((response) => {
                console.log(response);
                console.log('amount', amountNew);
                Wallet.findOneAndUpdate(
                  { email },
                  {
                    $set: { balance: amountNew },
                  },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log('Something wrong when updating data!');
                    }

                    console.log(doc);
                    Transaction.create(transactionObject);
                    return res.status(200).json('Transaction saved');
                  }
                );
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (error) {
            tracelogger(error);
          }
        }
      } catch (error) {
        tracelogger(error);
      }
    }
  }
}
export default WalletController;
