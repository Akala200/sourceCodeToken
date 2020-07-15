/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable require-jsdoc */
import bcrypt from 'bcrypt';
import User from '../models/Users';
import Token from '../models/Token';
import responses from '../utils/responses';
import tracelogger from '../logger/tracelogger';
import { signToken } from '../utils/storeToken';
import randomstring from 'randomstring';
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

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

    const code =  randomstring.generate({
          length: 7,
          charset: 'numeric'
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
          user: createdUser. _d,
        };

        const tokenRegistration = await Token.create(tokenObject);



        sgMail.send(msg);

        if(tokenRegistration) {
          return res
          .status(201)
          .json(responses.success(201, 'Email sent successfully'));
        } else {
          return res
          .status(500)
          .json(responses.success(500, 'Email not sent'));
        }
       
      }
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
      return res.json(erroresponse);
    }
    if (user.regstatus == false) {
      return res.json({msg: 'Kindly verify your account'});
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.json(erroresponse);
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
    try {
     tokenUser = await Token.findOne({ code });
    } catch (error) {
      return res.json(error);
    }

    if (!token) {
      return res.json(verifyresponce);
    }

    const tokenId = tokenUser.user;
    
    try {
       saveChanges =  await User.findOneAndUpdate(
        { _id: tokenId },
        {
          $set: {
            regstatus: true,
          }
        },
        options
      );
    
    } catch (error) {
      return res.json(error);
    }

    if (!saveChanges) {
      return res.json({msg:'User not active'});
    }

    const TokenData = {
      id: user._id,
      email: user.email,
    };
    //  Generate Token
    const tokenize = await signToken(TokenData);

    
    const userData = {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
      id: user._id,
      tokenize,
    };
    return res
    .status(200)
    .json(responses.success(200, 'Account verified successfully', userData));
  }
}


export default UserController;
