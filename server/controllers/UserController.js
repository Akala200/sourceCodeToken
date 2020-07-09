/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable require-jsdoc */
import bcrypt from 'bcrypt';
import User from '../models/Users';
import responses from '../utils/responses';
import tracelogger from '../logger/tracelogger';
import { signToken } from '../utils/storeToken';

const erroresponse = [
  {
    path: 'login',
    message: 'Unable to Login',
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
        const userObject = {
          first_name,
          last_name,
          email,
          phone,
          password,
        };
        const createdUser = await User.create(userObject);

        const TokenData = {
          id: createdUser._id,
          email: createdUser.email,
        };
        //  Generate Token
        const token = await signToken(TokenData);

        const userData = {
          first_name: createdUser.first_name,
          last_name: createdUser.last_name,
          phone: createdUser.phone,
          email: createdUser.email,
          id: createdUser._id,
          token,
        };

        return res
          .status(201)
          .json(responses.success(201, 'User created successfully', userData));
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
}
export default UserController;
