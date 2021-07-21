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
  getNoBVNUser,
  getTransactionCount,
  getSuccessfulTransactionCount,
  getFailedTransactionCount,
  getCreditTransactionCount,
  getDebitTransactionCount,
  getSuccessfulDebitTransactionCount,
  getFailedDebitTransactionCount,
  getSuccessfulCreditTransactionCount,
  getFailedCreditTransactionCount,
  addRate,
  getRate,
  updateRate,
  getCustomers,
  getOneCustomers,
  getAdminWallet,
  getAdmin,
  getOneAdmin,
  getUserWallet,
  getTransaction,
} = AdminController;

router.post('/admin/create/account', newUser);
router.post('/admin/login', login);
router.post('/admin/create/wallet', verify);
router.post('/admin/add/rate', addRate);
router.get('/admin/get/rate', getRate);
router.get('/admin/wallet', getAdminWallet);
router.get('/admin/all', getAdmin);
router.get('/admin/get/one', getOneAdmin);
router.get('/admin/customer/wallet', getUserWallet);
router.get('/admin/customer/transaction', getTransaction);

router.get('/admin/user/address', getAddress);
router.get('/admin/user/total', getUserCount);
router.get('/admin/user/verified', getBVNUser);
router.get('/admin/user/unverified', getNoBVNUser);
router.get('/admin/user/transaction', getTransactionCount);
router.get('/admin/user/successful/transaction', getSuccessfulTransactionCount);
router.get('/admin/user/failed/transaction', getFailedTransactionCount);
router.get('/admin/user/credit/transaction', getCreditTransactionCount);
router.get('/admin/user/debit/transaction', getDebitTransactionCount);
router.get('/admin/user/customers', getCustomers);
router.get('/admin/user/customer', getOneCustomers);

router.get(
  '/admin/user/successful/debit/transaction',
  getSuccessfulDebitTransactionCount
);

router.get(
  '/admin/user/failed/debit/transaction',
  getFailedDebitTransactionCount
);

router.get(
  '/admin/user/failed/credit/transaction',
  getFailedCreditTransactionCount
);


router.get(
  '/admin/user/successful/credit/transaction',
  getSuccessfulCreditTransactionCount
);

router.put('/admin/update/password', changePassword);

router.put('/admin/update/rate', updateRate);

router.post('/admin/forgot/password', forgetPassword);
router.post('/admin/new/password', confirmPassword);
router.post('/admin/web/password', confirmPassword);

// getAddress

router.get('/admin/get/user', getUser);
router.put('/admin/update/user', updateUser);


// bitcoin
export default router;
