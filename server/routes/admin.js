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
  getUserCount,
  getBVNUser,
} = AdminController;

router.post('/create/account', newUser);
router.post('/admin/login', login);
router.post('/admin/verify', verify);

router.get('/admin/user/address', getAddress);
router.get('/admin/user/total', getUserCount);
router.get('/admin/user/verified', getBVNUser);

router.put('/admin/update/password', changePassword);

router.post('/admin/forgot/password', forgetPassword);
router.post('/admin/new/password', confirmPassword);
router.post('/admin/web/password', confirmPassword);

// getAddress

router.get('/admin/get/user', getUser);
router.put('/admin/update/user', updateUser);


// bitcoin
export default router;
