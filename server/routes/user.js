import { Router } from 'express';
import UserController from '../controllers/UserController';

// const { decodeRegToken } = require("../utils/storeToken");

const router = Router();

const {
  login,
  newUser,
  verify,
  getlist,
  bitcoin,
  shortlist,
  updateUser,
  getUser,
  bitcoinMobile,
  bitcoinMobileNgn,
  bitcoinMobileUsd,
  bitcoinMobileMarketBTC,
  bitcoinMobileMarketXRP,
  bitcoinMobileMarketUSDT,
  bitcoinMobileMarketETH,
  getAddress,
  changePassword,
  changeEmail,
  verifyNew,
  betokened,
  forgetPassword,
  confirmPassword,
  checkCode,
  completeSetUp,
  getBankCode,
  createOtherWallet,
  initiatePayment,
  getRate,
} = UserController;

router.post('/create/account', newUser);
router.post('/login', login);
router.post('/verify', verify);
router.get('/lists', getlist);
router.get('/mobile', bitcoinMobile);
router.get('/get/bank', getBankCode);


router.get('/coin/history', bitcoinMobileNgn);
router.get('/coin/history/usd', bitcoinMobileUsd);
router.get('/coin/market/btc', bitcoinMobileMarketBTC);
router.get('/coin/market/xrp', bitcoinMobileMarketXRP);
router.get('/coin/market/sudt', bitcoinMobileMarketUSDT);
router.get('/coin/market/eth', bitcoinMobileMarketETH);
router.get('/user/address', getAddress);
router.get('/get/rate', getRate);

router.put('/update/password', changePassword);
router.post('/update/email', changeEmail);
router.post('/update/web', changeEmail);
router.post('/complete/account', completeSetUp);
router.post('/create/other/wallet', createOtherWallet);

router.post('/verify/new/email', verifyNew);
router.get('/data', betokened);
router.post('/forgot/password', forgetPassword);
router.post('/new/password', confirmPassword);
router.post('/check/code', checkCode);
router.post('/web/password', confirmPassword);


// getAddress

router.get('/get/user', getUser);
router.put('/update/user', updateUser);
router.put('/initiated/payment', initiatePayment);
router.get('/bitcoin', bitcoin);
router.get('/shortlist', shortlist);

// bitcoin
export default router;
