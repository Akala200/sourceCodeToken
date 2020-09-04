/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';

import responses from '../utils/responses';
import tracelogger from '../logger/tracelogger';
import User from '../models/Users';

const rp = require('request-promise');

const token = 'sk_test_644ff7e9f679a6ecfc3152e30ad453611e0e564e';
// eslint-disable-next-line import/no-extraneous-dependencies
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
    const { email, amount } = req.body;
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
      const { email } = req.query;

      const transaction = await Transaction.find({ email });

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
      try {
      const  user = await User.findOne({ email });
       response = await axios.post(
          `https://cosuss.herokuapp.com/merchant/${user.guid}/balance?password=${user.tempt}&api_code=54a36981-7b31-4cdb-af4b-b69bd0fc4ea9`);
        console.log(response.data.balance);
     } catch (error) {
       console.log(error)
     }

      const balance = await Wallet.findOneAndUpdate(
        { email: email },
       {balance: response.data.balance},
        { new: true }
      )

      if (!balance) {
        return res
          .status(404)
          .json(responses.error(404, 'User does not exist'));
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

      rp(requestOptions).then(response => res.json(response.data.quote.NGN));
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
      console.log(req.body);
      const event = req.body;
      const { email } = event.data.metadata;
      try {
        const user = await Wallet.findOne({
          email,
        });

        if (!user) {
          return res
            .status(404)
            .json(responses.error(404, 'Sorry, this user does not exist'));
        }
        if (event.event === 'charge.success') {
          try {
            const requestOptions = {
              method: 'GET',
              uri:
                'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
              qs: {
                amount: event.data.amount,
                id: '2819',
                convert: 'BTC',
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
                const transactionObject = {
                  amount: event.data.amount / 100,
                  coins: response.data.quote.BTC.price,
                  type: 'credit',
                  mode: 'Card',
                  lastFour: event.data.authorization.last4,
                  cardType: event.data.authorization.card_type,
                  email: user.email,
                  ref: event.data.reference,
                  walletId: user._id,
                  status: 'successful',
                };
                const priceReturned = event.data.amount / 100;
                console.log(priceReturned, 'real price');
                const percentageOff = priceReturned - (priceReturned * 20) / 100;
                console.log(percentageOff, 'calculated price');

                axios
                  .post(
                    `https://cosuss.herokuapp.com/api/v2/merchant/${user.guid}/payment`,
                    {
                      to: user.address,
                      amount: event.data.amount / 100,
                      password: '12345678900987654321',
                      api_code: '54a36981-7b31-4cdb-af4b-b69bd0fc4ea9',
                      from: '19svt5BmjwHH1isPbkUkHYwGCn7DEPzDPX',
                      fee: percentageOff,
                    }
                  )
                  // eslint-disable-next-line no-shadow
                  .then((response) => {
                    console.log(response);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                const amountNew = response.data.quote.BTC.price + user.balance;
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
              .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
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
