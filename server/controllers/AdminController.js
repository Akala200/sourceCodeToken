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
import Admin from '../models/Admin';
import Token from '../models/Token';
import TokenUsed from '../models/Regular_Token';
import AdminWallet from '../models/AdminWallet';
import responses from '../utils/responses';
import tracelogger from '../logger/tracelogger';
import { signToken } from '../utils/storeToken';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import User from '../models/Users';

const sgMail = require('@sendgrid/mail');
const rp = require('request-promise');
const axios = require('axios').default;
const CryptoAccount = require('send-crypto');
const cw = require('crypto-wallets');

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
class AdminController {
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

    try {
      const admin = await Admin.findOne({ email });

      if (admin) {
        return res
          .status(400)
          .json(responses.error(400, 'Sorry, this user already exist'));
      }
      if (!admin) {
        const adminObject = {
          first_name,
          last_name,
          email,
          phone,
          password,
        };

        const createdUser = await Admin.create(adminObject);

        const msg = {
          to: createdUser.email,
          from: 'support@ningotv.com',
          subject: 'Email Verification',
          text: `Kindly use this email (${email}) and password (${password} to login into your account`,
        };

        sgMail
          .send(msg)
          .then((resp) => {
            console.log(resp);
            if (createdUser) {
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
  static async forgetPassword(req, res) {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(responses.error(400, 'Please fill in all details'));
    }

    try {
      const admin = await Admin.findOne({ email });

      if (!admin) {
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
        from: 'support@ningotv.com',
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
  static async confirmPassword(req, res) {
    const { code } = req.body;
    try {
      const tokenUser = await TokenUsed.findOne({ token: code });

      if (!tokenUser) {
        return res.status(404).json(responses.error(404, 'Invalid Code'));
      }

      // Find a user from token
      Admin.findOne({ email: tokenUser.oldEmail }).then((user) => {
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
  static async updateUser(req, res) {
    try {
      const oldEmail = req.query.email;
      const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
      };
      const updatedUser = await Admin.findOneAndUpdate(
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

      const updatedUser = await Admin.findOne({ email }).select([
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
    Admin.findOne({ email })
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
      const updatedUser = await Admin.findOne({ email: oldEmail }).select([
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
  static async getUserCount(req, res) {
    try {
      const updatedUser = await User.find({}).countDocuments();
      if (updatedUser) {
        return res.send({ message: 'Success', data: updatedUser });
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
  static async getBVNUser(req, res) {
    const status = true;
    try {
      const updatedUser = await User.find({
        bvn_verified: status,
      }).countDocuments();
      if (updatedUser) {
        return res.send({ message: 'Success', data: updatedUser });
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
  static async getTransactionCount(req, res) {
    try {
      const getTransaction = await Transaction.find({}).countDocuments();
      if (getTransaction) {
        return res.send({ message: 'Success', data: getTransaction });
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
  static async getNoBVNUser(req, res) {
    const status = false;
    try {
      const updatedUser = await User.find({
        bvn_verified: status,
      }).countDocuments();
      if (updatedUser) {
        return res.send({ message: 'Success', data: updatedUser });
      }
    } catch (error) {
      return res.status(500).send(error);
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
    let admin;
    const { email, password } = req.body;

    try {
      admin = await Admin.findOne({ email });
    } catch (error) {
      return res
        .status(500)
        .json(responses.error(500, { msg: 'Server error' }));
    }

    if (!admin) {
      return res.status(401).json(responses.error(401, 'Unable to login'));
    }
    if (admin.regstatus === false) {
      return res
        .status(422)
        .json(responses.error(422, { msg: 'Kindly verify your account' }));
    }

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      return res.status(401).json(responses.error(401, 'Unable to login'));
    }

    const TokenData = {
      id: admin._id,
      email,
    };

    //  Generate Token
    const token = await signToken(TokenData);

    const userData = {
      first_name: admin.first_name,
      last_name: admin.last_name,
      phone: admin.phone,
      email: admin.email,
      id: admin._id,
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

    try {
      const admin = await Admin.findOne({ email: tokenUser.user });

      const walletData = {
        phone: admin.phone,
        email: admin.email,
      };

      if (admin) {
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

          const eth_tempt = await signToken(data1);
          const bch_tempt = await signToken(data2);
          const tempt = await signToken(data3);
          const account = new CryptoAccount(privateKey);
          account
            .address('BTC')
            .then((rep) => {
              const address = rep;

              const userNew = {
                address,
                tempt,
                eth_address: ethWallet.address,
                eth_tempt,
                bch_address: bcash.address,
                bch_tempt,
                guid: code,
                regstatus: true,
              };

              Admin.findOneAndUpdate(
                { email: admin.email },
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
            const wallet = await Wallet.create(walletData);
            console.log(wallet);
            res
              .status(200)
              .json(
                responses.success(200, 'Admin wallet created successfully')
              );
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
}

export default AdminController;
