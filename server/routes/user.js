import { Router } from 'express';
import UserController from '../controllers/UserController';

const { decodeRegToken } = require('../utils/storeToken');

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
} = UserController;

router.post('/create/account', newUser);
router.post('/login', login);
router.post('/verify', verify);
router.get('/lists', getlist);
router.get('/mobile', decodeRegToken, bitcoinMobile);
router.get('/coin/history', bitcoinMobileNgn);
router.get('/coin/history/usd', decodeRegToken, bitcoinMobileUsd);
router.get('/coin/market/btc', decodeRegToken, bitcoinMobileMarketBTC);
router.get('/coin/market/xrp', decodeRegToken, bitcoinMobileMarketXRP);
router.get('/coin/market/sudt', decodeRegToken, bitcoinMobileMarketUSDT);
router.get('/coin/market/eth', decodeRegToken, bitcoinMobileMarketETH);
router.get('/user/address', decodeRegToken, getAddress);
router.put('/update/password', decodeRegToken, changePassword);
router.post('/update/email', decodeRegToken, changeEmail);
router.post('/update/web', decodeRegToken, changeEmail);

router.post('/verify/new/email', decodeRegToken, verifyNew);
router.get('/data', betokened);
router.post('/forgot/password', forgetPassword);
router.post('/new/password', confirmPassword);
router.post('/check/code', checkCode);
router.post('/web/password', confirmPassword);


// getAddress

router.get('/get/user', getUser);
router.put('/update/user', updateUser);
router.get('/bitcoin', bitcoin);
router.get('/shortlist', shortlist);

// bitcoin
export default router;
