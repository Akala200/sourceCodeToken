/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable require-jsdoc */
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
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
      return res.json(error);
    }

    if (!user) {
      return res.status(401).json(responses.error(422, erroresponse));
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

    return res.json(userData);
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
    console.log(tokenUser.user);
    if (!tokenUser) {
      return res
        .status(404)
        .json(
          responses.error(404, 'Account verification Failed, Invalid token')
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
      console.log(TokenData, 'first cool');
      console.log(walletData, 'cool');
      //  Generate Token
      const tokenize = await signToken(TokenData);

      if (user) {
        try {
          const response = await axios.post(
            'https://cosuss.herokuapp.com/api/v2/create',
            {
              api_code: '54a36981-7b31-4cdb-af4b-b69bd0fc4ea9',
              password: '12345678900987654321',
              hd: true,
            }
          );
          console.log(response.data);
          const guid = response.data.guid;
          const address = response.data.address;
          const label = response.data.label;

          const user = {
            guid,
            address,
            label,
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


          const userData = {
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            email: user.email,
            id: user._id,
            tokenize,
          };

          try {
            const willet = await Wallet.create(walletData);
            console.log(willet);
            await Token.findOneAndDelete({ token: code }).then(toks => res.json(userData));
          } catch (error) {
            return res.json(error);
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      return res.json(error);
    }

    // MmFmM2UzZTk1OWM1NGZiM2E3MzAyNjkwODY5NDUwZGI
  }
}

export default UserController;
