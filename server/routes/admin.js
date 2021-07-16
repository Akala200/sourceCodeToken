import { Router } from 'express';
import AdminController from '../controllers/AdminController';

// const { decodeRegToken } = require("../utils/storeToken");

const router = Router();

const {
  login,
  newUser,
  verify,
  updateUser,
  getUser,
  getAddress,
  changePassword,
  forgetPassword,
  confirmPassword,
} = AdminController;

router.post('/create/account', newUser);
router.post('/login', login);
router.post('/verify', verify);

router.get('/user/address', getAddress);
router.put('/update/password', changePassword);

router.post('/forgot/password', forgetPassword);
router.post('/new/password', confirmPassword);
router.post('/web/password', confirmPassword);

// getAddress

router.get('/get/user', getUser);
router.put('/update/user', updateUser);


// bitcoin
export default router;
